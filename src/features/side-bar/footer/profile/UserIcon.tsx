/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Avatar, SxProps, Theme } from '@mui/material';
import { mergeSx } from '../../../../utils';
import { getAbbreviationFromUserName } from '../../../../utils/user-utils';

export function UserAvatarIcon({ label, sx }: Readonly<{ label: string; sx?: SxProps<Theme> }>) {
    return (
        <Avatar
            sx={mergeSx(
                (theme) => ({
                    height: '24px',
                    width: '24px',
                    fontSize: theme.typography.pxToRem(11),
                    textTransform: 'uppercase',
                }),
                { ...sx }
            )}
        >
            {getAbbreviationFromUserName(label)}
        </Avatar>
    );
}
