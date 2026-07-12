/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import type { Meta, StoryObj } from '@storybook/react-vite';
import { FieldLabel } from '../../../src/components/ui/reactHookForm/utils/FieldLabel';

const meta = {
    title: 'UI/Inputs/ReactHookForm/Text/FieldLabel',
    component: FieldLabel,
    tags: ['autodocs'],
    args: { label: 'Voltage' },
} satisfies Meta<typeof FieldLabel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Required: Story = {};
export const Optional: Story = { args: { optional: true } };
