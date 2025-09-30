/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { forwardRef, useMemo, useState } from 'react';
import { Button, Collapse, SnackbarContent, Stack, Typography, useTheme } from '@mui/material';
import { type BackendErrorDetails } from '../../utils/backendErrors';

type BackendErrorDetailKey = keyof BackendErrorDetails;

export interface BackendErrorSnackbarContentProps {
    message: string;
    detailsLabel: string;
    detailLabels: Record<BackendErrorDetailKey, string>;
    details: BackendErrorDetails;
    showDetailsLabel: string;
    hideDetailsLabel: string;
}

const detailOrder: BackendErrorDetailKey[] = ['service', 'message', 'path'];

export const BackendErrorSnackbarContent = forwardRef<HTMLDivElement, BackendErrorSnackbarContentProps>(
    ({ message, detailsLabel, detailLabels, details, showDetailsLabel, hideDetailsLabel }, ref) => {
        const theme = useTheme();
        const [isExpanded, setIsExpanded] = useState(false);

        const renderedDetails = useMemo(
            () =>
                detailOrder
                    .map((key) => ({ key, label: detailLabels[key], value: details[key] }))
                    .filter((detail) => detail.label),
            [detailLabels, details]
        );

        return (
            <SnackbarContent
                ref={ref}
                sx={{
                    flexWrap: 'wrap',
                    alignItems: 'stretch',
                    backgroundColor: theme.palette.error.main,
                    color: theme.palette.error.contrastText,
                    '& .MuiCollapse-root': {
                        width: '100%',
                    },
                    '& .MuiButton-root': {
                        color: theme.palette.error.contrastText,
                    },
                }}
                message={
                    <Stack spacing={0.5} sx={{ whiteSpace: 'pre-line' }}>
                        <Typography variant="body2" color="inherit">
                            {message}
                        </Typography>
                        {renderedDetails.length > 0 ? (
                            <>
                                <Button
                                    color="inherit"
                                    size="small"
                                    onClick={() => setIsExpanded((current) => !current)}
                                >
                                    {isExpanded ? hideDetailsLabel : showDetailsLabel}
                                </Button>
                                <Collapse in={isExpanded} unmountOnExit>
                                    <Stack spacing={0.25} sx={{ mt: 0.5 }}>
                                        <Typography variant="body2" fontWeight={600} color="inherit">
                                            {detailsLabel}
                                        </Typography>
                                        {renderedDetails.map(({ key, label, value }) => (
                                            <Typography variant="body2" key={key} color="inherit">
                                                {label}: {value}
                                            </Typography>
                                        ))}
                                    </Stack>
                                </Collapse>
                            </>
                        ) : null}
                    </Stack>
                }
            />
        );
    }
);

BackendErrorSnackbarContent.displayName = 'BackendErrorSnackbarContent';
