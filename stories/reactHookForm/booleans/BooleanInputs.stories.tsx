import type { PropsWithChildren } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Checkbox, Switch } from '@mui/material';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { CustomFormProvider } from '../../../src/components/ui/reactHookForm/provider/CustomFormProvider';
import { BooleanInput } from '../../../src/components/ui/reactHookForm/booleans/BooleanInput';

function Form({ children }: PropsWithChildren) {
    const methods = useForm({ defaultValues: { enabled: true } });
    return (
        <CustomFormProvider {...methods} validationSchema={yup.object() as any}>
            {children}
        </CustomFormProvider>
    );
}

const meta = {
    title: 'UI/Inputs/ReactHookForm/Boolean/BooleanInputs',
    component: BooleanInput,
    tags: ['autodocs'],
    argTypes: {
        Input: {
            table: {
                disable: true,
            },
        },
    },
    decorators: [
        (Story) => (
            <Form>
                <Story />
            </Form>
        ),
    ],
} satisfies Meta<typeof BooleanInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const CheckboxField: Story = {
    args: { name: 'enabled', Input: Checkbox, label: 'CheckBox' },
    render: (args) => <BooleanInput {...args} />,
};
export const SwitchField: Story = {
    args: { name: 'enabled', Input: Switch, label: 'Switch' },
    render: (args) => <BooleanInput {...args} />,
};
