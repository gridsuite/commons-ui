/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { FullOption, toFlatOptionArray, ValueSelectorProps } from 'react-querybuilder';
import { Autocomplete, TextField } from '@mui/material';

export function FieldSelector({ options, className, value, disabled, handleOnChange }: Readonly<ValueSelectorProps>) {
    const optionList: FullOption[] = toFlatOptionArray(options);

    return (
        <Autocomplete
            onChange={(event, newValue) => {
                if (newValue) {
                    handleOnChange(newValue.name);
                }
            }}
            value={optionList.find((option) => option.name === value)}
            disabled={disabled}
            className={className}
            options={optionList}
            disableClearable
            size="small"
            renderInput={(params) => <TextField {...params} label="" variant="standard" />}
            autoHighlight
            getOptionLabel={(option) => option.label}
        />
    );
}
