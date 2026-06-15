import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { CheckboxAutocomplete } from '../../../src/components/ui/inputs/checkbox-autocomplete/checkbox-autocomplete';

const options = ['France', 'Germany', 'Italy', 'Spain', 'Sweden'];

const meta = {
    title: 'UI/Inputs/CheckboxAutocomplete',
    component: CheckboxAutocomplete<string>,
    tags: ['autodocs'],
    args: { options, value: [], getOptionLabel: (option) => option, onChange: () => undefined },
    render: (args) => {
        const [value, setValue] = useState(args.value);
        return <CheckboxAutocomplete {...args} value={value} onChange={setValue} />;
    },
} satisfies Meta<typeof CheckboxAutocomplete<string>>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {};
export const Selected: Story = { args: { value: ['France', 'Spain'] } };
export const Limited: Story = { args: { maxSelection: 2, value: ['France'] } };
