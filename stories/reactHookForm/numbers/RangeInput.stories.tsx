import type { PropsWithChildren } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { DEFAULT_RANGE_VALUE, getRangeInputSchema, RangeInput, CustomFormProvider } from '../../../src';

function Form({ children}: PropsWithChildren<{}>) {
    const methods = useForm({
        defaultValues: {
            limits: DEFAULT_RANGE_VALUE,
        },
    });
    return (
        <CustomFormProvider {...methods} validationSchema={yup.object().shape({ ...getRangeInputSchema('limits') })}>
            {children}
        </CustomFormProvider>
    );
}

const meta = {
    title: 'UI/ReactHookForm/RangeInput',
    component: RangeInput,
    tags: ['autodocs'],
    args: { name: 'limits', label: 'Limits' },
} satisfies Meta<typeof RangeInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { decorators: [(Story) => <Form><Story /></Form>] };
