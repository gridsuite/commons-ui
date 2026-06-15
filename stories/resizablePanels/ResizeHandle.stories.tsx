import type { Meta, StoryObj } from '@storybook/react-vite';
import { Box } from '@mui/material';
import { Panel, PanelGroup } from 'react-resizable-panels';
import { ResizeHandle } from '../../src';

const meta = {
    title: 'UI/ResizeHandle',
    component: ResizeHandle,
    tags: ['autodocs'],
    argTypes: {
        visible: {
            type: 'boolean',
        },
        rotated: {
            type: 'boolean',
        },
    },
    render: (args) => (
        <PanelGroup
            direction={args.rotated ? 'vertical' : 'horizontal'}
            style={{ width: 420, height: 180, border: '1px solid black' }}
        >
            <Panel>
                <Box p={2}>First panel</Box>
            </Panel>
            <ResizeHandle {...args} />
            <Panel>
                <Box p={2}>Second panel</Box>
            </Panel>
        </PanelGroup>
    ),
    parameters: {
        docs: {
            description: {
                component: `
Styled component using "react-resizable-panels" PanelResizeHandle.

react-resizable-panels documentation :
https://react-resizable-panels.vercel.app/
`,
            },
        },
    },
} satisfies Meta<typeof ResizeHandle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Vertical: Story = {};
export const Horizontal: Story = { args: { rotated: true } };
