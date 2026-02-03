/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { ChangeEvent } from 'react';
import { FormattedMessage } from 'react-intl';
import { CircularProgress, InputAdornment, TextField, type TextFieldProps } from '@mui/material';
import { Check as CheckIcon } from '@mui/icons-material';
import { useController } from 'react-hook-form';
import type { UUID } from 'node:crypto';
import type { ElementType } from '../../../../utils';
import type { SxStyle } from '../../../../utils/styles';
import { useUniqueNameValidation } from '../../../../hooks/useUniqueNameValidation';

export interface UniqueNameInputProps {
    name: string;
    label?: string;
    elementType: ElementType;
    autoFocus?: boolean;
    onManualChangeCallback?: () => void;
    formProps?: Omit<
        TextFieldProps,
        'value' | 'onChange' | 'name' | 'label' | 'inputRef' | 'inputProps' | 'InputProps'
    >;
    activeDirectory?: UUID;
    currentName?: string;
    isPrefilled?: boolean;
    sx?: SxStyle;
    fullWidth?: boolean;
}

/**
 * Input component that constantly checks if the field's value is available or not
 */
export function UniqueNameInput({
    name,
    label,
    elementType,
    autoFocus,
    onManualChangeCallback,
    formProps,
    currentName = '',
    isPrefilled = false,
    activeDirectory,
    sx,
    fullWidth = true,
}: Readonly<UniqueNameInputProps>) {
    const {
        field: { onChange, onBlur, value, ref },
        fieldState: { error },
    } = useController({
        name,
    });

    const { isValidating } = useUniqueNameValidation({
        name,
        currentName,
        elementType,
        activeDirectory,
        isPrefilled,
    });

    // Handle on user's change
    const handleManualChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        onChange(e.target.value);
        onManualChangeCallback?.();
    };

    const translatedLabel = <FormattedMessage id={label} />;

    const translatedError = error && <FormattedMessage id={error.message} />;

    const showOk = value?.trim() && !isValidating && !error;
    const endAdornment = (
        <InputAdornment position="end">
            {isValidating && <CircularProgress size="1rem" />}
            {showOk && <CheckIcon style={{ color: 'green' }} />}
        </InputAdornment>
    );

    return (
        <TextField
            autoComplete="new-password" // turns off the browser autocomplete. May be replaced by "off" but it is not well supported by some browsers
            onChange={handleManualChange}
            onBlur={onBlur}
            value={value}
            name={name}
            inputRef={ref}
            label={translatedLabel}
            type="text"
            autoFocus={autoFocus}
            margin="dense"
            sx={sx}
            fullWidth={fullWidth}
            error={!!error}
            helperText={translatedError}
            InputProps={{
                endAdornment,
                inputProps: {
                    'data-testid': 'NameInputField',
                },
            }}
            {...formProps}
        />
    );
}
