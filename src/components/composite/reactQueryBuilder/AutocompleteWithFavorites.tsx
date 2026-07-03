/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Autocomplete, type AutocompleteProps, Box, TextField } from '@mui/material';
import { useMemo } from 'react';
import type { MuiStyles } from '../../../utils/styles';

const styles = {
    favBox: (theme) => ({
        borderBottom: '1px solid',
        borderColor: theme.palette.divider,
    }),
} as const satisfies MuiStyles;

interface AutocompleteWithFavoritesProps<Value> extends Omit<
    AutocompleteProps<Value, boolean, false, boolean>,
    'multiple' | 'renderInput' | 'renderGroup' | 'groupBy'
> {
    favorites: Value[];
    valid: boolean;
}

/**
 * Autocomplete component which allows to have a few "favorite" options always displayed
 * at the beginning of the selector and separated from the others options
 */
export function AutocompleteWithFavorites<Value>({
    favorites,
    valid,
    options,
    value,
    ...otherProps
}: AutocompleteWithFavoritesProps<Value>) {
    const optionsWithFavorites = useMemo(() => {
        if (favorites) {
            // remove favorites from standardOptions to avoid duplicate keys
            const optionsWithoutFavorites = options.filter((option: Value) => !favorites.includes(option));
            return [...favorites, ...optionsWithoutFavorites];
        }
        return options;
    }, [options, favorites]);

    return (
        <Autocomplete
            size="small"
            value={value}
            options={optionsWithFavorites}
            // avoid warning in console MUI: The value provided to Autocomplete is invalid.
            isOptionEqualToValue={(option, val) => option === val || val === ''}
            {...otherProps}
            /* props should not be overridden */
            groupBy={(option: Value) => (favorites.includes(option) ? `fav` : 'not_fav')}
            multiple={Array.isArray(value)}
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
