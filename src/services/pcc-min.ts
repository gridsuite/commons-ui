/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import type { UUID } from 'node:crypto';
import { backendFetch, backendFetchJson } from './utils';
import { getStudyUrl } from './security-analysis';
import { PREFIX_STUDY_QUERIES } from './loadflow';
import { FilterIdentifier, FILTERS } from '../utils/constants/filterConstant';

export type PccMinParameters = {
    [FILTERS]: FilterIdentifier[];
};

export function getPccMinStudyParameters(studyUuid: UUID): Promise<PccMinParameters | null> {
    console.info('get pcc min study parameters');
    const getPccMintParams = `${getStudyUrl(studyUuid)}/pcc-min/parameters`;
    console.debug(getPccMintParams);
    return backendFetchJson(getPccMintParams);
}

export function updatePccMinParameters(studyUuid: UUID | null, newParams: PccMinParameters | null) {
    console.info('set study pcc min parameters');
    const url = `${PREFIX_STUDY_QUERIES}/v1/studies/${studyUuid}/pcc-min/parameters`;
    console.debug(url);
    return backendFetch(url, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(newParams),
    });
}
