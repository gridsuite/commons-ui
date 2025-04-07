/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { DragIndicator as DragIndicatorIcon } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import { DraggableCheckBoxListItemContentProps } from './checkBoxList.type';
import { CheckBoxListItemContent } from './CheckBoxListItemContent';
import { mergeSx } from '../../utils';

export function DraggableCheckBoxListItemContent({
    provided,
    isHighlighted,
    sx,
    ...props
}: Readonly<DraggableCheckBoxListItemContentProps>) {
    return (
        <>
            <IconButton
                {...provided.dragHandleProps}
                size="small"
                sx={mergeSx(
                    {
                        display: isHighlighted ? 'block' : 'none',
                        padding: 'unset',
                        marginTop: '9px', // this is to align drag button to the checkbox and label
                    },
                    sx?.dragButton
                )}
            >
                <DragIndicatorIcon />
            </IconButton>
            <CheckBoxListItemContent sx={sx} {...props} />
        </>
    );
}
