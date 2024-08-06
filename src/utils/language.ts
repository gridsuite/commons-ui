/*
 * Copyright © 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

export const LANG_SYSTEM = 'sys';
export const LANG_ENGLISH = 'en';
export const LANG_FRENCH = 'fr';

const supportedLanguages = [LANG_FRENCH, LANG_ENGLISH];

export type GsLangUser = typeof LANG_ENGLISH | typeof LANG_FRENCH;
export type GsLang = GsLangUser | typeof LANG_SYSTEM;

export function getSystemLanguage() {
    const systemLanguage = navigator.language.split(/[-_]/)[0];
    return supportedLanguages.includes(systemLanguage) ? (systemLanguage as GsLangUser) : LANG_ENGLISH;
}

export function getComputedLanguage(language: GsLang) {
    return language === LANG_SYSTEM ? getSystemLanguage() : language;
}
