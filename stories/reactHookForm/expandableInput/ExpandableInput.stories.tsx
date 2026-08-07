/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import type { PropsWithChildren } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Grid, TextField } from '@mui/material';
import { useController, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { CustomFormProvider, ExpandableInput } from '../../../src';

function Row({ name, index }: { name: string; index: number }) {
    const { field } = useController({ name: `${name}.${index}.label` });
    return (
        <Grid size={10}>
            <TextField {...field} size="small" fullWidth />
        </Grid>
    );
}
function Form({ children }: PropsWithChildren) {
    const methods = useForm({ defaultValues: { rows: [{ label: 'First row' }, { label: 'Second row' }] } });
    return (
        <CustomFormProvider
            {...methods}
            validationSchema={yup.object().shape({
                rows: yup
                    .array()
                    .required()
                    .of(yup.object().shape({ label: yup.string().required() })),
            })}
        >
            {children}
        </CustomFormProvider>
    );
}

const meta = {
    title: 'UI/Inputs/ReactHookForm/Table/ExpandableInput',
    component: ExpandableInput,
    tags: ['autodocs'],
    args: { name: 'rows', Field: Row, addButtonLabel: 'Add row', initialValue: { label: 'New row' } },
    decorators: [
        (Story) => (
            <Form>
                <Story />
            </Form>
        ),
    ],
    argTypes: { Field: { control: false } },
} satisfies Meta<typeof ExpandableInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const DisabledAdd: Story = { args: { disabled: true } };
