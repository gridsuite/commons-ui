/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { Checkbox, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import OverflowableText from '../OverflowableText';
import { ClickableRowItemProps } from './check-box-list-type';

export function ClickableRowItem({ sx, disabled, label, onClick, onItemClick, ...props }: ClickableRowItemProps) {
    const onCheckboxClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();
        onClick();
    };
    return (
        <ListItemButton sx={{ paddingLeft: 0, ...sx?.checkboxButton }} disabled={disabled} onClick={onItemClick}>
            <ListItemIcon sx={{ minWidth: 0, ...sx?.checkBoxIcon }}>
                <Checkbox disableRipple sx={{ paddingLeft: 0, ...sx?.checkbox }} onClick={onCheckboxClick} {...props} />
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

export default ClickableRowItem;
