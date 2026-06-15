/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Box, Divider, LinearProgress, Stack } from '@mui/material';
import { ReactNode } from 'react';

interface ParameterLayoutProps {
    children: ReactNode;
    header?: ReactNode;
    footer?: ReactNode;
    isLoading?: boolean;
    contentSx?: any;
}

const styles = {
    stack: {
        height: '100%',
        overflow: 'hidden',
        position: 'relative',
        display: 'flex',
    },
    header: {
        flexShrink: 0,
    },
    content: {
        flexGrow: 1,
        overflowY: 'auto',
        overflowX: 'hidden',
        minHeight: 0, // Critical for flex-grow with overflow
    },
    footer: {
        flexShrink: 0,
        p: 1,
    },
} as const;

export function ParameterLayout({ children, header, footer, isLoading, contentSx }: Readonly<ParameterLayoutProps>) {
    return (
        <Stack sx={styles.stack}>
            {header && <Box sx={styles.header}>{header}</Box>}
            <Box sx={[styles.content, contentSx]}>{isLoading ? <LinearProgress /> : children}</Box>
            {footer && (
                <Box sx={styles.footer}>
                    <Divider sx={{ mb: 1 }} />
                    {footer}
                </Box>
            )}
        </Stack>
    );
}
