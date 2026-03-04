/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { useCallback } from 'react';
import { Chip } from '@mui/material';
import { AutocompleteInput } from '../autocompleteInputs/AutocompleteInput';
import { useLocalizedCountries } from '../../../../hooks/useLocalizedCountries';
import { useCustomFormContext } from '../provider/useCustomFormContext';
import { Option } from '../../../../utils/types/types';

export interface CountryInputProps {
    name: string;
    label: string;
    dataTestId?: string;
}

export function CountriesInput({ name, label, dataTestId }: Readonly<CountryInputProps>) {
    const { language } = useCustomFormContext();
    const { translate, countryCodes } = useLocalizedCountries(language!);

    const translateOption = useCallback(
        (option: Option) => {
            if (typeof option === 'string') {
                return translate(option);
            }
            return translate(option.label);
        },
        [translate]
    );

    return (
        <AutocompleteInput
            data-testid={dataTestId}
            name={name}
            label={label}
            options={countryCodes}
            getOptionLabel={translateOption}
            fullWidth
            multiple
            renderTags={(val: any[], getTagsProps: any) =>
                val.map((code: string, index: number) => {
                    const { key, ...tagProps } = getTagsProps({ index });
                    return (
                        <Chip
                            key={key ?? code}
                            data-testid={`${dataTestId}.${code}`}
                            size="small"
                            label={translate(code)}
                            {...tagProps}
                        />
                    );
                })
            }
        />
    );
}
