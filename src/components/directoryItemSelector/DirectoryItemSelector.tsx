/**
 * Copyright (c) 2022, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import type { UUID } from 'node:crypto';
import type { MuiStyles } from '../../utils';
import {
    getFileIcon,
    ElementType,
    arraysContainIdenticalStrings,
    ElementAttributes,
    snackWithFallback,
} from '../../utils';
import { TreeViewFinder, TreeViewFinderNodeProps, TreeViewFinderProps } from '../treeViewFinder';
import { useSnackMessage } from '../../hooks';
import { fetchDirectoryContent, fetchElementsInfos, fetchRootFolders } from '../../services';
import {
    fetchChildrenForExpandedNodes,
    getExpansionPathsForSelected,
    initializeFromLastSelected,
    saveLastSelectedDirectoryFromNode,
} from './utils';

const styles = {
    icon: (theme) => ({
        marginRight: theme.spacing(1),
        width: '18px',
        height: '18px',
    }),
} as const satisfies MuiStyles;

// TODO: check avec Kevin / Sylvain
type ElementAttributesBase = {
    elementUuid: ElementAttributes['elementUuid'] | null;
    subdirectoriesCount: ElementAttributes['subdirectoriesCount'];
    parentUuid: ElementAttributes['parentUuid'];
    children: ElementAttributes['children'];
};

function sameRights(
    sourceAccessRights: ElementAttributes['accessRights'],
    accessRightsToCompare: ElementAttributes['accessRights']
) {
    if (!sourceAccessRights && !accessRightsToCompare) {
        return true;
    }
    if (!sourceAccessRights || !accessRightsToCompare) {
        return false;
    }
    return sourceAccessRights.isPrivate === accessRightsToCompare.isPrivate;
}

function flattenDownNodes<T>(n: T, cef: (n: T) => T[]): T[] {
    const subs = cef(n);
    if (subs.length === 0) {
        return [n];
    }
    return Array.prototype.concat([n], ...subs.map((sn) => flattenDownNodes(sn, cef)));
}

function refreshedUpNodes(
    nodeMap: Record<UUID, ElementAttributesBase>,
    newElement: ElementAttributesBase
): ElementAttributesBase[] {
    if (!newElement?.elementUuid) {
        return [];
    }
    if (newElement.parentUuid === null) {
        return [newElement];
    }
    const parent = nodeMap[newElement.parentUuid];
    const nextChildren = parent.children.map((c) => (c.elementUuid === newElement.elementUuid ? newElement : c));
    const nextParent = { ...parent, children: nextChildren };
    return [newElement, ...refreshedUpNodes(nodeMap, nextParent as ElementAttributesBase)];
}

/**
 * Make an updated tree [root_nodes, id_to_node] from previous tree and new {id, children}
 * @param prevRoots previous [root nodes]
 * @param prevMap previous map (js object) uuid to children nodes
 * @param nodeId uuid of the node to update children, may be null or undefined (means root)
 * @param children new value of the node children (shallow nodes)
 */
function updatedTree(
    prevRoots: ElementAttributes[],
    prevMap: Record<UUID, ElementAttributes>,
    nodeId: UUID | null,
    children: ElementAttributes[]
) {
    const nextChildren = children
        .sort((a, b) => a.elementName.localeCompare(b.elementName))
        .map((n) => {
            const pn = prevMap[n.elementUuid];
            if (!pn) {
                return { ...n, children: [], parentUuid: nodeId };
            }
            if (
                n.elementName === pn.elementName &&
                sameRights(n.accessRights, pn.accessRights) &&
                n.subdirectoriesCount === pn.subdirectoriesCount &&
                nodeId === pn.parentUuid
            ) {
                return pn;
            }
            if (pn.parentUuid !== nodeId) {
                console.warn(`reparent ${pn.parentUuid} -> ${nodeId}`);
            }
            return {
                ...pn,
                elementName: n.elementName,
                accessRights: n.accessRights,
                subdirectoriesCount: n.subdirectoriesCount,
                parentUuid: nodeId,
            };
        });

    const prevChildren = nodeId ? prevMap[nodeId]?.children : prevRoots;
    if (prevChildren?.length === nextChildren.length && prevChildren.every((e, i) => e === nextChildren[i])) {
        return [prevRoots, prevMap];
    }

    const nextUuids = new Set(children ? children.map((n) => n.elementUuid) : []);
    const prevUuids = prevChildren ? prevChildren.map((n) => n.elementUuid) : [];
    const mayNodeId = nodeId ? [nodeId] : [];

    const nonCopyUuids = new Set([
        ...nextUuids,
        ...mayNodeId,
        ...Array.prototype.concat(
            ...prevUuids
                .filter((u: UUID) => !nextUuids.has(u))
                .map((u: UUID) => flattenDownNodes(prevMap[u], (n) => n.children).map((n) => n.elementUuid))
        ),
    ]);

    const prevNode = nodeId ? prevMap[nodeId] : {};
    const nextNode = {
        elementUuid: nodeId,
        parentUuid: null,
        ...prevNode,
        children: nextChildren,
        subdirectoriesCount: nextChildren.length,
    } satisfies ElementAttributesBase;

    const nextMap = Object.fromEntries([
        ...Object.entries(prevMap).filter(([k]) => !nonCopyUuids.has(k)),
        ...nextChildren.map((n) => [n.elementUuid, n]),
        ...refreshedUpNodes(prevMap, nextNode).map((n) => [n.elementUuid, n]),
    ]);

    const nextRoots = nodeId === null ? nextChildren : prevRoots.map((r) => nextMap[r.elementUuid]);

    return [nextRoots, nextMap];
}

export interface DirectoryItemSelectorProps extends TreeViewFinderProps {
    types: string[];
    equipmentTypes?: string[];
    itemFilter?: (val: ElementAttributes) => boolean;
    expanded?: UUID[];
    selected?: UUID[];
}

function sortHandlingDirectories(a: TreeViewFinderNodeProps, b: TreeViewFinderNodeProps): number {
    // If children property is set it means it's a directory, they are handled differently in order to keep them at the top of the list
    if (a.children && !b.children) {
        return -1;
    }
    if (b.children && !a.children) {
        return 1;
    }
    return a.name.localeCompare(b.name);
}

export function DirectoryItemSelector({
    open,
    types,
    equipmentTypes,
    itemFilter,
    expanded,
    selected,
    onClose,
    ...otherTreeViewFinderProps
}: Readonly<DirectoryItemSelectorProps>) {
    const [data, setData] = useState<TreeViewFinderNodeProps[]>([]);
    const [lastFetchedEquipmentTypes, setLastFetchedEquipmentTypes] = useState<string[]>();
    const [rootDirectories, setRootDirectories] = useState<ElementAttributes[]>([]);
    const [isRootsLoaded, setIsRootsLoaded] = useState(false);
    const [autoExpandedNodes, setAutoExpandedNodes] = useState<UUID[]>([]);
    const nodeMap = useRef<Record<UUID, ElementAttributes>>({});
    const dataRef = useRef<TreeViewFinderNodeProps[]>([]);
    dataRef.current = data;

    const rootsRef = useRef<ElementAttributes[]>([]);
    rootsRef.current = rootDirectories;
    const { snackError } = useSnackMessage();
    const contentFilter = useCallback(() => new Set([ElementType.DIRECTORY, ...types]), [types]);

    const convertChildren = useCallback((children: ElementAttributes[]): TreeViewFinderNodeProps[] => {
        return children.map((e) => {
            return {
                id: e.elementUuid,
                name: e.elementName,
                type: e.type,
                description: e.description,
                specificMetadata: e.specificMetadata,
                icon: getFileIcon(e.type, styles.icon),
                children: e.type === ElementType.DIRECTORY ? convertChildren(e.children) : undefined,
                childrenCount: e.type === ElementType.DIRECTORY ? e.subdirectoriesCount : undefined,
            };
        });
    }, []);

    const convertRoots = useCallback(
        (newRoots: ElementAttributes[]): TreeViewFinderNodeProps[] => {
            return newRoots.map((e) => {
                return {
                    id: e.elementUuid,
                    name: e.elementName,
                    description: e.description,
                    icon: getFileIcon(e.type, styles.icon),
                    children:
                        e.type === ElementType.DIRECTORY
                            ? convertChildren(nodeMap.current[e.elementUuid].children)
                            : undefined,
                    childrenCount: e.type === ElementType.DIRECTORY ? e.subdirectoriesCount : undefined,
                };
            });
        },
        [convertChildren]
    );

    const addToDirectory = useCallback(
        (nodeId: UUID, content: ElementAttributes[]) => {
            const [nrs, mdr] = updatedTree(rootsRef.current, nodeMap.current, nodeId, content);
            setRootDirectories(nrs);
            nodeMap.current = mdr;
            setData(convertRoots(nrs));
        },
        [convertRoots]
    );

    const updateRootDirectories = useCallback(() => {
        setIsRootsLoaded(false);
        fetchRootFolders(types)
            .then((newData) => {
                const [nrs, mdr] = updatedTree(rootsRef.current, nodeMap.current, null, newData);
                setRootDirectories(nrs);
                nodeMap.current = mdr;
                setData(convertRoots(nrs));
            })
            .catch((error) => {
                snackWithFallback(snackError, error, { headerId: 'DirectoryItemSelector' });
            })
            .finally(() => {
                setIsRootsLoaded(true);
            });
    }, [convertRoots, types, snackError]);

    const fetchDirectoryChildren = useCallback(
        (nodeId: UUID): Promise<void> => {
            const typeList = types.includes(ElementType.DIRECTORY) ? [] : types;
            return fetchDirectoryContent(nodeId, typeList)
                .then((children) => {
                    const childrenMatchedTypes = children.filter((item: ElementAttributes) =>
                        contentFilter().has(item.type)
                    );

                    if (childrenMatchedTypes.length > 0 && equipmentTypes && equipmentTypes.length > 0) {
                        return fetchElementsInfos(
                            childrenMatchedTypes.map((e: ElementAttributes) => e.elementUuid),
                            types,
                            equipmentTypes
                        ).then((childrenWithMetadata: ElementAttributes[]) => {
                            const filteredChildren = itemFilter
                                ? childrenWithMetadata.filter((val: ElementAttributes) => {
                                      // Accept every directory
                                      if (val.type === ElementType.DIRECTORY) {
                                          return true;
                                      }
                                      // otherwise filter with the custom itemFilter func
                                      return itemFilter(val);
                                  })
                                : childrenWithMetadata;
                            // update directory content
                            addToDirectory(nodeId, filteredChildren);
                        });
                    }
                    // update directory content
                    addToDirectory(nodeId, childrenMatchedTypes);
                    return Promise.resolve();
                })
                .catch((error) => {
                    console.warn(`Could not update subs (and content) of '${nodeId}' : ${error.message}`);
                });
        },
        [types, equipmentTypes, itemFilter, contentFilter, addToDirectory]
    );

    // Helper function to fetch children for a node if it is not already loaded, or if a refresh is needed
    const fetchNodeChildrenIfNeeded = useCallback(
        async (nodeId: UUID): Promise<void> => {
            const node = nodeMap.current[nodeId];
            if (
                node &&
                (!node.children ||
                    node.children.length === 0 ||
                    !arraysContainIdenticalStrings(equipmentTypes, lastFetchedEquipmentTypes)) &&
                node.type === ElementType.DIRECTORY
            ) {
                setLastFetchedEquipmentTypes(equipmentTypes);
                await fetchDirectoryChildren(nodeId);
            }
        },
        [equipmentTypes, lastFetchedEquipmentTypes, setLastFetchedEquipmentTypes, fetchDirectoryChildren]
    );

    // Handle expansion from selected items
    const handleSelectedExpansion = useCallback(async (): Promise<boolean> => {
        if (!selected || selected.length === 0) {
            return false;
        }

        const expandedArray = await getExpansionPathsForSelected(selected, expanded);
        setAutoExpandedNodes(expandedArray);
        await fetchChildrenForExpandedNodes(expandedArray, fetchNodeChildrenIfNeeded);
        return true;
    }, [selected, expanded, fetchNodeChildrenIfNeeded]);

    // Handle expansion from provided expanded prop
    const handleProvidedExpansion = useCallback(async (): Promise<boolean> => {
        if (!expanded || expanded.length === 0) {
            return false;
        }

        setAutoExpandedNodes(expanded);
        await fetchChildrenForExpandedNodes(expanded, fetchNodeChildrenIfNeeded);

        return true;
    }, [expanded, fetchNodeChildrenIfNeeded]);

    // Handle expansion from last selected directory
    const handleLastSelectedExpansion = useCallback(async (): Promise<boolean> => {
        const expandPath = await initializeFromLastSelected();

        if (!expandPath) {
            return false;
        }

        setAutoExpandedNodes(expandPath);
        await fetchChildrenForExpandedNodes(expandPath, fetchNodeChildrenIfNeeded);

        return true;
    }, [fetchNodeChildrenIfNeeded]);

    // Main expansion orchestrator
    const initializeExpansion = useCallback(async () => {
        // Priority 1: Handle selected items
        const selectedSuccess = await handleSelectedExpansion();
        if (selectedSuccess) {
            return;
        }

        // Priority 2: Handle provided expanded items
        const expandedSuccess = await handleProvidedExpansion();
        if (expandedSuccess) {
            return;
        }

        // Priority 3: Fall back to last selected directory
        await handleLastSelectedExpansion();
    }, [handleSelectedExpansion, handleProvidedExpansion, handleLastSelectedExpansion]);

    // Handle root loading and expansion initialization
    useEffect(() => {
        if (!open) {
            setIsRootsLoaded(false);
            setAutoExpandedNodes([]);
            return;
        }

        // Phase 1: Load root directories if not already loaded
        if (!isRootsLoaded) {
            updateRootDirectories();
            return;
        }

        // Phase 2: Initialize expansion once roots are loaded
        initializeExpansion();
    }, [open, isRootsLoaded, updateRootDirectories, initializeExpansion]);

    const handleClose = useCallback(
        (nodes: TreeViewFinderNodeProps[]) => {
            if (nodes && nodes.length > 0) {
                const lastSelectedNode = nodes[0];
                saveLastSelectedDirectoryFromNode(lastSelectedNode);
            }

            setAutoExpandedNodes([]);

            onClose(nodes);
        },
        [onClose]
    );

    return (
        <TreeViewFinder
            onTreeBrowse={fetchDirectoryChildren as (NodeId: string) => void}
            sortMethod={sortHandlingDirectories}
            multiSelect // defaulted to true
            open={open}
            expanded={autoExpandedNodes}
            onlyLeaves // defaulted to true
            selected={selected}
            onClose={handleClose}
            {...otherTreeViewFinderProps}
            data={data}
        />
    );
}
