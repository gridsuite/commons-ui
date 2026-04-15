/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import type { Meta, StoryObj } from '@storybook/react';
import { Box, Paper, Typography } from '@mui/material';
import { ExpandableGroup } from '../src/components/expandableGroup';
import { ResizeHandle } from '../src/components/resizablePanels';
import { Panel, PanelGroup } from 'react-resizable-panels';
import GridSection from '../src/components/grid/grid-section';
import GridItem from '../src/components/grid/grid-item';
import { Grid } from '@mui/material';

// ─── ExpandableGroup ─────────────────────────────────────────────────────────

const meta: Meta<typeof ExpandableGroup> = {
    title: 'Layout/ExpandableGroup',
    component: ExpandableGroup,
    parameters: {
        docs: {
            description: {
                component:
                    'An accordion-based collapsible section. The icon changes when hovering the summary. The header can be a string (i18n key) or any React node.',
            },
        },
    },
};

export default meta;
type Story = StoryObj<typeof ExpandableGroup>;

export const Default: Story = {
    render: () => (
        <Box sx={{ maxWidth: 480 }}>
            <ExpandableGroup renderHeader={<Typography fontWeight="bold">General settings</Typography>}>
                <Box sx={{ p: 2 }}>
                    <Typography variant="body2">Content inside the expandable group goes here.</Typography>
                </Box>
            </ExpandableGroup>
            <ExpandableGroup renderHeader={<Typography fontWeight="bold">Advanced settings</Typography>}>
                <Box sx={{ p: 2 }}>
                    <Typography variant="body2">More advanced settings appear on expand.</Typography>
                </Box>
            </ExpandableGroup>
        </Box>
    ),
};

export const Nested: Story = {
    name: 'Nested groups',
    render: () => (
        <Box sx={{ maxWidth: 480 }}>
            <ExpandableGroup renderHeader={<Typography fontWeight="bold">Parent group</Typography>}>
                <Box sx={{ pl: 2 }}>
                    <ExpandableGroup renderHeader={<Typography>Child group A</Typography>}>
                        <Box sx={{ p: 2 }}>
                            <Typography variant="body2">Nested content A</Typography>
                        </Box>
                    </ExpandableGroup>
                    <ExpandableGroup renderHeader={<Typography>Child group B</Typography>}>
                        <Box sx={{ p: 2 }}>
                            <Typography variant="body2">Nested content B</Typography>
                        </Box>
                    </ExpandableGroup>
                </Box>
            </ExpandableGroup>
        </Box>
    ),
};

// ─── ResizablePanels ─────────────────────────────────────────────────────────

export const ResizablePanelsStory: StoryObj = {
    name: 'ResizablePanels',
    render: () => (
        <Box sx={{ height: 300, border: '1px solid', borderColor: 'divider', borderRadius: 1, overflow: 'hidden' }}>
            <PanelGroup direction="horizontal">
                <Panel defaultSize={40} minSize={20}>
                    <Paper elevation={0} sx={{ height: '100%', p: 2, backgroundColor: 'action.hover' }}>
                        <Typography variant="subtitle2">Left panel</Typography>
                        <Typography variant="body2">Drag the handle to resize.</Typography>
                    </Paper>
                </Panel>
                <ResizeHandle />
                <Panel minSize={20}>
                    <Paper elevation={0} sx={{ height: '100%', p: 2 }}>
                        <Typography variant="subtitle2">Right panel</Typography>
                        <Typography variant="body2">Content area.</Typography>
                    </Paper>
                </Panel>
            </PanelGroup>
        </Box>
    ),
    parameters: {
        docs: {
            description: {
                story: 'A horizontally-resizable panel layout using `react-resizable-panels`. `ResizeHandle` is the custom drag handle provided by the library.',
            },
        },
    },
};

// ─── GridSection + GridItem ──────────────────────────────────────────────────

export const GridSectionStory: StoryObj = {
    name: 'GridSection + GridItem',
    render: () => (
        <Box sx={{ maxWidth: 600 }}>
            <GridSection title="MuiVirtualizedTable/exportCSV" heading={3} />
            <Grid container spacing={2} sx={{ mt: 1 }}>
                <GridItem size={6}>
                    <Paper sx={{ p: 2 }} variant="outlined">
                        <Typography variant="body2">Item spanning 6 columns</Typography>
                    </Paper>
                </GridItem>
                <GridItem size={6} tooltip="This item has a tooltip on hover">
                    <Paper sx={{ p: 2 }} variant="outlined">
                        <Typography variant="body2">Item with tooltip (hover me)</Typography>
                    </Paper>
                </GridItem>
                <GridItem size={12}>
                    <Paper sx={{ p: 2 }} variant="outlined">
                        <Typography variant="body2">Item spanning full width (12 columns)</Typography>
                    </Paper>
                </GridItem>
            </Grid>
        </Box>
    ),
    parameters: {
        docs: {
            description: {
                story:
                    '`GridSection` renders a titled section header. `GridItem` is a helper wrapper around MUI Grid with optional tooltip support.',
            },
        },
    },
};
