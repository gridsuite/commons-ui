/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Box, Stack, Typography } from '@mui/material';
import {
    LeftPanelOpenIcon,
    LeftPanelCloseIcon,
    ArrowsOutputIcon,
    EditNoteIcon,
} from '../src/components/icons';

const IconGallery = () => (
    <Stack direction="row" spacing={4} flexWrap="wrap" useFlexGap>
        {(
            [
                { Icon: LeftPanelOpenIcon, name: 'LeftPanelOpenIcon' },
                { Icon: LeftPanelCloseIcon, name: 'LeftPanelCloseIcon' },
                { Icon: ArrowsOutputIcon, name: 'ArrowsOutputIcon' },
                { Icon: EditNoteIcon, name: 'EditNoteIcon' },
            ] as const
        ).map(({ Icon, name }) => (
            <Box key={name} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                <Icon fontSize="large" color="action" />
                <Icon fontSize="medium" color="primary" />
                <Icon fontSize="small" color="secondary" />
                <Typography variant="caption">{name}</Typography>
            </Box>
        ))}
    </Stack>
);

const meta: Meta<typeof IconGallery> = {
    title: 'Icons/Custom Icons',
    component: IconGallery,
    parameters: {
        docs: {
            description: {
                component:
                    'Custom SVG icons built on top of MUI SvgIcon. Supports all standard MUI icon props such as `fontSize` and `color`.',
            },
        },
    },
};

export default meta;
type Story = StoryObj<typeof IconGallery>;

export const AllIcons: Story = {
    name: 'All custom icons',
    render: () => <IconGallery />,
};

export const Sizes: Story = {
    name: 'Sizes',
    render: () => (
        <Stack spacing={2}>
            {(['inherit', 'small', 'medium', 'large'] as const).map((size) => (
                <Stack key={size} direction="row" spacing={2} alignItems="center">
                    <Typography variant="body2" sx={{ width: 80 }}>
                        {size}
                    </Typography>
                    <LeftPanelOpenIcon fontSize={size} />
                    <LeftPanelCloseIcon fontSize={size} />
                    <ArrowsOutputIcon fontSize={size} />
                    <EditNoteIcon fontSize={size} />
                </Stack>
            ))}
        </Stack>
    ),
};

export const Colors: Story = {
    name: 'Colors',
    render: () => (
        <Stack spacing={2}>
            {(['inherit', 'action', 'primary', 'secondary', 'error', 'warning', 'info', 'success'] as const).map(
                (color) => (
                    <Stack key={color} direction="row" spacing={2} alignItems="center">
                        <Typography variant="body2" sx={{ width: 80 }}>
                            {color}
                        </Typography>
                        <LeftPanelOpenIcon color={color} />
                        <LeftPanelCloseIcon color={color} />
                        <ArrowsOutputIcon color={color} />
                        <EditNoteIcon color={color} />
                    </Stack>
                )
            )}
        </Stack>
    ),
};
