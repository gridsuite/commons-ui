/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import type { Meta, StoryObj } from '@storybook/react-vite';
import { MidFormError, FieldErrorAlert } from '../../../src';

const meta = {
    title: 'UI/Inputs/ReactHookForm/Text/ErrorComponents',
    component: FieldErrorAlert,
    tags: ['autodocs'],
    args: { message: 'The submitted value is invalid.' },
} satisfies Meta<typeof FieldErrorAlert>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Alert: Story = {};
export const Inline: Story = { render: () => <MidFormError message="At least one item is required." /> };
