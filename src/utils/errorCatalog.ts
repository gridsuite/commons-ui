/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { IntlShape } from 'react-intl';
import catalog from './businessErrorCatalog.json';

const DEFAULT_LOCALE = 'en';

type CatalogTranslations = Record<string, string>;
type Catalog = Record<string, CatalogTranslations>;

const errorCatalogMessages: Catalog = catalog;

const errorCatalogDefaultMessages: Record<string, string> = Object.entries(errorCatalogMessages).reduce(
    (accumulator, [code, translations]) => {
        accumulator[code] = translations[DEFAULT_LOCALE] ?? Object.values(translations)[0] ?? '';
        return accumulator;
    },
    {} as Record<string, string>
);

export type ErrorCatalogCode = keyof typeof errorCatalogMessages & string;

const normalizeLocale = (locale?: string): string => {
    if (!locale) {
        return DEFAULT_LOCALE;
    }
    const [language] = locale.toLowerCase().split('-');
    return language || DEFAULT_LOCALE;
};

export const isKnownErrorCatalogCode = (value: string | undefined): value is ErrorCatalogCode => {
    if (typeof value !== 'string') {
        return false;
    }
    return Object.prototype.hasOwnProperty.call(errorCatalogDefaultMessages, value);
};

export const resolveErrorCatalogMessage = (locale: string, code: ErrorCatalogCode): string => {
    const translations = errorCatalogMessages[code];
    const normalizedLocale = normalizeLocale(locale);
    return translations?.[normalizedLocale] ?? errorCatalogDefaultMessages[code];
};

export const resolveErrorCatalogMessageWithIntl = (intl: IntlShape, code: ErrorCatalogCode): string =>
    resolveErrorCatalogMessage(intl.locale, code);

export const getErrorCatalogDefaultMessage = (code: ErrorCatalogCode): string => errorCatalogDefaultMessages[code];
