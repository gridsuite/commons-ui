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

type InputTypes = typeof Switch | typeof Checkbox;
type InputProps<TInput> = TInput extends (props: infer Props) => JSX.Element ? Props : never;

export type BooleanInputProps<TInput extends InputTypes> = {
    name: string;
    label?: string;
    formProps?: InputProps<TInput>;
    Input: TInput;
};

export function BooleanInput<TInput extends InputTypes>({
    name,
    label,
    formProps,
    Input,
    ...props
}: Readonly<BooleanInputProps<TInput>>) {
    const { onChange, ...otherFormProps } = formProps ?? { onChange: undefined };
    const {
        field: { onChange: onChangeRhf, value, ref },
    } = useController<Record<string, boolean>>({ name });

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
            checked={value}
            onChange={handleChangeValue}
            inputRef={ref}
            inputProps={{ 'aria-label': 'primary checkbox' }}
            {...(otherFormProps as any)}
            {...props}
        />
    );

    if (label) {
        return <FormControlLabel control={CustomInput} label={intl.formatMessage({ id: label })} />;
    }

    return CustomInput;
}
