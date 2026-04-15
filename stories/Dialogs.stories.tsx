/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Box, Button, Stack, Typography } from '@mui/material';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { MultipleSelectionDialog } from '../src/components/multipleSelectionDialog';
import { PopupConfirmationDialog } from '../src/components/dialogs/popupConfirmationDialog/PopupConfirmationDialog';
import { CustomMuiDialog } from '../src/components/dialogs/customMuiDialog/CustomMuiDialog';
import { TextInput } from '../src/components/inputs/reactHookForm/text/TextInput';
import { DescriptionModificationDialog } from '../src/components/dialogs/descriptionModificationDialog/DescriptionModificationDialog';

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

// ─── MultipleSelectionDialog ──────────────────────────────────────────────────

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

// ─── PopupConfirmationDialog ──────────────────────────────────────────────────

export const PopupConfirmationDialogStory: StoryObj = {
    name: 'PopupConfirmationDialog',
    render: () => {
        const [open, setOpen] = useState(false);
        const [confirmed, setConfirmed] = useState(false);
        return (
            <Stack spacing={2} alignItems="flex-start">
                <Button variant="outlined" color="error" onClick={() => setOpen(true)}>
                    Delete element
                </Button>
                {confirmed && <Typography color="success.main">Deletion confirmed!</Typography>}
                <PopupConfirmationDialog
                    message="deleteEquipment"
                    openConfirmationPopup={open}
                    setOpenConfirmationPopup={setOpen}
                    handlePopupConfirmation={() => {
                        setOpen(false);
                        setConfirmed(true);
                    }}
                />
            </Stack>
        );
    },
    parameters: {
        docs: {
            description: {
                story:
                    'A lightweight confirmation dialog with Cancel and Validate actions. The `message` prop is a translation key shown as the dialog body.',
            },
        },
    },
};

// ─── CustomMuiDialog ──────────────────────────────────────────────────────────

const customDialogSchema = yup.object({ label: yup.string().required() });

function CustomMuiDialogDemo() {
    const [open, setOpen] = useState(false);
    const [saved, setSaved] = useState<string | null>(null);
    const methods = useForm({
        defaultValues: { label: '' },
        resolver: yupResolver(customDialogSchema),
    });
    return (
        <Stack spacing={2} alignItems="flex-start">
            <Button variant="outlined" onClick={() => setOpen(true)}>
                Open dialog
            </Button>
            {saved && (
                <Typography variant="body2">
                    Saved label: <strong>{saved}</strong>
                </Typography>
            )}
            <CustomMuiDialog
                open={open}
                onClose={() => {
                    setOpen(false);
                    methods.reset();
                }}
                onSave={(data) => {
                    setSaved(data.label);
                }}
                formContext={{ ...methods, validationSchema: customDialogSchema }}
                titleId="inputs/name"
            >
                <Box sx={{ pt: 1 }}>
                    <TextInput name="label" label="inputs/name" />
                </Box>
            </CustomMuiDialog>
        </Stack>
    );
}

export const CustomMuiDialogStory: StoryObj = {
    name: 'CustomMuiDialog',
    render: () => <CustomMuiDialogDemo />,
    parameters: {
        docs: {
            description: {
                story:
                    'A dialog that wraps `CustomFormProvider` and provides Save / Cancel buttons with built-in form submission. The `formContext` prop is the merged result of `useForm()` + validation schema.',
            },
        },
    },
};

// ─── DescriptionModificationDialog ───────────────────────────────────────────

function DescriptionModificationDialogDemo() {
    const [open, setOpen] = useState(false);
    const [description, setDescription] = useState('Initial description text.');
    return (
        <Stack spacing={2} alignItems="flex-start">
            <Button variant="outlined" onClick={() => setOpen(true)}>
                Edit description
            </Button>
            <Typography variant="body2">
                Current description: <em>{description || '(empty)'}</em>
            </Typography>
            <DescriptionModificationDialog
                open={open}
                description={description}
                onClose={() => setOpen(false)}
                updateForm={(data) => {
                    setDescription(data.description ?? '');
                    setOpen(false);
                }}
            />
        </Stack>
    );
}

export const DescriptionModificationDialogStory: StoryObj = {
    name: 'DescriptionModificationDialog',
    render: () => <DescriptionModificationDialogDemo />,
    parameters: {
        docs: {
            description: {
                story:
                    'A dialog for editing a textual description. Provides `updateElement` for async backend updates and `updateForm` for local state updates.',
            },
        },
    },
};
