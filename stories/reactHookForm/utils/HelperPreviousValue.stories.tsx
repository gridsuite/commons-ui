import type { Meta, StoryObj } from '@storybook/react-vite';
import type { PropsWithChildren } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { CustomFormProvider, TextInput } from '../../../src';
import { HelperPreviousValue } from '../../../src/components/ui/reactHookForm/utils/HelperPreviousValue';

function Form({ children, value = 'Paris' }: PropsWithChildren<{ value?: string }>) {
    const methods = useForm({ defaultValues: { city: value } });
    return (
        <CustomFormProvider
            {...methods}
            validationSchema={yup.object().shape({
                city: yup.string().required(),
            })}
        >
            {children}
        </CustomFormProvider>
    );
}
const meta = {
    title: 'UI/Inputs/ReactHookForm/Utils/HelperPreviousValue',
    component: HelperPreviousValue,
    tags: ['autodocs'],
    args: { previousValue: 220, adornmentText: 'kV' },
} satisfies Meta<typeof HelperPreviousValue>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WarningLastBuiltNode: Story = {};
export const BuiltNode: Story = { args: { isNodeBuilt: true } };
export const TextOnly: Story = { args: { disabledTooltip: true } };
export const WithComponent: Story = {
    render: () => (
        <Form>
            <TextInput name="city" previousValue="Londres" />
        </Form>
    ),
};
