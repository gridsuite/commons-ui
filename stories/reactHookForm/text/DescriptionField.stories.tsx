import type { PropsWithChildren } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { DescriptionField, CustomFormProvider } from '../../../src';

function Form({ children, description }: PropsWithChildren<{ description?: string }>) {
    const methods = useForm({ defaultValues: { description } });
    return (
        <CustomFormProvider
            {...methods}
            validationSchema={yup.object().shape({
                description: yup.string(),
            })}
        >
            {children}
        </CustomFormProvider>
    );
}

const meta = {
    title: 'UI/Inputs/ReactHookForm/Text/DescriptionField',
    component: DescriptionField,
    tags: ['autodocs'],
} satisfies Meta<typeof DescriptionField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {
    decorators: [
        (Story) => (
            <Form>
                <Story />
            </Form>
        ),
    ],
};
export const WithValue: Story = {
    decorators: [
        (Story) => (
            <Form description="Existing study description">
                <Story />
            </Form>
        ),
    ],
};
