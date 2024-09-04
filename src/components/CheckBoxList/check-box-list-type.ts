/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';
import { DraggableProvided, DragStart, DropResult } from 'react-beautiful-dnd';
import { SxProps } from '@mui/system';

export interface CheckBoxListItemSxProps {
    checkBoxIcon?: SxProps;
    label?: SxProps;
    checkboxList?: SxProps;
    checkboxButton?: SxProps;
    checkbox?: SxProps;
    list?: SxProps;
    dragAndDropContainer?: SxProps;
}

export interface CheckBoxListItemProps<T> {
    item: T;
    sx?: CheckBoxListItemSxProps;
    label: string;
    onClick: () => void;
    secondaryAction?: (item: T, hover: string) => React.ReactElement | null;
    getItemId: (item: T) => string;
    disabled?: boolean;
    divider?: boolean;
    checked: boolean;
    isCheckboxClickableOnly?: boolean;
}

export interface DraggableCheckBoxListItemProps<T> extends CheckBoxListItemProps<T> {
    isDragDisable?: boolean;
    provided: DraggableProvided;
}

export interface CheckBoxListItemsProps<T> {
    items: T[];
    selectedItems: T[];
    onSelectionChange?: (selectedItems: T[]) => void;
    getItemId: (item: T) => string;
    getItemLabel?: (item: T) => string;
    secondaryAction?: (item: T) => React.ReactElement | null;
    enableSecondaryActionOnHover?: boolean;
    isDisabled?: (item: T) => boolean;
    addSelectAllCheckbox?: boolean;
    selectAllCheckBoxLabel?: string;
    sx?: CheckBoxListItemSxProps;
    isDndDragAndDropActive?: boolean;
    isDragDisable?: boolean;
    divider?: boolean;
    isCheckboxClickableOnly?: boolean;
}

export interface CheckboxListProps<T> extends CheckBoxListItemsProps<T> {
    onDragStart?: (dragStart: DragStart) => void;
    onDragEnd?: (dropResult: DropResult) => void;
}

export interface ClickableItemProps {
    sx?: CheckBoxListItemSxProps;
    label: string;
    onClick: () => void;
    disabled?: boolean;
    checked: boolean;
}

export interface DraggableClickableItemProps extends ClickableItemProps {
    provided: DraggableProvided;
    isHighlighted: boolean;
}
