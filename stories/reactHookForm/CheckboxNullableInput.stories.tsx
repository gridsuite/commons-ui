import type { PropsWithChildren } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { CustomFormProvider } from '../../src/components/ui/reactHookForm/provider/CustomFormProvider';
import { CheckboxNullableInput } from '../../src/components/ui/reactHookForm/CheckboxNullableInput';

function Form({ children, value }: PropsWithChildren<{ value: boolean | null }>) {
    const methods = useForm({ defaultValues: { state: value } });
    return <CustomFormProvider {...methods} validationSchema={yup.object().shape({state: yup.boolean().nullable().required()})}>{children}</CustomFormProvider>;
}

const meta = {
    title: 'UI/ReactHookForm/CheckboxNullableInput',
    component: CheckboxNullableInput,
    tags: ['autodocs'],
    args: { name: 'state', label: 'Nullable state' },
} satisfies Meta<typeof CheckboxNullableInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Checked: Story = { decorators: [(Story) => <Form value><Story /></Form>] };
export const Unchecked: Story = { decorators: [(Story) => <Form value={false}><Story /></Form>] };
export const Indeterminate: Story = { decorators: [(Story) => <Form value={null}><Story /></Form>] };
