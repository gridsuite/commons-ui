import type { Meta, StoryObj } from '@storybook/react-vite';
import { ActivableChip } from '../../src/components/ui/inputs/ActivableChip';

const meta = {
    title: 'UI/Inputs/ActivableChip',
    component: ActivableChip,
    tags: ['autodocs'],
    args: { label: 'Network filter', tooltipMessage: 'Toggle filter', onClick: () => undefined },
} satisfies Meta<typeof ActivableChip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Active: Story = { args: { isActivated: true } };
export const Inactive: Story = { args: { isActivated: false } };
export const Disabled: Story = { args: { isActivated: true, isDisabled: true } };
