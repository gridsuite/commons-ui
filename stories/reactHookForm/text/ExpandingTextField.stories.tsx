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
import { ExpandingTextField, CustomFormProvider } from '../../../src';

function Form({
    isReadOnly = false,
    children,
    text = 'A long description designed to take up significant space in the demo field. It should be long enough to ensure that the content exceeds the visible area and requires scrolling after the expected number of lines.',
}: PropsWithChildren<{ text?: string }> & { isReadOnly: boolean }) {
    const methods = useForm({ defaultValues: { description: text } });
    return (
        <CustomFormProvider
            {...methods}
            validationSchema={yup.object().shape({
                description: yup.string().required(),
            })}
            isReadOnly={isReadOnly}
        >
            {children}
        </CustomFormProvider>
    );
}

const meta = {
    title: 'UI/Inputs/ReactHookForm/Text/ExpandingTextField',
    component: ExpandingTextField,
    tags: ['autodocs'],
    args: { name: 'description', label: 'Description' },
    decorators: [
        (Story, { parameters }) => (
            <Form isReadOnly={parameters.isReadOnly}>
                <Story />
            </Form>
        ),
    ],
} satisfies Meta<typeof ExpandingTextField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Compact: Story = { args: { minRows: 1, rows: 2, maxCharactersNumber: 120 } };
export const Disabled: Story = { args: { disabled: true } };
export const ReadOnly: Story = { parameters: { isReadOnly: true } };
