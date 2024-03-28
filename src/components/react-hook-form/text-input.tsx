/**
 * Copyright (c) 2022, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { ReactElement } from 'react';
import {
    IconButton,
    InputAdornment,
    TextField,
    TextFieldProps,
} from '@mui/material';
import { Clear as ClearIcon } from '@mui/icons-material';
import { useController, useFormContext } from 'react-hook-form';
import TextFieldWithAdornment from './utils/text-field-with-adornment';
import FieldLabel from './utils/field-label';
import {
    genHelperError,
    genHelperPreviousValue,
    identity,
    isFieldRequired,
} from './utils/functions';

type Input = string | number;

type TextFieldWithAdornmentProps = TextFieldProps & {
    // variant already included in TextFieldProps
    value: Input; // we override the default type of TextFieldProps which is unknown
    adornmentPosition: string;
    adornmentText: string;
    handleClearValue?: () => void;
};

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
    previousValue?: Input;
    clearable?: boolean;
    formProps?: Omit<
        TextFieldWithAdornmentProps | TextFieldProps,
        'value' | 'onChange' | 'inputRef' | 'inputProps' | 'InputProps'
    >;
}

const TextInput = ({
    name,
    label,
    labelValues, // this prop is used to add a value to label. this value is displayed without being translated
    id,
    adornment,
    customAdornment,
    outputTransform = identity, //transform materialUi input value before sending it to react hook form, mostly used to deal with number fields
    inputTransform = identity, //transform react hook form value before sending it to materialUi input, mostly used to deal with number fields
    acceptValue = () => true, //used to check user entry before committing the input change, used mostly to prevent user from typing a character in number field
    previousValue,
    clearable,
    formProps,
}: TextInputProps) => {
    const { validationSchema, getValues, removeOptional } =
        useFormContext() as any;

    const {
        field: { onChange, value, ref },
        fieldState: { error },
    } = useController({ name });

    const handleClearValue = () => {
        onChange(outputTransform(''));
    };

    const handleValueChanged = (e: any) => {
        if (acceptValue(e.target.value)) {
            onChange(outputTransform(e.target.value));
        }
    };

    const transformedValue = inputTransform(value);

    const fieldLabel = !label
        ? null
        : FieldLabel({
              label,
              values: labelValues,
              optional:
                  !isFieldRequired(name, validationSchema, getValues()) &&
                  !formProps?.disabled &&
                  !removeOptional,
          });

    return adornment ? (
        <TextFieldWithAdornment
            key={id ? id : label}
            size="small"
            fullWidth
            id={id ? id : label}
            label={fieldLabel}
            {...(adornment && {
                adornmentPosition: adornment.position,
                adornmentText: adornment?.text,
            })}
            value={transformedValue}
            onChange={handleValueChanged}
            InputProps={{
                endAdornment: (
                    <InputAdornment position="end">
                        {clearable &&
                            transformedValue !== undefined &&
                            transformedValue !== '' && (
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
                    handleClearValue: handleClearValue,
                })}
            {...genHelperPreviousValue(previousValue!, adornment)}
            {...genHelperError(error?.message)}
            {...formProps}
        />
    ) : (
        <TextField
            key={id ? id : label}
            size="small"
            fullWidth
            id={id ? id : label}
            label={fieldLabel}
            value={transformedValue}
            onChange={handleValueChanged}
            InputProps={{
                endAdornment: (
                    <InputAdornment position="end">
                        {clearable &&
                            transformedValue !== undefined &&
                            transformedValue !== '' && (
                                <IconButton onClick={handleClearValue}>
                                    <ClearIcon />
                                </IconButton>
                            )}
                        {customAdornment && { ...customAdornment }}
                    </InputAdornment>
                ),
            }}
            inputRef={ref}
            {...genHelperPreviousValue(previousValue!, adornment)}
            {...genHelperError(error?.message)}
            {...formProps}
        />
    );
};

export default TextInput;
