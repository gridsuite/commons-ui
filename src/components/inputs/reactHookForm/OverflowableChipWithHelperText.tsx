/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.ds
 */

import { Box, FormHelperText } from '@mui/material';
import { OverflowableChip, OverflowableChipProps } from './OverflowableChip';

export interface OverflowableChipWithHelperTextProps extends OverflowableChipProps {
    helperText?: string;
}

export function OverflowableChipWithHelperText({
    helperText,
    ...otherProps
}: Readonly<OverflowableChipWithHelperTextProps>) {
    return (
        <Box sx={{ display: 'flex', alignItems: 'left', flexDirection: 'column' }}>
            <OverflowableChip {...otherProps} />
            {helperText && <FormHelperText sx={{ fontSize: 'x-small' }}>{helperText}</FormHelperText>}
        </Box>
    );
}
