/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React, { forwardRef, Ref, useCallback, useEffect, useImperativeHandle, useMemo, useState } from 'react';
import { alpha, Checkbox, styled, SxProps, Theme, useTheme } from '@mui/material';
import { SimpleTreeView, TreeItem, treeItemClasses } from '@mui/x-tree-view';

const BorderedTreeItem = styled(TreeItem)(({ theme, root }: { theme: Theme; root: boolean }) => {
    const border = `1px dashed ${alpha(theme.palette.text.primary, 0.4)}`;
    return {
        position: 'relative',
        '&:before': {
            pointerEvents: 'none',
            content: '""',
            position: 'absolute',
            width: 16,
            left: -16,
            top: 20,
            borderBottom: root ? 'none' : border,
        },
        [`& .${treeItemClasses.groupTransition}`]: {
            marginLeft: 15,
            paddingLeft: 18,
            borderLeft: border,
        },
        [`& .${treeItemClasses.content}`]: {
            paddingLeft: 8,
            width: 'max-content',
        },
        [`& .${treeItemClasses.label}`]: {
            whiteSpace: 'nowrap',
        },
    };
});

export type ItemData = {
    id: string;
    parentId?: string;
    name?: string;
};

enum CheckState {
    UNCHECKED = 'UNCHECKED',
    CHECKED = 'CHECKED',
    INDETERMINATE = 'INDETERMINATE',
}

export type CheckboxTreeviewApi<TData extends ItemData = ItemData> = {
    getSelectedItems: () => TData[];
};

type CheckBoxTreeViewProps<TData extends ItemData = ItemData> = {
    data: TData[];
    checkAll: boolean;
    onSelectionChanged?: (newSelection: TData[]) => void;
    getLabel: (element: TData) => string;
    sx?: SxProps;
};

function CheckboxTreeview<TData extends ItemData>(
    { data: items, checkAll, onSelectionChanged, getLabel, sx }: Readonly<CheckBoxTreeViewProps<TData>>,
    ref: Ref<CheckboxTreeviewApi<TData>>
) {
    const theme = useTheme();

    const initialItemStates = useMemo<Record<string, CheckState>>(
        () => Object.fromEntries(items.map((elem) => [elem.id, checkAll ? CheckState.CHECKED : CheckState.UNCHECKED])),
        [items, checkAll]
    );

    const [itemStates, setItemStates] = useState(initialItemStates);

    // used to reset internal state when initial data changed
    useEffect(() => {
        setItemStates(initialItemStates);
    }, [initialItemStates]);

    const updateItemState = useCallback(
        (_itemStates: Record<string, CheckState>, _items: TData[], onClickedId: string) => {
            // recursive algo
            const updateStateParent = (__itemStates: Record<string, CheckState>, __items: TData[], childId: string) => {
                const child = __items.find((elem) => elem.id === childId);
                const parent = __items.find((elem) => elem.id === child?.parentId);

                if (!parent) {
                    // at root item
                    return;
                }

                const childrenIds = __items.filter((elem) => elem.parentId === parent.id).map((elem) => elem.id);

                const childrenStates = childrenIds.map((id) => __itemStates[id]);

                // recompute state of parent
                // initial default state
                // eslint-disable-next-line no-param-reassign
                __itemStates[parent.id] = CheckState.INDETERMINATE;
                // all children checked => parent must be checked
                if (childrenStates.every((state) => state === CheckState.CHECKED)) {
                    // eslint-disable-next-line no-param-reassign
                    __itemStates[parent.id] = CheckState.CHECKED;
                }
                // all children unchecked => parent must be unchecked
                if (childrenStates.every((state) => state === CheckState.UNCHECKED)) {
                    // eslint-disable-next-line no-param-reassign
                    __itemStates[parent.id] = CheckState.UNCHECKED;
                }

                // recursive visit
                updateStateParent(__itemStates, __items, parent.id);
            };

            // recursive algo
            const setState = (
                __itemStates: Record<string, CheckState>,
                __items: TData[],
                id: string,
                newState: CheckState
            ) => {
                // eslint-disable-next-line no-param-reassign
                __itemStates[id] = newState;

                // set all children the same state of the current element
                const children = __items.filter((elem) => elem.parentId === id);
                children.forEach((elem) => setState(__itemStates, __items, elem.id, newState));

                // update parent's state of the current element
                updateStateParent(__itemStates, __items, id);
            };

            // update item's state
            const newItemStates = { ..._itemStates };
            // get current state
            const currentState = _itemStates[onClickedId];
            setState(
                newItemStates,
                _items,
                onClickedId,
                currentState === CheckState.CHECKED ? CheckState.UNCHECKED : CheckState.CHECKED
            );

            return newItemStates;
        },
        []
    );

    const handleItemSelect = useCallback(
        (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, id: string) => {
            event.stopPropagation();
            const newItemStates = updateItemState(itemStates, items, id);
            setItemStates(newItemStates);
            if (onSelectionChanged) {
                // compute selected items on newItemStates
                const selectedItems = items.filter(
                    (item) =>
                        newItemStates[item.id] === CheckState.CHECKED &&
                        !items.find((elem) => elem.parentId === item.id) // no children
                );
                onSelectionChanged(selectedItems);
            }
        },
        [itemStates, items, updateItemState, onSelectionChanged]
    );

    const handleExpand = useCallback((event: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
        event.stopPropagation();
    }, []);

    const getSelectedItems = useCallback(() => {
        return items.filter(
            (item) => itemStates[item.id] === CheckState.CHECKED && !items.some((elem) => elem.parentId === item.id) // no children
        );
    }, [items, itemStates]);

    // expose some api for the component by using ref
    useImperativeHandle(
        ref,
        () => ({
            getSelectedItems,
        }),
        [getSelectedItems]
    );

    const itemsByParent = useMemo(() => {
        const map = new Map<string | null, TData[]>();
        items.forEach((item) => {
            const key = item.parentId ?? null; // using null as a key for root items
            if (!map.has(key)) map.set(key, []);
            map.get(key)?.push(item);
        });
        return map;
    }, [items]);

    // render function (recursive rendering)
    const renderTree = useCallback(
        (parentId: string | null = null) => {
            const itemsToRender = itemsByParent.get(parentId) ?? [];

            return itemsToRender.map((elem) => (
                <BorderedTreeItem
                    theme={theme}
                    key={elem.id}
                    itemId={elem.id}
                    onClick={handleExpand}
                    root={!elem.parentId}
                    label={
                        <>
                            <Checkbox
                                checked={CheckState.CHECKED === itemStates[elem.id]}
                                indeterminate={CheckState.INDETERMINATE === itemStates[elem.id]}
                                onClick={(event) => handleItemSelect(event, elem.id)}
                            />
                            {getLabel ? getLabel(elem) : elem.name}
                        </>
                    }
                >
                    {renderTree(elem.id)}
                </BorderedTreeItem>
            ));
        },
        [itemsByParent, theme, handleExpand, itemStates, getLabel, handleItemSelect]
    );

    return <SimpleTreeView sx={sx}>{renderTree(null)}</SimpleTreeView>;
}

export default forwardRef(CheckboxTreeview) as <TData extends ItemData>(
    props: CheckBoxTreeViewProps<TData> & { ref?: Ref<CheckboxTreeviewApi<TData>> }
) => ReturnType<typeof CheckboxTreeview>;
