/**
 * Copyright (c) 2021, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useCallback, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import PropTypes from 'prop-types';
import {
    makeComposeClasses,
    toNestedGlobalSelectors,
} from '../../utils/styles';

import { styled } from '@mui/system';

import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Typography,
} from '@mui/material';

import { TreeView, TreeItem } from '@mui/x-tree-view';
import {
    Check as CheckIcon,
    ChevronRight as ChevronRightIcon,
    ExpandMore as ExpandMoreIcon,
} from '@mui/icons-material';
import CancelButton from '../react-hook-form/utils/cancel-button';

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
};

export const generateTreeViewFinderClass = (className) =>
    `GsiTreeViewFinder-${className}`;
const composeClasses = makeComposeClasses(generateTreeViewFinderClass);

/**
 * This callback type is called `onTreeBrowseCallback` and is displayed as a global symbol.
 *
 * @callback onTreeBrowseCallback
 * @param {string} nodeId The id of the node clicked
 */

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
 * @param {Boolean}         [multiselect=false] - Allow/Forbid multiselection on Tree
 * @param {Object}          [cancelButtonProps] - The cancel button props
 */
const TreeViewFinder = (props) => {
    const intl = useIntl();
    const {
        classes,
        title,
        contentText,
        open,
        data,
        defaultExpanded,
        defaultSelected,
        onClose,
        onTreeBrowse,
        validationButtonText,
        onlyLeaves,
        multiselect,
        sortMethod,
        className,
        cancelButtonProps,
    } = props;

    const [mapPrintedNodes, setMapPrintedNodes] = useState({});

    // Controlled expanded for TreeView
    const [expanded, setExpanded] = useState(defaultExpanded);
    // Controlled selected for TreeView
    const [selected, setSelected] = useState(defaultSelected);

    /* Utilities */
    const isSelectable = (node) => {
        return onlyLeaves ? isLeaf(node) : true; // otherwise everything is selectable
    };

    const isLeaf = (node) => {
        return node && node.children === undefined;
    };

    const computeMapPrintedNodes = useCallback((nodes) => {
        let newMapPrintedNodes = {};
        nodes.forEach((node) => {
            newMapPrintedNodes[node.id] = node;
            if (!isLeaf(node)) {
                Object.assign(
                    newMapPrintedNodes,
                    computeMapPrintedNodes(node.children)
                );
            }
        });
        return newMapPrintedNodes;
    }, []);

    // Effects
    useEffect(() => {
        // compute all mapPrintedNodes here from data prop
        // if data changes in current expanded nodes
        let newMapPrintedNodes = computeMapPrintedNodes(data);
        console.debug(
            'data updated, new mapPrintedNodes (nbNodes = ',
            Object.keys(newMapPrintedNodes).length,
            ') : ',
            newMapPrintedNodes
        );
        setMapPrintedNodes(newMapPrintedNodes);
    }, [data, computeMapPrintedNodes]);

    const computeSelectedNodes = () => {
        return selected.map((nodeId) => {
            return mapPrintedNodes[nodeId];
        });
    };

    const handleNodeToggle = (e, nodeIds) => {
        // onTreeBrowse proc only on last node clicked and only when expanded
        nodeIds.every((nodeId) => {
            if (!expanded.includes(nodeId)) {
                // proc onTreeBrowse here
                onTreeBrowse && onTreeBrowse(nodeId);
                return false; // break loop to call onTreeBrowse only once
            }
            return true;
        });

        setExpanded(nodeIds);
        // will proc onNodeSelect then ...
    };

    /* User Interaction management */
    const handleNodeSelect = (e, values) => {
        // Default management
        if (multiselect) {
            setSelected(
                values.filter((nodeId) => isSelectable(mapPrintedNodes[nodeId]))
            );
        } else {
            // Toggle selection to allow unselection
            if (selected.includes(values)) {
                setSelected([]);
            } else {
                setSelected(
                    isSelectable(mapPrintedNodes[values]) ? [values] : []
                );
            }
        }
    };

    /* Render utilities */
    const getValidationButtonText = () => {
        if (validationButtonText) {
            return validationButtonText;
        } else {
            return intl.formatMessage(
                { id: 'treeview_finder/addElementsValidation' },
                {
                    nbElements: selected.length,
                }
            );
        }
    };

    const getNodeIcon = (node) => {
        if (!node) {
            return null;
        }

        if (
            isSelectable(node) &&
            selected.find((nodeId) => nodeId === node.id)
        ) {
            return (
                <CheckIcon className={composeClasses(classes, cssLabelIcon)} />
            );
        } else {
            if (node.icon) {
                return (
                    <div className={composeClasses(classes, cssLabelIcon)}>
                        {node.icon}
                    </div>
                );
            } else {
                return null;
            }
        }
    };

    const renderTreeItemLabel = (node) => {
        return (
            <div className={composeClasses(classes, cssLabelRoot)}>
                {getNodeIcon(node)}
                <Typography className={composeClasses(classes, cssLabelText)}>
                    {node.name}
                </Typography>
            </div>
        );
    };
    const showChevron = (node) => {
        // by defaut show Chevron if childrenCount is null or undefined otherwise only if > 0
        return !!(
            node.childrenCount == null ||
            (node.childrenCount && node.childrenCount > 0)
        );
    };

    const renderTree = (node) => {
        if (!node) {
            return;
        }
        return (
            <TreeItem
                key={node.id}
                nodeId={node.id}
                label={renderTreeItemLabel(node)}
                expandIcon={
                    showChevron(node) ? (
                        <ChevronRightIcon
                            className={composeClasses(classes, cssIcon)}
                        />
                    ) : null
                }
                collapseIcon={
                    showChevron(node) ? (
                        <ExpandMoreIcon
                            className={composeClasses(classes, cssIcon)}
                        />
                    ) : null
                }
            >
                {Array.isArray(node.children)
                    ? node.children.length
                        ? node.children
                              .sort(sortMethod)
                              .map((child) => renderTree(child))
                        : [false] // Pass non empty Array here to simulate a child then this node isn't considered as a leaf.
                    : null}
            </TreeItem>
        );
    };

    return (
        <Dialog
            open={open}
            onClose={(e, r) => {
                if (r === 'escapeKeyDown' || r === 'backdropClick') {
                    onClose([]);
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
                {title
                    ? title
                    : intl.formatMessage(
                          { id: 'treeview_finder/finderTitle' },
                          { multiselect: multiselect }
                      )}
            </DialogTitle>
            <DialogContent>
                <DialogContentText>
                    {contentText
                        ? contentText
                        : intl.formatMessage(
                              { id: 'treeview_finder/contentText' },
                              { multiselect: multiselect }
                          )}
                </DialogContentText>

                <TreeView
                    // Controlled props
                    expanded={expanded}
                    selected={selected}
                    // events
                    onNodeToggle={handleNodeToggle}
                    onNodeSelect={handleNodeSelect}
                    // Uncontrolled props
                    multiSelect={multiselect}
                >
                    {data && Array.isArray(data)
                        ? data
                              .sort(sortMethod)
                              .map((child) => renderTree(child))
                        : null}
                </TreeView>
            </DialogContent>
            <DialogActions>
                <CancelButton
                    style={{ float: 'left', margin: '5px' }}
                    onClick={() => {
                        onClose([]);
                        setSelected([]);
                    }}
                    {...cancelButtonProps}
                />
                <Button
                    variant="outlined"
                    style={{ float: 'left', margin: '5px' }}
                    onClick={() => {
                        onClose(computeSelectedNodes());
                        setSelected([]);
                    }}
                    disabled={selected.length === 0}
                >
                    {getValidationButtonText()}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

/* TreeViewFinder props list */
TreeViewFinder.propTypes = {
    // Controlled
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func,
    data: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired,
            children: PropTypes.array,
        })
    ).isRequired,
    onTreeBrowse: PropTypes.func,
    //uncontrolled
    classes: PropTypes.object,
    title: PropTypes.string,
    contentText: PropTypes.string,
    validationButtonText: PropTypes.string,
    defaultSelected: PropTypes.arrayOf(PropTypes.string),
    defaultExpanded: PropTypes.arrayOf(PropTypes.string),
    onlyLeaves: PropTypes.bool,
    multiselect: PropTypes.bool,
    sortMethod: PropTypes.func,
    cancelButtonProps: PropTypes.object,
    className: PropTypes.string,
};

/* TreeViewFinder props default values */
TreeViewFinder.defaultProps = {
    defaultSelected: [],
    defaultExpanded: [],
    onlyLeaves: true,
    multiselect: false,
    sortMethod: undefined,
    classes: {},
};

const nestedGlobalSelectorsStyles = toNestedGlobalSelectors(
    defaultStyles,
    generateTreeViewFinderClass
);

export default styled(TreeViewFinder)(nestedGlobalSelectorsStyles);
