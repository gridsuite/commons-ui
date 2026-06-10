/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0.
 */

import type { Meta, StoryObj } from '@storybook/react-vite';
import { AddButton, AddButtonMode } from '../../src';
import { fn } from 'storybook/test';

const meta = {
    title: 'UI/AddButton',
    component: AddButton,
    tags: ['autodocs'],
    args: { label: 'Button label', onClick: () => {}},
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
