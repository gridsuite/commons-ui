/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import { IconButton } from '@mui/material';
import { DraggableCheckBoxListItemContentProps } from './checkBoxList.type';
import { CheckBoxListItemContent } from './CheckBoxListItemContent';

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
                sx={{
                    opacity: isHighlighted ? '1' : '0', // TODO WHY ?
                    padding: 'unset',
                    marginTop: '9px', // this is to align drag button to the checkbox and label
                    ...sx?.dragButton,
                }}
            >
                <DragIndicatorIcon />
            </IconButton>
            <CheckBoxListItemContent sx={sx} {...props} />
        </>
    );
}
