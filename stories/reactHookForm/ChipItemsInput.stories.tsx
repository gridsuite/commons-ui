import type { PropsWithChildren } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { SnackbarProvider, ChipItemsInput, CustomFormProvider } from '../../src';

function Form({ children, items }: PropsWithChildren<{ items: string[] }>) {
    const methods = useForm({ defaultValues: { tags: items } });
    return <SnackbarProvider>
        <CustomFormProvider {...methods} validationSchema={yup.object().shape({tags: yup.array().required().of(yup.string().required())})}>{children}</CustomFormProvider>
    </SnackbarProvider>;
}

const meta = {
    title: 'UI/Inputs/ReactHookForm/Selection/ChipItemsInput',
    component: ChipItemsInput,
    tags: ['autodocs'],
    args: { name: 'tags', label: 'Tags' },
    argTypes: {
        name: {
            table: {
                disable: true
            }
        },
    },
} satisfies Meta<typeof ChipItemsInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = { decorators: [(Story) => <Form items={[]}><Story /></Form>] };
export const WithItems: Story = { decorators: [(Story) => <Form items={['production', 'network', 'validated']}><Story /></Form>] };
