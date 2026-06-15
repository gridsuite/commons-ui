import type { Meta, StoryObj } from '@storybook/react-vite';
import { MultipleSelectionDialog } from '../../../src';
import { useState } from 'react';
import { Button } from '@mui/material';

type Item = { id: string; label: string };
const items: Item[] = [{ id: 'a', label: 'Option A' }, { id: 'b', label: 'Option B' }, { id: 'c', label: 'Option C' }];

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
    render: (args) => {
        const [isOpen, setIsOpen] = useState(args.open);
        return (
            <>
                <Button onClick={() => setIsOpen(true)}>Open dialog</Button>
                <MultipleSelectionDialog {...args} handleClose={() => setIsOpen(false)} open={isOpen} />
            </>
        );
    },
} satisfies Meta<typeof MultipleSelectionDialog<Item>>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const WithDndActive: Story = { args: { isDndActive: true } };
