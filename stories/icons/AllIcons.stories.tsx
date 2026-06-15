import type { Meta, StoryObj } from '@storybook/react-vite';
import { Stack, SvgIcon } from '@mui/material';
import { ArrowsInputIcon } from '../../src/components/ui/icons/ArrowsInputIcon';
import { ArrowsOutputIcon } from '../../src/components/ui/icons/ArrowsOutputIcon';
import { LeftPanelCloseIcon } from '../../src/components/ui/icons/LeftPanelCloseIcon';
import { LeftPanelOpenIcon } from '../../src/components/ui/icons/LeftPanelOpenIcon';
import { EditNoteIcon } from '../../src';

const meta = {
    component: SvgIcon,
    title: 'UI/Icons',
    tags: ['autodocs'],
    args: { fontSize: 'large' },
    argTypes: {
        fontSize: {
            control: 'select',
            options: ['inherit', 'large', 'medium', 'small'],
        },
    },
} satisfies Meta<typeof SvgIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AllIcons: Story = {
    render: (args) => (
        <Stack direction="row" spacing={2}>
            <LeftPanelOpenIcon fontSize={args.fontSize} />
            <LeftPanelCloseIcon fontSize={args.fontSize} />
            <ArrowsInputIcon fontSize={args.fontSize} />
            <ArrowsOutputIcon fontSize={args.fontSize} />
            <EditNoteIcon fontSize={args.fontSize} empty />
            <EditNoteIcon fontSize={args.fontSize} />
        </Stack>
    ),
};
