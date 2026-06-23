/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import type { Meta, StoryObj } from '@storybook/react-vite';
import { MenuList } from '@mui/material';
import { CustomMenuItem, CustomNestedMenuItem } from '../../src';

const meta = {
    title: 'UI/ContextMenu/CustomNestedMenuItem',
    component: CustomNestedMenuItem,
    tags: ['autodocs'],
    decorators: [
        (Story) => (
            <MenuList>
                <Story />
            </MenuList>
        ),
    ],
    argTypes: {
        children: { control: false },
    },
    render: (args) => (
        <CustomNestedMenuItem label="SubMenu" {...args}>
            <CustomMenuItem>CSV</CustomMenuItem>
            <CustomMenuItem>JSON</CustomMenuItem>
        </CustomNestedMenuItem>
    ),
} satisfies Meta<typeof CustomNestedMenuItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const SeveralLevels: Story = {
    decorators: (Story) => (
        <CustomNestedMenuItem label="SubMenu">
            <Story />
            <Story />
        </CustomNestedMenuItem>
    ),
};
export const Disabled: Story = { args: { disabled: true } };
