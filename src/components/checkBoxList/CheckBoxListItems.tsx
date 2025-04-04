/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useCallback, useMemo } from 'react';
import { List, ListItem, ListItemButton } from '@mui/material';
import { FormattedMessage } from 'react-intl';
import { Draggable } from 'react-beautiful-dnd';
import { CheckBoxListItem } from './CheckBoxListItem';
import { DraggableCheckBoxListItem } from './DraggableCheckBoxListItem';
import { CheckBoxListItemsProps } from './checkBoxList.type';
import { CheckBoxListItemContent } from './CheckBoxListItemContent';

export function CheckBoxListItems<T>({
    items,
    selectedItems,
    onSelectionChange,
    getItemId,
    sx,
    secondaryAction,
    addSelectAllCheckbox,
    selectAllCheckBoxLabel,
    getItemLabel,
    getItemLabelSecondary,
    isDisabled,
    isDndActive,
    isDragDisable,
    divider,
    onItemClick,
    isItemClickable,
    ...props
}: Readonly<CheckBoxListItemsProps<T>>) {
    const handleOnchange = useCallback(
        (newValues: T[]) => {
            if (onSelectionChange) {
                onSelectionChange(newValues);
            }
        },
        [onSelectionChange]
    );

    const toggleSelectAll = useCallback(() => {
        if (selectedItems.length !== items.length) {
            handleOnchange(items);
        } else {
            handleOnchange([]);
        }
    }, [selectedItems, handleOnchange, items]);

    const toggleSelection = useCallback(
        (elementToToggleId: string) => {
            const element = items?.find((v) => getItemId(v) === elementToToggleId);
            if (element === undefined) {
                return;
            }

            const elementSelected = selectedItems.find((v) => getItemId(v) === elementToToggleId);
            const newValues = [...selectedItems];
            if (elementSelected === undefined) {
                newValues.push(element);
                handleOnchange(newValues);
            } else {
                handleOnchange(newValues.filter((v) => getItemId(v) !== elementToToggleId));
            }
        },
        [items, selectedItems, getItemId, handleOnchange]
    );

    const isChecked = useCallback(
        (item: T) => selectedItems.map((v) => getItemId(v)).includes(getItemId(item)),
        [selectedItems, getItemId]
    );

    const handleSecondaryAction = (item: T, hover: string) => {
        if (!secondaryAction) {
            return null;
        }
        const isItemHovered = hover === getItemId(item);
        return secondaryAction(item, isItemHovered);
    };

    const selectAllLabel = useMemo(
        () => selectAllCheckBoxLabel ?? 'multiple_selection_dialog/selectAll',
        [selectAllCheckBoxLabel]
    );

    return (
        <List key="droppable-checkbox-list" sx={sx?.checkboxList} dense disablePadding {...props}>
            {addSelectAllCheckbox && (
                <ListItem
                    disablePadding
                    divider={divider}
                    sx={{
                        '&:not(:last-child)': {
                            borderBottom: '2px solid',
                        },
                    }}
                >
                    <ListItemButton
                        onClick={toggleSelectAll}
                        sx={{ alignItems: 'flex-start', paddingLeft: isDndActive ? '24px' : 0 }}
                    >
                        <CheckBoxListItemContent
                            onClick={toggleSelectAll}
                            checked={selectedItems.length !== 0}
                            indeterminate={selectedItems.length > 0 && selectedItems.length !== items.length}
                            label={<FormattedMessage id={selectAllLabel} defaultMessage={selectAllLabel} />}
                        />
                    </ListItemButton>
                </ListItem>
            )}
            {items?.map((item, index) => {
                const label = getItemLabel ? getItemLabel(item) : getItemId(item);
                const secondary = getItemLabelSecondary ? getItemLabelSecondary(item) : null;
                const disabled = isDisabled ? isDisabled(item) : false;
                const addDivider = divider && index < items.length - 1;
                // sx can be dependent on item or not
                const calculatedItemSx = typeof sx?.items === 'function' ? sx?.items(item) : sx?.items;

                if (isDndActive) {
                    return (
                        <Draggable
                            draggableId={getItemId(item)}
                            index={index}
                            isDragDisabled={isDragDisable}
                            key={getItemId(item)}
                        >
                            {(provided) => (
                                <DraggableCheckBoxListItem<T>
                                    key={getItemId(item)}
                                    item={item}
                                    checked={isChecked(item)}
                                    label={label}
                                    secondary={secondary}
                                    onClick={() => toggleSelection(getItemId(item))}
                                    sx={calculatedItemSx}
                                    disabled={disabled}
                                    getItemId={getItemId}
                                    secondaryAction={handleSecondaryAction}
                                    isDragDisable={isDragDisable}
                                    provided={provided}
                                    divider={addDivider}
                                    onItemClick={onItemClick}
                                    isItemClickable={isItemClickable}
                                />
                            )}
                        </Draggable>
                    );
                }
                return (
                    <CheckBoxListItem<T>
                        key={getItemId(item)}
                        item={item}
                        checked={isChecked(item)}
                        label={label}
                        secondary={secondary}
                        onClick={() => toggleSelection(getItemId(item))}
                        disabled={disabled}
                        getItemId={getItemId}
                        sx={calculatedItemSx}
                        secondaryAction={handleSecondaryAction}
                        divider={addDivider}
                        onItemClick={onItemClick}
                        isItemClickable={isItemClickable}
                    />
                );
            })}
        </List>
    );
}
