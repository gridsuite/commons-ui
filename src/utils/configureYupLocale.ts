/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { setLocale } from 'yup';
import { YUP_NOT_TYPE_DEFAULT, YUP_NOT_TYPE_NUMBER, YUP_REQUIRED } from './constants';

let configured = false;

export function configureYupLocale(): void {
    if (configured) {
        return;
    }

    setLocale({
        mixed: {
            required: YUP_REQUIRED,
            notType: ({ type }) => {
                if (type === 'number') {
                    return YUP_NOT_TYPE_NUMBER;
                }
                return YUP_NOT_TYPE_DEFAULT;
            },
        },
    });

    configured = true;
}
