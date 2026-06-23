import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Button } from '@mui/material';
import { SnackbarProvider, DescriptionModificationDialog, DescriptionModificationDialogProps } from '../../../src';

function DescriptionModificationDialogsStory(args: DescriptionModificationDialogProps) {
    const { open: defaultOpenValue } = args;
    const [isOpen, setIsOpen] = useState(defaultOpenValue);
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
