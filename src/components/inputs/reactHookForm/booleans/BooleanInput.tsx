/**
 * Copyright (c) 2022, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { ChangeEvent, useCallback } from 'react';
import { useIntl } from 'react-intl';
import { Checkbox, CheckboxProps, FormControlLabel, Switch, SwitchProps } from '@mui/material';
import { useController } from 'react-hook-form';

export interface BooleanInputProps {
    name: string;
    label?: string;
    formProps?: SwitchProps | CheckboxProps;
    Input: typeof Switch | typeof Checkbox;
}

export function BooleanInput({ name, label, formProps, Input }: BooleanInputProps) {
    const {
        field: { onChange, value, ref },
    } = useController<Record<string, boolean>>({ name });

    const intl = useIntl();

    const handleChangeValue = useCallback(
        (event: ChangeEvent<HTMLInputElement>) => {
            onChange(event.target.checked);
        },
        [onChange]
    );

    const CustomInput = (
        // @ts-ignore
        <Input
            checked={value}
            onChange={(e: ChangeEvent<HTMLInputElement>) => handleChangeValue(e)}
            inputRef={ref}
            inputProps={{
                'aria-label': 'primary checkbox',
            }}
            {...formProps}
        />
    );

    if (label) {
        return <FormControlLabel control={CustomInput} label={intl.formatMessage({ id: label })} />;
    }

    return CustomInput;
}
