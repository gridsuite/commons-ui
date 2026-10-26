/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { SyntheticEvent, useMemo } from 'react';
import { useController } from 'react-hook-form';
import { Autocomplete, AutocompleteProps, TextField, TextFieldProps } from '@mui/material';
import {
    genHelperError,
    getReadOnlyAutocompleteProps,
    getReadOnlySlotProps,
} from '../../../components/ui/reactHookForm/utils';
import { type AutocompleteInputProps } from '../../../components/ui/reactHookForm/autocompleteInputs';
import { balancesAdjustmentStyles } from './balancesAdjustment.styles';
import { useCustomFormContext } from '../../../components';

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
    const { isReadOnly } = useCustomFormContext();
    const {
        field: { onChange, value, ref },
        fieldState: { error },
    } = useController({ name });

    const handleChange = (_event: SyntheticEvent, newValue: string[]) => {
        onChange(newValue);
    };
    const readOnlySlotProps = useMemo(() => getReadOnlySlotProps(isReadOnly, value), [isReadOnly, value]);

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
                        htmlInput: {
                            ...params.slotProps.htmlInput,
                            ...readOnlySlotProps.htmlInput,
                        },
                        input: {
                            ...params.slotProps.input,
                            ...readOnlySlotProps.input,
                        },
                        inputLabel: {
                            ...params.slotProps.inputLabel,
                            ...readOnlySlotProps.inputLabel,
                        },
                    }}
                    label={label}
                    {...genHelperError(error?.message)}
                />
            )}
            getOptionLabel={(option) => translate(option)}
            autoHighlight
            disableCloseOnSelect
            {...props}
            {...getReadOnlyAutocompleteProps(isReadOnly)}
        />
    );
}
