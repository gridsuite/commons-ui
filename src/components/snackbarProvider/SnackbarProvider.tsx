/**
 * Copyright (c) 2020, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { IconButton, styled } from '@mui/material';
import { Clear as ClearIcon } from '@mui/icons-material';
import {
    type SnackbarKey,
    SnackbarProvider as OrigSnackbarProvider,
    type SnackbarProviderProps,
    closeSnackbar as closeSnackbarFromNotistack,
} from 'notistack';
import type { MuiStyles } from '../../utils/styles';

const StyledOrigSnackbarProvider = styled(OrigSnackbarProvider)(() => ({
    '&.notistack-MuiContent': {
        alignItems: 'flex-start',
        flexWrap: 'nowrap',
    },
    '#notistack-snackbar': {
        alignItems: 'flex-start',
    },
}));

const styles = {
    buttonColor: (theme) => ({
        color: theme.palette.common.white,
    }),
} as const satisfies MuiStyles;

/* A wrapper around notistack's SnackbarProvider that provides defaults props */
export function SnackbarProvider(props: SnackbarProviderProps) {
    const action = (key: SnackbarKey) => (
        <IconButton
            onClick={() => closeSnackbarFromNotistack(key)}
            aria-label="clear-snack"
            size="small"
            sx={styles.buttonColor}
        >
            <ClearIcon fontSize="small" />
        </IconButton>
    );

    return (
        <StyledOrigSnackbarProvider
            anchorOrigin={{ horizontal: 'center', vertical: 'bottom' }}
            hideIconVariant
            action={action}
            {...props}
        />
    );
}
