/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Button } from '@mui/material';
import { MultipleSelectionDialog, MultipleSelectionDialogProps } from '../../../src';

type Item = { id: string; label: string };
const items: Item[] = [
    { id: 'a', label: 'Option A' },
    { id: 'b', label: 'Option B' },
    { id: 'c', label: 'Option C' },
];

function MultipleSelectionDialogStory(args: MultipleSelectionDialogProps<Item>) {
    const { open: defaultOpenValue } = args;
    const [isOpen, setIsOpen] = useState(defaultOpenValue);
    return (
        <>
            <Button onClick={() => setIsOpen(true)}>Open dialog</Button>
            <MultipleSelectionDialog {...args} handleClose={() => setIsOpen(false)} open={isOpen} />
        </>
    );
}

const meta = {
    title: 'UI/Dialogs/MultipleSelectionDialog',
    component: MultipleSelectionDialog<Item>,
    tags: ['autodocs'],
    args: {
        open: false,
        titleId: 'Select options',
        items,
        selectedItems: [],
        getItemId: (item) => item.id,
        getItemLabel: (item) => item.label,
        handleClose: () => undefined,
        handleValidate: () => undefined,
    },
    render: (args) => <MultipleSelectionDialogStory {...args} />,
} satisfies Meta<typeof MultipleSelectionDialog<Item>>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const WithDndActive: Story = { args: { isDndActive: true } };
