/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { ReactElement, SyntheticEvent, useCallback, useEffect, useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import {
    Button,
    ButtonProps,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    ModalProps,
    styled,
    Typography,
} from '@mui/material';
import { TreeItem, TreeView, TreeViewClasses } from '@mui/x-tree-view';
import {
    Check as CheckIcon,
    ChevronRight as ChevronRightIcon,
    ExpandMore as ExpandMoreIcon,
} from '@mui/icons-material';
import { makeComposeClasses, type MuiStyles, toNestedGlobalSelectors } from '../../utils/styles';
import { CancelButton } from '../inputs/reactHookForm/utils/CancelButton';

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

export interface TreeViewFinderNodeProps {
    id: string;
    name: string;
    icon?: ReactElement;
    childrenCount?: number;
    children?: TreeViewFinderNodeProps[];
}

interface TreeViewFinderNodeMapProps {
    [id: string]: TreeViewFinderNodeProps;
}

export interface TreeViewFinderProps {
    // TreeView Props
    defaultExpanded?: string[];
    defaultSelected?: string[];
    selected?: string[];
    expanded?: string[];
    multiSelect?: boolean;
    classes?: Partial<TreeViewClasses>;
    className?: string;

    // dialog props
    contentText?: string;
    open: ModalProps['open'];
    onClose: (nodes: TreeViewFinderNodeProps[]) => void;
    validationButtonText?: string;
    cancelButtonProps?: ButtonProps;
    title?: string;

    // data management props
    onlyLeaves?: boolean;
    data?: TreeViewFinderNodeProps[];
    onTreeBrowse?: (nodeId: string) => void;
    sortMethod?: (a: TreeViewFinderNodeProps, b: TreeViewFinderNodeProps) => number;
}

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
 */
function TreeViewFinderComponant(props: TreeViewFinderProps) {
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
        onTreeBrowse,
        validationButtonText,
        onlyLeaves = true,
        multiSelect = false,
        sortMethod,
        className,
        cancelButtonProps,
        selected: selectedProp,
        expanded: expandedProp,
    } = props;

    const [mapPrintedNodes, setMapPrintedNodes] = useState<TreeViewFinderNodeMapProps>({});

    // Controlled expanded for TreeView
    const [expanded, setExpanded] = useState<string[] | undefined>(defaultExpanded ?? []);
    // Controlled selected for TreeView
    const [selected, setSelected] = useState<string[] | undefined>(defaultSelected ?? []);

    const scrollRef = useRef<any>([]);
    const [autoScrollAllowed, setAutoScrollAllowed] = useState<boolean>(true);

    /* Utilities */
    const isLeaf = (node: TreeViewFinderNodeProps) => {
        return node && node.children === undefined;
    };

    const isSelectable = (node: TreeViewFinderNodeProps) => {
        return onlyLeaves ? isLeaf(node) : true; // otherwise everything is selectable
    };

    const isValidationDisabled = () => {
        return (
            selected?.length === 0 ||
            (selected?.length === selectedProp?.length && selected?.every((nodeId) => selectedProp?.includes(nodeId)))
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

    // Effects
    useEffect(() => {
        // compute all mapPrintedNodes here from data prop
        // if data changes in current expanded nodes
        const newMapPrintedNodes = computeMapPrintedNodes(data);
        setMapPrintedNodes(newMapPrintedNodes);
    }, [data, computeMapPrintedNodes]);

    const computeSelectedNodes = () => {
        if (!selected) {
            return [];
        }
        return selected?.map((nodeId) => {
            return mapPrintedNodes[nodeId];
        });
    };

    const handleNodeToggle = (_e: SyntheticEvent, nodeIds: string[]) => {
        // onTreeBrowse proc only on last node clicked and only when expanded
        nodeIds.every((nodeId) => {
            if (!expanded?.includes(nodeId)) {
                // proc onTreeBrowse here
                onTreeBrowse?.(nodeId);
                return false; // break loop to call onTreeBrowse only once
            }
            return true;
        });

        setExpanded(nodeIds);
        // will proc onNodeSelect then ...
    };

    useEffect(() => {
        if (!selectedProp) {
            return;
        }
        if (selectedProp.length > 0) {
            setSelected((oldSelectedNodes) => [...(oldSelectedNodes ?? []), ...selectedProp]);
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
        if (!selectedProp) {
            return;
        }
        // if we have selected elements by default, we scroll to it
        if (selectedProp.length > 0 && autoScrollAllowed) {
            // we check if all expanded nodes by default all already expanded first
            const isNodeExpanded = expandedProp?.every((nodeId) => expanded?.includes(nodeId));

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
        }
    }, [expanded, selectedProp, expandedProp, data, autoScrollAllowed]);

    /* User Interaction management */
    const handleNodeSelect = (_e: SyntheticEvent, values: string | string[]) => {
        // Default management
        if (multiSelect && Array.isArray(values)) {
            setSelected(values.filter((nodeId) => isSelectable(mapPrintedNodes[nodeId])));
        } else if (!Array.isArray(values)) {
            // Toggle selection to allow unselection
            if (selected?.includes(values)) {
                setSelected([]);
            } else {
                setSelected(isSelectable(mapPrintedNodes[values]) ? [values] : []);
            }
        }
    };

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

        if (isSelectable(node) && selected?.find((nodeId) => nodeId === node.id)) {
            return <CheckIcon className={composeClasses(classes, cssLabelIcon)} />;
        }
        if (node.icon) {
            return <div className={composeClasses(classes, cssLabelIcon)}>{node.icon}</div>;
        }
        return null;
    };

    const renderTreeItemLabel = (node: TreeViewFinderNodeProps) => {
        return (
            <div className={composeClasses(classes, cssLabelRoot)}>
                {getNodeIcon(node)}
                <Typography className={composeClasses(classes, cssLabelText)}>{node.name}</Typography>
            </div>
        );
    };
    const showChevron = (node: TreeViewFinderNodeProps) => {
        // by defaut show Chevron if childrenCount is null or undefined otherwise only if > 0
        return !!(node.childrenCount == null || (node.childrenCount && node.childrenCount > 0));
    };

    const renderTree = (node: TreeViewFinderNodeProps) => {
        if (!node) {
            return null;
        }
        let childrenNodes = null;

        if (Array.isArray(node.children)) {
            if (node.children.length) {
                const sortedChildren = node.children.sort(sortMethod);
                childrenNodes = sortedChildren.map((child) => renderTree(child));
            } else {
                childrenNodes = [false]; // Pass non empty Array here to simulate a child then this node isn't considered as a leaf.
            }
        }
        return (
            <TreeItem
                key={node.id}
                nodeId={node.id}
                label={renderTreeItemLabel(node)}
                expandIcon={
                    showChevron(node) ? <ChevronRightIcon className={composeClasses(classes, cssIcon)} /> : null
                }
                collapseIcon={
                    showChevron(node) ? <ExpandMoreIcon className={composeClasses(classes, cssIcon)} /> : null
                }
                ref={(element) => {
                    if (selectedProp?.includes(node.id)) {
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
                }
            }}
            aria-labelledby="TreeViewFindertitle"
            className={className}
            classes={{
                paper: composeClasses(classes, cssDialogPaper),
            }}
        >
            <DialogTitle id="TreeViewFindertitle">
                {title ?? intl.formatMessage({ id: 'treeview_finder/finderTitle' }, { multiSelect })}
            </DialogTitle>
            <DialogContent>
                <DialogContentText>
                    {contentText ?? intl.formatMessage({ id: 'treeview_finder/contentText' }, { multiSelect })}
                </DialogContentText>

                <TreeView
                    // Controlled props
                    expanded={expanded}
                    // events
                    onNodeToggle={handleNodeToggle}
                    onNodeSelect={handleNodeSelect}
                    // Uncontrolled props
                    {...getTreeViewSelectionProps()}
                >
                    {data && Array.isArray(data) ? data.sort(sortMethod).map((child) => renderTree(child)) : null}
                </TreeView>
            </DialogContent>
            <DialogActions>
                <CancelButton
                    style={{ float: 'left', margin: '5px' }}
                    onClick={() => {
                        onClose?.([]);
                        setSelected([]);
                        setAutoScrollAllowed(true);
                    }}
                    {...cancelButtonProps}
                />
                <Button
                    variant="outlined"
                    style={{ float: 'left', margin: '5px' }}
                    onClick={() => {
                        onClose?.(computeSelectedNodes());
                        setSelected([]);
                        setAutoScrollAllowed(true);
                    }}
                    disabled={isValidationDisabled()}
                >
                    {getValidationButtonText()}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

const nestedGlobalSelectorsStyles = toNestedGlobalSelectors(defaultStyles, generateTreeViewFinderClass);

export const TreeViewFinder = styled(TreeViewFinderComponant)(nestedGlobalSelectorsStyles);
