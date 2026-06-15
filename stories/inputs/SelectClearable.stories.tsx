import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { SelectClearable } from '../../src/components/ui/inputs/SelectClearable';

const options = [
    { id: 'FR', label: 'France' },
    { id: 'DE', label: 'Germany' },
    { id: 'ES', label: 'Spain' },
];

const meta = {
    title: 'UI/Inputs/SelectClearable',
    component: SelectClearable,
    tags: ['autodocs'],
    args: { options, label: 'Country', value: null, onChange: () => undefined },
    render: (args) => {
        const [value, setValue] = useState(args.value);
        return <SelectClearable {...args} value={value} onChange={setValue} />;
    },
} satisfies Meta<typeof SelectClearable>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {};
export const Selected: Story = { args: { value: 'FR' } };
export const Disabled: Story = { args: { value: 'DE', disabled: true } };
