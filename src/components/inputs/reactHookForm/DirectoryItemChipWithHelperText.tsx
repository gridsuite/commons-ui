/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.ds
 */

import { Box, FormHelperText } from '@mui/material';
import { FormattedMessage } from 'react-intl';
import { DirectoryItemChip, DirectoryItemChipProps } from './DirectoryItemChip';

export interface DirectoryItemChipWithHelperTextProps extends DirectoryItemChipProps {
    helperText?: string;
}

export function DirectoryItemChipWithHelperText({
    helperText,
    ...otherProps
}: Readonly<DirectoryItemChipWithHelperTextProps>) {
    return (
        <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
            <DirectoryItemChip {...otherProps} />
            {helperText && (
                <FormHelperText>
                    <FormattedMessage id={helperText} />
                </FormHelperText>
            )}
        </Box>
    );
}
