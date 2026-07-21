/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import type { UUID } from 'node:crypto';
import { backendFetch, backendFetchJson } from './utils';
import { getStudyUrl } from './security-analysis';
import { FilterIdentifier, FILTERS, PccMinParameters, PccMinParametersEnriched } from '../utils';
import { mapPccMinParameters } from '../utils/types/pcc-min.type';
import { fetchElementNames } from './directory';
import { PREFIX_STUDY_SERVER_QUERIES } from './loadflow';

function getPccMinUrl() {
    return `${PREFIX_STUDY_SERVER_QUERIES}/v1/pcc-min/`;
}

function collectAllElementIds(params: PccMinParameters): Set<string> {
    return new Set(params[FILTERS]);
}

export function enrichPccMinParameters(parameters: PccMinParameters): Promise<PccMinParametersEnriched> {
    const allElementIds = collectAllElementIds(parameters);

    const elementNamesPromise = allElementIds.size === 0 ? Promise.resolve(null) : fetchElementNames(allElementIds);

    return elementNamesPromise.then((elementNames) => {
        const mapIdsToFilterIdentifiers = (ids: UUID[] | undefined): FilterIdentifier[] => {
            return ids
                ? ids.map((id) => ({
                      filterId: id,
                      filterName: elementNames?.[id] ?? undefined,
                  }))
                : [];
        };
        return {
            ...parameters,
            [FILTERS]: mapIdsToFilterIdentifiers(parameters[FILTERS]),
        };
    });
}

export function getPccMinStudyParameters(studyUuid: UUID): Promise<PccMinParametersEnriched | null> {
    console.info('get pcc min study parameters');
    const url = `${getStudyUrl(studyUuid)}/pcc-min/parameters`;
    console.debug(url);
    const parametersPromise: Promise<PccMinParameters> = backendFetchJson(url);
    return parametersPromise.then((parameters) => enrichPccMinParameters(parameters));
}

export function fetchPccMinParameters(parameterUuid: UUID): Promise<PccMinParametersEnriched> {
    console.info('fetch pcc min parameters');
    const url = `${getPccMinUrl()}parameters/${encodeURIComponent(parameterUuid)}`;
    console.debug(url);
    const parametersPromise: Promise<PccMinParameters> = backendFetchJson(url);
    return parametersPromise.then((parameters) => enrichPccMinParameters(parameters));
}

export function updatePccMinParameters(studyUuid: UUID | null, newParams: PccMinParametersEnriched | null) {
    console.info('set study pcc min parameters');
    const url = `${getStudyUrl(studyUuid)}/pcc-min/parameters`;
    console.debug(url);
    return backendFetch(url, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: newParams == null ? null : JSON.stringify(mapPccMinParameters(newParams)),
    });
}
