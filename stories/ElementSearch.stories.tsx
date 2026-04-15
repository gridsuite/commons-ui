/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import type { Meta, StoryObj } from '@storybook/react';
import { useState, useMemo } from 'react';
import { Box, Button, Chip, Stack, TextField, Typography } from '@mui/material';
import { AutocompleteRenderInputParams } from '@mui/material/Autocomplete';
import { ElementSearchInput, RenderElementProps } from '../src/components/elementSearch/elementSearchInput/ElementSearchInput';
import { ElementSearchDialog } from '../src/components/elementSearch/elementSearchDialog/ElementSearchDialog';

const meta: Meta = {
    title: 'Search/ElementSearch',
    parameters: {
        docs: {
            description: {
                component:
                    'Generic search components. `ElementSearchInput` is a controlled, prop-driven autocomplete. `ElementSearchDialog` wraps it in a dialog. Both are backend-agnostic — data is passed via props.',
            },
        },
    },
};

export default meta;

// ─── Mock dataset ─────────────────────────────────────────────────────────────

type Equipment = { id: string; name: string; type: string; voltage: number };

const ALL_EQUIPMENTS: Equipment[] = [
    { id: 'g1', name: 'Generator GEN1', type: 'Generator', voltage: 400 },
    { id: 'g2', name: 'Generator GEN2', type: 'Generator', voltage: 220 },
    { id: 'l1', name: 'Load LOAD1', type: 'Load', voltage: 400 },
    { id: 'l2', name: 'Load LOAD2', type: 'Load', voltage: 63 },
    { id: 'b1', name: 'Bus BUS1', type: 'Bus', voltage: 400 },
    { id: 't1', name: 'Transformer TR1', type: 'Transformer', voltage: 400 },
];

// ─── ElementSearchInput ───────────────────────────────────────────────────────

function ElementSearchInputDemo() {
    const [searchTerm, setSearchTerm] = useState('');
    const [selected, setSelected] = useState<Equipment | null>(null);
    const [loading, setLoading] = useState(false);

    const results = useMemo(
        () =>
            ALL_EQUIPMENTS.filter(
                (e) =>
                    searchTerm.length >= 2 &&
                    (e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        e.type.toLowerCase().includes(searchTerm.toLowerCase()))
            ),
        [searchTerm]
    );

    const handleSearchTermChange = (term: string) => {
        setSearchTerm(term);
        setLoading(true);
        setTimeout(() => setLoading(false), 300);
    };

    return (
        <Box sx={{ maxWidth: 480 }}>
            <Typography variant="body2" sx={{ mb: 1 }}>
                Type at least 2 characters to search (e.g. "gen", "load", "bus")
            </Typography>
            <ElementSearchInput<Equipment>
                searchTerm={searchTerm}
                onSearchTermChange={handleSearchTermChange}
                onSelectionChange={(eq) => setSelected(eq)}
                getOptionLabel={(eq) => eq.name}
                isOptionEqualToValue={(a, b) => a.id === b.id}
                elementsFound={results}
                loading={loading}
                showResults={searchTerm.length >= 2}
                renderElement={({ element, inputValue, ...props }: RenderElementProps<Equipment>) => (
                    <li {...props} key={element.id}>
                        <Stack>
                            <Typography variant="body2">{element.name}</Typography>
                            <Typography variant="caption" color="text.secondary">
                                {element.type} — {element.voltage} kV
                            </Typography>
                        </Stack>
                    </li>
                )}
                renderInput={(term, params: AutocompleteRenderInputParams) => (
                    <TextField {...params} label="Search equipment" size="small" />
                )}
            />
            {selected && (
                <Box sx={{ mt: 2 }}>
                    <Typography variant="body2">
                        Selected: <strong>{selected.name}</strong> ({selected.type}, {selected.voltage} kV)
                    </Typography>
                </Box>
            )}
        </Box>
    );
}

export const InputStory: StoryObj = {
    name: 'ElementSearchInput',
    render: () => <ElementSearchInputDemo />,
    parameters: {
        docs: {
            description: {
                story:
                    '`ElementSearchInput` is a generic search autocomplete. Results are filtered client-side here for demo purposes; in production, results come from a backend call triggered by `onSearchTermChange`.',
            },
        },
    },
};

// ─── ElementSearchDialog ──────────────────────────────────────────────────────

function ElementSearchDialogDemo() {
    const [open, setOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selected, setSelected] = useState<Equipment | null>(null);

    const results = useMemo(
        () =>
            ALL_EQUIPMENTS.filter(
                (e) =>
                    searchTerm.length >= 2 &&
                    (e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        e.type.toLowerCase().includes(searchTerm.toLowerCase()))
            ),
        [searchTerm]
    );

    return (
        <Stack spacing={2} alignItems="flex-start">
            <Button variant="outlined" onClick={() => setOpen(true)}>
                Open search dialog
            </Button>
            {selected && (
                <Chip
                    label={`${selected.name} (${selected.type})`}
                    onDelete={() => setSelected(null)}
                    size="small"
                />
            )}
            <ElementSearchDialog<Equipment>
                open={open}
                onClose={() => setOpen(false)}
                searchTerm={searchTerm}
                onSearchTermChange={setSearchTerm}
                onSelectionChange={(eq) => {
                    setSelected(eq);
                    setOpen(false);
                    setSearchTerm('');
                }}
                getOptionLabel={(eq) => eq.name}
                isOptionEqualToValue={(a, b) => a.id === b.id}
                elementsFound={results}
                showResults={searchTerm.length >= 2}
                renderElement={({ element, ...props }: RenderElementProps<Equipment>) => (
                    <li {...props} key={element.id}>
                        <Stack>
                            <Typography variant="body2">{element.name}</Typography>
                            <Typography variant="caption" color="text.secondary">
                                {element.type} — {element.voltage} kV
                            </Typography>
                        </Stack>
                    </li>
                )}
                renderInput={(term, params: AutocompleteRenderInputParams) => (
                    <TextField {...params} autoFocus label="Search equipment" size="small" />
                )}
            />
        </Stack>
    );
}

export const DialogStory: StoryObj = {
    name: 'ElementSearchDialog',
    render: () => <ElementSearchDialogDemo />,
    parameters: {
        docs: {
            description: {
                story:
                    '`ElementSearchDialog` wraps `ElementSearchInput` in a fullWidth MUI `Dialog`. It resets the search term when the dialog closes.',
            },
        },
    },
};
