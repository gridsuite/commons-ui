/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import type { UUID } from 'node:crypto';
import { backendFetch, backendFetchJson, safeEncodeURIComponent } from './utils';
import {
    FactorsCount,
    SensitivityAnalysisParametersInfos,
    SensitivityInjectionsSet,
    SensitivityInjection,
    SensitivityHVDC,
    SensitivityPST,
    SensitivityNodes,
} from '../utils';
import { PREFIX_STUDY_QUERIES } from './loadflow';
import { CONTAINER_ID, CONTAINER_NAME } from '../components/parameters/common/parameter-table/constants';
import { EquipmentsContainer } from '../components/parameters/common/parameter-table';

const GET_PARAMETERS_PREFIX = `${import.meta.env.VITE_API_GATEWAY}/study/v1/sensitivity-analysis/parameters`;
const PREFIX_SENSITIVITY_ANALYSIS_SERVER_QUERIES = `${import.meta.env.VITE_API_GATEWAY}/sensitivity-analysis`;
export const getStudyUrl = (studyUuid: UUID | null) =>
    `${PREFIX_STUDY_QUERIES}/v1/studies/${safeEncodeURIComponent(studyUuid)}`;

export const getStudyUrlWithNodeUuidAndRootNetworkUuid = (
    studyUuid: string | null | undefined,
    nodeUuid: string | undefined,
    rootNetworkUuid: string | undefined | null
) =>
    `${PREFIX_STUDY_QUERIES}/v1/studies/${safeEncodeURIComponent(studyUuid)}/root-networks/${safeEncodeURIComponent(
        rootNetworkUuid
    )}/nodes/${safeEncodeURIComponent(nodeUuid)}`;

export function getSensiUrl() {
    return `${PREFIX_SENSITIVITY_ANALYSIS_SERVER_QUERIES}/v1/`;
}

export function fetchSensitivityAnalysisProviders(): Promise<string[]> {
    console.info('fetch sensitivity analysis providers');
    const url = `${getSensiUrl()}providers`;
    console.debug(url);
    return backendFetchJson(url);
}

export function fetchSensitivityAnalysisParameters(parameterUuid: string) {
    console.info('get sensitivity analysis parameters');
    const url = `${GET_PARAMETERS_PREFIX}/${parameterUuid}`;
    console.debug(url);
    return backendFetchJson(url);
}

export function setSensitivityAnalysisParameters(
    studyUuid: UUID | null,
    newParamsInfos: SensitivityAnalysisParametersInfos<EquipmentsContainer> | null
) {
    console.info('set sensitivity analysis parameters');
    const url = `${getStudyUrl(studyUuid)}/sensitivity-analysis/parameters`;
    console.debug(url);
    return backendFetch(url, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: newParamsInfos ? JSON.stringify(mapSensitivityAnalysisParameters(newParamsInfos)) : null,
    });
}

export function getSensitivityAnalysisFactorsCount(
    studyUuid: UUID | null,
    currentNodeUuid: UUID,
    currentRootNetworkUuid: UUID,
    newParams: SensitivityAnalysisParametersInfos<EquipmentsContainer>,
    abortSignal: AbortSignal
): Promise<FactorsCount> {
    console.info('get sensitivity analysis parameters computing count');
    const url = `${getStudyUrlWithNodeUuidAndRootNetworkUuid(studyUuid, currentNodeUuid, currentRootNetworkUuid)}/sensitivity-analysis/factor-count`;
    console.debug(url);
    return backendFetchJson(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(newParams),
        signal: abortSignal,
    });
}

export function updateSensitivityAnalysisParameters(
    parameterUuid: UUID,
    newParamsInfos: SensitivityAnalysisParametersInfos<EquipmentsContainer> | null
) {
    console.info('set security analysis parameters');
    const setSecurityAnalysisParametersUrl = `${getSensiUrl()}parameters/${parameterUuid}`;
    console.debug(setSecurityAnalysisParametersUrl);
    return backendFetch(setSecurityAnalysisParametersUrl, {
        method: 'PUT',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: newParamsInfos ? JSON.stringify(mapSensitivityAnalysisParameters(newParamsInfos)) : null,
    });
}
