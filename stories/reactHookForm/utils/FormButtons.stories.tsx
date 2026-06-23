/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { PropsWithChildren, useEffect } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Stack } from '@mui/material';
import { useForm, FormProvider } from 'react-hook-form';
import { SubmitButton, CancelButton } from '../../../src';

function Form({ children, shouldSetIsDirty = false }: PropsWithChildren<{ shouldSetIsDirty?: boolean }>) {
    const methods = useForm({ defaultValues: { name: '' } });
    useEffect(() => {
        if (shouldSetIsDirty && !methods.formState.isDirty) {
            methods.setValue('name', 'Changed', { shouldDirty: true });
        }
    }, [methods, shouldSetIsDirty]);
    return <FormProvider {...methods}>{children}</FormProvider>;
}

const meta = {
    title: 'UI/Inputs/ReactHookForm/Buttons/FormButtons',
    component: SubmitButton,
    tags: ['autodocs'],
    decorators: [
        (Story) => (
            <Form shouldSetIsDirty>
                <Story />
            </Form>
        ),
    ],
} satisfies Meta<typeof SubmitButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Submit: Story = { args: { variant: 'outlined' } };
export const DisabledSubmit: Story = {
    decorators: [
        (Story) => (
            <Form>
                <Story />
            </Form>
        ),
    ],
};
export const Actions: Story = {
    render: () => (
        <Stack direction="row" spacing={1}>
            <CancelButton />
            <SubmitButton variant="outlined" />
        </Stack>
    ),
};
