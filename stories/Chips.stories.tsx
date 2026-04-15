/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Button, Stack, Typography } from '@mui/material';
import { BuildStatusChip } from '../src/components/node/build-status-chip';
import { BuildStatus } from '../src/components/node/constant';
import { ActivableChip } from '../src/components/inputs/ActivableChip';
import { OverflowableChipWithHelperText } from '../src/components/inputs/reactHookForm/OverflowableChipWithHelperText';

// ─── BuildStatusChip ─────────────────────────────────────────────────────────

const buildStatusMeta: Meta<typeof BuildStatusChip> = {
    title: 'Chips/BuildStatusChip',
    component: BuildStatusChip,
    parameters: {
        docs: {
            description: {
                component:
                    'A small chip indicating the build status of a node. Colors are driven by the MUI theme (`theme.node.buildStatus`).',
            },
        },
    },
    argTypes: {
        buildStatus: {
            control: 'select',
            options: Object.values(BuildStatus),
        },
    },
};

export default buildStatusMeta;
type BuildStatusStory = StoryObj<typeof BuildStatusChip>;

export const AllStatuses: BuildStatusStory = {
    name: 'All build statuses',
    render: () => (
        <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
            {Object.values(BuildStatus).map((status) => (
                <BuildStatusChip key={status} buildStatus={status} />
            ))}
        </Stack>
    ),
};

export const SingleStatus: BuildStatusStory = {
    name: 'Interactive (controls)',
    args: {
        buildStatus: BuildStatus.BUILT,
    },
};

// ─── ActivableChip ───────────────────────────────────────────────────────────

export const ActivableChipStory: StoryObj = {
    name: 'ActivableChip',
    render: () => {
        const [active, setActive] = useState(true);
        return (
            <Stack spacing={2}>
                <Typography variant="body2">Click the chip to toggle its state.</Typography>
                <Stack direction="row" spacing={2}>
                    <ActivableChip
                        isActivated={active}
                        label="Auto mode"
                        tooltipMessage={active ? 'Click to deactivate' : 'Click to activate'}
                        onClick={() => setActive((v) => !v)}
                    />
                    <ActivableChip
                        isActivated={false}
                        label="Disabled"
                        tooltipMessage="This chip is disabled"
                        onClick={() => {}}
                        isDisabled
                    />
                </Stack>
            </Stack>
        );
    },
    parameters: {
        docs: {
            description: {
                story: 'A toggleable chip with an icon indicating its active/inactive state. Shows a tooltip on hover.',
            },
        },
    },
};

// ─── OverflowableChipWithHelperText ──────────────────────────────────────────

export const OverflowableChipStory: StoryObj = {
    name: 'OverflowableChipWithHelperText',
    render: () => (
        <Stack spacing={2} sx={{ maxWidth: 200 }}>
            <OverflowableChipWithHelperText label="Short label" />
            <OverflowableChipWithHelperText
                label="Very long label that will overflow"
                helperText="Helper text shown below"
                onDelete={() => {}}
            />
        </Stack>
    ),
    parameters: {
        docs: {
            description: {
                story: 'A chip that truncates its label with an ellipsis and a tooltip when the label overflows.',
            },
        },
    },
};
