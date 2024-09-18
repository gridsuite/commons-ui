/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import { Checkbox, IconButton, ListItemIcon, ListItemText } from '@mui/material';
import { OverflowableText } from '../overflowableText';
import { DraggableClickableCheckBoxItemProps } from './checkBoxList.type';

const styles = {
    dragIcon: (theme: any) => ({
        padding: 'unset',
        border: theme.spacing(0),
        borderRadius: theme.spacing(0),
        zIndex: 90,
    }),
};

export function DraggableClickableCheckBoxItem({
    sx,
    disabled,
    provided,
    isHighlighted,
    label,
    ...props
}: Readonly<DraggableClickableCheckBoxItemProps>) {
    return (
        <>
            <IconButton
                {...provided.dragHandleProps}
                size="small"
                sx={{
                    opacity: isHighlighted ? '1' : '0',
                    padding: 'unset',
                    ...styles.dragIcon,
                }}
            >
                <DragIndicatorIcon spacing={0} />
            </IconButton>
            <ListItemIcon sx={{ minWidth: 0, ...sx?.checkBoxIcon }}>
                <Checkbox disableRipple sx={{ paddingLeft: 0, ...sx?.checkbox }} {...props} />
            </ListItemIcon>
            <ListItemText
                sx={{
                    display: 'flex',
                }}
                disableTypography
            >
                <OverflowableText sx={sx?.label} text={label} />
            </ListItemText>
        </>
    );
}
