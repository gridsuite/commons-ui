/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Box, Button, ListItemText, Menu, MenuItem, Typography } from '@mui/material';
import { CheckBoxList } from '../src/components/checkBoxList';
import { CustomNestedMenuItem } from '../src/components/menus/custom-nested-menu';

// ─── CheckBoxList ─────────────────────────────────────────────────────────────

type Item = { id: string; label: string };
const ITEMS: Item[] = [
    { id: '1', label: 'Voltage level' },
    { id: '2', label: 'Active power' },
    { id: '3', label: 'Reactive power' },
    { id: '4', label: 'Current' },
    { id: '5', label: 'Angle' },
];

const meta: Meta = {
    title: 'Data/CheckBoxList',
    parameters: {
        docs: {
            description: {
                component:
                    'A list of checkboxes with optional drag-and-drop reordering. Built on top of MUI List and `@hello-pangea/dnd`.',
            },
        },
    },
};
export default meta;

export const BasicCheckBoxList: StoryObj = {
    name: 'CheckBoxList – basic',
    render: () => {
        const [checked, setChecked] = useState<string[]>(['1', '3']);
        const toggle = (id: string) =>
            setChecked((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));

        return (
            <Box sx={{ maxWidth: 320 }}>
                <CheckBoxList<Item>
                    items={ITEMS}
                    selectedItems={ITEMS.filter((i) => checked.includes(i.id))}
                    onSelectionChange={(items) => setChecked(items.map((i) => i.id))}
                    getItemId={(item) => item.id}
                    getItemLabel={(item) => item.label}
                    addSelectAllCheckbox
                />
                <Typography variant="caption" sx={{ mt: 1, display: 'block' }}>
                    Selected: {checked.join(', ') || 'none'}
                </Typography>
            </Box>
        );
    },
};

export const DraggableCheckBoxList: StoryObj = {
    name: 'CheckBoxList – drag & drop',
    render: () => {
        const [items, setItems] = useState<Item[]>(ITEMS);
        const [checked, setChecked] = useState<string[]>(['2']);

        const handleDragEnd = (result: any) => {
            if (!result.destination) return;
            const reordered = Array.from(items);
            const [removed] = reordered.splice(result.source.index, 1);
            reordered.splice(result.destination.index, 0, removed);
            setItems(reordered);
        };

        return (
            <Box sx={{ maxWidth: 320 }}>
                <Typography variant="caption" sx={{ mb: 1, display: 'block' }}>
                    Drag rows to reorder
                </Typography>
                <CheckBoxList<Item>
                    items={items}
                    selectedItems={items.filter((i) => checked.includes(i.id))}
                    onSelectionChange={(sel) => setChecked(sel.map((i) => i.id))}
                    getItemId={(item) => item.id}
                    getItemLabel={(item) => item.label}
                    isDndActive
                    onDragEnd={handleDragEnd}
                />
            </Box>
        );
    },
};

// ─── CustomNestedMenuItem ─────────────────────────────────────────────────────

export const NestedMenuStory: StoryObj = {
    name: 'CustomNestedMenuItem',
    render: () => {
        const [anchor, setAnchor] = useState<null | HTMLElement>(null);

        return (
            <Box>
                <Button variant="outlined" onClick={(e) => setAnchor(e.currentTarget)}>
                    Open context menu
                </Button>
                <Menu open={Boolean(anchor)} anchorEl={anchor} onClose={() => setAnchor(null)}>
                    <MenuItem onClick={() => setAnchor(null)}>
                        <ListItemText>Edit</ListItemText>
                    </MenuItem>
                    <CustomNestedMenuItem label="Export">
                        <MenuItem onClick={() => setAnchor(null)}>
                            <ListItemText>As CSV</ListItemText>
                        </MenuItem>
                        <MenuItem onClick={() => setAnchor(null)}>
                            <ListItemText>As JSON</ListItemText>
                        </MenuItem>
                    </CustomNestedMenuItem>
                    <MenuItem onClick={() => setAnchor(null)}>
                        <ListItemText>Delete</ListItemText>
                    </MenuItem>
                </Menu>
            </Box>
        );
    },
    parameters: {
        docs: {
            description: {
                story:
                    '`CustomNestedMenuItem` extends `mui-nested-menu` with smart positioning (flips left when there is not enough space on the right) and hover highlight styles.',
            },
        },
    },
};
