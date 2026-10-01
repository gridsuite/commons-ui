/**
 * Copyright (c) 2022, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { type ChangeEvent, type JSX, useCallback } from 'react';
import { useIntl } from 'react-intl';
import { Checkbox, FormControlLabel, Switch } from '@mui/material';
import { useController } from 'react-hook-form';
import { useCustomFormContext } from '../provider';

type InputTypes = typeof Switch | typeof Checkbox;
type InputProps<TInput> = TInput extends (props: infer Props) => JSX.Element ? Props : never;

export type BooleanInputProps<TInput extends InputTypes> = {
    name: string;
    label?: string;
    formProps?: InputProps<TInput>;
    Input: TInput;
    dataTestId?: string;
};

export function BooleanInput<TInput extends InputTypes>({
    name,
    label,
    formProps,
    Input,
    dataTestId,
    ...props
}: Readonly<BooleanInputProps<TInput>>) {
    const { onChange, slotProps, disabled, ...otherFormProps } = formProps ?? { onChange: undefined };
    const {
        field: { onChange: onChangeRhf, value, ref },
    } = useController<Record<string, boolean>>({ name });

    const { readOnly } = useCustomFormContext();

    const intl = useIntl();

    const handleChangeValue = useCallback(
        (event: ChangeEvent<HTMLInputElement>) => {
            onChangeRhf(event.target.checked);
            onChange?.(event, event.target.checked);
        },
        [onChange, onChangeRhf]
    );

    const CustomInput = (
        <Input
            checked={value ?? false} // Prevents component from switching to uncontrolled mode
            onChange={handleChangeValue}
            inputRef={ref}
            slotProps={{ input: { 'aria-label': 'primary checkbox' }, ...slotProps }}
            data-testid={dataTestId}
            disabled={readOnly || disabled}
            {...(otherFormProps as any)}
            {...props}
        />
    );

    if (label) {
        return (
            <FormControlLabel
                control={CustomInput}
                label={intl.formatMessage({ id: label })}
                // must restore label color and opacity otherwise disabled Input is detected
                // by FormControlLabel.
                sx={
                    readOnly
                        ? {
                              '& .MuiFormControlLabel-label.Mui-disabled': {
                                  color: 'text.primary',
                                  opacity: 1,
                              },
                          }
                        : undefined
                }
            />
        );
    }

    return CustomInput;
}
