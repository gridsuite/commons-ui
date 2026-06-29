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
import { TextInput, CustomFormProvider } from '../../../src';

function Form({ children, value = 'Paris' }: PropsWithChildren<{ value?: string }>) {
    const methods = useForm({ defaultValues: { city: value } });
    return (
        <CustomFormProvider
            {...methods}
            validationSchema={yup.object().shape({
                city: yup.string().required(),
            })}
        >
            {children}
        </CustomFormProvider>
    );
}

const meta = {
    title: 'UI/Inputs/ReactHookForm/Text/TextInput',
    component: TextInput,
    tags: ['autodocs'],
    args: { name: 'city', label: 'City' },
    decorators: [
        (Story) => (
            <Form>
                <Story />
            </Form>
        ),
    ],
} satisfies Meta<typeof TextInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Clearable: Story = { args: { clearable: true } };
export const Disabled: Story = { args: { disabled: true } };
