/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.ds
 */

import { Box, BoxProps, Chip, type ChipProps } from '@mui/material';
import { OverflowableText } from '../../overflowableText';

export interface OverflowableChipProps extends ChipProps {
    boxSx?: BoxProps['sx'];
}

export function OverflowableChip({ label, boxSx, ...otherProps }: Readonly<OverflowableChipProps>) {
    return (
        <Box padding="3px" sx={{ cursor: 'default', ...boxSx }} onClick={(e) => e.stopPropagation()}>
            <Chip
                size="small"
                label={
                    <Box sx={{ display: 'flex' }}>
                        <OverflowableText
                            text={label}
                            sx={{
                                maxWidth: '20ch',
                                marginX: 'auto',
                            }}
                        />
                    </Box>
                }
                {...otherProps}
            />
        </Box>
    );
}
