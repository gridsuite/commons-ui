/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import type { Meta, StoryObj } from '@storybook/react-vite';
import { ActivableChip } from '../../src/components/ui/inputs/ActivableChip';

const meta = {
    title: 'UI/Inputs/ActivableChip',
    component: ActivableChip,
    tags: ['autodocs'],
    args: { label: 'Network filter', tooltipMessage: 'Toggle filter', onClick: () => undefined },
} satisfies Meta<typeof ActivableChip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Active: Story = { args: { isActivated: true } };
export const Inactive: Story = { args: { isActivated: false } };
export const Disabled: Story = { args: { isActivated: true, isDisabled: true } };
