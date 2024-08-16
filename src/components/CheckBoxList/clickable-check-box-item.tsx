/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { Checkbox, ListItemText } from '@mui/material';
import OverflowableText from '../OverflowableText';
import { ClickableItemProps } from './check-box-list-type';

export function ClickableCheckBoxItem({ sx, label, ...props }: ClickableItemProps) {
    return (
        <>
            <Checkbox disableRipple sx={sx?.checkbox} {...props} />
            <ListItemText sx={{ display: 'flex' }} disableTypography>
                <OverflowableText sx={sx?.label} text={label} />
            </ListItemText>
        </>
    );
}

export default ClickableCheckBoxItem;
