/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import type { ReactElement } from 'react';
import type { DraggableProvided, DragStart, DropResult } from 'react-beautiful-dnd';
import type { SxProps, Theme } from '@mui/material';

export type CheckBoxListItemSx = {
    checkBoxIcon?: SxProps<Theme>;
    label?: SxProps<Theme>;
    checkboxListItem?: SxProps<Theme>;
    checkboxButton?: SxProps<Theme>;
    checkbox?: SxProps<Theme>;
};

export type CheckBoxListSx = {
    dragAndDropContainer?: SxProps<Theme>;
    checkboxList?: SxProps<Theme>;
};

export type CheckBoxListItemSxMethod<T> = (item: T) => CheckBoxListItemSx;

type CheckBoxListItemSxProps<T> = CheckBoxListSx & {
    items: CheckBoxListItemSx | CheckBoxListItemSxMethod<T>;
};

export interface CheckBoxListItemProps<T> {
    item: T;
    sx?: CheckBoxListItemSx;
    label: string;
    onClick: () => void;
    secondaryAction?: (item: T, hover: string) => ReactElement | null;
    getItemId: (item: T) => string;
    disabled?: boolean;
    divider?: boolean;
    checked: boolean;
    onItemClick?: (item: T) => void;
    isItemClickable?: (item: T) => boolean;
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
    secondaryAction?: (item: T, hover: boolean) => ReactElement | null;
    isDisabled?: (item: T) => boolean;
    addSelectAllCheckbox?: boolean;
    selectAllCheckBoxLabel?: string;
    sx?: CheckBoxListItemSxProps<T>;
    isDndDragAndDropActive?: boolean;
    isDragDisable?: boolean;
    divider?: boolean;
    onItemClick?: (item: T) => void;
    isItemClickable?: (item: T) => boolean;
}

export interface CheckboxListProps<T> extends CheckBoxListItemsProps<T> {
    onDragStart?: (dragStart: DragStart) => void;
    onDragEnd?: (dropResult: DropResult) => void;
}

export interface ClickableCheckBoxItemProps {
    sx?: CheckBoxListItemSx;
    label: string;
    onClick: () => void;
    disabled?: boolean;
    checked: boolean;
}

export interface DraggableClickableCheckBoxItemProps extends ClickableCheckBoxItemProps {
    provided: DraggableProvided;
    isHighlighted: boolean;
}

interface ClickableItem {
    onItemClick: () => void;
    isItemClickable?: boolean;
}

export interface ClickableRowItemProps extends ClickableCheckBoxItemProps, ClickableItem {}

export interface DraggableClickableRowItemProps extends DraggableClickableCheckBoxItemProps, ClickableItem {}
