import type { PropsWithChildren } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { EnumInput, CustomFormProvider } from '../../../src';

function Form({ children }: PropsWithChildren) {
    const methods = useForm({ defaultValues: { level: 'medium' } });
    return <CustomFormProvider {...methods} validationSchema={yup.object().shape({
        level: yup.string().required(),
    })}>{children}</CustomFormProvider>;
}

const meta = {
    title: 'UI/ReactHookForm/EnumInput',
    component: EnumInput,
    tags: ['autodocs'],
    args: {
        name: 'level',
        label: 'Level',
        size: 'small',
        labelValues: {},
        options: [{ id: 'low', label: 'Low' }, { id: 'medium', label: 'Medium' }, { id: 'high', label: 'High' }],
    },
    decorators: [(Story) => <Form><Story /></Form>],
} satisfies Meta<typeof EnumInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Small: Story = {};
export const Medium: Story = { args: { size: 'medium' } };
