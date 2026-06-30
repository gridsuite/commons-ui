/**
 * Copyright (c) 2022, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useMemo } from 'react';
import { Autocomplete, AutocompleteProps, TextField, TextFieldProps } from '@mui/material';
import { useController } from 'react-hook-form';
import { genHelperError, identity, isFieldRequired, FieldLabel, HelperPreviousValue } from '../utils';
import { useCustomFormContext } from '../provider';
import { Option } from '../../../../utils';

export interface AutocompleteInputProps
    extends Omit<
        AutocompleteProps<Option, boolean | undefined, boolean | undefined, boolean | undefined>,
        // we already defined them in our custom Autocomplete
        'value' | 'onChange' | 'renderInput'
    > {
    name: string;
    options: Option[];
    label?: string;
    outputTransform?: (value: Option | null) => Option | null;
    inputTransform?: (value: Option | null) => Option | null;
    readOnly?: boolean;
    previousValue?: string;
    allowNewValue?: boolean;
    onChangeCallback?: () => void;
    formProps?: Omit<TextFieldProps, 'value' | 'onChange' | 'inputRef' | 'inputProps' | 'InputProps'>;
    disabledTooltip?: boolean;
    onCheckNewValue?: (value: Option | null) => boolean; // if return false, do not apply the new value
}

export function AutocompleteInput({
    name,
    label,
    options,
    outputTransform = identity, // transform materialUi input value before sending it to react hook form, mostly used to deal with select fields that need to return a string
    inputTransform = identity, // transform react hook form value before sending it to materialUi input, mostly used to deal with select fields that need to return a string
    readOnly = false,
    previousValue,
    allowNewValue,
    onChangeCallback, // method called when input value is changing
    formProps,
    disabledTooltip,
    onCheckNewValue,
    ...props
}: AutocompleteInputProps) {
    const { validationSchema, getValues, removeOptional, isNodeBuilt, isUpdate } = useCustomFormContext();
    const {
        field: { onChange, value, ref },
        fieldState: { error },
    } = useController({ name });

    const handleChange = (newValue: Option) => {
        const currentValue = getValues(name);
        // Avoid to trigger onChange if objects have the same id
        if (currentValue?.id === newValue) {
            return;
        }
        if (onCheckNewValue && !onCheckNewValue(newValue)) {
            return;
        }
        onChangeCallback?.();
        // if free solo not enabled or if value is not of string type, we call onChange right away
        if (!allowNewValue || typeof newValue !== 'string') {
            onChange(outputTransform(newValue));
            return;
        }

        // otherwise, we check if user input matches with one of the options
        const matchingOption = options.find((option: Option) => typeof option !== 'string' && option.id === newValue);
        // if it does, we send the matching option to react hook form
        if (matchingOption) {
            onChange(outputTransform(matchingOption));
            return;
        }

        // otherwise, we send the user input
        onChange(outputTransform(newValue));
    };

    const selectedValues = useMemo(() => inputTransform(value), [inputTransform, value]);

    return (
        <Autocomplete
            value={selectedValues ?? null} // Ensure null instead of undefined otherwise it switches to uncontrolled mode
            onChange={(_, data) => handleChange(data as Option)}
            {...(allowNewValue && {
                freeSolo: true,
                autoComplete: true,
                blurOnSelect: true,
                autoSelect: false,
                onInputChange: (_, data) => {
                    handleChange(data);
                },
            })}
            options={options}
            renderInput={({ inputProps, ...rest }) => (
                <TextField
                    {...(label && {
                        label: FieldLabel({
                            label,
                            optional:
                                !isFieldRequired(name, validationSchema, getValues()) &&
                                !props?.disabled &&
                                !removeOptional,
                        }),
                    })}
                    inputRef={ref}
                    inputProps={{ ...inputProps, readOnly }}
                    helperText={
                        previousValue && (
                            <HelperPreviousValue
                                previousValue={previousValue}
                                isNodeBuilt={isNodeBuilt}
                                disabledTooltip={disabledTooltip || (!isUpdate && isNodeBuilt)}
                            />
                        )
                    }
                    {...genHelperError(error?.message)}
                    {...formProps}
                    {...rest}
                />
            )}
            {...props}
        />
    );
}
