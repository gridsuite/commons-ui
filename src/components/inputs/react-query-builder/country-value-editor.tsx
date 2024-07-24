/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { ValueEditorProps } from 'react-querybuilder';
import { MaterialValueEditor } from '@react-querybuilder/material';
import { Autocomplete, TextField } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import useConvertValue from './use-convert-value';
import useValid from './use-valid';
import { useLocalizedCountries } from '../../../hooks/localized-countries-hook';
import useCustomFormContext from '../react-hook-form/provider/use-custom-form-context';
import { fetchDefaultCountry, fetchFavoriteCountries } from '../../../services';
import CountrySelector from './country-selector';

function CountryValueEditor(props: ValueEditorProps) {
    const { language } = useCustomFormContext();
    const { translate, countryCodes } = useLocalizedCountries(language);
    const { value, handleOnChange } = props;
    const [allCountryCodes, setAllCountryCodes] = useState(countryCodes);
    const [favoriteCountryCodes, setFavoriteCountryCodes] = useState<string[]>([
        '',
    ]);
    // true when several countries may be selected simultaneously
    const multiCountryMode: boolean = useMemo(() => {
        return Array.isArray(value);
    }, [value]);
    // matters when only one country is selectable
    const [currentCountryCode, setCurrentCountryCode] = useState(
        multiCountryMode ? undefined : value
    );

    useEffect(() => {
        fetchFavoriteCountries().then((favs: string[]) => {
            setFavoriteCountryCodes(favs);
        });
    }, [setFavoriteCountryCodes]);

    // fetches and set the default country
    useEffect(() => {
        if (allCountryCodes.length > 0 && !multiCountryMode) {
            if (value === undefined || value === '') {
                fetchDefaultCountry().then((countryCode) => {
                    if (countryCode) {
                        setCurrentCountryCode(countryCode);
                    }
                });
            } else {
                setCurrentCountryCode(value);
            }
        }
    }, [allCountryCodes, multiCountryMode, value]);

    const countriesList = useMemo(() => {
        // remove favoriteCountryCodes from countryCodes to avoid duplicate keys
        const countryCodesWithoutFavorites = countryCodes.filter(
            (countryCode: string) => !favoriteCountryCodes.includes(countryCode)
        );
        setAllCountryCodes([
            ...favoriteCountryCodes,
            ...countryCodesWithoutFavorites,
        ]);

        const favoriteCountryOptions = favoriteCountryCodes.map(
            (countryCode: string) => {
                return {
                    name: countryCode,
                    label: translate(countryCode),
                    fav: true,
                };
            }
        );
        const otherCountryOptions = countryCodesWithoutFavorites.map(
            (countryCode: string) => {
                return {
                    name: countryCode,
                    label: translate(countryCode),
                    fav: false,
                };
            }
        );

        return [...favoriteCountryOptions, ...otherCountryOptions];
    }, [countryCodes, favoriteCountryCodes, translate]);
    // When we switch to 'in' operator, we need to switch the input value to an array and vice versa
    useConvertValue(props);

    const valid = useValid(props);

    // The displayed component totally depends on the value type and not the operator. This way, we have smoother transition.
    if (!multiCountryMode) {
        return (
            <MaterialValueEditor
                {...props}
                value={currentCountryCode}
                values={countriesList}
                title={undefined} // disable the tooltip
                selectorComponent={CountrySelector}
            />
        );
    }
    return (
        <Autocomplete
            value={value}
            options={allCountryCodes}
            getOptionLabel={(code: string) => translate(code)}
            onChange={(event, newValue: any) => handleOnChange(newValue)}
            multiple
            fullWidth
            renderInput={(params) => <TextField {...params} error={!valid} />}
        />
    );
}
export default CountryValueEditor;
