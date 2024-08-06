/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Draggable } from 'react-beautiful-dnd';
import { useCallback, useMemo } from 'react';
import { Checkbox, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { FormattedMessage } from 'react-intl';
import { CheckBoxListItem } from './check-box-list-item';
import OverflowableText from '../OverflowableText';
import { DraggableCheckBoxListItem } from './draggable-check-box-list-item';
import { CheckBoxListItemsProps } from './check-box-list-type';

export function CheckBoxListItems<T>({
    items,
    selectedItems,
    onSelectionChange,
    getItemId,
    sx,
    secondaryAction,
    enableSecondaryActionOnHover,
    addSelectAllCheckbox,
    selectAllCheckBoxLabel,
    getItemLabel,
    isDisabled,
    isDndDragAndDropActive,
    isDragDisable,
    divider,
    ...props
}: CheckBoxListItemsProps<T>) {
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

        if (!enableSecondaryActionOnHover) {
            return secondaryAction(item);
        }

        if (hover === getItemId(item)) {
            return secondaryAction(item);
        }

        return null;
    };

    const selectAllLabel = useMemo(
        () => selectAllCheckBoxLabel ?? 'multiple_selection_dialog/selectAll',
        [selectAllCheckBoxLabel]
    );

    return (
        <List key="droppable-checkbox-list" dense {...props}>
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
                    <ListItemButton onClick={toggleSelectAll}>
                        <ListItemIcon>
                            <Checkbox
                                checked={selectedItems.length !== 0}
                                indeterminate={selectedItems.length > 0 && selectedItems.length !== items.length}
                            />
                        </ListItemIcon>
                        <ListItemText sx={{ display: 'flex' }} disableTypography>
                            <OverflowableText
                                text={<FormattedMessage id={selectAllLabel} defaultMessage={selectAllLabel} />}
                            />
                        </ListItemText>
                    </ListItemButton>
                </ListItem>
            )}
            {items?.map((item, index) => {
                const label = getItemLabel ? getItemLabel(item) : getItemId(item);
                const disabled = isDisabled ? isDisabled(item) : false;
                console.log('test label : ', item, label);

                if (isDndDragAndDropActive) {
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
                                    onClick={() => toggleSelection(getItemId(item))}
                                    sx={sx}
                                    disabled={disabled}
                                    getItemId={getItemId}
                                    secondaryAction={handleSecondaryAction}
                                    isDragDisable={isDragDisable}
                                    provided={provided}
                                    divider={divider}
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
                        onClick={() => toggleSelection(getItemId(item))}
                        disabled={disabled}
                        getItemId={getItemId}
                        sx={sx}
                        secondaryAction={handleSecondaryAction}
                        divider={divider}
                    />
                );
            })}
        </List>
    );
}

export default CheckBoxListItems;
