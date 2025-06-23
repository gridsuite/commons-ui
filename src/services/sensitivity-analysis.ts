import { UUID } from 'crypto';
import { backendFetch, backendFetchJson, backendFetchText } from './utils';
import { PREFIX_STUDY_QUERIES, safeEncodeURIComponent } from './security-analysis';
import { SensitivityAnalysisFactorsCountParameters, SensitivityAnalysisParametersInfos } from '../utils';

const GET_PARAMETERS_PREFIX = `${import.meta.env.VITE_API_GATEWAY}/sensitivity-analysis/v1/parameters`;
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

export function getSensitivityAnalysisParameters(studyUuid: UUID) {
    console.info('get sensitivity analysis parameters');
    const url = `${getStudyUrl(studyUuid)}/sensitivity-analysis/parameters`;
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
    newParams: SensitivityAnalysisParametersInfos | null
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
        body: newParams ? JSON.stringify(newParams) : null,
    });
}

export function getSensitivityAnalysisFactorsCount(
    studyUuid: UUID | null,
    currentNodeUuid: UUID,
    currentRootNetworkUuid: UUID,
    isInjectionsSet: boolean,
    newParams: SensitivityAnalysisFactorsCountParameters
) {
    console.info('get sensitivity analysis parameters computing count');
    const urlSearchParams = new URLSearchParams();
    const jsoned = JSON.stringify(isInjectionsSet);
    urlSearchParams.append('isInjectionsSet', jsoned);
    Object.keys(newParams)
        // @ts-ignore
        .filter((key) => newParams[key])
        // @ts-ignore
        .forEach((key) => urlSearchParams.append(`ids[${key}]`, newParams[key]));

    const url = `${getStudyUrlWithNodeUuidAndRootNetworkUuid(studyUuid, currentNodeUuid, currentRootNetworkUuid)}
      /sensitivity-analysis/factors-count?${urlSearchParams}`;
    console.debug(url);
    return backendFetch(url, {
        method: 'GET',
    });
}

export function fetchDefaultSensitivityAnalysisProvider() {
    console.info('fetch default sensitivity analysis provider');
    const url = `${PREFIX_STUDY_QUERIES}/v1/sensitivity-analysis-default-provider`;
    console.debug(url);
    return backendFetchText(url);
}

export function updateSensitivityAnalysisParameters(parameterUuid: UUID, newParams: any) {
    console.info('set security analysis parameters');
    const setSecurityAnalysisParametersUrl = `${getSensiUrl()}parameters/${parameterUuid}`;
    console.debug(setSecurityAnalysisParametersUrl);
    return backendFetch(setSecurityAnalysisParametersUrl, {
        method: 'PUT',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: newParams ? JSON.stringify(newParams) : null,
    });
}
