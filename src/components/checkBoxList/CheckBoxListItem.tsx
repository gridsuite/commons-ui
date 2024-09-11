/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useState } from 'react';
import { ListItem } from '@mui/material';
import { CheckBoxListItemProps } from './checkBoxList.type';
import { ClickableCheckBoxItem } from './ClickableCheckBoxItem';
import { ClickableRowItem } from './ClickableRowItem';

export function CheckBoxListItem<T>({
    item,
    sx,
    secondaryAction,
    getItemId,
    divider,
    isCheckboxClickableOnly,
    ...props
}: CheckBoxListItemProps<T>) {
    const [hover, setHover] = useState<string>('');
    return (
        <ListItem
            secondaryAction={secondaryAction?.(item, hover)}
            sx={{ minWidth: 0, ...sx?.checkboxListItem }}
            onMouseEnter={() => setHover(getItemId(item))}
            onMouseLeave={() => setHover('')}
            disablePadding={!isCheckboxClickableOnly}
            disableGutters
            divider={divider}
        >
            {isCheckboxClickableOnly ? <ClickableCheckBoxItem {...props} /> : <ClickableRowItem {...props} />}
        </ListItem>
    );
}

export default CheckBoxListItem;
