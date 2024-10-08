/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { ValueEditorProps } from 'react-querybuilder';
import { SyntheticEvent, useEffect, useState } from 'react';
import { useLocalizedCountries } from '../../../hooks/useLocalizedCountries';
import { useCustomFormContext } from '../reactHookForm/provider/useCustomFormContext';
import { fetchFavoriteAndDefaultCountries } from '../../../services';
import { AutocompleteWithFavorites } from './AutocompleteWithFavorites';
import { useConvertValue } from './hooks/useConvertValue';
import { useValid } from './hooks/useValid';

export function CountryValueEditor(props: ValueEditorProps) {
    const { value, handleOnChange } = props;

    const { language } = useCustomFormContext();
    const { translate, countryCodes } = useLocalizedCountries(language);
    const [favoriteCountryCodes, setFavoriteCountryCodes] = useState<string[]>([]);
    const [initialized, setInitialized] = useState<boolean>(false);

    // fetch favorite countries and default country
    useEffect(() => {
        if (!initialized) {
            fetchFavoriteAndDefaultCountries().then(({ favoriteCountries, defaultCountry }) => {
                setFavoriteCountryCodes(favoriteCountries);
                if (defaultCountry && !value) {
                    handleOnChange(defaultCountry);
                }
                setInitialized(true);
            });
        }
    }, [initialized, setInitialized, handleOnChange, value]);

    // When we switch to 'in' operator, we need to switch the input value to an array and vice versa
    useConvertValue(props);

    const valid = useValid(props);

    return (
        <AutocompleteWithFavorites
            value={value}
            options={countryCodes}
            favorites={favoriteCountryCodes}
            getOptionLabel={(code: string) => (code ? translate(code) : '')}
            valid={valid}
            onChange={(event: SyntheticEvent, newValue: any) => {
                handleOnChange(newValue);
            }}
            fullWidth
        />
    );
}
