import type { Meta, StoryObj } from '@storybook/react-vite';
import { SnackbarProvider, DescriptionModificationDialog } from '../../../src';
import { useState } from 'react';
import { Button } from '@mui/material';

const meta = {
    title: 'UI/Dialogs/DescriptionModificationDialog',
    component: DescriptionModificationDialog,
    tags: ['autodocs'],
    args: {open: false, onClose: undefined, description: ""},
    decorators: [(Story) => <SnackbarProvider><Story /></SnackbarProvider>],
    render: (args) => {
        const [isOpen, setIsOpen] = useState(args.open);
        return (
            <>
                <Button onClick={() => setIsOpen(true)}>Open dialog</Button>
                <DescriptionModificationDialog {...args} onClose={() => setIsOpen(false)} open={isOpen} />
            </>
        );
    }
} satisfies Meta<typeof DescriptionModificationDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const WithDefaultValue: Story = { args: { description: 'Existing description' } };
