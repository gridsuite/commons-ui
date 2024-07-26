/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React, { useState } from 'react';
import {
    Checkbox,
    IconButton,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    SxProps,
} from '@mui/material';
import { UUID } from 'crypto';
import { DraggableProvided } from 'react-beautiful-dnd';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import OverflowableText from '../OverflowableText';

export interface CheckBoxItemProps {
    item: any;
    checkBoxIconSx?: SxProps;
    labelSx?: SxProps;
    checkboxListSx?: SxProps;
    checked: boolean;
    label: string;
    getValueId: (value: any) => string | UUID;
    onClick: (
        event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
        item: any
    ) => void;
    disabled: boolean | undefined;
    secondaryAction?: (
        item: any,
        hover: string | UUID
    ) => React.ReactElement | undefined;
    isCheckBoxDraggable?: boolean | undefined;
    provided?: DraggableProvided;
}

const styles = {
    dragIcon: (theme: any) => ({
        padding: theme.spacing(0),
        border: theme.spacing(1),
        borderRadius: theme.spacing(0),
        zIndex: 90,
    }),
};

export function CheckBoxListItem({
    item,
    checkBoxIconSx,
    checked,
    labelSx,
    label,
    onClick,
    disabled = false,
    secondaryAction,
    checkboxListSx,
    getValueId,
    isCheckBoxDraggable,
    provided,
    ...props
}: CheckBoxItemProps) {
    const [hover, setHover] = useState<string | UUID>(null);
    return (
        <ListItem
            secondaryAction={secondaryAction && secondaryAction(item, hover)}
            sx={checkboxListSx}
            onMouseEnter={() => setHover(getValueId(item))}
            onMouseLeave={() => setHover(null)}
            disablePadding
            divider
            ref={provided?.innerRef}
            {...(isCheckBoxDraggable && provided
                ? provided.draggableProps
                : {})}
            {...(isCheckBoxDraggable && provided
                ? provided?.dragHandleProps
                : {})}
        >
            <ListItemButton onClick={(event) => onClick(event, item)}>
                {isCheckBoxDraggable && provided ? (
                    <ListItemIcon sx={checkBoxIconSx}>
                        <IconButton
                            {...provided.dragHandleProps}
                            sx={styles.dragIcon}
                            size="small"
                            style={{
                                opacity: hover === getValueId(item) ? '1' : '0',
                            }}
                        >
                            <DragIndicatorIcon />
                        </IconButton>
                        <Checkbox
                            checked={checked}
                            disableRipple
                            disabled={disabled}
                            {...props}
                        />
                    </ListItemIcon>
                ) : (
                    <ListItemIcon sx={checkBoxIconSx}>
                        <Checkbox
                            checked={checked}
                            disableRipple
                            disabled={disabled}
                            {...props}
                        />
                    </ListItemIcon>
                )}
                <ListItemText>
                    <OverflowableText sx={labelSx} text={label} />
                </ListItemText>
            </ListItemButton>
        </ListItem>
    );
}
