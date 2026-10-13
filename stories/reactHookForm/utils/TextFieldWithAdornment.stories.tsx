/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import type { PropsWithChildren } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { CustomFormProvider, TextFieldWithAdornment } from '../../../src';

function Form({ isReadOnly = false, children }: PropsWithChildren & { isReadOnly: boolean }) {
    const methods = useForm({ defaultValues: {} });
    return (
        <CustomFormProvider
            {...methods}
            validationSchema={yup.object().shape({
                city: yup.string().required(),
            })}
            isReadOnly={isReadOnly}
        >
            {children}
        </CustomFormProvider>
    );
}

const meta = {
    title: 'UI/Inputs/ReactHookForm/Text/TextFieldWithAdornment',
    component: TextFieldWithAdornment,
    tags: ['autodocs'],
    args: { value: 225, label: 'Voltage', adornmentText: 'kV', adornmentPosition: 'end' },
    decorators: [
        (Story, { parameters }) => (
            <Form isReadOnly={parameters.isReadOnly}>
                <Story />
            </Form>
        ),
    ],
} satisfies Meta<typeof TextFieldWithAdornment>;

export default meta;
type Story = StoryObj<typeof meta>;

export const EndAdornment: Story = {};
export const StartAdornment: Story = {
    args: { value: 1200, label: 'Cost', adornmentText: '€', adornmentPosition: 'start' },
};
export const Clearable: Story = { args: { handleClearValue: () => undefined } };
export const EndAdornmentReadOnly: Story = { parameters: { isReadOnly: true } };
export const StartAdornmentReadOnly: Story = {
    args: { value: 1200, label: 'Cost', adornmentText: '€', adornmentPosition: 'start' },
    parameters: { isReadOnly: true },
};
export const ClearableReadOnly: Story = {
    args: { handleClearValue: () => undefined },
    parameters: { isReadOnly: true },
};
