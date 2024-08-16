/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Checkbox, IconButton, ListItemText } from '@mui/material';
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

export function DraggableClickableCheckBoxItem({
    sx,
    disabled,
    provided,
    isHighlighted,
    label,
    ...props
}: DraggableClickableItemProps) {
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
            <Checkbox disableRipple sx={sx?.checkbox} {...props} />
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

export default DraggableClickableCheckBoxItem;
