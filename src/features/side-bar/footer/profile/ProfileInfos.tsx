/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Box, Divider, MenuItem } from '@mui/material';
import { Person } from '@mui/icons-material';
import { UserProfile } from 'oidc-client-ts';

export function ProfileInfos({ userProfile }: Readonly<{ userProfile?: UserProfile }>) {
    return (
        <>
            <MenuItem
                sx={{
                    px: 1.5,
                    '&.Mui-disabled': {
                        opacity: 1,
                    },
                }}
                disabled
            >
                <Person />
                <Box component="span" px={1}>
                    {userProfile?.name} <br />
                    <Box component="span">{userProfile?.email}</Box>
                </Box>
            </MenuItem>
            <Divider />
        </>
    );
}
