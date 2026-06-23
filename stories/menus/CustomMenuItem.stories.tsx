import type { Meta, StoryObj } from '@storybook/react-vite';
import { MenuList } from '@mui/material';
import { CustomMenuItem } from '../../src';

const meta = {
    title: 'UI/ContextMenu/CustomMenuItem',
    component: CustomMenuItem,
    tags: ['autodocs'],
    args: { children: 'Open study' },
    decorators: [
        (Story) => (
            <MenuList>
                <Story />
            </MenuList>
        ),
    ],
} satisfies Meta<typeof CustomMenuItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Selected: Story = { args: { selected: true } };
export const Disabled: Story = { args: { disabled: true } };
