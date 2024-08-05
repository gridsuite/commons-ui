/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useState } from 'react';
import {
    Checkbox,
    IconButton,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
} from '@mui/material';
import { FormattedMessage } from 'react-intl';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import OverflowableText from '../OverflowableText';
import { DraggableCheckBoxListItemProps } from './check-box-list-type';

const styles = {
    dragIcon: (theme: any) => ({
        padding: theme.spacing(0),
        border: theme.spacing(1),
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
    ...props
}: DraggableCheckBoxListItemProps<T>) {
    const [hover, setHover] = useState<string>('');
    return (
        <ListItem
            secondaryAction={secondaryAction?.(item, hover)}
            sx={sx?.checkboxList}
            onMouseEnter={() => setHover(getItemId(item))}
            onMouseLeave={() => setHover('')}
            disablePadding
            divider={divider}
            disabled={disabled}
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
        >
            <ListItemButton onClick={onClick}>
                <ListItemIcon sx={sx?.checkBoxIcon}>
                    <IconButton
                        {...provided.dragHandleProps}
                        size="small"
                        sx={{
                            opacity:
                                hover === getItemId(item) && !isDragDisable
                                    ? '1'
                                    : '0',
                            ...styles.dragIcon,
                        }}
                    >
                        <DragIndicatorIcon />
                    </IconButton>
                    <Checkbox disableRipple {...props} />
                </ListItemIcon>
                <ListItemText sx={{ display: 'flex' }} disableTypography>
                    <OverflowableText
                        sx={sx?.label}
                        text={
                            <FormattedMessage
                                id={label}
                                defaultMessage={label}
                            />
                        }
                    />
                </ListItemText>
            </ListItemButton>
        </ListItem>
    );
}

export default DraggableCheckBoxListItem;
