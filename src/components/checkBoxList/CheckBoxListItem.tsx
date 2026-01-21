/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useCallback, useState } from 'react';
import { ListItem, ListItemButton } from '@mui/material';
import { CheckBoxListItemProps } from './checkBoxList.type';
import { CheckBoxListItemContent } from './CheckBoxListItemContent';
import { mergeSx } from '../../utils';
import type { MuiStyles } from '../../utils/styles';

const styles = {
    checkboxListItem: {
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

export function CheckBoxListItem<T>({
    item,
    sx,
    secondaryAction,
    getItemId,
    divider,
    onItemClick,
    isItemClickable,
    disabled,
    ...props
}: Readonly<CheckBoxListItemProps<T>>) {
    const [hover, setHover] = useState<string>('');
    const handleItemClick = useCallback(() => {
        if (!onItemClick) {
            return; // nothing to do
        }
        if (isItemClickable) {
            if (isItemClickable(item)) {
                onItemClick(item); // only call on clickable items
            }
            return;
        }
        // otherwise, every items are clickable
        onItemClick(item);
    }, [isItemClickable, item, onItemClick]);
    return (
        <ListItem
            secondaryAction={secondaryAction?.(item, hover)}
            sx={mergeSx(styles.checkboxListItem, sx?.checkboxListItem)}
            onMouseEnter={() => setHover(getItemId(item))}
            onMouseLeave={() => setHover('')}
            disablePadding
            divider={divider}
        >
            {onItemClick ? (
                <ListItemButton
                    // this is to align checkbox and label
                    sx={mergeSx({ alignItems: 'flex-start', padding: 'unset' }, sx?.checkboxButton)}
                    disabled={disabled}
                    onClick={handleItemClick}
                >
                    <CheckBoxListItemContent sx={sx} {...props} />
                </ListItemButton>
            ) : (
                <CheckBoxListItemContent sx={sx} {...props} />
            )}
        </ListItem>
    );
}
