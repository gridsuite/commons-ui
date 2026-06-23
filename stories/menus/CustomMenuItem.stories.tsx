/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import type { Meta, StoryObj } from '@storybook/react-vite';
import { MenuList } from '@mui/material';
import { CustomMenuItem } from '../../src';

const meta = {
    title: 'UI/ContextMenu/CustomMenuItem',
    component: CustomMenuItem,
    tags: ['autodocs'],
    args: { children: 'Open study' },
    decorators: [
        (Story) => (
            <MenuList>
                <Story />
            </MenuList>
        ),
    ],
} satisfies Meta<typeof CustomMenuItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Selected: Story = { args: { selected: true } };
export const Disabled: Story = { args: { disabled: true } };
