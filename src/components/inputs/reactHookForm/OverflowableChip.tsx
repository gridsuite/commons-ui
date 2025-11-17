/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.ds
 */

import { Box, Chip, type ChipProps } from '@mui/material';
import { OverflowableText } from '../../overflowableText';

export interface OverflowableChipProps extends ChipProps {}

export function OverflowableChip({ label, ...otherProps }: Readonly<OverflowableChipProps>) {
    return (
        <Chip
            size="small"
            label={
                <Box sx={{ display: 'flex' }}>
                    <OverflowableText
                        text={label}
                        sx={{
                            maxWidth: '20ch',
                            mx: 'auto',
                        }}
                    />
                </Box>
            }
            {...otherProps}
        />
    );
}
