/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useState } from 'react';
import { ListItem } from '@mui/material';
import { DraggableCheckBoxListItemProps } from './checkBoxList.type';
import { DraggableClickableCheckBoxItem } from './DraggableClickableCheckBoxItem';
import { DraggableClickableRowItem } from './DraggableClickableRowItem';

export function DraggableCheckBoxListItem<T>({
    item,
    sx,
    secondaryAction,
    getItemId,
    isDragDisable,
    provided,
    divider,
    onItemClick,
    isItemClickable,
    ...props
}: Readonly<DraggableCheckBoxListItemProps<T>>) {
    const [hover, setHover] = useState<string>('');
    return (
        <ListItem
            secondaryAction={secondaryAction?.(item, hover)}
            sx={{ minWidth: 0, ...sx?.checkboxListItem }}
            onMouseEnter={() => setHover(getItemId(item))}
            onMouseLeave={() => setHover('')}
            disablePadding={!!onItemClick}
            disableGutters
            divider={divider}
            ref={provided.innerRef}
            {...provided.draggableProps}
        >
            {!onItemClick ? (
                <DraggableClickableCheckBoxItem
                    provided={provided}
                    isHighlighted={hover === getItemId(item) && !isDragDisable}
                    sx={sx}
                    {...props}
                />
            ) : (
                <DraggableClickableRowItem
                    provided={provided}
                    isHighlighted={hover === getItemId(item) && !isDragDisable}
                    onItemClick={() => onItemClick(item)}
                    isItemClickable={isItemClickable?.(item)}
                    sx={sx}
                    {...props}
                />
            )}
        </ListItem>
    );
}
