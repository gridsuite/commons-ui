/*
 * Copyright © 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

export const LANG_SYSTEM = 'sys';
export const LANG_ENGLISH = 'en';
export const LANG_FRENCH = 'fr';
export type GsLangUser = typeof LANG_ENGLISH | typeof LANG_FRENCH;
export type GsLang = GsLangUser | typeof LANG_SYSTEM;

const supportedLanguages = [LANG_FRENCH, LANG_ENGLISH];

export const getSystemLanguage = () => {
    const systemLanguage = navigator.language.split(/[-_]/)[0];
    return supportedLanguages.includes(systemLanguage as GsLangUser) ? (systemLanguage as GsLangUser) : LANG_ENGLISH;
};

export const getComputedLanguage = (language: GsLang): GsLangUser => {
    return language === LANG_SYSTEM ? getSystemLanguage() : (language ?? LANG_ENGLISH);
};

// Resolves LANG_SYSTEM to the browser language, so the system choice behaves like the language actually displayed
export const isFrenchLanguage = (language: string | undefined): boolean =>
    getComputedLanguage(language as GsLang) === LANG_FRENCH;

export function getCsvDelimiter(language: string | undefined): ';' | ',' {
    return isFrenchLanguage(language) ? ';' : ',';
}

export const transformIfFrenchNumber = (value: string, language: GsLang): string => {
    const trimmedValue = value.trim();
    // Only transform if we're in French mode and the value is a number that has a comma
    if (
        isFrenchLanguage(language) &&
        trimmedValue.includes(',') &&
        !Number.isNaN(Number(trimmedValue.replace(',', '.')))
    ) {
        return trimmedValue.replace(',', '.');
    }
    return trimmedValue;
};
