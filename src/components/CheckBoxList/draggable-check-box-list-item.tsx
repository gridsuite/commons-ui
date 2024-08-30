/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useState } from 'react';
import { ListItem } from '@mui/material';
import { DraggableCheckBoxListItemProps } from './check-box-list-type';
import { DraggableClickableCheckBoxItem } from './draggable-clickable-check-box-item';
import { DraggableClickableRowItem } from './draggable-clickable-row-item';

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
}: DraggableCheckBoxListItemProps<T>) {
    const [hover, setHover] = useState<string>('');
    return (
        <ListItem
            secondaryAction={secondaryAction?.(item, hover)}
            sx={{ minWidth: 0, ...sx?.checkboxList }}
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
                    {...props}
                />
            ) : (
                <DraggableClickableRowItem
                    provided={provided}
                    isHighlighted={hover === getItemId(item) && !isDragDisable}
                    onItemClick={() => onItemClick(item)}
                    isItemClickable={isItemClickable(item)}
                    {...props}
                />
            )}
        </ListItem>
    );
}

export default DraggableCheckBoxListItem;