/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '@mui/material';
import { CustomTooltip } from '../../src';

const meta = {
    title: 'UI/CustomTooltip',
    component: CustomTooltip,
    tags: ['autodocs'],
    args: { title: 'Helpful tooltip', children: <Button variant="outlined">Hover me</Button> },
    argTypes: { children: { control: false } },
    parameters: {
        docs: {
            description: {
                component: `
Wrapper of MUI tooltip.

This component specifies :
- tooltip arrow
- 250ms enter delay

All standard props from MUI tooltip stay available

MUI documentation :
https://mui.com/material-ui/react-tooltip/
`,
            },
        },
    },
} satisfies Meta<typeof CustomTooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const PlacementRight: Story = { args: { placement: 'right' } };
