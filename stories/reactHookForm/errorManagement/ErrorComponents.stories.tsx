import type { Meta, StoryObj } from '@storybook/react-vite';
import { MidFormError, FieldErrorAlert } from '../../../src';

const meta = {
    title: 'UI/Inputs/ReactHookForm/Text/ErrorComponents',
    component: FieldErrorAlert,
    tags: ['autodocs'],
    args: { message: 'The submitted value is invalid.' },
} satisfies Meta<typeof FieldErrorAlert>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Alert: Story = {};
export const Inline: Story = { render: () => <MidFormError message="At least one item is required." /> };
