/**
 * Copyright (c) 2022, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { ReactElement } from 'react';
import { IconButton, InputAdornment, TextField, TextFieldProps } from '@mui/material';
import { Clear as ClearIcon } from '@mui/icons-material';
import { useController } from 'react-hook-form';
import { TextFieldWithAdornment, TextFieldWithAdornmentProps } from '../utils/TextFieldWithAdornment';
import { FieldLabel } from '../utils/FieldLabel';
import { genHelperError, identity, isFieldRequired } from '../utils/functions';
import { useCustomFormContext } from '../provider/useCustomFormContext';

import { Input } from '../../../../utils/types/types';
import { HelperPreviousValue } from '../utils/HelperPreviousValue';

export interface TextInputProps {
    name: string;
    label?: string;
    labelValues?: any; // it's for values from https://formatjs.io/docs/react-intl/components/#formattedmessage
    id?: string;
    adornment?: {
        position: string;
        text: string;
    };
    customAdornment?: ReactElement | null;
    outputTransform?: (value: string) => Input | null;
    inputTransform?: (value: Input) => string;
    acceptValue?: (value: string) => boolean;
    onChange?: (value: string) => void;
    previousValue?: Input;
    clearable?: boolean;
    formProps?: Omit<
        TextFieldWithAdornmentProps | TextFieldProps,
        'value' | 'onChange' | 'inputRef' | 'inputProps' | 'InputProps'
    >;
    disabledTooltip?: boolean;
    disabled?: boolean;
}

export function TextInput({
    name,
    label,
    labelValues, // this prop is used to add a value to label. this value is displayed without being translated
    id,
    adornment,
    customAdornment,
    outputTransform = identity, // transform materialUi input value before sending it to react hook form, mostly used to deal with number fields
    inputTransform = identity, // transform react hook form value before sending it to materialUi input, mostly used to deal with number fields
    acceptValue = () => true, // used to check user entry before committing the input change, used mostly to prevent user from typing a character in number field
    onChange, // method called when input value changed, if you want to manually trigger validation for example (do not update the form here unless you know what you do, it's already done by RHF)
    previousValue,
    clearable,
    formProps,
    disabledTooltip, // In case we don't want to show tooltip on the value and warning/info icons
    disabled,
}: TextInputProps) {
    const { validationSchema, getValues, removeOptional, isNodeBuilt, isUpdate } = useCustomFormContext();
    const {
        field: { onChange: onChangeRhf, value, ref },
        fieldState: { error },
    } = useController({ name });

    const Field = adornment ? TextFieldWithAdornment : TextField;
    const finalAdornment = {
        adornmentPosition: adornment?.position ?? '',
        adornmentText: adornment?.text ?? '',
    };

    const handleClearValue = () => {
        onChangeRhf(outputTransform(''));
    };

    const handleValueChanged = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        if (acceptValue(e.target.value)) {
            onChangeRhf(outputTransform(e.target.value));
            onChange?.(e.target.value);
        }
    };

    const transformedValue = inputTransform(value);

    const fieldLabel = !label
        ? null
        : FieldLabel({
              label,
              values: labelValues,
              optional:
                  !isFieldRequired(name, validationSchema, getValues()) && !formProps?.disabled && !removeOptional,
          });

    return (
        <Field
            key={id ?? label}
            size="small"
            fullWidth
            id={id ?? label}
            label={fieldLabel}
            value={transformedValue}
            onChange={handleValueChanged}
            disabled={disabled}
            InputProps={{
                endAdornment: (
                    <InputAdornment position="end">
                        {clearable && transformedValue !== undefined && transformedValue !== '' && (
                            <IconButton onClick={handleClearValue}>
                                <ClearIcon />
                            </IconButton>
                        )}
                        {customAdornment && { ...customAdornment }}
                    </InputAdornment>
                ),
            }}
            inputRef={ref}
            {...(clearable &&
                adornment && {
                    handleClearValue,
                })}
            helperText={
                <HelperPreviousValue
                    previousValue={previousValue}
                    isNodeBuilt={isNodeBuilt}
                    disabledTooltip={disabledTooltip || (!isUpdate && isNodeBuilt)}
                    adornmentText={adornment?.text}
                />
            }
            {...genHelperError(error?.message)}
            {...formProps}
            {...(adornment && { ...finalAdornment })}
        />
    );
}
