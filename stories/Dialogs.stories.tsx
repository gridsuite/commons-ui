/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Box, Button, Stack, Typography } from '@mui/material';
import { MultipleSelectionDialog } from '../src/components/multipleSelectionDialog';

type ColumnItem = { id: string; label: string };

const COLUMNS: ColumnItem[] = [
    { id: 'name', label: 'Name' },
    { id: 'voltage', label: 'Voltage (kV)' },
    { id: 'power', label: 'Active power (MW)' },
    { id: 'current', label: 'Current (A)' },
    { id: 'angle', label: 'Angle (°)' },
    { id: 'status', label: 'Status' },
];

const meta: Meta = {
    title: 'Dialogs/MultipleSelectionDialog',
    parameters: {
        docs: {
            description: {
                component:
                    'A dialog wrapping a `CheckBoxList` that lets the user select multiple items from a list. Includes Cancel and Validate actions.',
            },
        },
    },
};

export default meta;

export const Default: StoryObj = {
    name: 'Column visibility picker',
    render: () => {
        const [open, setOpen] = useState(false);
        const [selected, setSelected] = useState<ColumnItem[]>(COLUMNS.slice(0, 3));

        return (
            <Stack spacing={2}>
                <Button variant="outlined" onClick={() => setOpen(true)}>
                    Choose visible columns
                </Button>
                <Typography variant="body2">Visible: {selected.map((c) => c.label).join(', ') || 'none'}</Typography>
                <MultipleSelectionDialog<ColumnItem>
                    open={open}
                    titleId="Choose columns to display"
                    items={COLUMNS}
                    selectedItems={selected}
                    getItemId={(item) => item.id}
                    getItemLabel={(item) => item.label}
                    handleClose={() => setOpen(false)}
                    handleValidate={(items) => {
                        setSelected(items);
                        setOpen(false);
                    }}
                    addSelectAllCheckbox
                />
            </Stack>
        );
    },
};

export const OpenByDefault: StoryObj = {
    name: 'Dialog open (static preview)',
    render: () => (
        <Box sx={{ height: 500, position: 'relative' }}>
            <MultipleSelectionDialog<ColumnItem>
                open
                titleId="Select columns"
                items={COLUMNS}
                selectedItems={COLUMNS.slice(0, 2)}
                getItemId={(item) => item.id}
                getItemLabel={(item) => item.label}
                handleClose={() => {}}
                handleValidate={() => {}}
            />
        </Box>
    ),
};
