/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Box, Grid, LinearProgress, Stack, ButtonGroup } from '@mui/material';
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
    extra?: ReactNode;
}

interface ParameterLayoutProps {
    children: ReactNode;
    title?: string;
    header?: ReactNode;
    isLoading?: boolean;
    contentSx?: any;
    actions?: ParameterActions;
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

export function ParameterLayout({
    children,
    title,
    header,
    isLoading,
    contentSx,
    actions,
}: Readonly<ParameterLayoutProps>) {
    const { preFillOnClick, resetOnClick, saveOnClick, validateOnClick } = actions ?? {};

    const { isXsScreen } = useParameterLayoutContext();

    return (
        <Stack sx={styles.stack}>
            <Box sx={{ paddingBottom: 2 }}>
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
                                <LabelledButton
                                    callback={resetOnClick}
                                    label="button.reset"
                                    data-testid="ResetButton"
                                    startIcon={<RestartAlt />}
                                />
                            )}
                        </ButtonGroup>
                    </Grid>
                </Grid>
            </Box>
            {header && <Box sx={styles.header}>{header}</Box>}
            <Box sx={[styles.content, contentSx]}>{isLoading ? <LinearProgress /> : children}</Box>
            <Box sx={styles.footer}>
                {saveOnClick && <LabelledButton label="save" data-testid="SaveButton" callback={saveOnClick} />}
                {validateOnClick && (
                    <SubmitButton variant="contained" data-testid="ValidateButton" onClick={validateOnClick}>
                        <FormattedMessage id="validate" />
                    </SubmitButton>
                )}
                {actions?.extra}
            </Box>
        </Stack>
    );
}
