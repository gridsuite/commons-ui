/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { ValueSelectorProps } from 'react-querybuilder';
import { Box, MenuItem, Select, Theme } from '@mui/material';

export interface OptionWithFav {
    name: string;
    label: string;
    fav: boolean;
}

const styles = {
    favBox: (theme: Theme) => ({
        borderBottom: '1px solid',
        borderColor: theme.palette.divider,
    }),
};

/**
 * ValueSelector which allows to have a few "favorite" options always displayed
 * at the beginning of the selector and separated from the others options
 */
function SelectorWithFavs(props: ValueSelectorProps) {
    const { options, value, handleOnChange } = props;
    let favs: OptionWithFav[] = [];
    let allOthers: OptionWithFav[] = [];
    options.forEach((opt: any) => {
        if (opt.fav) {
            favs = [...favs, opt];
        } else {
            allOthers = [...allOthers, opt];
        }
    });

    return (
        <Select value={value} onChange={(e) => handleOnChange(e.target.value)}>
            {favs.map((opt: OptionWithFav) => (
                <MenuItem key={opt.name} value={opt.name}>
                    {opt.label}
                </MenuItem>
            ))}
            {favs.length > 0 ? <Box sx={styles.favBox} /> : ''}
            {allOthers.map((opt: OptionWithFav) => (
                <MenuItem key={opt.name} value={opt.name}>
                    {opt.label}
                </MenuItem>
            ))}
        </Select>
    );
}

export default SelectorWithFavs;
