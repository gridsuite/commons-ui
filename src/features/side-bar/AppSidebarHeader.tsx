/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Box, Divider, Stack, Typography, IconButton, Tooltip } from '@mui/material';
import { Info } from '@mui/icons-material';
import { ReactNode, useState } from 'react';
import { AboutDialog, GridSuiteModule } from '../topBar';

interface AppSideBarHeaderProps {
    isMinimized: boolean;
    isLoggedIn: boolean;
    appName: string;
    appLogo: ReactNode;
    appLicense?: string;
    appVersion?: string;
    globalVersionPromise: () => Promise<string>;
    additionalModulesPromise: () => Promise<GridSuiteModule[]>;
}

export function AppSidebarHeader({
    isMinimized,
    isLoggedIn,
    appName,
    appLogo,
    appLicense,
    appVersion,
    globalVersionPromise,
    additionalModulesPromise,
}: Readonly<AppSideBarHeaderProps>) {
    const [isAboutDialogOpen, setIsAboutDialogOpen] = useState(false);
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
                    {appLogo}
                    {!isMinimized && (
                        <Typography variant="h6">
                            Grid
                            <Box component="span" sx={{ color: '#7e57c2' }}>
                                Monitor
                            </Box>
                        </Typography>
                    )}
                </Stack>

                {isLoggedIn && (
                    <Stack
                        width="100%"
                        direction="row"
                        sx={{
                            alignSelf: 'flex-end',
                        }}
                        alignItems="center"
                        justifyContent={isMinimized ? 'center' : 'end'}
                        spacing={1}
                    >
                        <>
                            {!isMinimized && <Typography variant="caption">V{appVersion}</Typography>}
                            <Tooltip title={`V${appVersion}`} disableHoverListener={!isMinimized}>
                                <IconButton sx={{ paddingX: 0 }} onClick={() => setIsAboutDialogOpen(true)}>
                                    <Info fontSize="small" />
                                </IconButton>
                            </Tooltip>
                        </>
                    </Stack>
                )}

                <Divider />
            </Stack>
            <AboutDialog
                appLicense={appLicense}
                appVersion={appVersion}
                open={isAboutDialogOpen}
                onClose={() => setIsAboutDialogOpen(false)}
                additionalModulesPromise={additionalModulesPromise}
                globalVersionPromise={globalVersionPromise}
                appName={appName}
            />
        </>
    );
}
