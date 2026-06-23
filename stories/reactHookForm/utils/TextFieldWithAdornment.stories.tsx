/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import type { Meta, StoryObj } from '@storybook/react-vite';
import { TextFieldWithAdornment } from '../../../src';

const meta = {
    title: 'UI/Inputs/ReactHookForm/Text/TextFieldWithAdornment',
    component: TextFieldWithAdornment,
    tags: ['autodocs'],
    args: { value: 225, label: 'Voltage', adornmentText: 'kV', adornmentPosition: 'end' },
} satisfies Meta<typeof TextFieldWithAdornment>;

export default meta;
type Story = StoryObj<typeof meta>;

export const EndAdornment: Story = {};
export const StartAdornment: Story = {
    args: { value: 1200, label: 'Cost', adornmentText: '€', adornmentPosition: 'start' },
};
export const Clearable: Story = { args: { handleClearValue: () => undefined } };
