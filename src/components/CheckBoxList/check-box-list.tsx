/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React, { useCallback, useState } from 'react';
import {
    Box,
    Checkbox,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
} from '@mui/material';
import {
    DragDropContext,
    Draggable,
    DragStart,
    Droppable,
    DropResult,
} from 'react-beautiful-dnd';
import { UUID } from 'crypto';
import { FormattedMessage } from 'react-intl';
import { CheckBoxListItem } from './check-box-list-item';
import OverflowableText from '../OverflowableText';

interface CheckboxListProps {
    itemRenderer?: (params: {
        item: any;
        index: number;
        checked: boolean;
        toggleSelection: (id: any) => void;
    }) => React.ReactNode;
    values: any[];
    onSelectionChange?: (selectedItems: any[]) => void;
    getValueId: (value: any) => any;
    getValueLabel?: (value: any) => string;
    checkboxListSx?: any;
    labelSx?: any;
    isCheckBoxDraggable?: boolean;
    isDragDisable?: boolean;
    draggableProps?: any;
    secondaryAction?: (item: any) => React.ReactElement;
    enableSecondaryActionOnHover?: boolean;
    isDisabled?: (item: any) => boolean;
    addSelectAllCheckbox?: boolean;
    onDragStart?: (dragStart: DragStart) => void;
    onDragEnd?: (dropResult: DropResult) => void;
    isDropDisabled?: boolean;
    selectedItems: any[];
}

export function CheckboxList({
    itemRenderer,
    values = [],
    selectedItems,
    getValueId = (value) => value?.id ?? value,
    getValueLabel = (value) => value?.label ?? value,
    checkboxListSx,
    labelSx,
    secondaryAction,
    enableSecondaryActionOnHover = true,
    isDisabled = () => false,
    onSelectionChange,
    addSelectAllCheckbox = false,
    isCheckBoxDraggable = false,
    onDragStart,
    onDragEnd,
    isDropDisabled,
    isDragDisable = false,
    draggableProps,
    ...props
}: CheckboxListProps) {
    const [isDragging, setIsDragging] = useState(false);

    const handleOnchange = useCallback(
        (newValues: any[]) => {
            if (onSelectionChange) {
                onSelectionChange(newValues);
            }
        },
        [onSelectionChange]
    );

    const toggleSelectAll = useCallback(() => {
        if (selectedItems.length !== values.length) {
            handleOnchange(values);
        } else {
            handleOnchange([]);
        }
    }, [selectedItems, handleOnchange, values]);

    const toggleSelection = useCallback(
        (elementToToggleId: string) => {
            const element = values?.find(
                (v) => getValueId(v) === elementToToggleId
            );
            if (element === undefined) {
                return;
            }

            const elementSelected = selectedItems.find(
                (v) => getValueId(v) === elementToToggleId
            );
            const newValues = [...selectedItems];
            if (elementSelected === undefined) {
                newValues.push(element);
                handleOnchange(newValues);
            } else {
                handleOnchange(
                    newValues.filter((v) => getValueId(v) !== elementToToggleId)
                );
            }
        },
        [values, selectedItems, getValueId, handleOnchange]
    );

    const isChecked = useCallback(
        (item: any) =>
            selectedItems.map((v) => getValueId(v)).includes(getValueId(item)),
        [selectedItems, getValueId]
    );

    const handleSecondaryAction = (item: any, hover: string | UUID) => {
        if (!secondaryAction) {
            return undefined;
        }

        if (!enableSecondaryActionOnHover) {
            return secondaryAction(item);
        }

        if (hover === getValueId(item)) {
            return secondaryAction(item);
        }

        return undefined;
    };

    const renderItems = () => {
        return (
            <List key="droppable-checkbox-list" dense {...props}>
                {addSelectAllCheckbox && (
                    <ListItem
                        disablePadding
                        divider
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
                                    indeterminate={
                                        selectedItems.length > 0 &&
                                        selectedItems.length !== values.length
                                    }
                                />
                            </ListItemIcon>
                            <ListItemText>
                                <OverflowableText
                                    text={
                                        <FormattedMessage id="multiple_selection_dialog/selectAll" />
                                    }
                                />
                            </ListItemText>
                        </ListItemButton>
                    </ListItem>
                )}
                {values?.map((item, index) => {
                    if (itemRenderer) {
                        return itemRenderer({
                            item,
                            index,
                            checked: isChecked(item),
                            toggleSelection,
                        });
                    }

                    const label = getValueLabel ? getValueLabel(item) : item;
                    const disabled = isDisabled ? isDisabled(item) : false;

                    if (isCheckBoxDraggable) {
                        return (
                            <Draggable
                                draggableId={String(getValueId(item))}
                                index={index}
                                isDragDisabled={isDragDisable}
                            >
                                {(provided) => (
                                    <CheckBoxListItem
                                        key={getValueId(item)}
                                        item={item}
                                        checked={isChecked(item)}
                                        label={label}
                                        onClick={() =>
                                            toggleSelection(getValueId(item))
                                        }
                                        labelSx={labelSx}
                                        disabled={disabled}
                                        getValueId={getValueId}
                                        checkboxListSx={checkboxListSx}
                                        secondaryAction={handleSecondaryAction}
                                        isDragging={
                                            !isDragDisable && !isDragging
                                        }
                                        isCheckBoxDraggable={
                                            isCheckBoxDraggable
                                        }
                                        provided={provided}
                                    />
                                )}
                            </Draggable>
                        );
                    }
                    return (
                        <CheckBoxListItem
                            key={getValueId(item)}
                            item={item}
                            checked={isChecked(item)}
                            label={label}
                            onClick={() => toggleSelection(getValueId(item))}
                            labelSx={labelSx}
                            disabled={disabled}
                            getValueId={getValueId}
                            checkboxListSx={checkboxListSx}
                            secondaryAction={handleSecondaryAction}
                        />
                    );
                })}
            </List>
        );
    };

    return {
        ...(isCheckBoxDraggable ? (
            <DragDropContext
                onDragEnd={(dropResult) => {
                    if (onDragEnd) {
                        onDragEnd(dropResult);
                    }
                    setIsDragging(false);
                }}
                onDragStart={(dragStart) => {
                    if (onDragStart) {
                        onDragStart(dragStart);
                    }
                    setIsDragging(true);
                }}
            >
                <Droppable
                    droppableId="droppable-checkbox-list"
                    isDropDisabled={isDropDisabled}
                >
                    {(provided) => (
                        <Box
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                        >
                            {renderItems()}
                            {provided.placeholder}
                        </Box>
                    )}
                </Droppable>
            </DragDropContext>
        ) : (
            renderItems()
        )),
    };
}

export default CheckboxList;
