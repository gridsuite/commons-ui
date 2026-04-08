/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { useState } from 'react';
import { useController } from 'react-hook-form';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent,
} from '@mui/material';
import { FormattedMessage, useIntl } from 'react-intl';

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
            <Dialog open={openConfirmationDialog} aria-labelledby="dialog-title-change-equipment-type">
                <DialogTitle id="dialog-title-change-equipment-type">Confirmation</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        <FormattedMessage id="changeTypeConfirmation" />
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenConfirmationDialog(false)} variant="outlined">
                        <FormattedMessage id="cancel" />
                    </Button>
                    <Button onClick={handleValidate} variant="outlined">
                        <FormattedMessage id="button.changeType" />
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
