/**
 * Copyright (c) 2020, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useRef } from 'react';
import { IconButton, styled, Theme } from '@mui/material';
import { Clear as ClearIcon } from '@mui/icons-material';
import { SnackbarProvider as OrigSnackbarProvider, SnackbarKey, SnackbarProviderProps } from 'notistack';

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
    buttonColor: (theme: Theme) => ({
        color: theme.palette.common.white,
    }),
};

/* A wrapper around notistack's SnackbarProvider that provides defaults props */
export function SnackbarProvider(props: SnackbarProviderProps) {
    const ref = useRef<OrigSnackbarProvider>(null);

    const action = (key: SnackbarKey) => (
        <IconButton
            onClick={() => ref.current?.closeSnackbar(key)}
            aria-label="clear-snack"
            size="small"
            sx={styles.buttonColor}
        >
            <ClearIcon fontSize="small" />
        </IconButton>
    );

    return (
        <StyledOrigSnackbarProvider
            ref={ref}
            anchorOrigin={{ horizontal: 'center', vertical: 'bottom' }}
            hideIconVariant
            action={action}
            {...props}
        />
    );
}
