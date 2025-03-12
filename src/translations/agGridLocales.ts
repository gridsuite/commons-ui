/*
 * Copyright © 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import {
    AG_GRID_LOCALE_BG,
    AG_GRID_LOCALE_BR,
    AG_GRID_LOCALE_CN,
    AG_GRID_LOCALE_CZ,
    AG_GRID_LOCALE_DE,
    AG_GRID_LOCALE_DK,
    AG_GRID_LOCALE_EG,
    AG_GRID_LOCALE_EN,
    AG_GRID_LOCALE_ES,
    AG_GRID_LOCALE_FI,
    AG_GRID_LOCALE_FR,
    AG_GRID_LOCALE_GR,
    AG_GRID_LOCALE_HK,
    AG_GRID_LOCALE_HR,
    AG_GRID_LOCALE_HU,
    AG_GRID_LOCALE_IL,
    AG_GRID_LOCALE_IR,
    AG_GRID_LOCALE_IT,
    AG_GRID_LOCALE_JP,
    AG_GRID_LOCALE_KR,
    AG_GRID_LOCALE_NL,
    AG_GRID_LOCALE_NO,
    AG_GRID_LOCALE_PK,
    AG_GRID_LOCALE_PL,
    AG_GRID_LOCALE_PT,
    AG_GRID_LOCALE_RO,
    AG_GRID_LOCALE_SE,
    AG_GRID_LOCALE_SK,
    AG_GRID_LOCALE_TR,
    AG_GRID_LOCALE_TW,
    AG_GRID_LOCALE_UA,
    AG_GRID_LOCALE_VN,
} from '@ag-grid-community/locale';

export const I18N_GRID_PREFIX = 'grid.';

/**
 * Ag-Grid localizations use a different format than ICU message syntax and need to be converted
 * (ex: <code>"The line ${variable} of ${variable} is valid"</code> → <code>"The line ${variable1} of ${variable2} is valid"</code>)
 */
function transformString(input: string) {
    let count = 0;
    return input.replace(/\$\{variable\}/g, () => `\${variable${++count}}`); // eslint-disable-line no-plusplus
}

/**
 * Convert a localization of aggrid to one usable with Intl and add a prefix to keys
 * @param agGridLocale The standard localization of AgGrid
 */
function transformAgGridLocale<T extends Record<string, string>>(agGridLocale: T) {
    return Object.fromEntries(
        Object.entries(agGridLocale).map(([key, value]) => [`${I18N_GRID_PREFIX}${key}`, transformString(value)])
    ) as Record<`${typeof I18N_GRID_PREFIX}${string & keyof T}`, string>;
}

export const intlAgGridLocaleEN = compileTime(() => transformAgGridLocale(AG_GRID_LOCALE_EN));
export const intlAgGridLocaleEG = compileTime(() => transformAgGridLocale(AG_GRID_LOCALE_EG));
export const intlAgGridLocaleBG = compileTime(() => transformAgGridLocale(AG_GRID_LOCALE_BG));
export const intlAgGridLocaleCZ = compileTime(() => transformAgGridLocale(AG_GRID_LOCALE_CZ));
export const intlAgGridLocaleDK = compileTime(() => transformAgGridLocale(AG_GRID_LOCALE_DK));
export const intlAgGridLocaleDE = compileTime(() => transformAgGridLocale(AG_GRID_LOCALE_DE));
export const intlAgGridLocaleGR = compileTime(() => transformAgGridLocale(AG_GRID_LOCALE_GR));
export const intlAgGridLocaleFI = compileTime(() => transformAgGridLocale(AG_GRID_LOCALE_FI));
export const intlAgGridLocaleFR = compileTime(() => transformAgGridLocale(AG_GRID_LOCALE_FR));
export const intlAgGridLocaleIL = compileTime(() => transformAgGridLocale(AG_GRID_LOCALE_IL));
export const intlAgGridLocaleHR = compileTime(() => transformAgGridLocale(AG_GRID_LOCALE_HR));
export const intlAgGridLocaleHU = compileTime(() => transformAgGridLocale(AG_GRID_LOCALE_HU));
export const intlAgGridLocaleIT = compileTime(() => transformAgGridLocale(AG_GRID_LOCALE_IT));
export const intlAgGridLocaleJP = compileTime(() => transformAgGridLocale(AG_GRID_LOCALE_JP));
export const intlAgGridLocaleKR = compileTime(() => transformAgGridLocale(AG_GRID_LOCALE_KR));
export const intlAgGridLocaleNO = compileTime(() => transformAgGridLocale(AG_GRID_LOCALE_NO));
export const intlAgGridLocaleNL = compileTime(() => transformAgGridLocale(AG_GRID_LOCALE_NL));
export const intlAgGridLocaleCN = compileTime(() => transformAgGridLocale(AG_GRID_LOCALE_CN));
export const intlAgGridLocaleHK = compileTime(() => transformAgGridLocale(AG_GRID_LOCALE_HK));
export const intlAgGridLocaleTW = compileTime(() => transformAgGridLocale(AG_GRID_LOCALE_TW));
export const intlAgGridLocaleES = compileTime(() => transformAgGridLocale(AG_GRID_LOCALE_ES));
export const intlAgGridLocaleIR = compileTime(() => transformAgGridLocale(AG_GRID_LOCALE_IR));
export const intlAgGridLocalePL = compileTime(() => transformAgGridLocale(AG_GRID_LOCALE_PL));
export const intlAgGridLocaleBR = compileTime(() => transformAgGridLocale(AG_GRID_LOCALE_BR));
export const intlAgGridLocalePT = compileTime(() => transformAgGridLocale(AG_GRID_LOCALE_PT));
export const intlAgGridLocaleRO = compileTime(() => transformAgGridLocale(AG_GRID_LOCALE_RO));
export const intlAgGridLocaleSK = compileTime(() => transformAgGridLocale(AG_GRID_LOCALE_SK));
export const intlAgGridLocaleSE = compileTime(() => transformAgGridLocale(AG_GRID_LOCALE_SE));
export const intlAgGridLocaleTR = compileTime(() => transformAgGridLocale(AG_GRID_LOCALE_TR));
export const intlAgGridLocaleUA = compileTime(() => transformAgGridLocale(AG_GRID_LOCALE_UA));
export const intlAgGridLocalePK = compileTime(() => transformAgGridLocale(AG_GRID_LOCALE_PK));
export const intlAgGridLocaleVN = compileTime(() => transformAgGridLocale(AG_GRID_LOCALE_VN));
