/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Box } from '@mui/material';
import { ReactNode } from 'react';

export type MidFormErrorProps = { message: string | ReactNode };

// component to display error message in the middle of dialog
export function MidFormError({ message }: Readonly<MidFormErrorProps>) {
    return (
        <Box
            sx={(theme) => ({
                color: theme.palette.error.main,
                fontSize: 'small',
                marginLeft: theme.spacing(2),
                marginRight: theme.spacing(2),
            })}
        >
            {message}
        </Box>
    );
}
