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
import { SelectWithConfirmationInput, CustomFormProvider } from '../../../src';

function Form({ children }: PropsWithChildren<{ value?: string }>) {
    const methods = useForm({ defaultValues: { mode: 'AC' } });
    return (
        <CustomFormProvider
            {...methods}
            validationSchema={yup.object().shape({
                mode: yup.string().required(),
            })}
        >
            {children}
        </CustomFormProvider>
    );
}

const meta = {
    title: 'UI/Inputs/ReactHookForm/Selection/SelectWithConfirmationInput',
    component: SelectWithConfirmationInput,
    tags: ['autodocs'],
    args: { name: 'mode', label: 'Mode', options: ['AC', 'DC'], onValidate: () => undefined },
    decorators: [
        (Story) => (
            <Form>
                <Story />
            </Form>
        ),
    ],
} satisfies Meta<typeof SelectWithConfirmationInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Selected: Story = {};
