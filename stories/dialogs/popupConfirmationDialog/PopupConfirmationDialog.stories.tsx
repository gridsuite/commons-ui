import type { Meta, StoryObj } from '@storybook/react-vite';
import { PopupConfirmationDialog } from '../../../src';
import { useState } from 'react';
import { Button } from '@mui/material';

const meta = {
    title: 'UI/Dialogs/PopupConfirmationDialog',
    component: PopupConfirmationDialog,
    tags: ['autodocs'],
    args: {
        message: 'This action will replace the current selection.',
        isTranslationNeeded: false,
        openConfirmationPopup: false,
        setOpenConfirmationPopup: () => undefined,
        handlePopupConfirmation: () => undefined,
    },
    render: (args) => {
        const [isOpen, setIsOpen] = useState(args.openConfirmationPopup);
        return (
            <>
                <Button onClick={() => setIsOpen(true)}>Open dialog</Button>
                <PopupConfirmationDialog {...args} setOpenConfirmationPopup={setIsOpen} openConfirmationPopup={isOpen} />
            </>
        );
    },
} satisfies Meta<typeof PopupConfirmationDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const CustomValidateLabel: Story = { args: { validateButtonLabel: 'Confirm' } };