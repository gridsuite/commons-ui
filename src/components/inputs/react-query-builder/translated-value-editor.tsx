/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { ValueEditorProps } from 'react-querybuilder';
import { useMemo } from 'react';
import { MaterialValueEditor } from '@react-querybuilder/material';
import { useIntl } from 'react-intl';
import { Autocomplete, TextField } from '@mui/material';
import useConvertValue from './use-convert-value';
import useValid from './use-valid';

function TranslatedValueEditor(props: ValueEditorProps) {
    const intl = useIntl();
    const { values, value, handleOnChange } = props;

    const translatedValues = useMemo(() => {
        return values?.map((v) => {
            return {
                name: v.name,
                label: intl.formatMessage({ id: v.label }),
            };
        });
    }, [intl, values]);

    const translatedValuesAutocomplete = useMemo(() => {
        if (!values) {
            return {};
        }
        return Object.fromEntries(values.map((v) => [v.name, intl.formatMessage({ id: v.label })]));
    }, [intl, values]);

    useConvertValue(props);

    const valid = useValid(props);

    // The displayed component totally depends on the value type and not the operator. This way, we have smoother transition.
    if (!Array.isArray(value)) {
        return (
            <MaterialValueEditor
                {...props}
                values={translatedValues}
                title={undefined} // disable the tooltip
            />
        );
    }
    return (
        <Autocomplete
            value={value}
            options={Object.keys(translatedValuesAutocomplete)}
            getOptionLabel={(code: string) => translatedValuesAutocomplete[code]}
            onChange={(event, newValue: any) => handleOnChange(newValue)}
            multiple
            fullWidth
            renderInput={(params) => <TextField {...params} error={!valid} />}
        />
    );
}
export default TranslatedValueEditor;
