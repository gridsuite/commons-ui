/**
 * Copyright (c) 2022, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { FormattedMessage } from 'react-intl';
import { MenuItem, Select, SelectProps } from '@mui/material';
import { useController } from 'react-hook-form';

export type MuiSelectInputProps = SelectProps & {
    name: string;
    options: { id: string; label: string }[];
};

// This input use Mui select instead of Autocomplete which can be needed some time (like in FormControl)
function MuiSelectInput({ name, options, ...props }: MuiSelectInputProps) {
    const {
        field: { value, onChange },
    } = useController({
        name,
    });

    return (
        <Select value={value} onChange={onChange} {...props}>
            {options.map((option) => (
                <MenuItem key={option.id ?? option.label} value={option.id ?? option}>
                    <FormattedMessage id={option.label ?? option} />
                </MenuItem>
            ))}
        </Select>
    );
}

export default MuiSelectInput;
