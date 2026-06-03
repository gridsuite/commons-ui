/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import type { UUID } from 'node:crypto';
import { backendFetch, backendFetchJson, safeEncodeURIComponent } from './utils';
import { PREFIX_STUDY_QUERIES } from './loadflow';
import { IdName, mapSecurityAnalysisParameters, SAParameters, SAParametersEnriched } from '../utils';
import { fetchElementNames } from './directory';
import { ID, NAME } from '../features/parameters/common/parameter-table/constants';

const PREFIX_SECURITY_ANALYSIS_SERVER_QUERIES = `${import.meta.env.VITE_API_GATEWAY}/security-analysis`;

export const getStudyUrl = (studyUuid: UUID | null) =>
    `${PREFIX_STUDY_QUERIES}/v1/studies/${safeEncodeURIComponent(studyUuid)}`;

function getSecurityAnalysisUrl() {
    return `${PREFIX_SECURITY_ANALYSIS_SERVER_QUERIES}/v1/`;
}

export function fetchSecurityAnalysisProviders() {
    console.info('fetch security analysis providers');
    const url = `${getSecurityAnalysisUrl()}providers`;
    console.debug(url);
    return backendFetchJson(url);
}

function collectElementIds(params: SAParameters): Set<string> {
    const allElementIds = params.contingencyListsInfos
        ? params.contingencyListsInfos.flatMap((cli) => cli.contingencyLists ?? [])
        : [];
    return new Set(allElementIds);
}

export function enrichSecurityAnalysisParameters(parameters: SAParameters): Promise<SAParametersEnriched> {
    const allElementIds = collectElementIds(parameters);

    const elementNamesPromise = allElementIds.size === 0 ? Promise.resolve(null) : fetchElementNames(allElementIds);

    return elementNamesPromise.then((elementNames) => {
        const mapIdsToIdNames = (ids: UUID[] | undefined): IdName[] => {
            return ids
                ? ids.map((id) => ({
                      [ID]: id,
                      [NAME]: elementNames?.[id] ?? undefined,
                  }))
                : [];
        };
        return {
            ...parameters,
            contingencyListsInfos: parameters.contingencyListsInfos
                ? parameters.contingencyListsInfos.map((cli) => {
                      return {
                          ...cli,
                          contingencyLists: mapIdsToIdNames(cli.contingencyLists),
                      };
                  })
                : [],
        };
    });
}

export function fetchSecurityAnalysisParameters(parameterUuid: string): Promise<SAParametersEnriched> {
    console.info('fetch security analysis parameters');
    const url = `${getSecurityAnalysisUrl()}parameters/${encodeURIComponent(parameterUuid)}`;
    console.debug(url);
    const parametersPromise: Promise<SAParameters> = backendFetchJson(url);
    return parametersPromise.then((parameters) => enrichSecurityAnalysisParameters(parameters));
}

export function getSecurityAnalysisDefaultLimitReductions() {
    console.info('get security analysis default limit reductions');
    const url = `${getSecurityAnalysisUrl()}parameters/default-limit-reductions`;
    console.debug(url);
    return backendFetchJson(url);
}

export function getSecurityAnalysisParameters(studyUuid: UUID): Promise<SAParametersEnriched> {
    console.info('get security analysis parameters');
    const url = `${getStudyUrl(studyUuid)}/security-analysis/parameters`;
    console.debug(url);
    const parametersPromise: Promise<SAParameters> = backendFetchJson(url);
    return parametersPromise.then((parameters) => enrichSecurityAnalysisParameters(parameters));
}

export function setSecurityAnalysisParameters(studyUuid: UUID, newParams: SAParametersEnriched | null) {
    console.info('set security analysis parameters');
    const url = `${getStudyUrl(studyUuid)}/security-analysis/parameters`;
    console.debug(url);
    return backendFetch(url, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: newParams ? JSON.stringify(mapSecurityAnalysisParameters(newParams)) : null,
    });
}

export function updateSecurityAnalysisParameters(parameterUuid: UUID, newParams: SAParametersEnriched | null) {
    console.info('set security analysis parameters');
    const setSecurityAnalysisParametersUrl = `${getSecurityAnalysisUrl()}parameters/${parameterUuid}`;
    console.debug(setSecurityAnalysisParametersUrl);
    return backendFetch(setSecurityAnalysisParametersUrl, {
        method: 'PUT',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: newParams ? JSON.stringify(mapSecurityAnalysisParameters(newParams)) : null,
    });
}
