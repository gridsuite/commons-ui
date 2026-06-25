/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Box, Grid, LinearProgress, Stack, ButtonGroup, Tooltip, Theme } from '@mui/material';
import { RestartAlt, Upload } from '@mui/icons-material';
import { createContext, useContext, ReactNode, useMemo } from 'react';
import { FormattedMessage } from 'react-intl';
import { LabelledButton } from './parameters';
import { SubmitButton } from '../../../components/ui';

// Context for XS Screen
interface ParameterLayoutContextValue {
    isXsScreen: boolean;
}

const ParameterLayoutContext = createContext<ParameterLayoutContextValue>({ isXsScreen: false });

export const useParameterLayoutContext = () => useContext(ParameterLayoutContext);

export function ParameterLayoutProvider({
    isXsScreen,
    children,
}: Readonly<{
    isXsScreen: boolean;
    children: ReactNode;
}>) {
    const isXsScreenMemo = useMemo(() => ({ isXsScreen }), [isXsScreen]);
    return <ParameterLayoutContext.Provider value={isXsScreenMemo}>{children}</ParameterLayoutContext.Provider>;
}

export interface ParameterActions {
    preFillOnClick?: React.MouseEventHandler<HTMLButtonElement>;
    resetOnClick?: React.MouseEventHandler<HTMLButtonElement>;
    saveOnClick?: React.MouseEventHandler<HTMLButtonElement>;
    validateOnClick?: React.MouseEventHandler<HTMLButtonElement>;
    validateDisabled?: boolean;
    extra?: ReactNode;
}

interface ParameterLayoutProps {
    children: ReactNode;
    title?: string;
    isLoading?: boolean;
    actions?: ParameterActions;
}

const styles = {
    stack: {
        height: '100%',
        overflow: 'hidden',
        position: 'relative',
        display: 'flex',
    },
    title: {
        flexShrink: 0,
        paddingBottom: 2,
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
        borderTop: (theme: Theme) => `1px solid ${theme.palette.divider}`,
    },
} as const;

export function ParameterLayout({ children, title, isLoading, actions }: Readonly<ParameterLayoutProps>) {
    const { preFillOnClick, resetOnClick, saveOnClick, validateOnClick, validateDisabled } = actions ?? {};

    const { isXsScreen } = useParameterLayoutContext();

    return (
        <Stack sx={styles.stack}>
            {(title || preFillOnClick || resetOnClick) && (
                <Box sx={styles.title}>
                    <Grid container justifyContent="space-between" sx={{ alignItems: 'center' }}>
                        <Grid item xs={4}>
                            {title && !isXsScreen && <FormattedMessage id={title} />}
                        </Grid>
                        <Grid item xs="auto">
                            <ButtonGroup>
                                {preFillOnClick && (
                                    <LabelledButton
                                        callback={preFillOnClick}
                                        label="button.prefill"
                                        data-testid="PrefillButton"
                                        startIcon={<Upload />}
                                    />
                                )}
                                {resetOnClick && (
                                    <Tooltip title={<FormattedMessage id="tooltip.reset" />}>
                                        <LabelledButton
                                            callback={resetOnClick}
                                            label="button.reset"
                                            data-testid="ResetButton"
                                            startIcon={<RestartAlt />}
                                        />
                                    </Tooltip>
                                )}
                            </ButtonGroup>
                        </Grid>
                    </Grid>
                </Box>
            )}
            <Box sx={styles.content}>{isLoading ? <LinearProgress /> : children}</Box>
            <Box sx={styles.footer}>
                {saveOnClick && <LabelledButton label="save" data-testid="SaveButton" callback={saveOnClick} />}
                {validateOnClick && (
                    <SubmitButton
                        variant="contained"
                        data-testid="ValidateButton"
                        onClick={validateOnClick}
                        disabled={validateDisabled}
                    />
                )}
                {actions?.extra}
            </Box>
        </Stack>
    );
}
