/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { ValueEditorProps } from 'react-querybuilder';
import { useCallback, useMemo } from 'react';
import { MaterialValueEditor } from '@react-querybuilder/material';
import { useParameterState } from '../../hooks/useParameterState';
import { Autocomplete, TextField } from '@mui/material';
import useConvertValue from './use-convert-value';
import useValid from './use-valid';
import {
    PARAM_LANGUAGE,
    getComputedLanguage,
} from '../rhf-inputs/select-inputs/countries-input';

interface OwnProps {
    paramGlobalState: unknown;
    updateParam: (param: unknown) => Promise<unknown>;
}

const CountryValueEditor = (props: ValueEditorProps & OwnProps) => {
    const [languageLocal] = useParameterState(
        PARAM_LANGUAGE,
        props.paramGlobalState,
        props.updateParam
    );
    const countriesListCB = useCallback(() => {
        try {
            return require('localized-countries')(
                require('localized-countries/data/' +
                    getComputedLanguage(languageLocal as string).substr(0, 2))
            );
        } catch (error) {
            // fallback to English if no localized list is found
            return require('localized-countries')(
                require('localized-countries/data/en')
            );
        }
    }, [languageLocal]);

    const countriesList = useMemo(
        () =>
            Object.keys(countriesListCB().object()).map((country) => {
                return { name: country, label: countriesListCB().get(country) };
            }),
        [countriesListCB]
    );

    const countriesListAutocomplete = useMemo(
        () => countriesListCB(),
        [countriesListCB]
    );

    // When we switch to 'in' operator, we need to switch the input value to an array and vice versa
    useConvertValue(props);

    const valid = useValid(props);

    // The displayed component totally depends on the value type and not the operator. This way, we have smoother transition.
    if (!Array.isArray(props.value)) {
        return (
            <MaterialValueEditor
                {...props}
                values={countriesList}
                title={undefined} // disable the tooltip
            />
        );
    } else {
        return (
            <Autocomplete
                value={props.value}
                options={Object.keys(countriesListAutocomplete.object())}
                getOptionLabel={(code: string) =>
                    countriesListAutocomplete.get(code)
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
export default CountryValueEditor;
