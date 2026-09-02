/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React, {
    Dispatch,
    FunctionComponent,
    ReactElement,
    SetStateAction,
    useCallback,
    useEffect,
    useRef,
    useState,
} from 'react';
import { useIntl } from 'react-intl';
import {
    Box,
    Button,
    type ButtonProps,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    type ModalProps,
    styled,
    Typography,
    Tab,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tabs,
} from '@mui/material';
import { SimpleTreeView, SimpleTreeViewClasses, TreeItem } from '@mui/x-tree-view';
import {
    Check as CheckIcon,
    ChevronRight as ChevronRightIcon,
    ExpandMore as ExpandMoreIcon,
    AccessTime,
    FolderOpen,
    Star,
} from '@mui/icons-material';
import type { UUID } from 'node:crypto';
import { makeComposeClasses, type MuiStyles, toNestedGlobalSelectors } from '../../../utils/styles';
import { CancelButton } from '../reactHookForm/utils/CancelButton';
import { ElementAttributes, ElementType } from '../../../utils';
import { doesNodeHasChildren } from './TreeViewUtils';
import { HighlightedText } from './HighlightedText';
import { TreeViewSearchBar, type SearchBarItem, type TreeViewSearchBarProps } from './TreeViewSearchBar';
import { fetchConfigParameter, fetchDirectoryElementPath, fetchElementNames } from '../../../services';

export const FAVORITES_PARAMETER_NAME = 'favoriteElements';
export const RECENTS_PARAMETER_NAME = 'recentElements';
export const EXPLORE_APP_NAME = 'Explore';

const enum SelectorTab {
    FAVORITES = 'favorites',
    RECENTS = 'recents',
    BROWSE = 'browse',
}

// As a bunch of individual variables to try to make it easier
// to track that they are all used. Not sure, maybe group them in an object ?
const cssDialogPaper = 'dialogPaper';
const cssLabelRoot = 'labelRoot';
const cssLabelText = 'labelText';
const cssLabelIcon = 'labelIcon';
const cssIcon = 'icon';

// converted to nested rules
const defaultStyles = {
    [cssDialogPaper]: {
        minWidth: '50%',
    },
    [cssLabelRoot]: {
        display: 'flex',
        alignContent: 'center',
        alignItems: 'center',
    },
    [cssLabelText]: {
        fontWeight: 'inherit',
        flexGrow: 1,
    },
    [cssLabelIcon]: {
        display: 'flex',
        alignContent: 'center',
        alignItems: 'center',

        marginRight: '4px',
    },
    [cssIcon]: {},
} as const satisfies MuiStyles;

export const generateTreeViewFinderClass = (className: string) => `GsiTreeViewFinder-${className}`;
const composeClasses = makeComposeClasses(generateTreeViewFinderClass);

function CustomExpandIcon({ className }: Readonly<{ className?: string }>) {
    return <ChevronRightIcon className={className} />;
}

function CustomCollapseIcon({ className }: Readonly<{ className?: string }>) {
    return <ExpandMoreIcon className={className} />;
}

export interface TreeViewFinderNodeProps {
    id: UUID;
    name: string;
    type?: ElementType;
    description?: string;
    icon?: ReactElement;
    childrenCount?: number;
    children?: TreeViewFinderNodeProps[];
    parents?: TreeViewFinderNodeProps[];
    specificMetadata?: {
        equipmentType: string;
    };
}

interface TreeViewFinderNodeMapProps {
    [id: string]: TreeViewFinderNodeProps;
}

export interface TreeViewFinderProps {
    types: string[];
    equipmentTypes?: string[];

    // TreeView Props
    defaultExpanded?: string[];
    defaultSelected?: string[];
    selected?: string[];
    expanded?: string[];
    multiSelect?: boolean;
    classes?: Partial<SimpleTreeViewClasses>;
    className?: string;

    // dialog props
    contentText?: string;
    open: ModalProps['open'];
    onClose: (nodes: TreeViewFinderNodeProps[], shouldUpdateRecents?: boolean) => void;
    validationButtonText?: string;
    cancelButtonProps?: ButtonProps;
    title?: string;

    // data management props
    onlyLeaves?: boolean;
    data?: TreeViewFinderNodeProps[];
    onTreeBrowse?: (itemId: string) => void;
    sortMethod?: (a: TreeViewFinderNodeProps, b: TreeViewFinderNodeProps) => number;

    inline?: boolean;
    onSelectionChange?: (nodes: TreeViewFinderNodeProps[]) => void;
    fetchSearchElements?: TreeViewSearchBarProps<SearchBarItem>['fetchElements'];

    /**
     * TreeViewFinder documentation :
     * Component to choose elements in a flat list or a Tree data structure
     * It is flexible and allow controlled props to let Parent component manage
     * data.
     *
     * @param {Object}          classes - Deprecated, use sx or styled instead. - Otherwise, CSS classes, please use withStyles API from MaterialUI
     * @param {String}          [title] - Title of the Dialog
     * @param {String}          [contentText] - Content text of the Dialog
     * @param {Boolean}         open - dialog state boolean handler (Controlled)
     * @param {EventListener}   onClose - onClose callback to call when closing dialog
     * @param {Object[]}        data - data to feed the component (Controlled).
     * @param {String}          data[].id - Uuid of the object in Tree
     * @param {String}          data[].parentId - Uuid of the parent node in Tree
     * @param {String}          data[].name - name of the node to print in Tree
     * @param {String}          data[].icon - JSX of an icon to display next a node
     * @param {String}          data[].childrenCount - number of children
     * @param {Object[]}        [data[].children] - array of children nodes, if undefined, the node is a leaf.
     * @callback                onTreeBrowse - callback to update data prop when walk into Tree
     * @param {Array}           [defaultSelected=[]] - selected items at mount (Uncontrolled)
     * @param {Array}           [defaultExpanded=[]] - ids of the expanded items at mount (Uncontrolled)
     * @param {String}          [validationButtonText=default text] - Customized Validation Button text (default: Add N Elements)
     * @param {Boolean}         [onlyLeaves=true] - Allow/Forbid selection only on leaves
     * @param {Boolean}         [multiSelect=false] - Allow/Forbid multiselection on Tree
     * @param {Object}          [cancelButtonProps] - The cancel button props
     * @param {Object}          [selected] - ids of selected items
     * @param {Array}           [expanded] - ids of the expanded items
     * @param {Boolean}         [inline=false] - When true, renders only the tree content without the Dialog wrapper. Action buttons are hidden in inline mode.
     * @callback                onSelectionChange - Called whenever the selection changes in inline mode with the currently selected selectable nodes.
     * @callback                fetchSearchElements - Called to search matching elements
     */
}

function TreeViewFinderComponant(props: Readonly<TreeViewFinderProps>) {
    const intl = useIntl();
    const {
        classes = {},
        title,
        contentText,
        open,
        data,
        defaultExpanded,
        defaultSelected,
        onClose,
        types,
        equipmentTypes,
        onTreeBrowse,
        validationButtonText,
        onlyLeaves = true,
        multiSelect = false,
        sortMethod,
        className,
        cancelButtonProps,
        selected: selectedProp,
        expanded: expandedProp,
        inline = false,
        onSelectionChange,
        fetchSearchElements,
    } = props;

    const [mapPrintedNodes, setMapPrintedNodes] = useState<TreeViewFinderNodeMapProps>({});

    // Controlled expanded for TreeView
    const [expanded, setExpanded] = useState<string[] | undefined>(defaultExpanded ?? []);
    // Controlled selected for TreeView
    const [selected, setSelected] = useState<string[] | undefined>(defaultSelected ?? []);
    // Row selected in recents or favorites
    const [rowSelected, setRowSelected] = useState<any | undefined>(undefined);

    const scrollRef = useRef<(HTMLLIElement | null)[]>([]);
    const [autoScrollAllowed, setAutoScrollAllowed] = useState<boolean>(true);

    const [activeTab, setActiveTab] = useState<SelectorTab>(SelectorTab.BROWSE);

    const [highlightedNodeId, setHighlightedNodeId] = useState<string | null>(null);
    const [currentSearchTerm, setCurrentSearchTerm] = useState('');
    const [recents, setRecents] = useState<any[]>([]);
    const [favorites, setFavorites] = useState<any[]>([]);

    // map of node id to node html element reference
    const nodeRefsMap = useRef<Map<string, HTMLLIElement>>(new Map());
    const treeContainerRef = useRef<HTMLDivElement | null>(null);
    const isSearchDisabled =
        !fetchSearchElements || activeTab === SelectorTab.FAVORITES || activeTab === SelectorTab.RECENTS;

    /* Utilities */
    const isLeaf = (node: TreeViewFinderNodeProps) => {
        return node && node.children === undefined;
    };

    const isSelectable = (node: TreeViewFinderNodeProps) => {
        return onlyLeaves ? isLeaf(node) : true; // otherwise everything is selectable
    };

    const isValidationDisabled = () => {
        return (
            rowSelected === undefined &&
            (selected?.length === 0 ||
                (selected?.length === selectedProp?.length &&
                    selected?.every((itemId) => selectedProp?.includes(itemId))))
        );
    };

    const computeMapPrintedNodes = useCallback((nodes: TreeViewFinderNodeProps[] | undefined) => {
        const newMapPrintedNodes: TreeViewFinderNodeMapProps = {};
        nodes?.forEach((node) => {
            newMapPrintedNodes[node.id] = node;
            if (!isLeaf(node)) {
                Object.assign(newMapPrintedNodes, computeMapPrintedNodes(node.children));
            }
        });
        return newMapPrintedNodes;
    }, []);

    const findParents = (
        itemId: string,
        nodes: TreeViewFinderNodeProps[],
        parentPath: TreeViewFinderNodeProps[] = []
    ): TreeViewFinderNodeProps[] | null => {
        let result: TreeViewFinderNodeProps[] | null = null;

        nodes.some((node) => {
            // If the current node matches the selected node, set result and break
            if (node.id === itemId) {
                result = parentPath;
                return true;
            }

            // If the current node has children, recursively search them
            if (node.children) {
                const childResult = findParents(itemId, node.children, [...parentPath, node]);
                if (childResult) {
                    result = childResult;
                    return true;
                }
            }

            return false;
        });

        return result;
    };

    // Effects
    useEffect(() => {
        function fetchParameter(paramName: string, setActions: Dispatch<SetStateAction<any[]>>) {
            fetchConfigParameter(EXPLORE_APP_NAME, paramName).then((paramValue) => {
                if (paramValue !== undefined && paramValue !== null && paramValue !== '') {
                    let values: any[] = JSON.parse(paramValue.value) as any[];

                    // Filtering on types and equipment types
                    const allUuids: Set<string> = new Set(
                        values
                            .filter(
                                (e) =>
                                    types.includes(e.type) &&
                                    (equipmentTypes === undefined || equipmentTypes.includes(e.equipmentType))
                            )
                            .map((value: any) => value.id)
                    );

                    // Get name and remove deleted elements
                    // TODO later : we can avoid storing name and path in the parameter value
                    // as we get the name here from the id (we can also get the full path from the id)
                    const elementNamesPromise =
                        allUuids.size === 0 ? Promise.resolve(null) : fetchElementNames(allUuids);
                    elementNamesPromise.then((elementNames) => {
                        values = elementNames
                            ? values.filter((value) => {
                                  return value.id in elementNames;
                              })
                            : [];
                        setActions(values);
                    });
                }
            });
        }

        if (open) {
            // fetch recents and favorites
            fetchParameter(RECENTS_PARAMETER_NAME, setRecents);
            fetchParameter(FAVORITES_PARAMETER_NAME, setFavorites);
        }
    }, [data, open, types, equipmentTypes]);

    useEffect(() => {
        // compute all mapPrintedNodes here from data prop
        // if data changes in current expanded nodes
        const newMapPrintedNodes = computeMapPrintedNodes(data);
        setMapPrintedNodes(newMapPrintedNodes);
    }, [data, computeMapPrintedNodes]);

    const computeSelectedNodesFromTree = (): TreeViewFinderNodeProps[] => {
        if (!selected) {
            return [];
        }
        return selected
            .map((itemId) => {
                const selectedNode = mapPrintedNodes[itemId];
                if (!selectedNode) {
                    return null;
                }
                const parents = findParents(itemId, data ?? []);
                return {
                    ...selectedNode,
                    parents: parents ?? [],
                };
            })
            .filter((node) => node !== null) as TreeViewFinderNodeProps[];
    };

    const computeSelectedNodeFromRecentsOrFavorites = (): TreeViewFinderNodeProps[] => {
        return [{ id: rowSelected.id, name: rowSelected.name }];
    };

    const handleNodeToggle = (_e: React.SyntheticEvent | null, itemIds: string[]) => {
        // onTreeBrowse proc only on last node clicked and only when expanded
        itemIds.every((itemId) => {
            if (!expanded?.includes(itemId)) {
                // proc onTreeBrowse here
                onTreeBrowse?.(itemId);
                return false; // break loop to call onTreeBrowse only once
            }
            return true;
        });

        setExpanded(itemIds);
        // will proc onNodeSelect then ...
    };

    useEffect(() => {
        if (!selectedProp) {
            return;
        }
        if (selectedProp.length > 0) {
            setSelected((oldSelectedNodes) => {
                const prev = oldSelectedNodes ?? [];
                return Array.from(new Set([...prev, ...selectedProp]));
            });
        }
    }, [selectedProp]);

    useEffect(() => {
        if (!expandedProp || expandedProp.length === 0) {
            return;
        }
        if (expandedProp.length > 0) {
            setExpanded((oldExpandedNodes) => [...(oldExpandedNodes ?? []), ...expandedProp]);
        }
    }, [expandedProp]);

    useEffect(() => {
        const hasSelected = selectedProp && selectedProp.length > 0;
        const hasExpanded = expandedProp && expandedProp.length > 0;

        // Only proceed if we have either selected or expanded elements and auto scroll is allowed
        if ((!hasSelected && !hasExpanded) || !autoScrollAllowed) {
            return;
        }

        // we check if all expanded nodes by default all already expanded first
        const isNodeExpanded = expandedProp?.every((itemId) => expanded?.includes(itemId));

        // we got the last element that we suppose to scroll to
        const lastScrollRef = scrollRef.current[scrollRef.current.length - 1];
        if (isNodeExpanded && lastScrollRef) {
            lastScrollRef.scrollIntoView({
                behavior: 'smooth',
                block: 'center',
                inline: 'center',
            });
            setAutoScrollAllowed(false);
        }
    }, [expanded, selectedProp, expandedProp, data, autoScrollAllowed]);

    /* User Interaction management */
    const handleNodeSelect = (_e: React.SyntheticEvent | null, values: string | string[] | null) => {
        // Default management
        let newSelected: string[] = [];
        if (multiSelect && Array.isArray(values)) {
            newSelected = values.filter((itemId) => isSelectable(mapPrintedNodes[itemId]));
        } else if (typeof values === 'string') {
            // Toggle selection to allow unselection
            if (selected?.includes(values)) {
                newSelected = [];
            } else {
                newSelected = isSelectable(mapPrintedNodes[values]) ? [values] : [];
            }
        }
        setSelected(newSelected);
        if (inline && onSelectionChange) {
            // Emits nodes in tree display order
            const selectedSet = new Set(newSelected);
            const orderedNodes: TreeViewFinderNodeProps[] = [];
            const collectInTreeOrder = (nodes: TreeViewFinderNodeProps[] | undefined) => {
                [...(nodes ?? [])].sort(sortMethod).forEach((node) => {
                    if (selectedSet.has(node.id)) {
                        orderedNodes.push(node);
                    }
                    if (node.children) {
                        collectInTreeOrder(node.children);
                    }
                });
            };
            collectInTreeOrder(data);
            onSelectionChange(orderedNodes);
        }
    };

    /**
     * Callback called when user select a result from the search dropdown.
     */
    const handleSearchSelection = useCallback(
        (item: SearchBarItem) => {
            // Save the search term so HighlightedText can use it
            setCurrentSearchTerm(item.name);

            // Expand every ancestor of the found node.
            fetchDirectoryElementPath(item.id as UUID).then((response: ElementAttributes[]) => {
                const path = response.filter((e) => e.elementUuid !== item.id).map((e) => e.elementUuid);

                setExpanded((prev) => Array.from(new Set([...(prev ?? []), ...path])));
                // Trigger onTreeBrowse for each ancestor that wasn't already expanded
                path.forEach((a) => {
                    if (!expanded?.includes(a)) {
                        onTreeBrowse?.(a);
                    }
                });
                // Mark the node as highlighted
                setHighlightedNodeId(item.id);
                // Select the node in order to enable validation button
                handleNodeSelect(null, item.id);
            });
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [data, expanded, onTreeBrowse]
    );

    /* Render utilities */
    const getValidationButtonText = () => {
        if (validationButtonText) {
            return validationButtonText;
        }
        let buttonLabelId = '';
        if (Array.isArray(selectedProp)) {
            buttonLabelId =
                selectedProp?.length > 0
                    ? 'treeview_finder/replaceElementsValidation'
                    : 'treeview_finder/addElementsValidation';
        } else {
            buttonLabelId = selectedProp
                ? 'treeview_finder/replaceElementsValidation'
                : 'treeview_finder/addElementsValidation';
        }

        return intl.formatMessage(
            { id: buttonLabelId },
            {
                nbElements: selected?.length,
            }
        );
    };

    const getNodeIcon = (node: TreeViewFinderNodeProps) => {
        if (!node) {
            return null;
        }

        if (isSelectable(node) && selected?.find((itemId) => itemId === node.id)) {
            return <CheckIcon className={composeClasses(classes, cssLabelIcon)} />;
        }
        if (node.icon) {
            return <div className={composeClasses(classes, cssLabelIcon)}>{node.icon}</div>;
        }
        return null;
    };

    const renderTreeItemLabel = (node: TreeViewFinderNodeProps) => {
        const isHighlighted = node.id === highlightedNodeId && currentSearchTerm.length > 0;
        return (
            <div className={composeClasses(classes, cssLabelRoot)}>
                {getNodeIcon(node)}
                <Typography className={composeClasses(classes, cssLabelText)}>
                    {isHighlighted ? <HighlightedText text={node.name} highlight={currentSearchTerm} /> : node.name}
                </Typography>
            </div>
        );
    };

    const showChevron = (node: TreeViewFinderNodeProps) => {
        return !!(node.childrenCount && node.childrenCount > 0);
    };

    // Scroll to the highlighted node
    useEffect(() => {
        if (!highlightedNodeId) {
            return undefined;
        }

        const scrollToNode = () => {
            const treeItemEl = nodeRefsMap.current.get(highlightedNodeId);
            if (!treeItemEl) {
                return false;
            }
            treeItemEl.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
            return true;
        };

        if (scrollToNode()) {
            return undefined;
        }

        const treeContainer = treeContainerRef.current;
        if (!treeContainer) {
            return undefined;
        }

        // Using a MutationObserver on the tree container so we are notified as
        // soon as the TreeItem is mounted (after async directory expansion).
        const observer = new MutationObserver(() => {
            if (scrollToNode()) {
                observer.disconnect();
            }
        });

        observer.observe(treeContainer, { childList: true, subtree: true });

        return () => observer.disconnect();
    }, [highlightedNodeId]);

    const renderTree = (node: TreeViewFinderNodeProps) => {
        if (!node) {
            return null;
        }
        let childrenNodes = null;
        const showExpandIcon = showChevron(node);
        if (doesNodeHasChildren(node as unknown as ElementAttributes)) {
            // @ts-ignore checked above
            childrenNodes = node.children.toSorted(sortMethod).map(renderTree);
        } else if (showExpandIcon) {
            childrenNodes = [<span key="placeholder" style={{ display: 'none' }} />]; // simulate placeholder so expand icon is shown
        }
        return (
            <TreeItem
                key={node.id}
                itemId={node.id}
                label={renderTreeItemLabel(node)}
                slots={{
                    expandIcon: CustomExpandIcon,
                    collapseIcon: CustomCollapseIcon,
                }}
                slotProps={{
                    expandIcon: {
                        className: composeClasses(classes, cssIcon),
                    },
                    collapseIcon: {
                        className: composeClasses(classes, cssIcon),
                    },
                }}
                ref={(element) => {
                    // add each mounted node to the map, and remove it on unmount
                    if (element) {
                        nodeRefsMap.current.set(node.id, element);
                    } else {
                        nodeRefsMap.current.delete(node.id);
                    }

                    // Add to scroll ref if it's a selected element, or if no selected elements and it's an expanded element
                    const shouldAddToScrollRef =
                        selectedProp && selectedProp.length > 0
                            ? selectedProp.includes(node.id)
                            : (expandedProp?.includes(node.id) ?? false);

                    if (shouldAddToScrollRef || node.id === highlightedNodeId) {
                        scrollRef.current.push(element);
                    }
                }}
            >
                {childrenNodes}
            </TreeItem>
        );
    };

    const getTreeViewSelectionProps = () => {
        if (!multiSelect) {
            return {
                multiSelect: false as const,
                selected: selected && selected.length > 0 ? selected.at(0) : '',
            };
        }
        return {
            multiSelect: true as const,
            selected: selected ?? [],
        };
    };

    const renderTreeView = (
        <SimpleTreeView
            expandedItems={expanded}
            onExpandedItemsChange={handleNodeToggle}
            onSelectedItemsChange={handleNodeSelect}
            {...getTreeViewSelectionProps()}
        >
            {data && Array.isArray(data) ? data.sort(sortMethod).map((child) => renderTree(child)) : null}
        </SimpleTreeView>
    );

    const handleCancel = () => {
        onClose?.([]);
        setSelected([]);
        setRowSelected(undefined);
        setAutoScrollAllowed(true);
        setHighlightedNodeId(null);
        setCurrentSearchTerm('');
    };

    const handleValidate = () => {
        onClose?.(
            activeTab === SelectorTab.BROWSE
                ? computeSelectedNodesFromTree()
                : computeSelectedNodeFromRecentsOrFavorites(),
            activeTab === SelectorTab.BROWSE
        );
        setSelected([]);
        setRowSelected(undefined);
        setAutoScrollAllowed(true);
        setHighlightedNodeId(null);
        setCurrentSearchTerm('');
    };

    const actionButtons = (
        <>
            <CancelButton style={{ float: 'left', margin: '5px' }} onClick={handleCancel} {...cancelButtonProps} />
            <Button
                variant="outlined"
                style={{ float: 'left', margin: '5px' }}
                onClick={handleValidate}
                disabled={isValidationDisabled()}
                data-testid="SubmitButton"
            >
                {getValidationButtonText()}
            </Button>
        </>
    );

    const handleRowClick = (row: any) => {
        // set selected row
        setRowSelected(row);
    };

    /* ── Inline mode ── */
    if (inline) {
        return (
            <div className={className} data-testid="InlineTreeViewFinder">
                {renderTreeView}
            </div>
        );
    }

    /* ── Dialog mode (default) ── */
    return (
        <Dialog
            open={open}
            onClose={(e, r) => {
                if (r === 'backdropClick') {
                    return;
                }
                if (r === 'escapeKeyDown') {
                    onClose?.([]);
                    setSelected([]);
                    setRowSelected(undefined);
                }
            }}
            aria-labelledby="TreeViewFindertitle"
            className={className}
            classes={{ paper: composeClasses(classes, cssDialogPaper) }}
            data-testid="Dialog"
        >
            <DialogTitle id="TreeViewFindertitle" data-testid="DialogTitle">
                {title ?? intl.formatMessage({ id: 'treeview_finder/finderTitle' }, { multiSelect })}
            </DialogTitle>
            <DialogContent>
                <DialogContentText>
                    {contentText ?? intl.formatMessage({ id: 'treeview_finder/contentText' }, { multiSelect })}
                </DialogContentText>

                <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                    <Box sx={{ px: 1, pt: 1, pb: 0.5 }}>
                        {fetchSearchElements ? (
                            <TreeViewSearchBar<SearchBarItem>
                                fetchElements={fetchSearchElements}
                                onSelectionChange={handleSearchSelection}
                                disabled={isSearchDisabled}
                            />
                        ) : (
                            /* Disable TextField when no fetch function is provided */
                            <TreeViewSearchBar<SearchBarItem>
                                fetchElements={() => Promise.resolve([])}
                                onSelectionChange={() => {}}
                                disabled
                            />
                        )}
                    </Box>

                    <Tabs
                        value={activeTab}
                        onChange={(_e, newTab: SelectorTab) => setActiveTab(newTab)}
                        variant="fullWidth"
                        sx={{ borderBottom: 1, borderColor: 'divider', minHeight: 48 }}
                    >
                        <Tab
                            value={SelectorTab.FAVORITES}
                            icon={<Star fontSize="small" />}
                            iconPosition="start"
                            label={intl.formatMessage({ id: 'directoryItemSelector/tab/favorites' })}
                            sx={{ textTransform: 'none', minHeight: 48 }}
                        />
                        <Tab
                            value={SelectorTab.RECENTS}
                            icon={<AccessTime fontSize="small" />}
                            iconPosition="start"
                            label={intl.formatMessage({ id: 'directoryItemSelector/tab/recents' })}
                            sx={{ textTransform: 'none', minHeight: 48 }}
                        />
                        <Tab
                            value={SelectorTab.BROWSE}
                            icon={<FolderOpen fontSize="small" />}
                            iconPosition="start"
                            label={intl.formatMessage({ id: 'directoryItemSelector/tab/browse' })}
                            sx={{ textTransform: 'none', minHeight: 48 }}
                        />
                    </Tabs>

                    {(activeTab === SelectorTab.FAVORITES || activeTab === SelectorTab.RECENTS) && (
                        <TableContainer sx={{ flex: 1, maxHeight: 400, overflowY: 'auto' }}>
                            <Table stickyHeader size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>
                                            {intl.formatMessage({ id: 'directoryItemSelector/table/name' })}
                                        </TableCell>
                                        <TableCell>
                                            {intl.formatMessage({ id: 'directoryItemSelector/table/directory' })}
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {(activeTab === SelectorTab.RECENTS ? recents : favorites).map((item: any) => (
                                        <TableRow
                                            key={item.id}
                                            hover
                                            selected={rowSelected?.id === item.id}
                                            sx={{ height: 40, cursor: 'pointer' }}
                                            onClick={() => handleRowClick(item)}
                                        >
                                            <TableCell>{item.name}</TableCell>
                                            <TableCell>{item.path}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}

                    {activeTab === SelectorTab.BROWSE && <div ref={treeContainerRef}>{renderTreeView}</div>}
                </Box>
            </DialogContent>
            <DialogActions>{actionButtons}</DialogActions>
        </Dialog>
    );
}

const nestedGlobalSelectorsStyles = toNestedGlobalSelectors(defaultStyles, generateTreeViewFinderClass);
export const TreeViewFinder: FunctionComponent<TreeViewFinderProps> =
    styled(TreeViewFinderComponant)(nestedGlobalSelectorsStyles);
