/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { SyntheticEvent } from 'react';
import { useController } from 'react-hook-form';
import { Autocomplete, AutocompleteProps, TextField, TextFieldProps } from '@mui/material';
import { genHelperError } from '../../../components/ui/reactHookForm/utils';
import { AutocompleteInputProps } from '../../../components/ui/reactHookForm/autocompleteInputs';
import { balancesAdjustmentStyles } from './balancesAdjustment.styles';

export interface CountriesAutocompleteProps extends Pick<
    AutocompleteProps<string, true, false, false>,
    'limitTags' | 'disabled'
> {
    name: AutocompleteInputProps['name'];
    label?: TextFieldProps['label'];
    disabled?: boolean;
    dataTestId?: string;
    countryCodes: string[];
    translate: (countryCode: string) => string;
}

export function CountriesAutocomplete({
    name,
    label,
    disabled,
    dataTestId,
    countryCodes,
    translate,
    ...props
}: Readonly<CountriesAutocompleteProps>) {
    const {
        field: { onChange, value, ref },
        fieldState: { error },
    } = useController({ name });

    const handleChange = (_event: SyntheticEvent, newValue: string[]) => {
        onChange(newValue);
    };

    return (
        <Autocomplete
            data-testid={dataTestId}
            multiple
            disabled={disabled}
            value={value ?? []}
            onChange={handleChange}
            options={countryCodes}
            size="small"
            limitTags={2}
            sx={balancesAdjustmentStyles.autocomplete}
            renderInput={(params) => (
                <TextField
                    inputRef={ref}
                    {...params}
                    slotProps={{
                        ...params.slotProps,
                        htmlInput: { ...params.slotProps.htmlInput },
                    }}
                    label={label}
                    {...genHelperError(error?.message)}
                />
            )}
            getOptionLabel={(option) => translate(option)}
            autoHighlight
            disableCloseOnSelect
            {...props}
        />
    );
}
