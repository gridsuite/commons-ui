/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { useState } from 'react';
import { useController } from 'react-hook-form';
import { Select, SelectChangeEvent, MenuItem, FormControl, InputLabel } from '@mui/material';
import { FormattedMessage, useIntl } from 'react-intl';
import { PopupConfirmationDialog } from '../../../dialogs/popupConfirmationDialog';

interface SelectWithConfirmationInputProps {
    name: string;
    options: string[];
    onValidate: () => void;
    getOptionLabel?: (option: string) => string;
    label: string;
    isModification?: boolean;
}

export function SelectWithConfirmationInput({
    name,
    options,
    onValidate,
    getOptionLabel,
    label,
    isModification,
}: Readonly<SelectWithConfirmationInputProps>) {
    const intl = useIntl();
    const [openConfirmationDialog, setOpenConfirmationDialog] = useState(false);
    const [newValue, setNewValue] = useState('');
    const {
        field: { value, onChange },
    } = useController({
        name,
    });

    const selectedValue = typeof value === 'string' ? value : '';
    const handleChange = (event: SelectChangeEvent) => {
        if (selectedValue && isModification) {
            setOpenConfirmationDialog(true);
            setNewValue(event.target.value);
        } else {
            onChange(event.target.value);
        }
    };

    const handleValidate = () => {
        onValidate?.();
        onChange(newValue);
        setOpenConfirmationDialog(false);
    };

    return (
        <>
            <FormControl fullWidth>
                <InputLabel size="small">
                    <FormattedMessage id={label} />
                </InputLabel>
                <Select
                    value={selectedValue}
                    size="small"
                    fullWidth
                    onChange={handleChange}
                    label={<FormattedMessage id={label} />}
                >
                    {options.map((option) => (
                        <MenuItem key={option} value={option}>
                            {getOptionLabel ? getOptionLabel(option) : intl.formatMessage({ id: option })}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            <PopupConfirmationDialog
                message="changeTypeConfirmation"
                openConfirmationPopup={openConfirmationDialog}
                setOpenConfirmationPopup={setOpenConfirmationDialog}
                handlePopupConfirmation={handleValidate}
                validateButtonLabel="button.changeType"
            />
        </>
    );
}
