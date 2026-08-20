/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Avatar, Tooltip } from '@mui/material';

function getAbbreviationFromUserName(name: string) {
    // notice : == null means null or undefined
    if (name == null || name.trim() === '') {
        return '';
    }
    const splittedName = name.split(' ');
    if (splittedName.length > 1) {
        return `${splittedName[0][0]}${splittedName[splittedName.length - 1][0]}`;
    }
    return `${splittedName[0][0]}`;
}

export function UserAvatarIcon({ label }: Readonly<{ label: string }>) {
    return (
        <Tooltip title={label}>
            <Avatar
                sx={(theme) => ({
                    height: '24px',
                    width: '24px',
                    fontSize: theme.typography.pxToRem(11),
                    textTransform: 'capitalize',
                })}
            >
                {getAbbreviationFromUserName(label)}
            </Avatar>
        </Tooltip>
    );
}
