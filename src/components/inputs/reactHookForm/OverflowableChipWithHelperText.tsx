/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.ds
 */

import { Box, FormHelperText } from '@mui/material';
import { FormattedMessage } from 'react-intl';
import { OverflowableChip, OverflowableChipProps } from './OverflowableChip';

export interface OverflowableChipWithHelperTextProps extends OverflowableChipProps {
    helperText?: string;
}

export function OverflowableChipWithHelperText({
    helperText,
    ...otherProps
}: Readonly<OverflowableChipWithHelperTextProps>) {
    return (
        <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
            <OverflowableChip {...otherProps} />
            {helperText && (
                <FormHelperText>
                    <FormattedMessage id={helperText} />
                </FormHelperText>
            )}
        </Box>
    );
}
