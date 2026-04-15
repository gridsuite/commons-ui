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
