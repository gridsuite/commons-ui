/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Box, Divider, IconButton, Stack, Tooltip, Typography } from '@mui/material';
import { Info } from '@mui/icons-material';
import { ReactNode, useEffect, useState } from 'react';
import { SideBarDialogType, useAppSideBarDialogs } from './dialogs/AppSideBarDialogProvider';
import { Environment, fetchEnv } from '../../services';
import { EnvironmentChip } from './EnvironmentChip';

interface AppSideBarHeaderProps {
    isMinimized: boolean;
    isLoggedIn: boolean;
    appName: string;
    appNameColor: string;
    appLogo: ReactNode;
    appVersion?: string;
}

export function AppSideBarHeader({
    isMinimized,
    isLoggedIn,
    appName,
    appNameColor,
    appLogo,
    appVersion,
}: Readonly<AppSideBarHeaderProps>) {
    const { setOpenDialog } = useAppSideBarDialogs();
    const [environment, setEnvironment] = useState<Environment | ''>('');

    useEffect(() => {
        fetchEnv().then((env) => setEnvironment(env?.environment ?? ''));
    }, []);

    return (
        <Stack
            sx={{
                px: 1.5,
                pt: 3,
            }}
            spacing={1}
        >
            <Stack direction="row" alignItems="center" justifyContent={isMinimized ? 'center' : 'flex-start'}>
                <Box sx={{ position: 'relative', display: 'inline-block' }}>
                    {appLogo}

                    {isMinimized && <EnvironmentChip environment={environment} variant="minimized" />}
                </Box>

                {!isMinimized && (
                    <Box sx={{ position: 'relative', display: 'inline-block' }}>
                        <Typography variant="h6">
                            Grid
                            <Box component="span" sx={{ color: appNameColor }}>
                                {appName}
                            </Box>
                        </Typography>

                        <EnvironmentChip environment={environment} variant="expanded" />
                    </Box>
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
                        <IconButton sx={{ padding: 0 }} onClick={() => setOpenDialog(SideBarDialogType.ABOUT)}>
                            <Info fontSize="small" color="disabled" />
                        </IconButton>
                    </Tooltip>
                </>
            </Stack>

            <Divider />
        </Stack>
    );
}
