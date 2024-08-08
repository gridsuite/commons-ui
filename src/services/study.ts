/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { UUID } from 'crypto';
import { backendFetchJson } from './utils';

const PREFIX_STUDY_QUERIES = `${import.meta.env.VITE_API_GATEWAY}/study`;

// eslint-disable-next-line import/prefer-default-export
export function exportFilter(studyUuid: UUID, filterUuid?: UUID, token?: string) {
    console.info('get filter export on study root node');
    return backendFetchJson(
        `${PREFIX_STUDY_QUERIES}/v1/studies/${studyUuid}/filters/${filterUuid}/elements`,
        {
            method: 'get',
            headers: { 'Content-Type': 'application/json' },
        },
        token
    );
}
