/*
 * Copyright © 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useEffect } from 'react';
import { IntlShape, useIntl } from 'react-intl';
import { type LocaleObject, setLocale } from 'yup';
import { en as yupEn, fr as yupFr } from 'yup-locales';
import { GsLangUser, LANG_ENGLISH, LANG_FRENCH } from '../utils';

function mapLang(lng: GsLangUser): LocaleObject {
    switch (lng) {
        case LANG_FRENCH:
            return {
                ...yupFr,
                mixed: {
                    ...yupFr.mixed,
                    notType: ({ type }) => {
                        if (type === 'number') {
                            return "Ce champ n'accepte que des valeurs numériques";
                        }
                        // @ts-expect-error it's a function in lib sources
                        return yupFr.mixed?.notType(type);
                        // return '"La valeur du champ n'est pas au bon format';
                    },
                },
            };
        case LANG_ENGLISH:
        default:
            return {
                ...yupEn,
                mixed: {
                    ...yupEn.mixed,
                    notType: ({ type }) => {
                        if (type === 'number') {
                            return 'This field only accepts numeric values';
                        }
                        // @ts-expect-error it's a function in lib sources
                        return yupFr.mixed?.notType(type);
                        // return 'Field value format is incorrect';
                    },
                },
            };
    }
}

/**
 * Hook to automatically {@link setLocale} with {@link useIntl}.
 * This permit to have Yup schema validation return translated messages.
 * @param alterLocale extension point to further modify default locale
 */
export function useYupIntl(alterLocale: (lo: LocaleObject, intl: IntlShape) => LocaleObject = (lo) => lo) {
    const intl = useIntl();
    useEffect(() => {
        setLocale(alterLocale(mapLang(intl.locale as GsLangUser), intl));
    }, [alterLocale, intl]);
}
