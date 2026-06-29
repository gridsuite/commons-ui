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
import { MuiSelectInput, CustomFormProvider } from '../../../src';

function Form({ children }: PropsWithChildren) {
    const methods = useForm({ defaultValues: { priority: 'medium' } });
    return (
        <CustomFormProvider {...methods} validationSchema={yup.object() as any}>
            {children}
        </CustomFormProvider>
    );
}

const meta: Meta = {
    title: 'UI/Inputs/ReactHookForm/Selection/MuiSelectInput',
    component: MuiSelectInput,
    tags: ['autodocs'],
    args: { name: 'priority', options: ['low', 'medium', 'high'], fullWidth: true, size: 'small' },
    decorators: [
        (Story) => (
            <Form>
                <Story />
            </Form>
        ),
    ],
};

export default meta;
type Story = StoryObj;

export const Small: Story = {};
export const Medium: Story = { args: { size: 'medium' } };
