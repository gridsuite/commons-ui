/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import type { Meta, StoryObj } from '@storybook/react-vite';
import { AddButton, AddButtonMode } from '../../src';

const meta = {
    title: 'UI/Buttons/AddButton',
    component: AddButton,
    tags: ['autodocs'],
    args: { label: 'Button label', onClick: () => {} },
    argTypes: {
        mode: {
            control: 'select',
            options: Object.values(AddButtonMode),
        },
    },
} satisfies Meta<typeof AddButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Edit: Story = { args: { mode: AddButtonMode.EDIT } };
export const Disabled: Story = { args: { disabled: true } };
