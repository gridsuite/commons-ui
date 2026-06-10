/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import type { Meta, StoryObj } from '@storybook/react-vite';
import { Box, Stack, Typography } from '@mui/material';
import { expect, userEvent, within } from 'storybook/test';
import { ExpandableGroup } from '../../src/components/ui/expandableGroup/ExpandableGroup';

const content = (
    <Stack spacing={1}>
        <Typography>First detail</Typography>
        <Typography>Second detail</Typography>
    </Stack>
);

const meta = {
    title: 'UI/ExpandableGroup',
    component: ExpandableGroup,
    tags: ['autodocs'],
    args: {
        renderHeader: 'Group title',
        children: content,
    },
    argTypes: {
        children: {
            control: false,
        },
    },
} satisfies Meta<typeof ExpandableGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Nested: Story = {
    render: (args) => {
        return (
            <ExpandableGroup renderHeader={<Typography fontWeight="bold">Parent group</Typography>}>
                <Box sx={{ pl: 2 }}>
                    <ExpandableGroup renderHeader={<Typography>Child group A</Typography>}>
                        <Box sx={{ p: 2 }}>
                            <Typography variant="body2">Nested content A</Typography>
                        </Box>
                    </ExpandableGroup>
                    <ExpandableGroup renderHeader={<Typography>Child group B</Typography>}>
                        <Box sx={{ p: 2 }}>
                            <Typography variant="body2">Nested content B</Typography>
                        </Box>
                    </ExpandableGroup>
                </Box>
            </ExpandableGroup>
        );
    }
};

export const CustomHeader: Story = {
    args: {
        renderHeader: (
            <Stack>
                <Typography fontWeight="bold">Custom header</Typography>
                <Typography variant="caption">Additional context</Typography>
            </Stack>
        ),
    },
};
