/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import type { UUID } from 'node:crypto';
import { backendFetch, backendFetchJson } from './utils';
import { enrichSecurityAnalysisParameters, mapSecurityAnalysisParameters } from './security-analysis.utils';
import { SAParameters, SAParametersEnriched } from '../components/parameters/security-analysis/types';
import { getStudyUrl } from './study';

const PREFIX_SECURITY_ANALYSIS_SERVER_QUERIES = `${import.meta.env.VITE_API_GATEWAY}/security-analysis`;

function getSecurityAnalysisUrl() {
    return `${PREFIX_SECURITY_ANALYSIS_SERVER_QUERIES}/v1/`;
}

export function fetchSecurityAnalysisProviders() {
    console.info('fetch security analysis providers');
    const url = `${getSecurityAnalysisUrl()}providers`;
    console.debug(url);
    return backendFetchJson(url);
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
