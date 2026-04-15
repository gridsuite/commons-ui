/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Box, Button, Stack, Typography } from '@mui/material';
import { ExportCsvButton } from '../src/components/csvDownloader/export-csv-button';

// ─── ExportCsvButton ──────────────────────────────────────────────────────────

const meta: Meta<typeof ExportCsvButton> = {
    title: 'Actions/ExportCsvButton',
    component: ExportCsvButton,
    parameters: {
        docs: {
            description: {
                component:
                    'An icon button that triggers a CSV export. Shows a loading spinner while the download is in progress and a checkmark on success.',
            },
        },
    },
    argTypes: {
        disabled: { control: 'boolean' },
        isDownloadLoading: { control: 'boolean' },
        isDownloadSuccessful: { control: 'boolean' },
    },
};

export default meta;
type Story = StoryObj<typeof ExportCsvButton>;

export const Default: Story = {
    args: {
        onClick: () => {},
    },
};

export const Loading: Story = {
    args: {
        onClick: () => {},
        isDownloadLoading: true,
    },
};

export const Success: Story = {
    args: {
        onClick: () => {},
        isDownloadSuccessful: true,
    },
};

export const Disabled: Story = {
    args: {
        onClick: () => {},
        disabled: true,
    },
};

export const Simulated: Story = {
    name: 'Simulated download flow',
    render: () => {
        const [loading, setLoading] = useState(false);
        const [success, setSuccess] = useState(false);

        const handleClick = () => {
            setLoading(true);
            setSuccess(false);
            setTimeout(() => {
                setLoading(false);
                setSuccess(true);
            }, 2000);
        };

        return (
            <Stack spacing={1}>
                <Typography variant="body2">Click the button to simulate a 2-second download.</Typography>
                <ExportCsvButton onClick={handleClick} isDownloadLoading={loading} isDownloadSuccessful={success} />
            </Stack>
        );
    },
};
