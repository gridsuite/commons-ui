import { Box, Divider, Stack, Typography, IconButton, Tooltip } from '@mui/material';
import { Info } from '@mui/icons-material';
import { useState } from 'react';
import GridmonitorLogo from 'assets/images/gridmonitor_logo.svg?react';
import { AboutDialog, GridSuiteModule } from '../topBar';

interface AppSideBarHeaderProps {
    isMinimized: boolean;
    isLoggedIn: boolean;
    appName: string;
    appLicense?: string;
    appVersion?: string;
    globalVersionPromise: () => Promise<string>;
    additionalModulesPromise: () => Promise<GridSuiteModule[]>;
}

export function AppSidebarHeader({
    isMinimized,
    isLoggedIn,
    appName,
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
                    <GridmonitorLogo />
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
