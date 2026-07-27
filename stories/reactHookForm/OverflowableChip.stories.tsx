/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import type { Meta, StoryObj } from '@storybook/react-vite';
import { OverflowableChip } from '../../src/components/ui/reactHookForm/OverflowableChip';
import { OverflowableChipWithHelperText } from '../../src';

const meta = {
    title: 'UI/Inputs/ReactHookForm/Selection/OverflowableChip',
    component: OverflowableChip,
    tags: ['autodocs'],
    args: { label: 'A compact chip label' },
} satisfies Meta<typeof OverflowableChip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const LongLabel: Story = { args: { label: 'A very long equipment name that must be truncated in the chip' } };
export const Deletable: Story = { args: { onDelete: () => undefined } };
export const WithHelperText: Story = {
    render: (args) => <OverflowableChipWithHelperText helperText="Helper text" {...args} />,
};
