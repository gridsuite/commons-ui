/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { ValueEditorProps } from 'react-querybuilder';
import { Autocomplete, Box, TextField, Theme } from '@mui/material';
import { useEffect, useState } from 'react';
import useConvertValue from './use-convert-value';
import useValid from './use-valid';

const styles = {
    favBox: (theme: Theme) => ({
        borderBottom: '1px solid',
        borderColor: theme.palette.divider,
    }),
};

type AutocompleteWithFavoritesProps = ValueEditorProps & {
    standardOptions: string[];
    favorites: string[];
    getOptionLabel: any;
};

/**
 * ValueSelector which allows to have a few "favorite" options always displayed
 * at the beginning of the selector and separated from the others options
 */
function AutocompleteWithFavorites(props: AutocompleteWithFavoritesProps) {
    const {
        favorites,
        standardOptions,
        getOptionLabel,
        handleOnChange,
        value,
    } = props;
    const [allOptions, setAllOptions] = useState(standardOptions);

    // When we switch to 'in' operator, we need to switch the input value to an array and vice versa
    useConvertValue(props);

    const valid = useValid(props);

    useEffect(() => {
        // remove favoriteCountryCodes from countryCodes to avoid duplicate keys
        if (favorites !== undefined) {
            const countryCodesWithoutFavorites = standardOptions.filter(
                (countryCode: string) => !favorites.includes(countryCode)
            );
            setAllOptions([...favorites, ...countryCodesWithoutFavorites]);
        }
    }, [setAllOptions, standardOptions, favorites]);

    return (
        <Autocomplete
            value={value}
            options={allOptions}
            onChange={(event, newValue: any) => {
                handleOnChange(newValue);
            }}
            groupBy={(option: string) => {
                return favorites.includes(option) ? `fav` : 'not_fav';
            }}
            multiple={Array.isArray(value)}
            getOptionLabel={getOptionLabel}
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

export default AutocompleteWithFavorites;
