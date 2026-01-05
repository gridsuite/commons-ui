/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.ds
 */

import { Box, FormHelperText } from '@mui/material';
import { OverflowableChip, OverflowableChipProps } from './OverflowableChip';
import { mergeSx } from '../../../utils';

export interface OverflowableChipWithHelperTextProps extends OverflowableChipProps {
    helperText?: string;
}

export function OverflowableChipWithHelperText({
    helperText,
    boxSx,
    ...otherProps
}: Readonly<OverflowableChipWithHelperTextProps>) {
    return (
        <Box
            display="flex"
            alignItems="left"
            flexDirection="column"
            sx={mergeSx({ cursor: 'default' }, boxSx)}
            onClick={(e) => e.stopPropagation()}
        >
            <OverflowableChip boxSx={{ paddingBottom: '2px' }} {...otherProps} />
            {helperText && (
                <FormHelperText sx={{ fontSize: 'x-small', margin: 0, marginLeft: 2 }}>{helperText}</FormHelperText>
            )}
        </Box>
    );
}
