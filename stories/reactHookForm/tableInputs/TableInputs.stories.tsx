/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import type { PropsWithChildren } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Stack } from '@mui/material';
import { useForm, useFormContext } from 'react-hook-form';
import * as yup from 'yup';
import { TableTextInput, TableNumericalInput, CustomFormProvider } from '../../../src';

function Form({ children }: PropsWithChildren) {
    const methods = useForm({ defaultValues: { label: 'Line A', power: 120 } });
    return (
        <CustomFormProvider {...methods} validationSchema={yup.object() as any}>
            {children}
        </CustomFormProvider>
    );
}

const meta = {
    title: 'UI/Inputs/ReactHookForm/Table/TableInputs',
    component: TableTextInput,
    tags: ['autodocs'],
    decorators: [
        (Story) => (
            <Form>
                <Story />
            </Form>
        ),
    ],
} satisfies Meta<typeof TableTextInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Text: Story = { args: { name: 'label' } };
export const Numerical: Story = {
    args: { name: 'power' },
    render: () => <TableNumericalInput name="power" valueModified adornment={{ text: 'MW' }} />,
};
export const Row: Story = {
    args: { name: 'label' },
    render: () => (
        <Stack direction="row" spacing={1}>
            <TableTextInput name="label" />
            <TableNumericalInput name="power" valueModified />
        </Stack>
    ),
};

function TableTextInputWithErrorStory() {
    const methods = useFormContext();
    const { setError } = methods;
    setError('label', { message: 'Input error' });
    return (
        <Stack direction="row" spacing={1}>
            <TableTextInput name="label" />
            <TableNumericalInput name="power" valueModified />
        </Stack>
    );
}
export const WithError: Story = {
    args: { name: 'label' },
    render: () => <TableTextInputWithErrorStory />,
};
