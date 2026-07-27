/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Button } from '@mui/material';
import { SnackbarProvider, DescriptionModificationDialog, DescriptionModificationDialogProps } from '../../../src';

function DescriptionModificationDialogsStory(args: DescriptionModificationDialogProps) {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <>
            <Button onClick={() => setIsOpen(true)}>Open dialog</Button>
            <DescriptionModificationDialog {...args} onClose={() => setIsOpen(false)} open={isOpen} />
        </>
    );
}

const meta = {
    title: 'UI/Dialogs/DescriptionModificationDialog',
    component: DescriptionModificationDialog,
    tags: ['autodocs'],
    args: { open: false, onClose: undefined, description: '' },
    decorators: [
        (Story) => (
            <SnackbarProvider>
                <Story />
            </SnackbarProvider>
        ),
    ],
    render: (args) => <DescriptionModificationDialogsStory {...args} />,
} satisfies Meta<typeof DescriptionModificationDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const WithDefaultValue: Story = { args: { description: 'Existing description' } };
