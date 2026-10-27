/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import type { PropsWithChildren } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Checkbox, Switch } from '@mui/material';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { CustomFormProvider } from '../../../src/components/ui/reactHookForm/provider/CustomFormProvider';
import { BooleanInput } from '../../../src/components/ui/reactHookForm/booleans/BooleanInput';

function Form({ isReadOnly = false, children }: PropsWithChildren & { isReadOnly: boolean }) {
    const methods = useForm({ defaultValues: { enabled: true } });
    return (
        <CustomFormProvider {...methods} validationSchema={yup.object() as any} isReadOnly={isReadOnly}>
            {children}
        </CustomFormProvider>
    );
}

const meta = {
    title: 'UI/Inputs/ReactHookForm/Boolean/BooleanInputs',
    component: BooleanInput,
    tags: ['autodocs'],
    argTypes: {
        Input: {
            table: {
                disable: true,
            },
        },
    },
    decorators: [
        (Story, { parameters }) => (
            <Form isReadOnly={parameters.isReadOnly}>
                <Story />
            </Form>
        ),
    ],
} satisfies Meta<typeof BooleanInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const CheckboxField: Story = {
    args: { name: 'enabled', Input: Checkbox, label: 'CheckBox' },
    render: (args) => <BooleanInput {...args} />,
};
export const SwitchField: Story = {
    args: { name: 'enabled', Input: Switch, label: 'Switch' },
    render: (args) => <BooleanInput {...args} />,
};
export const CheckboxFieldReadOnly: Story = {
    args: { name: 'enabled', Input: Checkbox, label: 'CheckBox' },
    parameters: { isReadOnly: true },
    render: (args) => <BooleanInput {...args} />,
};
export const SwitchFieldReadOnly: Story = {
    args: { name: 'enabled', Input: Switch, label: 'Switch' },
    parameters: { isReadOnly: true },
    render: (args) => <BooleanInput {...args} />,
};
