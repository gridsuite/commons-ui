import type { Meta, StoryObj } from '@storybook/react-vite';
import { OverflowableChip } from '../../src/components/ui/reactHookForm/OverflowableChip';
import { OverflowableChipWithHelperText } from '../../src';

const meta = {
    title: 'UI/ReactHookForm/OverflowableChip',
    component: OverflowableChip,
    tags: ['autodocs'],
    args: { label: 'A compact chip label' },
} satisfies Meta<typeof OverflowableChip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const LongLabel: Story = { args: { label: 'A very long equipment name that must be truncated in the chip' } };
export const Deletable: Story = { args: { onDelete: () => undefined } };
export const WithHelperText: Story = { render: (args) => <OverflowableChipWithHelperText helperText={"Helper text"} {...args}/>}