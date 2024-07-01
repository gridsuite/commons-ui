/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { ValueEditorProps } from 'react-querybuilder';
import { MaterialValueEditor } from '@react-querybuilder/material';
import { Autocomplete, TextField } from '@mui/material';
import { useMemo } from 'react';
import useConvertValue from './use-convert-value';
import useValid from './use-valid';
import { useLocalizedCountries } from '../../../hooks/localized-countries-hook';
import useCustomFormContext from '../react-hook-form/provider/use-custom-form-context';

function CountryValueEditor(props: ValueEditorProps) {
    const { language } = useCustomFormContext();
    const { translate, countryCodes } = useLocalizedCountries(language);
    const { value, handleOnChange } = props;

    const countriesList = useMemo(
        () =>
            countryCodes.map((country: string) => {
                return { name: country, label: translate(country) };
            }),
        [countryCodes, translate]
    );
    // When we switch to 'in' operator, we need to switch the input value to an array and vice versa
    useConvertValue(props);

    const valid = useValid(props);

    // The displayed component totally depends on the value type and not the operator. This way, we have smoother transition.
    if (!Array.isArray(value)) {
        return (
            <MaterialValueEditor
                {...props}
                values={countriesList}
                title={undefined} // disable the tooltip
            />
        );
    }
    return (
        <Autocomplete
            value={value}
            options={countryCodes}
            getOptionLabel={(code: string) => translate(code)}
            onChange={(event, newValue: any) => handleOnChange(newValue)}
            multiple
            fullWidth
            renderInput={(params) => <TextField {...params} error={!valid} />}
        />
    );
}
export default CountryValueEditor;
