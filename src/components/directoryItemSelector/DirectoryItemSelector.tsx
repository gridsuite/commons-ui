/**
 * Copyright (c) 2022, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { SxProps, Theme } from '@mui/material';
import { UUID } from 'crypto';
import { getFileIcon } from '../../utils/mapper/getFileIcon';
import { ElementType } from '../../utils/types/elementType';
import { TreeViewFinder, TreeViewFinderNodeProps, TreeViewFinderProps } from '../treeViewFinder/TreeViewFinder';
import { useSnackMessage } from '../../hooks/useSnackMessage';
import { fetchDirectoryContent, fetchElementsInfos, fetchRootFolders } from '../../services';
import { ElementAttributes } from '../../utils';

const styles = {
    icon: (theme: Theme) => ({
        marginRight: theme.spacing(1),
        width: '18px',
        height: '18px',
    }),
};

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
    ...otherTreeViewFinderProps
}: Readonly<DirectoryItemSelectorProps>) {
    const [data, setData] = useState<TreeViewFinderNodeProps[]>([]);
    const [rootDirectories, setRootDirectories] = useState<ElementAttributes[]>([]);
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
                description: e.description,
                specificMetadata: e.specificMetadata,
                icon: getFileIcon(e.type, styles.icon as SxProps),
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
                    icon: getFileIcon(e.type, styles.icon as SxProps),
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
        fetchRootFolders(types)
            .then((newData) => {
                const [nrs, mdr] = updatedTree(rootsRef.current, nodeMap.current, null, newData);
                setRootDirectories(nrs);
                nodeMap.current = mdr;
                setData(convertRoots(nrs));
            })
            .catch((error) => {
                snackError({
                    messageTxt: error.message,
                    headerId: 'DirectoryItemSelector',
                });
            });
    }, [convertRoots, types, snackError]);

    const fetchDirectoryChildren = useCallback(
        (nodeId: UUID): void => {
            const typeList = types.includes(ElementType.DIRECTORY) ? [] : types;
            fetchDirectoryContent(nodeId, typeList)
                .then((children) => {
                    const childrenMatchedTypes = children.filter((item: ElementAttributes) =>
                        contentFilter().has(item.type)
                    );

                    if (childrenMatchedTypes.length > 0 && equipmentTypes && equipmentTypes.length > 0) {
                        fetchElementsInfos(
                            childrenMatchedTypes.map((e: ElementAttributes) => e.elementUuid),
                            types,
                            equipmentTypes
                        ).then((childrenWithMetadata: ElementAttributes[]) => {
                            const filtredChildren = itemFilter
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
                            addToDirectory(nodeId, filtredChildren);
                        });
                    } else {
                        // update directory content
                        addToDirectory(nodeId, childrenMatchedTypes);
                    }
                })
                .catch((error) => {
                    console.warn(`Could not update subs (and content) of '${nodeId}' : ${error.message}`);
                });
        },
        [types, equipmentTypes, itemFilter, contentFilter, addToDirectory]
    );

    // In this useEffect, we fetch the path (expanded array) of every selected node
    useEffect(() => {
        if (open && expanded && selected) {
            // we check if every selected item is already fetched
            const isSelectedItemFetched = selected.every((id) => nodeMap.current[id]);
            if (!isSelectedItemFetched) {
                expanded.forEach((nodeId) => {
                    const node = nodeMap.current[nodeId];
                    // we check that the node exist before fetching the children
                    // And we check if there is already children (Because we are trying to reach a selected element, we know every node has at least one child)
                    if (node?.children && node.children.length === 0) {
                        fetchDirectoryChildren(nodeId);
                    }
                });
            }
        }
    }, [open, expanded, fetchDirectoryChildren, selected, data]);

    useEffect(() => {
        if (open) {
            updateRootDirectories();
        }
    }, [open, updateRootDirectories]);

    return (
        <TreeViewFinder
            onTreeBrowse={fetchDirectoryChildren as (NodeId: string) => void}
            sortMethod={sortHandlingDirectories}
            multiSelect // defaulted to true
            open={open}
            expanded={expanded as string[]}
            onlyLeaves // defaulted to true
            selected={selected}
            {...otherTreeViewFinderProps}
            data={data}
        />
    );
}
