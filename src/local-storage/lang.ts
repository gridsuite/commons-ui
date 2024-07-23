/*
 * Copyright © 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { GsLang, LANG_SYSTEM } from '../components/TopBar/TopBar';

import { getComputedLanguage } from '../utils/language';

function getLocalStorageLanguageKey(appName: string) {
    return `${appName.toUpperCase()}_LANGUAGE`;
}

export function getLocalStorageLanguage(appName: string) {
    return (
        (localStorage.getItem(getLocalStorageLanguageKey(appName)) as GsLang) ||
        LANG_SYSTEM
    );
}

export function saveLocalStorageLanguage(
    appName: string,
    language: GsLang
): void {
    localStorage.setItem(getLocalStorageLanguageKey(appName), language);
}

export function getLocalStorageComputedLanguage(appName: string) {
    return getComputedLanguage(getLocalStorageLanguage(appName));
}
