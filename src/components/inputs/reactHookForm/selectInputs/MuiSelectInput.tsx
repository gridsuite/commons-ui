/**
 * Copyright (c) 2022, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { FormattedMessage } from 'react-intl';
import { FormControl, FormHelperText, MenuItem, Select, SelectProps } from '@mui/material';
import { useController } from 'react-hook-form';

export type MuiSelectInputProps = SelectProps & {
    name: string;
    options: { id: string; label: string }[] | string[];
    error?: boolean;
    helperText?: string;
};

function renderMenuItem(option: { id: string; label: string } | string) {
    const key = typeof option === 'string' ? option : option.id;
    const value = key;
    const label = typeof option === 'string' ? option : <FormattedMessage id={option.label} />;

    return (
        <MenuItem key={key} value={value}>
            {label}
        </MenuItem>
    );
}

// This input use Mui select instead of Autocomplete which can be needed some time (like in FormControl)
export function MuiSelectInput({ name, options, error, helperText, ...props }: MuiSelectInputProps) {
    const {
        field: { value, onChange },
    } = useController({
        name,
    });

    return (
        <FormControl fullWidth error={error} size={props.size}>
            <Select value={value} onChange={onChange} {...props}>
                {options.map(renderMenuItem)}
            </Select>
            {helperText && <FormHelperText>{helperText}</FormHelperText>}
        </FormControl>
    );
}
