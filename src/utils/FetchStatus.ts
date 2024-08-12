/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

/* We can't use an enum here because we have this error in apps using tsc with isolatedModules set to true
 * TS2748: Cannot access ambient const enums when isolatedModules is enabled.
 */
const FetchStatus = {
    IDLE: 'IDLE',
    FETCHING: 'FETCHING',
    FETCH_SUCCESS: 'FETCH_SUCCESS',
    FETCH_ERROR: 'FETCH_ERROR',
} as const;
export default FetchStatus;

// 'enum like' "TS type" creation
export type FetchStatusType = keyof typeof FetchStatus;
