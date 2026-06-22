import type { PropsWithChildren } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Stack } from '@mui/material';
import { useForm, FormProvider } from 'react-hook-form';
import { SubmitButton, CancelButton } from '../../../src';

function Form({ children, dirty = false }: PropsWithChildren<{ dirty?: boolean }>) {
    const methods = useForm({ defaultValues: { name: '' } });
    if (dirty && !methods.formState.isDirty) {
        methods.setValue('name', 'Changed', { shouldDirty: true });
    }
    return <FormProvider {...methods}>{children}</FormProvider>;
}

const meta = {
    title: 'UI/Inputs/ReactHookForm/Buttons/FormButtons',
    component: SubmitButton,
    tags: ['autodocs'],
    decorators: [(Story) => <Form dirty><Story /></Form>],
} satisfies Meta<typeof SubmitButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Submit: Story = { args: { variant: 'outlined' } };
export const DisabledSubmit: Story = { decorators: [(Story) => <Form><Story /></Form>] };
export const Actions: Story = {
    render: () => <Stack direction="row" spacing={1}><CancelButton /><SubmitButton variant="outlined" /></Stack>,
};
