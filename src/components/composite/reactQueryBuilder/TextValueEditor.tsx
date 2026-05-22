/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { ValueEditorProps } from 'react-querybuilder';
import { MaterialValueEditor } from '@react-querybuilder/material';
import { Autocomplete, TextField } from '@mui/material';
import { useIntl } from 'react-intl';
import { useConvertValue } from './hooks/useConvertValue';
import { useValid } from './hooks/useValid';
import { useCustomFilterOptions } from '../../../hooks/useCustomFilterOptions';

export function TextValueEditor(props: ValueEditorProps) {
    useConvertValue(props);

    const valid = useValid(props);

    const { value, handleOnChange, title } = props;
    // The displayed component totally depends on the value type and not the operator. This way, we have smoother transition.
    const customFilterOptions = useCustomFilterOptions();
    const intl = useIntl();

    if (!Array.isArray(value)) {
        return <MaterialValueEditor {...props} />;
    }
    return (
        <Autocomplete
            value={value}
            freeSolo
            options={[]}
            onChange={(event, newValue: any) => handleOnChange(newValue)}
            multiple
            fullWidth
            renderInput={(params) => (
                <TextField
                    {...params}
                    error={!valid}
                    placeholder={value?.length > 0 ? '' : intl.formatMessage({ id: 'valuesList' })}
                />
            )}
            size="small"
            title={title}
            filterOptions={customFilterOptions}
        />
    );
}
