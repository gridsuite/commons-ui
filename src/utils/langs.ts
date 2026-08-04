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

export function getCsvDelimiter(language: string | undefined): ';' | ',' {
    return language === LANG_FRENCH ? ';' : ',';
}

export const transformIfFrenchNumber = (value: string, language: GsLang): string => {
    const trimmedValue = value.trim();
    // Only transform if we're in French mode and the value is a number that has a comma
    if (
        language === LANG_FRENCH &&
        trimmedValue.includes(',') &&
        !Number.isNaN(Number(trimmedValue.replace(',', '.')))
    ) {
        return trimmedValue.replace(',', '.');
    }
    return trimmedValue;
};
