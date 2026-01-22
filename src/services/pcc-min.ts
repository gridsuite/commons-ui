/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import type { UUID } from 'node:crypto';
import { backendFetch, backendFetchJson } from './utils';
import { getStudyUrl } from './security-analysis';
import { FilterIdentifier, FILTERS } from '../utils/constants/filterConstant';

export type PccMinParameters = {
    [FILTERS]: FilterIdentifier[];
};
const PREFIX_PCC_MIN_SERVER_QUERIES = `${import.meta.env.VITE_API_GATEWAY}/pcc-min`;

function getPccMinUrl() {
    return `${PREFIX_PCC_MIN_SERVER_QUERIES}/v1/`;
}
export function getPccMinStudyParameters(studyUuid: UUID): Promise<PccMinParameters | null> {
    console.info('get pcc min study parameters');
    const getPccMintParams = `${getStudyUrl(studyUuid)}/pcc-min/parameters`;
    console.debug(getPccMintParams);
    return backendFetchJson(getPccMintParams);
}

export function fetchPccMinParameters(parameterUuid: UUID): Promise<PccMinParameters> {
    console.info('fetch pcc min parameters');
    const url = `${getPccMinUrl()}parameters/${encodeURIComponent(parameterUuid)}`;
    console.debug(url);
    return backendFetchJson(url);
}

export function updatePccMinParameters(studyUuid: UUID | null, newParams: PccMinParameters | null) {
    console.info('set study pcc min parameters');
    const url = `${getStudyUrl(studyUuid)}/pcc-min/parameters`;
    console.debug(url);
    return backendFetch(url, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: newParams !== null ? JSON.stringify(newParams) : null,
    });
}
