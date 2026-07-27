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
import { MultipleAutocompleteInput, CustomFormProvider } from '../../../src';

const options = ['Paris', 'Lyon', 'Nantes'];
function Form({ children }: PropsWithChildren) {
    const methods = useForm({ defaultValues: { cities: [options[0], options[1]] } });
    return (
        <CustomFormProvider
            {...methods}
            validationSchema={yup.object().shape({
                cities: yup.array().required().of(yup.string().required()),
            })}
        >
            {children}
        </CustomFormProvider>
    );
}

const meta = {
    title: 'UI/Inputs/ReactHookForm/Selection/MultipleAutocompleteInput',
    component: MultipleAutocompleteInput,
    tags: ['autodocs'],
    args: { name: 'cities', label: 'Cities', options },
} satisfies Meta<typeof MultipleAutocompleteInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithValues: Story = {
    decorators: [
        (Story) => (
            <Form>
                <Story />
            </Form>
        ),
    ],
};
