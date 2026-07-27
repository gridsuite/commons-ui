/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import type { Meta, StoryObj } from '@storybook/react-vite';
import { Box } from '@mui/material';
import { Panel, PanelGroup } from 'react-resizable-panels';
import { ResizeHandle } from '../../src';

const meta = {
    title: 'UI/ResizeHandle',
    component: ResizeHandle,
    tags: ['autodocs'],
    argTypes: {
        visible: {
            type: 'boolean',
        },
        rotated: {
            type: 'boolean',
        },
    },
    render: (args) => (
        <PanelGroup
            direction={args.rotated ? 'vertical' : 'horizontal'}
            style={{ width: 420, height: 180, border: '1px solid black' }}
        >
            <Panel>
                <Box p={2}>First panel</Box>
            </Panel>
            <ResizeHandle {...args} />
            <Panel>
                <Box p={2}>Second panel</Box>
            </Panel>
        </PanelGroup>
    ),
    parameters: {
        docs: {
            description: {
                component: `
Styled component using "react-resizable-panels" PanelResizeHandle.

react-resizable-panels documentation :
https://react-resizable-panels.vercel.app/
`,
            },
        },
    },
} satisfies Meta<typeof ResizeHandle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Horizontal: Story = {};
export const Vertical: Story = { args: { rotated: true } };
