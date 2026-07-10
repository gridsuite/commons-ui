/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import type { PropsWithChildren } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Box } from '@mui/material';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { SliderInput, CustomFormProvider } from '../../../src';

function Form({ children }: PropsWithChildren) {
    const methods = useForm({ defaultValues: { threshold: 27 } });
    return (
        <CustomFormProvider {...methods} validationSchema={yup.object().shape({ threshold: yup.number().required() })}>
            <Box px={2}>{children}</Box>
        </CustomFormProvider>
    );
}

const meta = {
    title: 'UI/Inputs/ReactHookForm/Number/SliderInput',
    component: SliderInput,
    tags: ['autodocs'],
    args: { name: 'threshold', min: 0, max: 100, valueLabelDisplay: 'auto' },
    decorators: [
        (Story) => (
            <Form>
                <Story />
            </Form>
        ),
    ],
} satisfies Meta<typeof SliderInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const WithMarks: Story = {
    args: {
        marks: [
            { value: 0, label: '0' },
            { value: 50, label: '50' },
            { value: 100, label: '100' },
        ],
    },
};
export const Disabled: Story = { args: { disabled: true } };
