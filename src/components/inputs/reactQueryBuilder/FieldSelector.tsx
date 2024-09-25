/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { FullOption, toFlatOptionArray, ValueSelectorProps } from 'react-querybuilder';
import { Autocomplete, TextField } from '@mui/material';

function FieldSelector(props: Readonly<ValueSelectorProps>) {
    const { options, className, value, disabled, handleOnChange } = props;
    const optionList: FullOption[] = toFlatOptionArray(options);

    return (
        <Autocomplete
            onChange={(event, newValue) => {
                handleOnChange(newValue?.name);
            }}
            value={optionList.find((option) => option.name === value)}
            disabled={disabled}
            className={className}
            options={optionList}
            size="small"
            renderInput={(params) => <TextField {...params} label="" variant="outlined" />}
            getOptionLabel={(option) => option.label}
        />
    );
}
export default FieldSelector;
