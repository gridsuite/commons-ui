/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { Checkbox, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { OverflowableText } from '../overflowableText';
import { ClickableRowItemProps } from './checkBoxList.type';

const styles = {
    unclickableItem: {
        '&:hover': {
            backgroundColor: 'transparent',
        },
        cursor: 'inherit',
    },
};

export function ClickableRowItem({
    sx,
    disabled,
    label,
    onClick,
    onItemClick,
    isItemClickable = true,
    ...props
}: Readonly<ClickableRowItemProps>) {
    const onCheckboxClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();
        onClick();
    };
    const handleItemClick = () => isItemClickable && onItemClick();

    return (
        <ListItemButton
            disableTouchRipple={!isItemClickable}
            sx={{ paddingLeft: 0, ...sx?.checkboxButton, ...(!isItemClickable && styles.unclickableItem) }}
            disabled={disabled}
            onClick={handleItemClick}
        >
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
