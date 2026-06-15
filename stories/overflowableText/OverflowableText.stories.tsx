import type { Meta, StoryObj } from '@storybook/react-vite';
import { OverflowableText } from '../../src';

const meta = {
    title: 'UI/OverflowableText',
    component: OverflowableText,
    tags: ['autodocs'],
    args: { text: 'A short label -> no tooltip', sx: { width: 220 } },
} satisfies Meta<typeof OverflowableText>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Truncated: Story = {
    args: { text: 'A very long label that cannot fit inside the available width and therefore displays a tooltip' },
};
export const Multiline: Story = {
    args: { text: 'A long description displayed on three lines before it is truncated for compact layouts.', maxLineCount: 3 },
};
