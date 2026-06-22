import type { Meta, StoryObj } from '@storybook/react-vite';
import { FieldLabel } from '../../../src/components/ui/reactHookForm/utils/FieldLabel';

const meta = {
    title: 'UI/Inputs/ReactHookForm/Text/FieldLabel',
    component: FieldLabel,
    tags: ['autodocs'],
    args: { label: 'Voltage' },
} satisfies Meta<typeof FieldLabel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Required: Story = {};
export const Optional: Story = { args: { optional: true } };
