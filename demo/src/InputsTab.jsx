/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { Box, Grid } from '@mui/material';
import { useState } from 'react';
import {
    AutocompleteInput,
    TextInput,
    RadioInput,
    SliderInput,
    FloatInput,
    IntegerInput,
    SelectInput,
    CheckboxInput,
    SwitchInput,
    SubmitButton,
    ExpandingTextField,
    CustomFormProvider,
    SelectClearable,
    DirectoryItemsInput,
    ElementType,
} from '../../src';

const AUTOCOMPLETE_INPUT = 'autocomplete';
const TEXT_INPUT = 'text';
const DESCRIPTION_INPUT = 'description';
const SLIDER_INPUT = 'slider';
const SELECT_INPUT = 'select';
const RADIO_INPUT = 'radio';
const INTEGER_INPUT = 'integer';
const FLOAT_INPUT = 'float';
const CHECKBOX_INPUT = 'checkbox';
const SWITCH_INPUT = 'switch';
const DIRECTORY_ITEMS_INPUT = 'directoryItems';

const emptyFormData = {
    [AUTOCOMPLETE_INPUT]: null,
    [TEXT_INPUT]: '',
    [DESCRIPTION_INPUT]: '',
    [SLIDER_INPUT]: null,
    [SELECT_INPUT]: null,
    [RADIO_INPUT]: null,
    [INTEGER_INPUT]: null,
    [FLOAT_INPUT]: null,
    [CHECKBOX_INPUT]: false, // or null, but should then be nullable in schema
    [SWITCH_INPUT]: false, // or null, but should then be nullable in schema
    [DIRECTORY_ITEMS_INPUT]: [],
};

const formSchema = yup.object().shape({
    [AUTOCOMPLETE_INPUT]: yup.string().nullable(),
    [TEXT_INPUT]: yup.string(),
    [DESCRIPTION_INPUT]: yup.string(),
    [SLIDER_INPUT]: yup.number().nullable(),
    [SELECT_INPUT]: yup.string().nullable(),
    [RADIO_INPUT]: yup.string().nullable(),
    [INTEGER_INPUT]: yup.number().nullable(),
    [FLOAT_INPUT]: yup.number().nullable(),
    [CHECKBOX_INPUT]: yup.boolean(),
    [SWITCH_INPUT]: yup.boolean(),
    [DIRECTORY_ITEMS_INPUT]: yup.array().of(yup.object()).default([]),
});

const options = [
    { id: 'kiki', label: 'inputs/kiki' },
    { id: 'ney', label: 'inputs/ney' },
    { id: 'lapulga', label: 'inputs/lapulga' },
    { id: 'ibra', label: 'inputs/ibra' },
];

const basicOptions = ['Kylian Mbappe', 'Neymar', 'Lionel Messi', 'Zlatan Ibrahimovic'];

const gridSize = 4;

const areIdsEqual = (val1, val2) => {
    return val1.id === val2.id;
};

const logWhenValuesChange = false;
const logWhenValidate = true;

function InputsTab() {
    const formMethods = useForm({
        defaultValues: emptyFormData,
        resolver: yupResolver(formSchema),
    });

    const { handleSubmit, watch } = formMethods;

    const formValues = watch();

    if (logWhenValuesChange) {
        console.log('Values of the form : ', formValues);
    }

    function onSubmit(values) {
        if (logWhenValidate) {
            console.log('Values of the form when validate : ', values);
        }
    }

    function onError(errors) {
        console.error('Error during validation : ', errors);
    }

    const [selectValue, setSelectValue] = useState();

    return (
        <CustomFormProvider validationSchema={formSchema} {...formMethods}>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    margin: 4,
                }}
            >
                <Grid container spacing={4}>
                    <Grid item xs={gridSize}>
                        <AutocompleteInput
                            name={AUTOCOMPLETE_INPUT}
                            options={basicOptions}
                            label="inputs/autocomplete"
                            isOptionEqualToValue={areIdsEqual}
                        />
                    </Grid>
                    <Grid item xs={gridSize}>
                        <TextInput name={TEXT_INPUT} label="inputs/text" />
                    </Grid>
                    <Grid item xs={gridSize}>
                        <ExpandingTextField
                            name={DESCRIPTION_INPUT}
                            label="inputs/description"
                            maxCharactersNumber={300}
                            minRows={2}
                            rows={4}
                        />
                    </Grid>
                    <Grid item xs={gridSize}>
                        <SliderInput name={SLIDER_INPUT} label="inputs/slider" min={0.0} max={100.0} step={0.1} />
                    </Grid>
                    <Grid item xs={gridSize}>
                        <SelectInput name={SELECT_INPUT} label="inputs/select" options={options} />
                    </Grid>
                    <Grid item xs={gridSize}>
                        <SelectClearable
                            value={selectValue}
                            onChange={setSelectValue}
                            label="inputs/select"
                            options={options}
                        />
                    </Grid>
                    <Grid item xs={gridSize}>
                        <RadioInput name={RADIO_INPUT} label="inputs/radio" options={options} />
                    </Grid>
                    <Grid item xs={gridSize}>
                        <IntegerInput name={INTEGER_INPUT} label="inputs/integer" />
                    </Grid>
                    <Grid item xs={gridSize}>
                        <FloatInput name={FLOAT_INPUT} label="inputs/float" />
                    </Grid>
                    <Grid item xs={gridSize}>
                        <CheckboxInput name={CHECKBOX_INPUT} label="inputs/checkbox" />
                    </Grid>
                    <Grid item xs={gridSize}>
                        <SwitchInput name={SWITCH_INPUT} label="inputs/switch" />
                    </Grid>
                    <Grid item xs={gridSize}>
                        <DirectoryItemsInput
                            name={DIRECTORY_ITEMS_INPUT}
                            label="inputs/directory-items"
                            titleId="inputs/directory-items"
                            elementType={ElementType.FILTER}
                            allowMultiSelect
                            hideErrorMessage
                            disable
                        />
                    </Grid>
                </Grid>
                <Box
                    sx={{
                        alignSelf: 'center',
                        margin: 5,
                        backgroundColor: 'pink',
                    }}
                >
                    <SubmitButton onClick={handleSubmit(onSubmit, onError)} />
                </Box>
            </Box>
        </CustomFormProvider>
    );
}

export default InputsTab;
