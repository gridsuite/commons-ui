/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import type { ReactElement, ReactNode } from 'react';
import type { DraggableProvided, DragStart, DropResult } from '@hello-pangea/dnd';
import type { SxStyle } from '../../utils/styles';

export type CheckBoxListItemSx = {
    checkBoxIcon?: SxStyle;
    listItemText?: SxStyle;
    label?: SxStyle;
    checkboxListItem?: SxStyle;
    checkboxButton?: SxStyle;
    checkbox?: SxStyle;
    dragButton?: SxStyle;
};

export type CheckBoxListSx = {
    dragAndDropContainer?: SxStyle;
    checkboxList?: SxStyle;
};

export type CheckBoxListItemSxMethod<T> = (item: T) => CheckBoxListItemSx;

type CheckBoxListItemSxProps<T> = CheckBoxListSx & {
    items: CheckBoxListItemSx | CheckBoxListItemSxMethod<T>;
};

export interface CheckBoxListItemProps<T> {
    item: T;
    sx?: CheckBoxListItemSx;
    label: ReactNode;
    secondary?: ReactNode;
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
    getItemLabel?: (item: T) => ReactNode;
    getItemLabelSecondary?: (item: T) => ReactNode;
    secondaryAction?: (item: T, hover: boolean) => ReactElement | null;
    isDisabled?: (item: T) => boolean;
    addSelectAllCheckbox?: boolean;
    selectAllCheckBoxLabel?: string;
    sx?: CheckBoxListItemSxProps<T>;
    isDndActive?: boolean;
    isDragDisable?: boolean;
    divider?: boolean;
    onItemClick?: (item: T) => void;
    isItemClickable?: (item: T) => boolean;
}

export interface CheckboxListProps<T> extends CheckBoxListItemsProps<T> {
    onDragStart?: (dragStart: DragStart) => void;
    onDragEnd?: (dropResult: DropResult) => void;
}

export interface CheckBoxListItemContentProps {
    sx?: CheckBoxListItemSx;
    label: ReactNode;
    secondary?: ReactNode;
    onClick: () => void;
    disabled?: boolean;
    checked: boolean;
    indeterminate?: boolean;
}

export interface DraggableCheckBoxListItemContentProps extends CheckBoxListItemContentProps {
    provided: DraggableProvided;
    isHighlighted: boolean;
}
