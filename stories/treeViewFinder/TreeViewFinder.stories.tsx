import type { Meta, StoryObj } from '@storybook/react-vite';
import type { UUID } from 'node:crypto';
import { useState } from 'react';
import { Button } from '@mui/material';
import { TreeViewFinder, TreeViewFinderProps } from '../../src';

const data = [
    {
        id: '00000000-0000-0000-0000-000000000001' as UUID,
        name: 'Projects',
        childrenCount: 2,
        children: [
            { id: '00000000-0000-0000-0000-000000000002' as UUID, name: 'Study A' },
            { id: '00000000-0000-0000-0000-000000000003' as UUID, name: 'Study B' },
        ],
    },
];

function TreeViewFinderStory(args: TreeViewFinderProps) {
    const { open: defaultOpenValue } = args;
    const [isOpen, setIsOpen] = useState(defaultOpenValue);
    return (
        <>
            <Button onClick={() => setIsOpen(true)}>Open dialog</Button>
            <TreeViewFinder {...args} onClose={() => setIsOpen(false)} open={isOpen} />
        </>
    );
}

const meta = {
    title: 'UI/Navigation/TreeViewFinder',
    component: TreeViewFinder,
    tags: ['autodocs'],
    args: { open: false, onClose: () => undefined, data, title: 'Select a study' },
} satisfies Meta<typeof TreeViewFinder>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Dialog: Story = {
    render: (args) => <TreeViewFinderStory {...args} />,
};
export const Inline: Story = { args: { inline: true, open: false, defaultExpanded: [data[0].id] } };
export const MultiSelect: Story = {
    render: (args) => <TreeViewFinderStory {...args} />,
    args: { multiSelect: true, onlyLeaves: true, defaultExpanded: [data[0].id] },
};
