import type { Meta, StoryObj } from '@storybook/react-vite';
import { TextFieldWithAdornment } from '../../../src';

const meta = {
    title: 'UI/Inputs/ReactHookForm/Text/TextFieldWithAdornment',
    component: TextFieldWithAdornment,
    tags: ['autodocs'],
    args: { value: 225, label: 'Voltage', adornmentText: 'kV', adornmentPosition: 'end' },
} satisfies Meta<typeof TextFieldWithAdornment>;

export default meta;
type Story = StoryObj<typeof meta>;

export const EndAdornment: Story = {};
export const StartAdornment: Story = {
    args: { value: 1200, label: 'Cost', adornmentText: '€', adornmentPosition: 'start' },
};
export const Clearable: Story = { args: { handleClearValue: () => undefined } };
