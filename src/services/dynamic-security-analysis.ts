/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import type { UUID } from 'node:crypto';
import { backendFetch, backendFetchJson, getRequestParamFromList } from './utils';
import {
    DynamicSecurityAnalysisParametersFetchReturn,
    DynamicSecurityAnalysisParametersInfos,
    ElementAttributes,
} from '../utils';
import { getStudyUrl } from './security-analysis';

const PREFIX_DYNAMIC_SECURITY_ANALYSIS_SERVER_QUERIES = `${import.meta.env.VITE_API_GATEWAY}/dynamic-security-analysis`;
const PREFIX_DIRECTORY_SERVER_QUERIES = `${import.meta.env.VITE_API_GATEWAY}/directory`;

export function fetchContingencyAndFiltersLists(listIds: UUID[]): Promise<ElementAttributes[]> {
    console.info('Fetching contingency and filters lists');

    // Add params to Url
    const idsParams = getRequestParamFromList(
        'ids',
        listIds.filter((id) => id) // filter falsy elements
    );
    const urlSearchParams = new URLSearchParams(idsParams);

    urlSearchParams.append('strictMode', 'false');

    const url = `${PREFIX_DIRECTORY_SERVER_QUERIES}/v1/elements?${urlSearchParams}`;
    console.debug(url);
    return backendFetchJson(url);
}

export function fetchDynamicSecurityAnalysisParameters(
    studyUuid: UUID
): Promise<DynamicSecurityAnalysisParametersFetchReturn> {
    console.info(`Fetching dynamic security analysis parameters on study '${studyUuid}' ...`);
    const url = `${getStudyUrl(studyUuid)}/dynamic-security-analysis/parameters`;
    console.debug(url);
    const parametersPromise: Promise<DynamicSecurityAnalysisParametersInfos> = backendFetchJson(url);

    // enrich contingency list uuids by contingency list infos with id and name
    return parametersPromise.then((parameters) => {
        if (parameters?.contingencyListIds) {
            return fetchContingencyAndFiltersLists(parameters?.contingencyListIds).then((contingencyListInfos) => {
                // eslint-disable-next-line no-param-reassign
                delete parameters.contingencyListIds;
                return {
                    ...parameters,
                    contingencyListInfos: contingencyListInfos?.map((info) => ({
                        id: info.elementUuid,
                        name: info.elementName,
                    })),
                };
            });
        }
        // eslint-disable-next-line no-param-reassign
        delete parameters.contingencyListIds;
        return {
            ...parameters,
            contingencyListInfos: [],
        };
    });
}

export function updateDynamicSecurityAnalysisParameters(
    studyUuid: UUID,
    newParams: DynamicSecurityAnalysisParametersFetchReturn | null
): Promise<Response> {
    console.info(`Setting dynamic security analysis parameters on study '${studyUuid}' ...`);
    const url = `${getStudyUrl(studyUuid)}/dynamic-security-analysis/parameters`;
    console.debug(url);

    // send to back contingency list uuids instead of contingency list infos
    const newParameters =
        newParams != null
            ? {
                  ...newParams,
                  contingencyListIds: newParams?.contingencyListInfos?.map((info) => info.id),
              }
            : newParams;

    delete newParameters?.contingencyListInfos;

    return backendFetch(url, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(newParameters),
    });
}

function getDynamicSecurityAnalysisUrl() {
    return `${PREFIX_DYNAMIC_SECURITY_ANALYSIS_SERVER_QUERIES}/v1/`;
}

export function fetchDynamicSecurityAnalysisProviders() {
    console.info('fetch dynamic security analysis providers');
    const url = `${getDynamicSecurityAnalysisUrl()}providers`;
    console.debug(url);
    return backendFetchJson(url);
}
