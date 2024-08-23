/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useState } from 'react';
import { ListItem } from '@mui/material';
import { CheckBoxListItemProps } from './check-box-list-type';
import { ClickableCheckBoxItem } from './clickable-check-box-item';
import { ClickableRowItem } from './clickable-row-item';

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
            sx={sx?.checkboxList}
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
