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
import { DEFAULT_RANGE_VALUE, getRangeInputSchema, RangeInput, CustomFormProvider } from '../../../src';

function Form({ isReadOnly = false, children }: PropsWithChildren<{}> & { isReadOnly: boolean }) {
    const methods = useForm({
        defaultValues: {
            limits: DEFAULT_RANGE_VALUE,
        },
    });
    return (
        <CustomFormProvider
            {...methods}
            validationSchema={yup.object().shape({ ...getRangeInputSchema('limits') })}
            isReadOnly={isReadOnly}
        >
            {children}
        </CustomFormProvider>
    );
}

const meta = {
    title: 'UI/Inputs/ReactHookForm/Number/RangeInput',
    component: RangeInput,
    tags: ['autodocs'],
    args: { name: 'limits', label: 'Limits' },
    decorators: [
        (Story, { parameters }) => (
            <Form isReadOnly={parameters.isReadOnly}>
                <Story />
            </Form>
        ),
    ],
} satisfies Meta<typeof RangeInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const ReadOnly: Story = { parameters: { isReadOnly: true } };
