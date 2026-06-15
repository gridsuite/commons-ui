import type { Meta, StoryObj } from '@storybook/react-vite';
import { MenuList } from '@mui/material';
import { CustomMenuItem, CustomNestedMenuItem } from '../../src';

const meta = {
    title: 'UI/Menus/CustomNestedMenuItem',
    component: CustomNestedMenuItem,
    tags: ['autodocs'],
    decorators: [
        (Story) => (
            <MenuList>
                <Story />
            </MenuList>
        ),
    ],
    argTypes: {
        children: { control: false },
    },
    render: (args) => (
        <CustomNestedMenuItem label={"SubMenu"} {...args}>
            <CustomMenuItem>CSV</CustomMenuItem>
            <CustomMenuItem>JSON</CustomMenuItem>
        </CustomNestedMenuItem>
    ),
} satisfies Meta<typeof CustomNestedMenuItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const SeveralLevels: Story = {
    decorators: (Story) => (
        <CustomNestedMenuItem label={'SubMenu'}>
            <Story />
            <Story />
        </CustomNestedMenuItem>
    ),
};
export const Disabled: Story = { args: { disabled: true } };
