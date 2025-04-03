/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { Checkbox, ListItemIcon, ListItemText } from '@mui/material';
import { OverflowableText } from '../overflowableText';
import { CheckBoxListItemContentProps } from './checkBoxList.type';

export function CheckBoxListItemContent({ sx, label, secondary, onClick, ...props }: CheckBoxListItemContentProps) {
    const onCheckboxClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();
        onClick();
    };
    return (
        <>
            <ListItemIcon sx={{ marginTop: '0px', ...sx?.checkBoxIcon }}>
                <Checkbox sx={sx?.checkbox} disableRipple onClick={onCheckboxClick} {...props} />
            </ListItemIcon>
            <ListItemText
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    paddingTop: '0px', // this is to align text with default padding/margin of the checkbox
                    marginTop: '9px',
                    ...sx?.listItemText,
                }}
                disableTypography
                secondary={secondary}
            >
                <OverflowableText sx={{ width: '100%', ...sx?.label }} text={label} />
            </ListItemText>
        </>
    );
}
