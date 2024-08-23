/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Checkbox, IconButton, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import OverflowableText from '../OverflowableText';
import { DraggableClickableItemProps } from './check-box-list-type';

const styles = {
    dragIcon: (theme: any) => ({
        padding: 'unset',
        border: theme.spacing(0),
        borderRadius: theme.spacing(0),
        zIndex: 90,
    }),
};

export function DraggableClickableRowItem({
    sx,
    disabled,
    onClick,
    provided,
    isHighlighted,
    label,
    ...props
}: DraggableClickableItemProps) {
    return (
        <ListItemButton sx={sx?.checkboxButton} disabled={disabled} onClick={onClick}>
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
        </ListItemButton>
    );
}

export default DraggableClickableRowItem;
