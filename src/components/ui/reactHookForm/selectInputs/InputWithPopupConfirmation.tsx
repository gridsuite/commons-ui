/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { useController } from 'react-hook-form';
import { useState } from 'react';
import { PopupConfirmationDialog } from '../../../ui/dialogs/popupConfirmationDialog/PopupConfirmationDialog';

export function InputWithPopupConfirmation({
    Input,
    name,
    shouldOpenPopup, // condition to open popup confirmation
    resetOnChange, // function applying the changes that must happen on EVERY value change (with or without confirmation)
    resetOnConfirmation, // complementary function applying the changes that must happen only AFTER confirmation
    message,
    validateButtonLabel,
    ...props
}: any) {
    const [newValue, setNewValue] = useState<string | null>(null);
    const [openPopup, setOpenPopup] = useState(false);
    const {
        field: { onChange },
    } = useController({
        name,
    });

    const handleOnChange = (_event: unknown, value: string) => {
        if (shouldOpenPopup()) {
            setOpenPopup(true);
            setNewValue(value);
        } else {
            resetOnChange?.();
            onChange(value);
        }
    };

    const handlePopupConfirmation = () => {
        resetOnChange?.();
        resetOnConfirmation?.();
        onChange(newValue);
        setOpenPopup(false);
    };

    return (
        <>
            <Input
                name={name}
                {...props}
                onChange={(e: unknown, value: { id: string }) => {
                    handleOnChange(e, value?.id ?? value);
                }}
            />
            <PopupConfirmationDialog
                message={message}
                openConfirmationPopup={openPopup}
                setOpenConfirmationPopup={setOpenPopup}
                handlePopupConfirmation={handlePopupConfirmation}
                validateButtonLabel={validateButtonLabel}
            />
        </>
    );
}
