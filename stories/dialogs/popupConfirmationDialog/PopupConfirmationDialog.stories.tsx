/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Button } from '@mui/material';
import { PopupConfirmationDialog, PopupConfirmationDialogProps } from '../../../src';

function PopupConfirmationDialogStory(args: PopupConfirmationDialogProps) {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <>
            <Button onClick={() => setIsOpen(true)}>Open dialog</Button>
            <PopupConfirmationDialog {...args} setOpenConfirmationPopup={setIsOpen} openConfirmationPopup={isOpen} />
        </>
    );
}

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
    render: (args) => <PopupConfirmationDialogStory {...args} />,
} satisfies Meta<typeof PopupConfirmationDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const CustomValidateLabel: Story = { args: { validateButtonLabel: 'Confirm' } };
