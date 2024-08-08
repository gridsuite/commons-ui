/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { ValueEditorProps } from 'react-querybuilder';
import { MaterialValueEditor } from '@react-querybuilder/material';
import { Autocomplete, TextField } from '@mui/material';
import useConvertValue from './use-convert-value';
import useValid from './use-valid';

function TextValueEditor(props: ValueEditorProps) {
    useConvertValue(props);

    const valid = useValid(props);

    const { value, handleOnChange } = props;
    // The displayed component totally depends on the value type and not the operator. This way, we have smoother transition.
    if (!Array.isArray(value)) {
        return (
            <MaterialValueEditor
                {...props}
                title={undefined} // disable the tooltip
            />
        );
    }
    return (
        <Autocomplete
            value={value}
            freeSolo
            options={[]}
            onChange={(event, newValue: any) => handleOnChange(newValue)}
            multiple
            fullWidth
            renderInput={(params) => <TextField {...params} error={!valid} />}
            size="small"
        />
    );
}
export default TextValueEditor;
