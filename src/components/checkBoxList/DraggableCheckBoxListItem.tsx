/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useCallback, useState } from 'react';
import { ListItem, ListItemButton } from '@mui/material';
import { DraggableCheckBoxListItemProps } from './checkBoxList.type';
import { DraggableCheckBoxListItemContent } from './DraggableCheckBoxListItemContent';
import { mergeSx } from '../../utils';
import type { MuiStyles } from '../../utils/styles';

const styles = {
    checkboxListItem: {
        // this is to align ListItem children and its secondary action
        alignItems: 'flex-start',
        // this is the only way to unset the absolute positionning of the secondary action
        '& .MuiListItemSecondaryAction-root': {
            marginTop: '1px',
            position: 'relative',
            top: 0,
            right: 0,
            transform: 'none',
        },
        // this is the only way to unset a 48px right padding when ListItemButton is hovered
        '& .MuiListItemButton-root': {
            paddingRight: '0px',
        },
    },
} as const satisfies MuiStyles;

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
    disabled,
    ...props
}: Readonly<DraggableCheckBoxListItemProps<T>>) {
    const [hover, setHover] = useState<string>('');
    const handleItemClick = useCallback(() => onItemClick?.(item), [item, onItemClick]);
    return (
        <ListItem
            secondaryAction={secondaryAction?.(item, hover)}
            sx={mergeSx(styles.checkboxListItem, sx?.checkboxListItem)}
            onMouseEnter={() => setHover(getItemId(item))}
            onMouseLeave={() => setHover('')}
            disablePadding
            ref={provided.innerRef}
            {...provided.draggableProps}
        >
            {isItemClickable?.(item) ? (
                <ListItemButton
                    // this is to align checkbox and label
                    sx={mergeSx({ alignItems: 'flex-start', paddingTop: '0px' }, sx?.checkboxButton)}
                    disabled={disabled}
                    onClick={handleItemClick}
                    disableGutters
                >
                    <DraggableCheckBoxListItemContent
                        provided={provided}
                        isHighlighted={hover === getItemId(item) && !isDragDisable}
                        sx={sx}
                        {...props}
                    />
                </ListItemButton>
            ) : (
                <DraggableCheckBoxListItemContent
                    provided={provided}
                    isHighlighted={hover === getItemId(item) && !isDragDisable}
                    sx={sx}
                    {...props}
                />
            )}
        </ListItem>
    );
}
