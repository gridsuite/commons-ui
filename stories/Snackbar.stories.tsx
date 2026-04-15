/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Box, Button, Stack, Typography } from '@mui/material';
import { SnackbarProvider } from '../src/components/snackbarProvider';
import { useSnackMessage } from '../src/hooks';

// ─── Helper component to trigger snacks from within the provider ─────────────

function SnackTriggers() {
    const { snackInfo, snackWarning, snackError, snackSuccess } = useSnackMessage();

    return (
        <Stack direction="row" flexWrap="wrap" gap={1}>
            <Button
                size="small"
                variant="contained"
                color="info"
                onClick={() => snackInfo({ messageTxt: 'Operation completed successfully', headerTxt: 'Info' })}
            >
                Info
            </Button>
            <Button
                size="small"
                variant="contained"
                color="success"
                onClick={() => snackSuccess({ messageTxt: 'File saved', headerTxt: 'Success' })}
            >
                Success
            </Button>
            <Button
                size="small"
                variant="contained"
                color="warning"
                onClick={() => snackWarning({ messageTxt: 'Disk space is running low', headerTxt: 'Warning' })}
            >
                Warning
            </Button>
            <Button
                size="small"
                variant="contained"
                color="error"
                onClick={() => snackError({ messageTxt: 'Network request failed', headerTxt: 'Error' })}
            >
                Error
            </Button>
        </Stack>
    );
}

const meta: Meta = {
    title: 'Feedback/SnackbarProvider',
    parameters: {
        docs: {
            description: {
                component:
                    'The `SnackbarProvider` wraps `notistack` and exposes a `useSnackMessage` hook. Use the hook to show info, success, warning and error notifications with an optional header.',
            },
        },
    },
};

export default meta;

export const AllVariants: StoryObj = {
    name: 'All snackbar variants',
    render: () => (
        <SnackbarProvider>
            <Box sx={{ p: 2 }}>
                <Typography variant="body2" sx={{ mb: 2 }}>
                    Click a button to trigger the corresponding snackbar notification.
                </Typography>
                <SnackTriggers />
            </Box>
        </SnackbarProvider>
    ),
};
