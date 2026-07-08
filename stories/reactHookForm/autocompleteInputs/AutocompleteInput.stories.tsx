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
import { CustomFormProvider } from '../../../src/components/ui/reactHookForm/provider/CustomFormProvider';
import { AutocompleteInput } from '../../../src/components/ui/reactHookForm/autocompleteInputs/AutocompleteInput';

const options = [
    { id: 'paris', label: 'Paris' },
    { id: 'lyon', label: 'Lyon' },
    { id: 'nantes', label: 'Nantes' },
];
function Form({ children }: PropsWithChildren) {
    const methods = useForm({ defaultValues: { city: options[0] } });
    return (
        <CustomFormProvider
            {...methods}
            validationSchema={yup.object().shape({
                city: yup.object().required().shape({
                    id: yup.string().required(),
                    label: yup.string().required(),
                }),
            })}
        >
            {children}
        </CustomFormProvider>
    );
}

const meta = {
    title: 'UI/Inputs/ReactHookForm/Selection/AutocompleteInput',
    component: AutocompleteInput,
    tags: ['autodocs'],
    args: {
        name: 'city',
        label: 'City',
        options,
        getOptionLabel: (option) => (typeof option === 'string' ? option : option.label),
    },
    decorators: [
        (Story) => (
            <Form>
                <Story />
            </Form>
        ),
    ],
} satisfies Meta<typeof AutocompleteInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const NoSearch: Story = { args: { readOnly: true } };
export const Disabled: Story = { args: { disabled: true } };
