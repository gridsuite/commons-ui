/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { ChangeEvent, useCallback, useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import {
    CircularProgress,
    InputAdornment,
    type SxProps,
    TextField,
    type TextFieldProps,
    type Theme,
} from '@mui/material';
import { Check as CheckIcon } from '@mui/icons-material';
import { useController, useFormContext } from 'react-hook-form';
import { UUID } from 'crypto';
import { useDebounce } from '../../../../hooks';
import { ElementType, FieldConstants } from '../../../../utils';
import { elementAlreadyExists } from '../../../../services';

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
    sx?: SxProps<Theme>;
    fullWidth?: boolean;
}

/**
 * Input component that constantly check if the field's value is available or not
 */
export function UniqueNameInput({
    name,
    label,
    elementType,
    autoFocus,
    onManualChangeCallback,
    formProps,
    currentName = '',
    activeDirectory,
    sx,
    fullWidth = true,
}: Readonly<UniqueNameInputProps>) {
    const {
        field: { onChange, onBlur, value, ref },
        fieldState: { error, isDirty },
    } = useController({
        name,
    });

    const {
        field: { value: selectedDirectory },
    } = useController({
        name: FieldConstants.DIRECTORY,
    });

    const {
        setError,
        clearErrors,
        trigger,
        formState: { errors },
    } = useFormContext();

    // This is a trick to share the custom validation state among the form : while this error is present, we can't validate the form
    const isValidating = errors.root?.isValidating;

    const directory = selectedDirectory || activeDirectory;

    const handleCheckName = useCallback(
        (nameValue: string) => {
            if (nameValue !== currentName && directory) {
                elementAlreadyExists(directory, nameValue, elementType)
                    .then((alreadyExist) => {
                        if (alreadyExist) {
                            setError(name, {
                                type: 'validate',
                                message: 'nameAlreadyUsed',
                            });
                        }
                    })
                    .catch((e) => {
                        setError(name, {
                            type: 'validate',
                            message: 'nameValidityCheckErrorMsg',
                        });
                        console.error(e?.message);
                    })
                    .finally(() => {
                        clearErrors('root.isValidating');
                        /* force form to validate, otherwise form
                        will remain invalid (setError('root.isValidating') invalid form and clearErrors does not affect form isValid state :
                        see documentation : https://react-hook-form.com/docs/useform/clearerrors) */
                        trigger('root.isValidating');
                    });
            } else {
                trigger('root.isValidating');
            }
        },
        [currentName, directory, elementType, setError, name, clearErrors, trigger]
    );

    const debouncedHandleCheckName = useDebounce(handleCheckName, 700);

    // We have to use an useEffect because the name can change from outside of this component (when we upload a case file for instance)
    useEffect(() => {
        const trimmedValue = value.trim();

        if (selectedDirectory) {
            debouncedHandleCheckName(trimmedValue);
        }

        // if the name is unchanged, we don't do custom validation
        if (!isDirty) {
            clearErrors(name);
            return;
        }
        if (trimmedValue) {
            clearErrors(name);
            setError('root.isValidating', {
                type: 'validate',
                message: 'cantSubmitWhileValidating',
            });
            debouncedHandleCheckName(trimmedValue);
        } else {
            clearErrors('root.isValidating');
            setError(name, {
                type: 'validate',
                message: 'nameEmpty',
            });
        }
    }, [debouncedHandleCheckName, setError, clearErrors, name, value, isDirty, selectedDirectory]);

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
            InputProps={{ endAdornment }}
            {...formProps}
        />
    );
}
