/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import type { UUID } from 'node:crypto';
import { backendFetchJson, getRequestParamFromList } from './utils';
import { ElementAttributes } from '../utils';
import { PREFIX_STUDY_SERVER_QUERIES } from './study';

export function fetchContingencyAndFiltersLists(listIds: UUID[]): Promise<ElementAttributes[]> {
    console.info('Fetching contingency and filters lists');

    // Add params to Url
    const idsParams = getRequestParamFromList(
        'ids',
        listIds.filter((id) => id) // filter falsy elements
    );
    const urlSearchParams = new URLSearchParams(idsParams);

    urlSearchParams.append('strictMode', 'false');

    const url = `${PREFIX_STUDY_SERVER_QUERIES}/v1/directory/elements?${urlSearchParams}`;
    console.debug(url);
    return backendFetchJson(url);
}

function getDynamicSecurityAnalysisUrl() {
    return `${PREFIX_STUDY_SERVER_QUERIES}/v1/dynamic-security-analysis/`;
}

export function fetchDynamicSecurityAnalysisProviders() {
    console.info('fetch dynamic security analysis providers');
    const url = `${getDynamicSecurityAnalysisUrl()}providers`;
    console.debug(url);
    return backendFetchJson(url);
}
