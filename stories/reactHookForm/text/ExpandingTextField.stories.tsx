import type { PropsWithChildren } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { ExpandingTextField, CustomFormProvider } from '../../../src';

function Form({
    children,
    text = 'A long description designed to take up significant space in the demo field. It should be long enough to ensure that the content exceeds the visible area and requires scrolling after the expected number of lines.',
}: PropsWithChildren<{ text?: string }>) {
    const methods = useForm({ defaultValues: { description: text } });
    return (
        <CustomFormProvider
            {...methods}
            validationSchema={yup.object().shape({
                description: yup.string().required(text),
            })}
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
        (Story) => (
            <Form>
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
