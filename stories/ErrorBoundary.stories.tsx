/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Box, Button, Stack, Typography } from '@mui/material';
import { CardErrorBoundary } from '../src/components/cardErrorBoundary/CardErrorBoundary';

const meta: Meta = {
    title: 'Feedback/CardErrorBoundary',
    parameters: {
        docs: {
            description: {
                component:
                    'A React class error boundary that catches render errors in its children and displays a recoverable error card. The user can reload or expand the card to see the error message.',
            },
        },
    },
};

export default meta;

// ─── Normal rendering (no error) ─────────────────────────────────────────────

export const Normal: StoryObj = {
    name: 'Normal (no error)',
    render: () => (
        <CardErrorBoundary>
            <Box sx={{ p: 2, bgcolor: 'action.hover', borderRadius: 1 }}>
                <Typography>This content renders normally — no error occurs.</Typography>
            </Box>
        </CardErrorBoundary>
    ),
};

// ─── Triggered error state ────────────────────────────────────────────────────

function BrokenComponent() {
    throw new Error('Simulated render error: something went wrong!');
}

function ErrorBoundaryDemo() {
    const [showBroken, setShowBroken] = useState(false);
    return (
        <Stack spacing={2} alignItems="flex-start">
            <Button
                variant="outlined"
                color="error"
                onClick={() => setShowBroken(true)}
                disabled={showBroken}
            >
                Trigger error
            </Button>
            <CardErrorBoundary>
                {showBroken ? (
                    <BrokenComponent />
                ) : (
                    <Box sx={{ p: 2, bgcolor: 'action.hover', borderRadius: 1 }}>
                        <Typography>Click the button above to simulate a render crash.</Typography>
                    </Box>
                )}
            </CardErrorBoundary>
        </Stack>
    );
}

export const WithError: StoryObj = {
    name: 'Error state (click to trigger)',
    render: () => <ErrorBoundaryDemo />,
    parameters: {
        docs: {
            description: {
                story:
                    'Click "Trigger error" to crash the child component and display the fallback error card. Use the reload icon inside the card to recover, or expand to see the error message.',
            },
        },
    },
};
