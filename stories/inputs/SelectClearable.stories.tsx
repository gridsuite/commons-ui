import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { SelectClearable, SelectClearableProps } from '../../src/components/ui/inputs/SelectClearable';

const options = [
    { id: 'FR', label: 'France' },
    { id: 'DE', label: 'Germany' },
    { id: 'ES', label: 'Spain' },
];

function SelectClearableStory(args: SelectClearableProps) {
    const { value: defaultValue } = args;
    const [value, setValue] = useState(defaultValue);
    return <SelectClearable {...args} value={value} onChange={setValue} />;
}

const meta = {
    title: 'UI/Inputs/SelectClearable',
    component: SelectClearable,
    tags: ['autodocs'],
    args: { options, label: 'Country', value: null, onChange: () => undefined },
    render: (args) => <SelectClearableStory {...args} />,
} satisfies Meta<typeof SelectClearable>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {};
export const Selected: Story = { args: { value: 'FR' } };
export const Disabled: Story = { args: { value: 'DE', disabled: true } };
