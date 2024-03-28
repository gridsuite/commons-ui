/**
 * Copyright (c) 2022, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import {
    FunctionComponent,
    useCallback,
    useEffect,
    useRef,
    useState,
} from 'react';
import { getFileIcon } from '../../utils/ElementIcon';
import { ElementType } from '../../utils/ElementType';
import { useSnackMessage } from '../../hooks/useSnackMessage.js';
import TreeViewFinder from '../TreeViewFinder';
import { Theme } from '@mui/material';
import { UUID } from 'crypto';

const styles = {
    icon: (theme: Theme) => ({
        marginRight: theme.spacing(1),
        width: '18px',
        height: '18px',
    }),
};

interface DirectoryItemSelectorProps {
    open: boolean;
    onClose: any;
    types: string[];
    equipmentTypes?: string[];
    title: string;
    itemFilter?: any;
    fetchDirectoryContent: (
        directoryUuid: UUID,
        elementTypes: string[]
    ) => Promise<any>;
    fetchRootFolders: (types: string[]) => Promise<any>;
    fetchElementsInfos: (
        ids: UUID[],
        elementTypes: string[],
        equipmentTypes: string[]
    ) => Promise<any>;
    classes?: any;
    contentText?: string;
    defaultExpanded?: string[];
    defaultSelected?: string[];
    validationButtonText?: string;
    className?: string;
    cancelButtonProps?: any;
    onlyLeaves?: boolean;
    multiselect?: boolean;
    selected?: UUID[];
    expanded?: UUID[];
}

const DirectoryItemSelector: FunctionComponent<DirectoryItemSelectorProps> = ({
    open,
    onClose,
    types,
    equipmentTypes,
    title,
    itemFilter,
    fetchDirectoryContent,
    fetchRootFolders,
    fetchElementsInfos,
    classes,
    contentText,
    defaultExpanded,
    defaultSelected,
    validationButtonText,
    className,
    cancelButtonProps,
    onlyLeaves = true,
    multiselect = true,
    selected,
    expanded,
}) => {
    const [data, setData] = useState<any[]>([]);
    const [rootDirectories, setRootDirectories] = useState<any[]>([]);
    const nodeMap = useRef<any>({});
    const dataRef = useRef<any[]>([]);
    dataRef.current = data;

    const rootsRef = useRef<any[]>([]);
    rootsRef.current = rootDirectories;
    const { snackError } = useSnackMessage();
    const openRef = useRef<boolean>();
    openRef.current = open;
    const contentFilter = useCallback(
        () => new Set([ElementType.DIRECTORY, ...types]),
        [types]
    );

    const convertChildren = useCallback((children: any[]): any[] => {
        return children.map((e) => {
            return {
                id: e.elementUuid,
                name: e.elementName,
                specificMetadata: e.specificMetadata,
                icon: getFileIcon(e.type, styles.icon),
                children:
                    e.type === ElementType.DIRECTORY
                        ? convertChildren(e.children)
                        : undefined,
                childrenCount:
                    e.type === ElementType.DIRECTORY
                        ? e.subdirectoriesCount
                        : undefined,
            };
        });
    }, []);

    const convertRoots = useCallback(
        (newRoots: any[]): any[] => {
            return newRoots.map((e) => {
                return {
                    id: e.elementUuid,
                    name: e.elementName,
                    icon: getFileIcon(e.type, styles.icon),
                    children:
                        e.type === ElementType.DIRECTORY
                            ? convertChildren(
                                  nodeMap.current[e.elementUuid].children
                              )
                            : undefined,
                    childrenCount:
                        e.type === ElementType.DIRECTORY
                            ? e.subdirectoriesCount
                            : undefined,
                };
            });
        },
        [convertChildren]
    );

    const addToDirectory = useCallback(
        (nodeId: UUID, content: any[]) => {
            let [nrs, mdr] = updatedTree(
                rootsRef.current,
                nodeMap.current,
                nodeId,
                content
            );
            setRootDirectories(nrs);
            nodeMap.current = mdr;
            setData(convertRoots(nrs));
        },
        [convertRoots]
    );

    const updateRootDirectories = useCallback(() => {
        fetchRootFolders(types)
            .then((data) => {
                let [nrs, mdr] = updatedTree(
                    rootsRef.current,
                    nodeMap.current,
                    null,
                    data
                );
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
    }, [convertRoots, types, snackError, fetchRootFolders]);

    const fetchDirectory = useCallback(
        (nodeId: UUID): void => {
            fetchDirectoryContent(nodeId, types)
                .then((children) => {
                    const childrenMatchedTypes = children.filter((item: any) =>
                        contentFilter().has(item.type)
                    );

                    if (
                        childrenMatchedTypes.length > 0 &&
                        equipmentTypes &&
                        equipmentTypes.length > 0
                    ) {
                        fetchElementsInfos(
                            childrenMatchedTypes.map((e: any) => e.elementUuid),
                            types,
                            equipmentTypes
                        ).then((childrenWithMetadata) => {
                            const children = itemFilter
                                ? childrenWithMetadata.filter((val: any) => {
                                      // Accept every directory
                                      if (val.type === ElementType.DIRECTORY) {
                                          return true;
                                      }
                                      // otherwise filter with the custom itemFilter func
                                      return itemFilter(val);
                                  })
                                : childrenWithMetadata;
                            // update directory content
                            addToDirectory(nodeId, children);
                        });
                    } else {
                        // update directory content
                        addToDirectory(nodeId, childrenMatchedTypes);
                    }
                })
                .catch((error) => {
                    console.warn(
                        `Could not update subs (and content) of '${nodeId}' : ${error.message}`
                    );
                });
        },
        [
            types,
            equipmentTypes,
            itemFilter,
            contentFilter,
            addToDirectory,
            fetchDirectoryContent,
            fetchElementsInfos,
        ]
    );

    useEffect(() => {
        if (open) {
            updateRootDirectories();
            if (expanded) {
                expanded.forEach((nodeId) => {
                    fetchDirectory(nodeId);
                });
            }
        }
    }, [open, updateRootDirectories, expanded, fetchDirectory]);

    function sortHandlingDirectories(a: any, b: any): number {
        //If children property is set it means it's a directory, they are handled differently in order to keep them at the top of the list
        if (a.children && !b.children) {
            return -1;
        } else if (b.children && !a.children) {
            return 1;
        }
        return a.name.localeCompare(b.name);
    }

    return (
        <>
            <TreeViewFinder
                multiselect={multiselect}
                onTreeBrowse={fetchDirectory}
                data={data}
                onlyLeaves={onlyLeaves}
                sortMethod={sortHandlingDirectories}
                title={title}
                onClose={onClose}
                open={open}
                classes={classes}
                contentText={contentText}
                defaultExpanded={defaultExpanded}
                defaultSelected={defaultSelected}
                validationButtonText={validationButtonText}
                className={className}
                cancelButtonProps={cancelButtonProps}
                selected={selected}
                expanded={expanded}
            />
        </>
    );
};

export default DirectoryItemSelector;

/**
 * Make an updated tree [root_nodes, id_to_node] from previous tree and new {id, children}
 * @param prevRoots previous [root nodes]
 * @param prevMap previous map (js object) uuid to children nodes
 * @param nodeId uuid of the node to update children, may be null or undefined (means root)
 * @param children new value of the node children (shallow nodes)
 */
function updatedTree(
    prevRoots: any[],
    prevMap: any,
    nodeId: UUID | null,
    children: any[]
) {
    const nextChildren = children
        .sort((a, b) => a.elementName.localeCompare(b.elementName))
        .map((n: any) => {
            let pn = prevMap[n.elementUuid];
            if (!pn) {
                return { ...n, children: [], parentUuid: nodeId };
            } else if (
                n.elementName === pn.elementName &&
                sameRights(n.accessRights, pn.accessRights) &&
                n.subdirectoriesCount === pn.subdirectoriesCount &&
                nodeId === pn.parentUuid
            ) {
                return pn;
            } else {
                if (pn.parentUuid !== nodeId) {
                    console.warn('reparent ' + pn.parentUuid + ' -> ' + nodeId);
                }
                return {
                    ...pn,
                    elementName: n.elementName,
                    accessRights: n.accessRights,
                    subdirectoriesCount: n.subdirectoriesCount,
                    parentUuid: nodeId,
                };
            }
        });

    const prevChildren = nodeId ? prevMap[nodeId]?.children : prevRoots;
    if (
        prevChildren?.length === nextChildren.length &&
        prevChildren.every((e: any, i: number) => e === nextChildren[i])
    ) {
        return [prevRoots, prevMap];
    }

    let nextUuids = new Set(children ? children.map((n) => n.elementUuid) : []);
    let prevUuids = prevChildren
        ? prevChildren.map((n: any) => n.elementUuid)
        : [];
    let mayNodeId = nodeId ? [nodeId] : [];

    let nonCopyUuids = new Set([
        ...nextUuids,
        ...mayNodeId,
        ...Array.prototype.concat(
            ...prevUuids
                .filter((u: UUID) => !nextUuids.has(u))
                .map((u: UUID) =>
                    flattenDownNodes(prevMap[u], (n) => n.children).map(
                        (n) => n.elementUuid
                    )
                )
        ),
    ]);

    const prevNode = nodeId ? prevMap[nodeId] : {};
    const nextNode = {
        elementUuid: nodeId,
        parentUuid: null,
        ...prevNode,
        children: nextChildren,
        subdirectoriesCount: nextChildren.length,
    };

    const nextMap = Object.fromEntries([
        ...Object.entries(prevMap).filter(([k, v], i) => !nonCopyUuids.has(k)),
        ...nextChildren.map((n) => [n.elementUuid, n]),
        ...refreshedUpNodes(prevMap, nextNode).map((n) => [n.elementUuid, n]),
    ]);

    const nextRoots =
        nodeId === null
            ? nextChildren
            : prevRoots.map((r) => nextMap[r.elementUuid]);

    return [nextRoots, nextMap];
}

function sameRights(a: any, b: any) {
    if (!a && !b) {
        return true;
    }
    if (!a || !b) {
        return false;
    }
    return a.isPrivate === b.isPrivate;
}

function flattenDownNodes(n: any, cef: (n: any) => any[]): any[] {
    const subs = cef(n);
    if (subs.length === 0) {
        return [n];
    }
    return Array.prototype.concat(
        [n],
        ...subs.map((sn: any) => flattenDownNodes(sn, cef))
    );
}

function refreshedUpNodes(m: any[], nn: any): any[] {
    if (!nn?.elementUuid) {
        return [];
    }
    if (nn.parentUuid === null) {
        return [nn];
    }
    const parent = m[nn.parentUuid];
    const nextChildren = parent.children.map((c: any) =>
        c.elementUuid === nn.elementUuid ? nn : c
    );
    const nextParent = { ...parent, children: nextChildren };
    return [nn, ...refreshedUpNodes(m, nextParent)];
}
