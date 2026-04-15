/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Box, Button, Stack, Table, TableBody, TableHead, TableRow, Typography } from '@mui/material';
import { TreeViewFinder, TreeViewFinderNodeProps } from '../src/components/treeViewFinder/TreeViewFinder';
import { ElementType } from '../src/utils';
import type { UUID } from 'node:crypto';

const meta: Meta = {
    title: 'Navigation/TreeViewFinder',
    parameters: {
        docs: {
            description: {
                component:
                    '`TreeViewFinder` is a controlled tree dialog that lets the user browse a hierarchical structure (folders/files) and select one or more nodes. Data is passed via the `data` prop; lazy loading is supported via `onTreeBrowse`.',
            },
        },
    },
};

export default meta;

// ─── Static flat list ─────────────────────────────────────────────────────────

const FLAT_DATA: TreeViewFinderNodeProps[] = [
    { id: 'root' as UUID, name: 'Root folder', type: undefined },
    { id: 'a' as UUID, name: 'Study A', type: ElementType.STUDY },
    { id: 'b' as UUID, name: 'Study B', type: ElementType.STUDY },
    { id: 'c' as UUID, name: 'Study C', type: ElementType.STUDY },
];

export const FlatList: StoryObj = {
    name: 'Flat list',
    render: () => {
        const [open, setOpen] = useState(false);
        const [selected, setSelected] = useState<TreeViewFinderNodeProps[]>([]);
        return (
            <Stack spacing={2} alignItems="flex-start">
                <Button variant="outlined" onClick={() => setOpen(true)}>
                    Open finder
                </Button>
                {selected.length > 0 && (
                    <Typography variant="body2">
                        Selected: <strong>{selected.map((n) => n.name).join(', ')}</strong>
                    </Typography>
                )}
                <TreeViewFinder
                    open={open}
                    title="Choose a study"
                    data={FLAT_DATA}
                    onClose={(nodes) => {
                        setSelected(nodes);
                        setOpen(false);
                    }}
                    onlyLeaves
                />
            </Stack>
        );
    },
    parameters: {
        docs: {
            description: {
                story: 'A flat list of selectable nodes. `onlyLeaves` prevents selecting folder-like nodes.',
            },
        },
    },
};

// ─── Nested tree ──────────────────────────────────────────────────────────────

const TREE_DATA: TreeViewFinderNodeProps[] = [
    {
        id: 'dir1' as UUID,
        name: 'Project Alpha',
        type: undefined,
        children: [
            { id: 'dir1-1' as UUID, name: 'Studies', type: undefined, children: [
                { id: 's1' as UUID, name: 'Base case', type: ElementType.STUDY },
                { id: 's2' as UUID, name: 'N-1 case', type: ElementType.STUDY },
            ]},
            { id: 'f1' as UUID, name: 'Case FR.xiidm', type: ElementType.CASE },
        ],
    },
    {
        id: 'dir2' as UUID,
        name: 'Project Beta',
        type: undefined,
        children: [
            { id: 's3' as UUID, name: 'Winter case', type: ElementType.STUDY },
            { id: 's4' as UUID, name: 'Summer case', type: ElementType.STUDY },
        ],
    },
];

export const NestedTree: StoryObj = {
    name: 'Nested tree',
    render: () => {
        const [open, setOpen] = useState(false);
        const [selected, setSelected] = useState<TreeViewFinderNodeProps[]>([]);
        return (
            <Stack spacing={2} alignItems="flex-start">
                <Button variant="outlined" onClick={() => setOpen(true)}>
                    Browse folder tree
                </Button>
                {selected.length > 0 && (
                    <Typography variant="body2">
                        Selected: <strong>{selected.map((n) => n.name).join(', ')}</strong>
                    </Typography>
                )}
                <TreeViewFinder
                    open={open}
                    title="Select a study or case"
                    contentText="Browse the project hierarchy and select a node."
                    data={TREE_DATA}
                    onClose={(nodes) => {
                        setSelected(nodes);
                        setOpen(false);
                    }}
                    defaultExpanded={['dir1', 'dir1-1']}
                />
            </Stack>
        );
    },
    parameters: {
        docs: {
            description: {
                story:
                    'Hierarchical tree with nested folders. `defaultExpanded` pre-opens nodes on render. `children` arrays are loaded all at once (no lazy loading in this demo).',
            },
        },
    },
};

// ─── Multi-select ─────────────────────────────────────────────────────────────

export const MultiSelect: StoryObj = {
    name: 'Multi-select',
    render: () => {
        const [open, setOpen] = useState(false);
        const [selected, setSelected] = useState<TreeViewFinderNodeProps[]>([]);
        return (
            <Stack spacing={2} alignItems="flex-start">
                <Button variant="outlined" onClick={() => setOpen(true)}>
                    Select multiple studies
                </Button>
                {selected.length > 0 && (
                    <Box>
                        <Typography variant="body2" sx={{ mb: 0.5 }}>Selected ({selected.length}):</Typography>
                        {selected.map((n) => (
                            <Typography key={n.id} variant="caption" display="block">
                                • {n.name}
                            </Typography>
                        ))}
                    </Box>
                )}
                <TreeViewFinder
                    open={open}
                    title="Select studies"
                    data={TREE_DATA}
                    multiSelect
                    onClose={(nodes) => {
                        setSelected(nodes);
                        setOpen(false);
                    }}
                    defaultExpanded={['dir1', 'dir1-1', 'dir2']}
                />
            </Stack>
        );
    },
    parameters: {
        docs: {
            description: {
                story: 'When `multiSelect` is true, the user can check multiple nodes before validating.',
            },
        },
    },
};
