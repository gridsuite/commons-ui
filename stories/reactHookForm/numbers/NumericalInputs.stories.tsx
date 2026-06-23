import type { PropsWithChildren } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { CustomFormProvider } from '../../../src/components/ui/reactHookForm/provider/CustomFormProvider';
import { FloatInput } from '../../../src/components/ui/reactHookForm/numbers/FloatInput';
import { IntegerInput } from '../../../src/components/ui/reactHookForm/numbers/IntegerInput';

function Form({ children }: PropsWithChildren) {
    const methods = useForm({ defaultValues: { voltage: 225.5, count: 12 } });
    return (
        <CustomFormProvider
            {...methods}
            validationSchema={yup.object().shape({
                voltage: yup.number().required(),
                count: yup.number().required(),
            })}
        >
            {children}
        </CustomFormProvider>
    );
}

const meta = {
    title: 'UI/Inputs/ReactHookForm/Number/NumericalInputs',
    component: FloatInput,
    tags: ['autodocs'],
    decorators: [
        (Story) => (
            <Form>
                <Story />
            </Form>
        ),
    ],
} satisfies Meta<typeof FloatInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Float: Story = { args: { name: 'voltage', label: 'Voltage', adornment: { position: 'end', text: 'kV' } } };
export const Integer: Story = {
    args: { name: 'count' },
    render: () => <IntegerInput name="count" label="Number of elements" />,
};
export const Clearable: Story = {
    args: { clearable: true, name: 'voltage', label: 'Voltage', adornment: { position: 'end', text: 'kV' } },
};
