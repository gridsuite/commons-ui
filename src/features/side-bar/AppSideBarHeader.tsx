/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Box, Divider, Stack, Typography, IconButton, Tooltip, ThemeProvider, Chip } from '@mui/material';
import { Info } from '@mui/icons-material';
import { ReactNode, useEffect, useMemo, useState } from 'react';
import { AboutDialog, GridSuiteModule } from '../topBar';
import { useAppSideBarTheme } from './AppSideBarThemeProvider';
import { fetchEnv, Environment } from '../../services';

interface AppSideBarHeaderProps {
    isMinimized: boolean;
    isLoggedIn: boolean;
    appName: string;
    appNameColor: string;
    appLogo: ReactNode;
    appLicense?: string;
    appVersion?: string;
    globalVersionPromise: () => Promise<string>;
    additionalModulesPromise: () => Promise<GridSuiteModule[]>;
}

const envColors: Record<Environment, string> = {
    REC: '#304FFE',
    DEV: '#DD2C00',
    PRE: '#AA00FF',
    PRO: '#DD2C00',
    DCH: '#2E7D32',
};

export function AppSideBarHeader({
    isMinimized,
    isLoggedIn,
    appName,
    appNameColor,
    appLogo,
    appLicense,
    appVersion,
    globalVersionPromise,
    additionalModulesPromise,
}: Readonly<AppSideBarHeaderProps>) {
    const { theme } = useAppSideBarTheme();
    const [isAboutDialogOpen, setIsAboutDialogOpen] = useState(false);
    const [environment, setEnvironment] = useState<Environment | string>('');

    useEffect(() => {
        fetchEnv().then((env) => setEnvironment(env?.environment ?? ''));
    }, []);

    const chip = useMemo(() => {
        if (!(environment in envColors)) {
            return null;
        }
        return (
            <Chip
                label={environment}
                size="small"
                sx={{
                    position: 'absolute',
                    top: 0,
                    right: 5,
                    transform: isMinimized ? 'translate(40%, -10%)' : 'translate(120%, -10%)',
                    fontSize: '0.5rem',
                    backgroundColor: envColors[environment as Environment],
                    color: '#ffffff',
                    height: isMinimized ? '12px' : '15px',
                    '& .MuiChip-label': {
                        padding: '0 4px',
                    },
                }}
            />
        );
    }, [environment, isMinimized]);

    return (
        <>
            <Stack
                sx={{
                    px: 1.5,
                    pt: 3,
                }}
            >
                <Stack
                    direction="row"
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: isMinimized ? 'center' : 'normal',
                    }}
                >
                    <Box sx={{ position: 'relative', display: 'inline-block' }}>
                        {appLogo}
                        {isMinimized && chip}
                    </Box>

                    {!isMinimized && (
                        <Box sx={{ position: 'relative', display: 'inline-block' }}>
                            <Typography variant="h6">
                                Grid
                                <Box component="span" sx={{ color: appNameColor }}>
                                    {appName}
                                </Box>
                            </Typography>
                            {chip}
                        </Box>
                    )}
                </Stack>
                <Stack
                    width="100%"
                    direction="row"
                    sx={{
                        alignSelf: 'flex-end',
                        marginY: 1,
                        visibility: isLoggedIn ? 'inherit' : 'hidden',
                    }}
                    alignItems="center"
                    justifyContent={isMinimized ? 'center' : 'end'}
                    spacing={1}
                >
                    {!isMinimized && <Typography variant="caption">V{appVersion}</Typography>}
                    <Tooltip title={`V${appVersion}`} disableHoverListener={!isMinimized}>
                        <IconButton sx={{ padding: 0 }} onClick={() => setIsAboutDialogOpen(true)}>
                            <Info fontSize="small" color="disabled" />
                        </IconButton>
                    </Tooltip>
                </Stack>

                <Divider />
            </Stack>
            <ThemeProvider theme={theme}>
                <AboutDialog
                    appLicense={appLicense}
                    appVersion={appVersion}
                    open={isAboutDialogOpen}
                    onClose={() => setIsAboutDialogOpen(false)}
                    additionalModulesPromise={additionalModulesPromise}
                    globalVersionPromise={globalVersionPromise}
                    appName={appName}
                />
            </ThemeProvider>
        </>
    );
}
