/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Stack, Switch } from '@mui/material';
import { ChangeEvent } from 'react';
import { FormattedMessage } from 'react-intl';
import { DARK_THEME, GsTheme, LIGHT_THEME } from '../../../../utils';
import { CustomMenuItem } from '../../../../components';

interface DarkModeToggleProps {
    currentTheme: GsTheme;
    setTheme: (newTheme: GsTheme) => Promise<void>;
}

export function DarkModeToggle({ currentTheme, setTheme }: Readonly<DarkModeToggleProps>) {
    const isDarkMode = currentTheme === DARK_THEME;

    const toggleMode = (event: ChangeEvent<HTMLInputElement>) => {
        const targetModeValue = event.target.checked ? DARK_THEME : LIGHT_THEME;
        setTheme(targetModeValue) // TODO: improve error handling
            .catch((err) => console.error(err));
    };
    return (
        <CustomMenuItem sx={{ px: 2 }}>
            <Stack width="100%" direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
                <FormattedMessage id="top-bar/darkMode" />
                <Switch checked={isDarkMode} onChange={toggleMode} />
            </Stack>
        </CustomMenuItem>
    );
}
