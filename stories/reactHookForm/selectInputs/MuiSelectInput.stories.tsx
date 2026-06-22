import type { PropsWithChildren } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { CustomFormProvider } from '../../../src/components/ui/reactHookForm/provider/CustomFormProvider';
import { MuiSelectInput } from '../../../src/components/ui/reactHookForm/selectInputs/MuiSelectInput';

function Form({ children }: PropsWithChildren) {
    const methods = useForm({ defaultValues: { priority: 'medium' } });
    return <CustomFormProvider {...methods} validationSchema={yup.object() as any}>{children}</CustomFormProvider>;
}

const meta: Meta = {
    title: 'UI/ReactHookForm/MuiSelectInput',
    component: MuiSelectInput,
    tags: ['autodocs'],
    args: { name: 'priority', options: ['low', 'medium', 'high'], fullWidth: true, size: 'small' },
    decorators: [(Story) => <Form><Story /></Form>],
};

export default meta;
type Story = StoryObj;

export const Small: Story = {};
export const Medium: Story = { args: { size: 'medium' } };
