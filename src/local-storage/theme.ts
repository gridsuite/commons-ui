/*
 * Copyright © 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { DARK_THEME, GsTheme } from '../components/TopBar/TopBar';

function getLocalStorageThemeKey(appName: string) {
    return `${appName.toUpperCase()}_THEME`;
}

export function getLocalStorageTheme(appName: string) {
    return (
        (localStorage.getItem(getLocalStorageThemeKey(appName)) as GsTheme) ||
        DARK_THEME
    );
}

export function saveLocalStorageTheme(appName: string, theme: GsTheme) {
    localStorage.setItem(getLocalStorageThemeKey(appName), theme);
}
