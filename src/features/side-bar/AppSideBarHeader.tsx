/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Box, Divider, Stack, Typography, IconButton, Tooltip, ThemeProvider } from '@mui/material';
import { Info } from '@mui/icons-material';
import { ReactNode, useState } from 'react';
import { AboutDialog, GridSuiteModule } from '../topBar';
import { useAppSideBarTheme } from './AppSideBarThemeProvider';

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
    return (
        <>
            <Stack
                sx={{
                    px: 1.5,
                    pt: 3,
                }}
                spacing={1}
            >
                <Stack direction="row" alignItems="center" justifyContent={isMinimized ? 'center' : 'flex-start'}>
                    {appLogo}
                    {!isMinimized && (
                        <Typography variant="h6">
                            Grid
                            <Box component="span" sx={{ color: appNameColor }}>
                                {appName}
                            </Box>
                        </Typography>
                    )}
                </Stack>

                <Stack
                    direction="row"
                    visibility={isLoggedIn ? 'inherit' : 'hidden'}
                    alignItems="center"
                    justifyContent={isMinimized ? 'center' : 'end'}
                    spacing={1}
                >
                    <>
                        {!isMinimized && <Typography variant="caption">V{appVersion}</Typography>}
                        <Tooltip title={`V${appVersion}`} disableHoverListener={!isMinimized}>
                            <IconButton sx={{ padding: 0 }} onClick={() => setIsAboutDialogOpen(true)}>
                                <Info fontSize="small" color="disabled" />
                            </IconButton>
                        </Tooltip>
                    </>
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
