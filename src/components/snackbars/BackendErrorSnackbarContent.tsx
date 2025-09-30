/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Close, ExpandLess, ExpandMore } from '@mui/icons-material';
import { Button, Collapse, IconButton, Stack, Typography, styled } from '@mui/material';
import { useSnackbar, type SnackbarKey } from 'notistack';
import { forwardRef, useCallback, useId, useMemo, useState } from 'react';

interface BackendErrorDetails {
    service: string;
    message: string;
    path: string;
}

export type BackendErrorDetailLabels = Record<keyof BackendErrorDetails, string>;

export interface BackendErrorSnackbarContentProps {
    message: string;
    detailLabels: BackendErrorDetailLabels;
    details: BackendErrorDetails;
    showDetailsLabel: string;
    hideDetailsLabel: string;
    snackbarKey?: SnackbarKey;
}

const Root = styled(Stack)(({ theme }) => ({
    width: '100%',
    color: theme.palette.common.white,
    backgroundColor: theme.palette.error.main,
    borderRadius: theme.shape.borderRadius,
    padding: theme.spacing(1.5),
    boxShadow: theme.shadows[6],
}));

const Header = styled(Stack)(({ theme }) => ({
    width: '100%',
    columnGap: theme.spacing(1),
}));

const ToggleButton = styled(Button)(({ theme }) => ({
    alignSelf: 'flex-start',
    padding: 0,
    minWidth: 0,
    textTransform: 'none',
    color: 'inherit',
    fontWeight: theme.typography.fontWeightMedium,
    '&:hover': {
        backgroundColor: 'transparent',
    },
}));

const DetailsList = styled(Stack)(() => ({
    width: '100%',
}));

const DetailRow = styled(Stack)(({ theme }) => ({
    flexDirection: 'row',
    columnGap: theme.spacing(1),
}));

export const BackendErrorSnackbarContent = forwardRef<HTMLDivElement, BackendErrorSnackbarContentProps>(
    ({ message, detailLabels, details, showDetailsLabel, hideDetailsLabel, snackbarKey }, ref) => {
        const { closeSnackbar } = useSnackbar();
        const [isExpanded, setIsExpanded] = useState(false);
        const detailsId = useId();

        const detailEntries = useMemo(() => {
            return (Object.keys(detailLabels) as Array<keyof BackendErrorDetails>).map((key) => ({
                key,
                label: detailLabels[key],
                value: details[key],
            }));
        }, [detailLabels, details]);

        const toggleDetails = useCallback(() => {
            setIsExpanded((prev) => !prev);
        }, []);

        const handleClose = useCallback(() => {
            closeSnackbar(snackbarKey);
        }, [closeSnackbar, snackbarKey]);

        return (
            <Root ref={ref} spacing={1} role="alert">
                <Header direction="row" alignItems="flex-start" justifyContent="space-between">
                    <Stack spacing={0.5} flexGrow={1} minWidth={0} pr={1}>
                        <Typography variant="body2">{message}</Typography>
                    </Stack>
                    <IconButton aria-label="close-snackbar" color="inherit" onClick={handleClose} size="small">
                        <Close fontSize="small" />
                    </IconButton>
                </Header>
                <ToggleButton
                    onClick={toggleDetails} 
                    endIcon={isExpanded ? <ExpandLess fontSize="small" /> : <ExpandMore fontSize="small" />}
                    aria-expanded={isExpanded}
                    aria-controls={detailsId}
                >
                    {isExpanded ? hideDetailsLabel : showDetailsLabel}
                </ToggleButton>
                <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                    <DetailsList spacing={0.5} id={detailsId}>
                        {detailEntries.map(({ key, label, value }) => (
                            <DetailRow key={key} alignItems="flex-start">
                                <Typography
                                    variant="caption"
                                    component="dt"
                                    sx={{
                                        flexShrink: 0,
                                        fontWeight: (theme) => theme.typography.fontWeightMedium,
                                    }}
                                >
                                    {label}
                                </Typography>
                                <Typography
                                    variant="caption"
                                    component="dd"
                                    sx={{
                                        margin: 0,
                                        wordBreak: 'break-word',
                                    }}
                                >
                                    {value}
                                </Typography>
                            </DetailRow>
                        ))}
                    </DetailsList>
                </Collapse>
            </Root>
        );
    }
);

BackendErrorSnackbarContent.displayName = 'BackendErrorSnackbarContent';
