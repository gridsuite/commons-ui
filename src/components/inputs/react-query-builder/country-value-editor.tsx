/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { ValueEditorProps } from 'react-querybuilder';
import { MaterialValueEditor } from '@react-querybuilder/material';
import { Autocomplete, Box, TextField, Theme } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import useConvertValue from './use-convert-value';
import useValid from './use-valid';
import { useLocalizedCountries } from '../../../hooks/localized-countries-hook';
import useCustomFormContext from '../react-hook-form/provider/use-custom-form-context';
import { fetchDefaultCountry, fetchFavoriteCountries } from '../../../services';
import SelectorWithFavs, { OptionWithFav } from './selector-with-favs';

const styles = {
    favBox: (theme: Theme) => ({
        borderBottom: '1px solid',
        borderColor: theme.palette.divider,
    }),
};

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
    const [currentCountryCodes, setCurrentCountryCodes] = useState<string[]>([
        '',
    ]);

    useEffect(() => {
        fetchFavoriteCountries().then((favs: string[]) => {
            setFavoriteCountryCodes(favs);
        });
    }, [setFavoriteCountryCodes]);

    useEffect(() => {
        if (allCountryCodes.length > 0) {
            if (!multiCountryMode) {
                // fetches and set the default country
                if (value === undefined || value === '') {
                    fetchDefaultCountry().then((countryCode) => {
                        if (countryCode) {
                            setCurrentCountryCodes([countryCode]);
                        }
                    });
                } else {
                    setCurrentCountryCodes([value]);
                }
            } else {
                setCurrentCountryCodes(value);
            }
        }
    }, [allCountryCodes, multiCountryMode, value, setCurrentCountryCodes]);

    const countriesList: OptionWithFav[] = useMemo(() => {
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
        // only one country may be selected
        return (
            <MaterialValueEditor
                {...props}
                value={currentCountryCodes[0]}
                values={countriesList}
                title={undefined} // disable the tooltip
                selectorComponent={SelectorWithFavs}
            />
        );
    }
    return (
        // any number of country may be selected
        <Autocomplete
            value={currentCountryCodes}
            options={allCountryCodes}
            getOptionLabel={(code: string) => translate(code)}
            onChange={(event, newValue: any) => handleOnChange(newValue)}
            groupBy={(option: string) => {
                return favoriteCountryCodes.includes(option)
                    ? `fav`
                    : 'not_fav';
            }}
            multiple
            fullWidth
            renderInput={(params) => <TextField {...params} error={!valid} />}
            renderGroup={(item) => {
                const { group, children } = item;
                return (
                    <Box key={`keyBoxGroup_${group}`} sx={styles.favBox}>
                        {children}
                    </Box>
                );
            }}
        />
    );
}
export default CountryValueEditor;
