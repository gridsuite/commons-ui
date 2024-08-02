/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { ValueEditorProps } from 'react-querybuilder';
import { useEffect, useState } from 'react';
import { useLocalizedCountries } from '../../../hooks/localized-countries-hook';
import useCustomFormContext from '../react-hook-form/provider/use-custom-form-context';
import { fetchDefaultCountry, fetchFavoriteCountries } from '../../../services';
import AutocompleteWithFavorites from './autocomplete-with-favorites';

function CountryValueEditor(props: ValueEditorProps) {
    const { value } = props;
    const { language } = useCustomFormContext();
    const { translate, countryCodes } = useLocalizedCountries(language);
    const [favoriteCountryCodes, setFavoriteCountryCodes] = useState<string[]>(
        []
    );
    const [valueInitialised, setValueInitialised] = useState(value);
    const [initialized, setInitialized] = useState<boolean>(false);

    useEffect(() => {
        fetchFavoriteCountries().then((favs: string[]) => {
            setFavoriteCountryCodes(favs);
        });
    }, [setFavoriteCountryCodes]);

    useEffect(() => {
        if (!valueInitialised) {
            if (!initialized) {
                fetchDefaultCountry().then((countryCode) => {
                    if (countryCode) {
                        setValueInitialised(countryCode);
                    }
                    setInitialized(true);
                });
            } else {
                setValueInitialised(value);
            }
        } else {
            setValueInitialised(value);
        }
    }, [
        setValueInitialised,
        initialized,
        setInitialized,
        valueInitialised,
        value,
    ]);

    return (
        <AutocompleteWithFavorites
            {...props}
            value={valueInitialised}
            standardOptions={countryCodes}
            favorites={favoriteCountryCodes}
            getOptionLabel={(code: any) => (code === '' ? '' : translate(code))}
        />
    );
}
export default CountryValueEditor;
