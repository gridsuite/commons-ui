/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import type { PropsWithChildren } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { CheckboxNullableInput, CustomFormProvider } from '../../src';

function Form({
    isReadOnly = false,
    children,
    value,
}: PropsWithChildren<{ value: boolean | null }> & { isReadOnly: boolean }) {
    const methods = useForm({ defaultValues: { state: value } });
    return (
        <CustomFormProvider
            {...methods}
            validationSchema={yup.object().shape({ state: yup.boolean().nullable().required() })}
            isReadOnly={isReadOnly}
        >
            {children}
        </CustomFormProvider>
    );
}

const meta = {
    title: 'UI/Inputs/ReactHookForm/Boolean/CheckboxNullableInput',
    component: CheckboxNullableInput,
    tags: ['autodocs'],
    args: { name: 'state', label: 'Nullable state' },
    decorators: [
        (Story, { parameters }) => (
            <Form isReadOnly={parameters.isReadOnly} value={parameters.value}>
                <Story />
            </Form>
        ),
    ],
} satisfies Meta<typeof CheckboxNullableInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Checked: Story = {
    parameters: { value: true },
};
export const Unchecked: Story = {
    parameters: { value: false },
};
export const Indeterminate: Story = {
    parameters: { value: null },
};

export const CheckedReadOnly: Story = {
    parameters: { isReadOnly: true, value: true },
};
export const UncheckedReadOnly: Story = {
    parameters: { isReadOnly: true, value: false },
};
export const IndeterminateReadOnly: Story = {
    parameters: { isReadOnly: true, value: null },
};
