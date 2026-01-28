/**
 * Copyright (c) 2022, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useIntl } from 'react-intl';
import { Autocomplete, type AutocompleteProps, TextField } from '@mui/material';
import { FieldLabel } from './reactHookForm/utils/FieldLabel';

type SelectOption = { id: string; label?: string };

export interface SelectClearableProps extends Omit<
    AutocompleteProps<SelectOption, false, false, false>,
    'value' | 'onChange' | 'renderInput'
> {
    value: string | null;
    onChange: (value: string | null) => void;
    label?: string;
}

export function SelectClearable(props: Readonly<SelectClearableProps>) {
    const { value, onChange, label, options, ...otherProps } = props;

    const intl = useIntl();

    const inputTransform = (inputValue: string | null) => {
        return (value && options.find((option) => option.id === inputValue)) || null;
    };

    const outputTransform = (option: SelectOption | null) => {
        return option?.id ?? null;
    };

    return (
        <Autocomplete
            value={inputTransform(value)}
            onChange={(_, newValue) => onChange(outputTransform(newValue))}
            getOptionLabel={(option) => {
                return option.label
                    ? intl.formatMessage({ id: option.label }) // If the option has a label property, display the label using internationalization
                    : option.id; // If the option doesn't have a label property, display the ID instead
            }}
            renderInput={({ inputProps, ...otherParams }) => (
                <TextField
                    {...otherParams}
                    {...(label && {
                        label: FieldLabel({
                            label,
                        }),
                    })}
                    inputProps={{ ...inputProps, readOnly: true }}
                />
            )}
            options={options}
            {...otherProps}
        />
    );
}
