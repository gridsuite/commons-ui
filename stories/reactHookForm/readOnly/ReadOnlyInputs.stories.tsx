import type { PropsWithChildren } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { IconButton, Stack } from '@mui/material';
import { ContentCopy } from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { CustomFormProvider } from '../../../src/components/ui/reactHookForm/provider/CustomFormProvider';
import { ReadOnlyInput } from '../../../src/components/ui/reactHookForm/readOnly/ReadOnlyInput';

function Form({ children }: PropsWithChildren) {
    const methods = useForm({ defaultValues: { string: 'Read only string', number: 225 } });
    return (
        <CustomFormProvider
            {...methods}
            validationSchema={yup.object().shape({
                string: yup.string().required(),
                number: yup.number().required(),
            })}
        >
            {children}
        </CustomFormProvider>
    );
}

const meta = {
    title: 'UI/Inputs/ReactHookForm/Text/ReadOnlyInputs',
    component: ReadOnlyInput,
    tags: ['autodocs'],
    decorators: [
        (Story) => (
            <Form>
                <Story />
            </Form>
        ),
    ],
} satisfies Meta<typeof ReadOnlyInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Text: Story = { args: { name: 'string' } };
export const Numerical: Story = { args: { name: 'number', isNumerical: true } };
