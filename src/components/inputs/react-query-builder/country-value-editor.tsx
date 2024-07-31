/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { ValueEditorProps } from 'react-querybuilder';
import { Autocomplete, Box, TextField, Theme } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import useConvertValue from './use-convert-value';
import useValid from './use-valid';
import { useLocalizedCountries } from '../../../hooks/localized-countries-hook';
import useCustomFormContext from '../react-hook-form/provider/use-custom-form-context';
import { fetchDefaultCountry, fetchFavoriteCountries } from '../../../services';

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
    const [favoriteCountryCodes, setFavoriteCountryCodes] = useState<string[]>(
        []
    );
    const [defaultCountry, setDefaultCountry] = useState<string | undefined>(
        undefined
    );

    useEffect(() => {
        fetchFavoriteCountries().then((favs: string[]) => {
            setFavoriteCountryCodes(favs);
        });
    }, [setFavoriteCountryCodes]);

    useEffect(() => {
        fetchDefaultCountry().then((countryCode) => {
            if (countryCode) {
                setDefaultCountry(countryCode);
            }
        });
    }, [setDefaultCountry]);

    useEffect(() => {
        // remove favoriteCountryCodes from countryCodes to avoid duplicate keys
        if (favoriteCountryCodes !== undefined) {
            const countryCodesWithoutFavorites = countryCodes.filter(
                (countryCode: string) =>
                    !favoriteCountryCodes.includes(countryCode)
            );
            setAllCountryCodes([
                ...favoriteCountryCodes,
                ...countryCodesWithoutFavorites,
            ]);
        }
    }, [setAllCountryCodes, countryCodes, favoriteCountryCodes]);

    // When we switch to 'in' operator, we need to switch the input value to an array and vice versa
    useConvertValue(props);

    const valid = useValid(props);

    const checkForDefaultValue = useMemo(() => {
        if (defaultCountry !== undefined) {
            if (value === undefined || value === '') {
                return defaultCountry;
            }
            if (Array.isArray(value) && !value.length) {
                return [defaultCountry];
            }
        }
        return value;
    }, [defaultCountry, value]);

    return (
        <Autocomplete
            value={checkForDefaultValue}
            options={allCountryCodes}
            getOptionLabel={(code: string) =>
                code === '' ? '' : translate(code)
            }
            onChange={(event, newValue: any) => handleOnChange(newValue)}
            groupBy={(option: string) => {
                return favoriteCountryCodes.includes(option)
                    ? `fav`
                    : 'not_fav';
            }}
            multiple={Array.isArray(value)}
            fullWidth
            size="small"
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
