/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Box, Button, Stack, Typography } from '@mui/material';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { CustomFormProvider } from '../src/components/inputs/reactHookForm/provider/CustomFormProvider';
import { TextInput } from '../src/components/inputs/reactHookForm/text/TextInput';
import { SelectInput } from '../src/components/inputs/reactHookForm/selectInputs/SelectInput';
import { SelectClearable } from '../src/components/inputs/SelectClearable';
import { ActivableChip } from '../src/components/inputs/ActivableChip';
import { CheckboxInput } from '../src/components/inputs/reactHookForm/booleans/CheckboxInput';
import { SwitchInput } from '../src/components/inputs/reactHookForm/booleans/SwitchInput';
import { RadioInput } from '../src/components/inputs/reactHookForm/booleans/RadioInput';
import { FloatInput } from '../src/components/inputs/reactHookForm/numbers/FloatInput';
import { IntegerInput } from '../src/components/inputs/reactHookForm/numbers/IntegerInput';
import { SliderInput } from '../src/components/inputs/reactHookForm/numbers/SliderInput';
import { RangeInput, DEFAULT_RANGE_VALUE, getRangeInputSchema } from '../src/components/inputs/reactHookForm/numbers/RangeInput';
import { AutocompleteInput } from '../src/components/inputs/reactHookForm/autocompleteInputs/AutocompleteInput';
import { MultipleAutocompleteInput } from '../src/components/inputs/reactHookForm/autocompleteInputs/MultipleAutocompleteInput';
import { OverflowableChip } from '../src/components/inputs/reactHookForm/OverflowableChip';

// ─── Shared form wrapper helper ──────────────────────────────────────────────

function FormWrapper({ schema, defaultValues, children }: { schema: any; defaultValues: any; children: any }) {
    const methods = useForm({ resolver: yupResolver(schema), defaultValues });
    const [submitted, setSubmitted] = useState<Record<string, unknown> | null>(null);
    return (
        <CustomFormProvider {...methods} validationSchema={schema}>
            <Box
                component="form"
                onSubmit={methods.handleSubmit((data) => setSubmitted(data))}
                sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxWidth: 360 }}
            >
                {children}
                <Button type="submit" variant="contained" size="small">
                    Submit
                </Button>
                {submitted && (
                    <Box sx={{ mt: 1, p: 1, bgcolor: 'action.hover', borderRadius: 1 }}>
                        <Typography variant="caption" component="pre">
                            {JSON.stringify(submitted, null, 2)}
                        </Typography>
                    </Box>
                )}
            </Box>
        </CustomFormProvider>
    );
}

// ─── TextInput ───────────────────────────────────────────────────────────────

const textSchema = yup.object({ name: yup.string().required(), description: yup.string() });

const meta: Meta = {
    title: 'Inputs/Form Inputs',
    parameters: {
        docs: {
            description: {
                component:
                    'React Hook Form–based input components. They must be rendered inside a `CustomFormProvider`. Each component reads and writes values through `react-hook-form` via `useController`.',
            },
        },
    },
};
export default meta;

export const TextInputStory: StoryObj = {
    name: 'TextInput',
    render: () => (
        <FormWrapper schema={textSchema} defaultValues={{ name: '', description: '' }}>
            <TextInput name="name" label="inputs/name" />
            <TextInput name="description" label="inputs/description" clearable />
        </FormWrapper>
    ),
    parameters: {
        docs: {
            description: {
                story:
                    '`TextInput` wraps MUI `TextField` and integrates with react-hook-form. Supports adornments, clearable buttons, and optional labels.',
            },
        },
    },
};

// ─── SelectInput ─────────────────────────────────────────────────────────────

const selectSchema = yup.object({ country: yup.string().nullable() });
const countryOptions = [
    { id: 'fr', label: 'France' },
    { id: 'de', label: 'Germany' },
    { id: 'gb', label: 'United Kingdom' },
];

export const SelectInputStory: StoryObj = {
    name: 'SelectInput',
    render: () => (
        <FormWrapper schema={selectSchema} defaultValues={{ country: null }}>
            <SelectInput name="country" label="inputs/country" options={countryOptions} />
        </FormWrapper>
    ),
    parameters: {
        docs: {
            description: {
                story: '`SelectInput` is a searchable autocomplete backed by react-hook-form. Options can have i18n label keys.',
            },
        },
    },
};

// ─── SelectClearable ─────────────────────────────────────────────────────────

const selectClearableOptions = [
    { id: 'option1', label: 'Option 1' },
    { id: 'option2', label: 'Option 2' },
    { id: 'option3', label: 'Option 3' },
];

export const SelectClearableStory: StoryObj = {
    name: 'SelectClearable',
    render: () => {
        const [value, setValue] = useState<string | null>('option1');
        return (
            <Box sx={{ maxWidth: 320 }}>
                <SelectClearable
                    label="inputs/country"
                    value={value}
                    onChange={setValue}
                    options={selectClearableOptions}
                />
                <Typography variant="caption" sx={{ mt: 1, display: 'block' }}>
                    Selected: {value ?? 'none'}
                </Typography>
            </Box>
        );
    },
    parameters: {
        docs: {
            description: {
                story:
                    '`SelectClearable` is a standalone (non-RHF) autocomplete that shows a clearable read-only select. Values are option IDs; labels can be i18n keys.',
            },
        },
    },
};

// ─── ActivableChip ───────────────────────────────────────────────────────────

export const ActivableChipInputStory: StoryObj = {
    name: 'ActivableChip',
    render: () => {
        const [active, setActive] = useState(true);
        return (
            <Stack spacing={2}>
                <ActivableChip
                    isActivated={active}
                    label="Auto calculation"
                    tooltipMessage={active ? 'Click to disable' : 'Click to enable'}
                    onClick={() => setActive((v) => !v)}
                />
                <ActivableChip
                    isActivated={false}
                    label="Disabled chip"
                    tooltipMessage="Cannot be toggled"
                    onClick={() => {}}
                    isDisabled
                />
            </Stack>
        );
    },
    parameters: {
        docs: {
            description: {
                story: 'A toggleable chip with a visual indicator (checkmark / cross icon) and tooltip.',
            },
        },
    },
};

// ─── Boolean inputs ───────────────────────────────────────────────────────────

const boolSchema = yup.object({
    agreeTerms: yup.boolean().required(),
    notifications: yup.boolean().required(),
    severity: yup.string().required(),
});

export const BooleanInputsStory: StoryObj = {
    name: 'Boolean inputs (Checkbox, Switch, Radio)',
    render: () => (
        <FormWrapper schema={boolSchema} defaultValues={{ agreeTerms: false, notifications: true, severity: 'warning' }}>
            <CheckboxInput name="agreeTerms" label="inputs/agreeTerms" />
            <SwitchInput name="notifications" label="inputs/notifications" />
            <RadioInput
                name="severity"
                label="inputs/severity"
                options={[
                    { id: 'info', label: 'Info' },
                    { id: 'warning', label: 'Warning' },
                    { id: 'error', label: 'Error' },
                ]}
            />
        </FormWrapper>
    ),
    parameters: {
        docs: {
            description: {
                story:
                    '`CheckboxInput` and `SwitchInput` wrap MUI controls via `BooleanInput`. `RadioInput` provides a labeled radio group. All are RHF-controlled.',
            },
        },
    },
};

// ─── Numeric inputs ───────────────────────────────────────────────────────────

const numericSchema = yup.object({
    voltage: yup.number().nullable(),
    iterations: yup.number().nullable(),
    tolerance: yup.number().nullable(),
    range: getRangeInputSchema('range'),
});

export const NumericInputsStory: StoryObj = {
    name: 'Numeric inputs (Float, Integer, Slider, Range)',
    render: () => (
        <FormWrapper
            schema={numericSchema}
            defaultValues={{ voltage: 400.0, iterations: 30, tolerance: 50, range: DEFAULT_RANGE_VALUE }}
        >
            <FloatInput name="voltage" label="inputs/voltage" adornment={{ position: 'end', text: 'kV' }} />
            <IntegerInput name="iterations" label="inputs/maxIterations" />
            <Box sx={{ px: 1 }}>
                <Typography variant="caption" color="text.secondary">Tolerance (%)</Typography>
                <SliderInput name="tolerance" min={0} max={100} step={1} valueLabelDisplay="auto" />
            </Box>
            <RangeInput name="range" label="inputs/voltageRange" />
        </FormWrapper>
    ),
    parameters: {
        docs: {
            description: {
                story:
                    '`FloatInput` and `IntegerInput` extend `TextInput` with numeric constraints. `SliderInput` is a MUI Slider controlled via RHF. `RangeInput` captures a min/max numeric range.',
            },
        },
    },
};

// ─── Autocomplete inputs ──────────────────────────────────────────────────────

const EQUIPMENT_OPTIONS = [
    { id: 'generator', label: 'Generator' },
    { id: 'load', label: 'Load' },
    { id: 'transformer', label: 'Transformer' },
    { id: 'bus', label: 'Bus' },
    { id: 'line', label: 'Line' },
];

const autocompleteSchema = yup.object({
    equipmentType: yup.object().nullable(),
    selectedTypes: yup.array(),
});

export const AutocompleteInputsStory: StoryObj = {
    name: 'Autocomplete inputs (single & multiple)',
    render: () => (
        <FormWrapper schema={autocompleteSchema} defaultValues={{ equipmentType: null, selectedTypes: [] }}>
            <AutocompleteInput name="equipmentType" label="inputs/equipmentType" options={EQUIPMENT_OPTIONS} />
            <MultipleAutocompleteInput name="selectedTypes" label="inputs/equipmentTypes" options={EQUIPMENT_OPTIONS} />
        </FormWrapper>
    ),
    parameters: {
        docs: {
            description: {
                story:
                    '`AutocompleteInput` wraps MUI `Autocomplete` for single selection. `MultipleAutocompleteInput` supports multi-selection with chip display. Both integrate with `react-hook-form`.',
            },
        },
    },
};

// ─── OverflowableChip ─────────────────────────────────────────────────────────

export const OverflowableChipStory: StoryObj = {
    name: 'OverflowableChip',
    render: () => (
        <Stack spacing={2} sx={{ maxWidth: 300 }}>
            <Typography variant="caption" color="text.secondary">
                Text truncates with a tooltip when it exceeds 20 characters
            </Typography>
            <OverflowableChip label="Short label" color="primary" />
            <OverflowableChip label="A very long label that will overflow and show a tooltip" color="secondary" />
            <OverflowableChip label="Deletable chip example" onDelete={() => {}} />
        </Stack>
    ),
    parameters: {
        docs: {
            description: {
                story:
                    '`OverflowableChip` is a MUI Chip that truncates its label with `OverflowableText` when it exceeds ~20 characters. It is standalone — no RHF context required.',
            },
        },
    },
};
