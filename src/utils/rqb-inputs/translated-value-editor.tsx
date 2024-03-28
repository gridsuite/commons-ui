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
import useConvertValue from './use-convert-value';
import { Autocomplete, TextField } from '@mui/material';
import useValid from './use-valid';

const TranslatedValueEditor = (props: ValueEditorProps) => {
    const intl = useIntl();

    const translatedValues = useMemo(() => {
        return props.values?.map((v) => {
            return {
                name: v.name,
                label: intl.formatMessage({ id: v.label }),
            };
        });
    }, [intl, props.values]);

    const translatedValuesAutocomplete = useMemo(() => {
        if (!props.values) {
            return {};
        }
        return Object.fromEntries(
            props.values.map((v) => [
                v.name,
                intl.formatMessage({ id: v.label }),
            ])
        );
    }, [intl, props.values]);

    useConvertValue(props);

    const valid = useValid(props);

    // The displayed component totally depends on the value type and not the operator. This way, we have smoother transition.
    if (!Array.isArray(props.value)) {
        return (
            <MaterialValueEditor
                {...props}
                values={translatedValues}
                title={undefined} // disable the tooltip
            />
        );
    } else {
        return (
            <Autocomplete
                value={props.value}
                options={Object.keys(translatedValuesAutocomplete)}
                getOptionLabel={(code: string) =>
                    translatedValuesAutocomplete[code]
                }
                onChange={(event, value: any) => props.handleOnChange(value)}
                multiple
                fullWidth
                renderInput={(params) => (
                    <TextField {...params} error={!valid} />
                )}
            />
        );
    }
};
export default TranslatedValueEditor;
