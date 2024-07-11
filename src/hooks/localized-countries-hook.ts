/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useCallback, useEffect, useMemo, useState } from 'react';
import localizedCountries, { LocalizedCountries } from 'localized-countries';
// @ts-ignore
import countriesFr from 'localized-countries/data/fr';
// @ts-ignore
import countriesEn from 'localized-countries/data/en';
import {
    LANG_FRENCH,
    LANG_ENGLISH,
    LANG_SYSTEM,
} from '../components/TopBar/TopBar';

const supportedLanguages = [LANG_FRENCH, LANG_ENGLISH];

export const getSystemLanguage = () => {
    const systemLanguage = navigator.language.split(/[-_]/)[0];
    return supportedLanguages.includes(systemLanguage)
        ? systemLanguage
        : LANG_ENGLISH;
};

export const getComputedLanguage = (language: string | undefined) => {
    return language === LANG_SYSTEM
        ? getSystemLanguage()
        : language ?? LANG_ENGLISH;
};

export const useLocalizedCountries = (language: string | undefined) => {
    const [localizedCountriesModule, setLocalizedCountriesModule] =
        useState<LocalizedCountries>();

    // TODO FM this is disgusting, can we make it better ?
    useEffect(() => {
        const lang = getComputedLanguage(language).substring(0, 2);
        let localizedCountriesResult;
        // vite does not support ESM dynamic imports on node_modules, so we have to imports the languages before and do this
        // https://github.com/vitejs/vite/issues/14102
        if (lang === 'fr') {
            localizedCountriesResult = localizedCountries(countriesFr);
        } else if (lang === 'en') {
            localizedCountriesResult = localizedCountries(countriesEn);
        } else {
            console.warn(
                `Unsupported language "${lang}" for countries translation, we use english as default`
            );
            localizedCountriesResult = localizedCountries(countriesEn);
        }
        setLocalizedCountriesModule(localizedCountriesResult);
    }, [language]);

    const countryCodes = useMemo(
        () =>
            localizedCountriesModule
                ? Object.keys(localizedCountriesModule.object())
                : [],
        [localizedCountriesModule]
    );

    const translate = useCallback(
        (countryCode: string) =>
            localizedCountriesModule
                ? localizedCountriesModule.get(countryCode)
                : '',
        [localizedCountriesModule]
    );

    return { translate, countryCodes };
};
