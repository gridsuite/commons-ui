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

function Form({ children, value }: PropsWithChildren<{ value: boolean | null }>) {
    const methods = useForm({ defaultValues: { state: value } });
    return (
        <CustomFormProvider
            {...methods}
            validationSchema={yup.object().shape({ state: yup.boolean().nullable().required() })}
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
} satisfies Meta<typeof CheckboxNullableInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Checked: Story = {
    decorators: [
        (Story) => (
            <Form value>
                <Story />
            </Form>
        ),
    ],
};
export const Unchecked: Story = {
    decorators: [
        (Story) => (
            <Form value={false}>
                <Story />
            </Form>
        ),
    ],
};
export const Indeterminate: Story = {
    decorators: [
        (Story) => (
            <Form value={null}>
                <Story />
            </Form>
        ),
    ],
};
