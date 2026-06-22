import type { PropsWithChildren } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { RadioInput, CustomFormProvider } from '../../../src';

function Form({ children }: PropsWithChildren) {
    const methods = useForm({ defaultValues: { mode: 'automatic' } });
    return <CustomFormProvider {...methods} validationSchema={yup.object().shape({
        mode: yup.string().required(),
    })}>{children}</CustomFormProvider>;
}

const meta = {
    title: 'UI/ReactHookForm/RadioInput',
    component: RadioInput,
    tags: ['autodocs'],
    args: {
        name: 'mode',
        label: 'Mode',
        options: [{ id: 'automatic', label: 'Automatic' }, { id: 'manual', label: 'Manual' }],
    },
    decorators: [(Story) => <Form><Story /></Form>],
} satisfies Meta<typeof RadioInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Column: Story = { args: { formProps: { row: false } } };
