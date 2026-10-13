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
import { SelectInput, CustomFormProvider } from '../../../src';

const options = [
    { id: 'active', label: 'Active' },
    { id: 'paused', label: 'Paused' },
    { id: 'archived', label: 'Archived' },
];
function Form({ isReadOnly = false, children }: PropsWithChildren<{}> & { isReadOnly: boolean }) {
    const methods = useForm({ defaultValues: { status: 'active' } });
    return (
        <CustomFormProvider
            {...methods}
            validationSchema={yup.object().shape({
                status: yup.string().required(),
            })}
            isReadOnly={isReadOnly}
        >
            {children}
        </CustomFormProvider>
    );
}

const meta = {
    title: 'UI/Inputs/ReactHookForm/Selection/SelectInput',
    component: SelectInput,
    tags: ['autodocs'],
    args: { name: 'status', label: 'Status', options },
    decorators: [
        (Story, { parameters }) => (
            <Form isReadOnly={parameters.isReadOnly}>
                <Story />
            </Form>
        ),
    ],
} satisfies Meta<typeof SelectInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Selected: Story = {};
export const Disabled: Story = { args: { disabled: true } };
export const SelectedReadOnly: Story = { parameters: { isReadOnly: true }};
export const DisabledReadOnly: Story = { args: { disabled: true }, parameters: { isReadOnly: true } };
