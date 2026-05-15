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
    mapSensitivityAnalysisParameters,
    SensitivityAnalysisParametersInfos,
    SensitivityAnalysisParametersInfosEnriched,
} from '../utils';
import { PREFIX_STUDY_QUERIES } from './loadflow';
import { fetchElementNames } from './directory';
import { IdName } from '../components/parameters/common/contingency-table/types';

const GET_PARAMETERS_PREFIX = `${import.meta.env.VITE_API_GATEWAY}/sensitivity-analysis/v1/parameters`;
const PREFIX_SENSITIVITY_ANALYSIS_SERVER_QUERIES = `${import.meta.env.VITE_API_GATEWAY}/sensitivity-analysis`;
const getStudyUrl = (studyUuid: UUID | null) =>
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

function collectAllElementIds(parameters: SensitivityAnalysisParametersInfos): Set<string> {
    const allElementIds = new Set<string>();

    parameters.sensitivityInjection?.forEach((i) => {
        i.monitoredBranches?.forEach((id) => allElementIds.add(id));
        i.injections?.forEach((id) => allElementIds.add(id));
        i.contingencies?.forEach((id) => allElementIds.add(id));
    });

    parameters.sensitivityInjectionsSet?.forEach((is) => {
        is.monitoredBranches?.forEach((id) => allElementIds.add(id));
        is.injections?.forEach((id) => allElementIds.add(id));
        is.contingencies?.forEach((id) => allElementIds.add(id));
    });

    parameters.sensitivityHVDC?.forEach((hvdc) => {
        hvdc.monitoredBranches?.forEach((id) => allElementIds.add(id));
        hvdc.hvdcs?.forEach((id) => allElementIds.add(id));
        hvdc.contingencies?.forEach((id) => allElementIds.add(id));
    });

    parameters.sensitivityPST?.forEach((pst) => {
        pst.monitoredBranches?.forEach((id) => allElementIds.add(id));
        pst.psts?.forEach((id) => allElementIds.add(id));
        pst.contingencies?.forEach((id) => allElementIds.add(id));
    });

    parameters.sensitivityNodes?.forEach((n) => {
        n.monitoredVoltageLevels?.forEach((id) => allElementIds.add(id));
        n.equipmentsInVoltageRegulation?.forEach((id) => allElementIds.add(id));
        n.contingencies?.forEach((id) => allElementIds.add(id));
    });

    return allElementIds;
}

export function enrichSensitivityAnalysisParameters(
    parameters: SensitivityAnalysisParametersInfos
): Promise<SensitivityAnalysisParametersInfosEnriched> {
    const allElementIds = collectAllElementIds(parameters);

    const elementNamesPromise = allElementIds.size === 0 ? Promise.resolve(null) : fetchElementNames(allElementIds);

    return elementNamesPromise.then((elementNames) => {
        const mapIdsToEquipmentsContainer = (ids: UUID[] | undefined): IdName[] => {
            return ids
                ? ids.map((id) => ({
                      id,
                      name: elementNames?.[id] ?? undefined,
                  }))
                : [];
        };
        return {
            ...parameters,
            sensitivityInjectionsSet: parameters.sensitivityInjectionsSet
                ? parameters.sensitivityInjectionsSet.map((is) => {
                      return {
                          ...is,
                          monitoredBranches: mapIdsToEquipmentsContainer(is.monitoredBranches),
                          injections: mapIdsToEquipmentsContainer(is.injections),
                          contingencies: mapIdsToEquipmentsContainer(is.contingencies),
                      };
                  })
                : [],
            sensitivityInjection: parameters.sensitivityInjection
                ? parameters.sensitivityInjection.map((i) => {
                      return {
                          ...i,
                          monitoredBranches: mapIdsToEquipmentsContainer(i.monitoredBranches),
                          injections: mapIdsToEquipmentsContainer(i.injections),
                          contingencies: mapIdsToEquipmentsContainer(i.contingencies),
                      };
                  })
                : [],
            sensitivityHVDC: parameters.sensitivityHVDC
                ? parameters.sensitivityHVDC.map((hvdc) => {
                      return {
                          ...hvdc,
                          monitoredBranches: mapIdsToEquipmentsContainer(hvdc.monitoredBranches),
                          hvdcs: mapIdsToEquipmentsContainer(hvdc.hvdcs),
                          contingencies: mapIdsToEquipmentsContainer(hvdc.contingencies),
                      };
                  })
                : [],
            sensitivityPST: parameters.sensitivityPST
                ? parameters.sensitivityPST.map((pst) => {
                      return {
                          ...pst,
                          monitoredBranches: mapIdsToEquipmentsContainer(pst.monitoredBranches),
                          psts: mapIdsToEquipmentsContainer(pst.psts),
                          contingencies: mapIdsToEquipmentsContainer(pst.contingencies),
                      };
                  })
                : [],
            sensitivityNodes: parameters.sensitivityNodes
                ? parameters.sensitivityNodes.map((n) => {
                      return {
                          ...n,
                          monitoredVoltageLevels: mapIdsToEquipmentsContainer(n.monitoredVoltageLevels),
                          equipmentsInVoltageRegulation: mapIdsToEquipmentsContainer(n.equipmentsInVoltageRegulation),
                          contingencies: mapIdsToEquipmentsContainer(n.contingencies),
                      };
                  })
                : [],
        };
    });
}

export function getSensitivityAnalysisParameters(studyUuid: UUID): Promise<SensitivityAnalysisParametersInfosEnriched> {
    console.info('get sensitivity analysis parameters');
    const url = `${getStudyUrl(studyUuid)}/sensitivity-analysis/parameters`;
    console.debug(url);
    const parametersPromise: Promise<SensitivityAnalysisParametersInfos> = backendFetchJson(url);
    return parametersPromise.then((parameters) => enrichSensitivityAnalysisParameters(parameters));
}

export function fetchSensitivityAnalysisParameters(
    parameterUuid: string
): Promise<SensitivityAnalysisParametersInfosEnriched> {
    console.info('get sensitivity analysis parameters');
    const url = `${GET_PARAMETERS_PREFIX}/${parameterUuid}`;
    console.debug(url);
    const parametersPromise: Promise<SensitivityAnalysisParametersInfos> = backendFetchJson(url);
    return parametersPromise.then((parameters) => enrichSensitivityAnalysisParameters(parameters));
}

export function setSensitivityAnalysisParameters(
    studyUuid: UUID | null,
    newParams: SensitivityAnalysisParametersInfosEnriched | null
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
        body: newParams ? JSON.stringify(mapSensitivityAnalysisParameters(newParams)) : null,
    });
}

export function getSensitivityAnalysisFactorsCount(
    studyUuid: UUID | null,
    currentNodeUuid: UUID,
    currentRootNetworkUuid: UUID,
    newParams: SensitivityAnalysisParametersInfosEnriched,
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
        body: JSON.stringify(mapSensitivityAnalysisParameters(newParams)),
        signal: abortSignal,
    });
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
        body: newParams ? JSON.stringify(mapSensitivityAnalysisParameters(newParams)) : null,
    });
}
