/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useState } from 'react';
import { Checkbox, IconButton, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import OverflowableText from '../OverflowableText';
import { DraggableCheckBoxListItemProps } from './check-box-list-type';

const styles = {
    dragIcon: (theme: any) => ({
        padding: 'unset',
        border: theme.spacing(0),
        borderRadius: theme.spacing(0),
        zIndex: 90,
    }),
};

export function DraggableCheckBoxListItem<T>({
    item,
    sx,
    label,
    onClick,
    secondaryAction,
    getItemId,
    isDragDisable,
    provided,
    disabled,
    divider,
    isCheckboxClickableOnly,
    ...props
}: DraggableCheckBoxListItemProps<T>) {
    const [hover, setHover] = useState<string>('');
    return (
        <ListItem
            secondaryAction={secondaryAction?.(item, hover)}
            sx={{ ...sx?.checkboxList }}
            onMouseEnter={() => setHover(getItemId(item))}
            onMouseLeave={() => setHover('')}
            disablePadding
            divider={divider}
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
        >
            <ListItemButton
                sx={sx?.checkboxButton}
                disabled={disabled}
                {...(!isCheckboxClickableOnly && {
                    onClick: () => onClick(),
                })}
            >
                <IconButton
                    {...provided.dragHandleProps}
                    size="small"
                    sx={{
                        opacity: hover === getItemId(item) && !isDragDisable ? '1' : '0',
                        padding: 'unset',
                        ...styles.dragIcon,
                    }}
                >
                    <DragIndicatorIcon spacing={0} />
                </IconButton>
                <ListItemIcon sx={{ ...sx?.checkBoxIcon }}>
                    <Checkbox
                        disableRipple
                        sx={sx?.checkbox}
                        {...(isCheckboxClickableOnly && {
                            onClick: () => onClick(),
                        })}
                        {...props}
                    />
                </ListItemIcon>
                <ListItemText
                    sx={{
                        display: 'flex',
                    }}
                    disableTypography
                >
                    <OverflowableText sx={sx?.label} text={label} />
                </ListItemText>
            </ListItemButton>
        </ListItem>
    );
}

export default DraggableCheckBoxListItem;
