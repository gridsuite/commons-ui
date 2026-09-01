/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Box, Divider, Stack, Typography, IconButton, Tooltip } from '@mui/material';
import { Info } from '@mui/icons-material';
import { ReactNode } from 'react';
import { SideBarDialogType, useAppSideBarDialogs } from './dialogs/AppSideBarDialogProvider';

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

    return (
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
                    <Typography fontSize={18}>
                        <Box component="span" style={{ fontWeight: 'bold' }}>
                            Grid
                        </Box>
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
                        <IconButton sx={{ padding: 0 }} onClick={() => setOpenDialog(SideBarDialogType.ABOUT)}>
                            <Info fontSize="small" sx={{ color: 'text.secondary' }} />
                        </IconButton>
                    </Tooltip>
                </>
            </Stack>

            <Divider />
        </Stack>
    );
}
