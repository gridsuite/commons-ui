/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '@mui/material';
import { useSnackbar } from 'notistack';
import { SnackbarProvider } from '../../src';

type SnackbarVariant = 'success' | 'error' | 'warning' | 'info';

type SnackbarButtonArgs = React.ComponentProps<typeof SnackbarProvider> & {
    snackBarVariant: SnackbarVariant;
};

function SnackbarButton({ snackBarVariant }: { snackBarVariant?: SnackbarVariant }) {
    const { enqueueSnackbar } = useSnackbar();

    return (
        <Button
            variant="contained"
            onClick={() =>
                enqueueSnackbar(`${snackBarVariant} snackbar`, {
                    variant: snackBarVariant,
                })
            }
        >
            Show snackbar
        </Button>
    );
}

const meta = {
    title: 'UI/SnackbarProvider',
    component: SnackbarProvider,
    tags: ['autodocs'],
    args: {
        snackBarVariant: 'success',
    },
    argTypes: {
        snackBarVariant: {
            control: 'select',
            options: ['success', 'error', 'warning', 'info'],
        },
    },
    render: ({ snackBarVariant }) => (
        <SnackbarProvider>
            <SnackbarButton snackBarVariant={snackBarVariant} />
        </SnackbarProvider>
    ),
    parameters: {
        docs: {
            description: {
                component: `
Wrapper of "notistack" NotificationProvider.

This component specifies :
- styling
- X button to close the snackbar
- snackbar position

All standard props from notistack SnackBarProvider

Snackbar documentation :
https://notistack.com/api-reference
`,
            },
        },
    },
} satisfies Meta<SnackbarButtonArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
