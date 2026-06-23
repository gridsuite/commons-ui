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
import { SnackbarProvider, DescriptionInput, CustomFormProvider } from '../../../src';

function Form({ children, value }: PropsWithChildren<{ value?: string }>) {
    const methods = useForm({ defaultValues: { description: value } });
    return (
        <SnackbarProvider>
            <CustomFormProvider
                {...methods}
                validationSchema={yup.object().shape({
                    description: yup.string(),
                })}
            >
                {children}
            </CustomFormProvider>
        </SnackbarProvider>
    );
}

const meta = {
    title: 'UI/Inputs/ReactHookForm/Text/DescriptionInput',
    component: DescriptionInput,
    tags: ['autodocs'],
    args: { name: 'description' },
} satisfies Meta<typeof DescriptionInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {
    decorators: [
        (Story) => (
            <Form>
                <Story />
            </Form>
        ),
    ],
};
export const WithDescription: Story = {
    decorators: [
        (Story) => (
            <Form value={'First line\nSecond line\nThird line\nFourth line'}>
                <Story />
            </Form>
        ),
    ],
};
