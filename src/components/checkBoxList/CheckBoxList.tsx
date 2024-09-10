/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useState } from 'react';
import { Box } from '@mui/material';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { CheckBoxListItems } from './CheckBoxListItems';
import { CheckboxListProps } from './checkBoxList.type';

export function CheckBoxList<T>({
    isDndDragAndDropActive = false,
    onDragStart,
    onDragEnd,
    isDragDisable = false,
    ...props
}: CheckboxListProps<T>) {
    const [isDragging, setIsDragging] = useState(false);

    const checkBoxField = (
        <CheckBoxListItems
            isDndDragAndDropActive={isDndDragAndDropActive}
            isDragDisable={isDragDisable || isDragging}
            {...props}
        />
    );

    return isDndDragAndDropActive ? (
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
            <Droppable droppableId="droppable-checkbox-list" isDropDisabled={isDragDisable}>
                {(provided) => (
                    <Box {...provided.droppableProps} ref={provided.innerRef}>
                        {checkBoxField}
                        {provided.placeholder}
                    </Box>
                )}
            </Droppable>
        </DragDropContext>
    ) : (
        checkBoxField
    );
}

export default CheckBoxList;
