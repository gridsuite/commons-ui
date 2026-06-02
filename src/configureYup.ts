/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { setLocale } from 'yup';
import {
    YUP_DEFAULT,
    YUP_NOT_NULL,
    YUP_NOT_TYPE_DEFAULT,
    YUP_NOT_TYPE_NUMBER,
    YUP_POSITIVE,
    YUP_REQUIRED,
} from './utils';

export const configureYup = () => {
    setLocale({
        mixed: {
            required: YUP_REQUIRED,
            notNull: YUP_NOT_NULL,
            default: YUP_DEFAULT,
            notType: ({ type }) => {
                if (type === 'number') {
                    return YUP_NOT_TYPE_NUMBER;
                }
                return YUP_NOT_TYPE_DEFAULT;
            },
        },
        number: {
            positive: YUP_POSITIVE,
        },
    });
};
