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
import { CONTAINER_ID, CONTAINER_NAME, EquipmentsContainer } from '../components/parameters/common/parameter-table';

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

function mapSensitivityAnalysisParameters(
    parametersInfos: SensitivityAnalysisParametersInfos<EquipmentsContainer>
): SensitivityAnalysisParametersInfos<UUID> {
    const mapEquipmentsContainerToIds = (containers: EquipmentsContainer[] | undefined): UUID[] => {
        return (containers ? containers.map((c) => c.containerId) : []) as UUID[];
    };

    return {
        ...parametersInfos,
        sensitivityInjectionsSet: parametersInfos.sensitivityInjectionsSet?.map((injectionsSet) => {
            return {
                ...injectionsSet,
                monitoredBranches: mapEquipmentsContainerToIds(injectionsSet.monitoredBranches),
                injections: mapEquipmentsContainerToIds(injectionsSet.injections),
                contingencyLists: mapEquipmentsContainerToIds(injectionsSet.contingencyLists),
            };
        }),
        sensitivityInjection: parametersInfos.sensitivityInjection?.map((injection) => {
            return {
                ...injection,
                monitoredBranches: mapEquipmentsContainerToIds(injection.monitoredBranches),
                injections: mapEquipmentsContainerToIds(injection.injections),
                contingencyLists: mapEquipmentsContainerToIds(injection.contingencyLists),
            };
        }),
        sensitivityHVDC: parametersInfos.sensitivityHVDC?.map((hvdc) => {
            return {
                ...hvdc,
                monitoredBranches: mapEquipmentsContainerToIds(hvdc.monitoredBranches),
                hvdcs: mapEquipmentsContainerToIds(hvdc.hvdcs),
                contingencyLists: mapEquipmentsContainerToIds(hvdc.contingencyLists),
            };
        }),
        sensitivityPST: parametersInfos.sensitivityPST?.map((pst) => {
            return {
                ...pst,
                monitoredBranches: mapEquipmentsContainerToIds(pst.monitoredBranches),
                psts: mapEquipmentsContainerToIds(pst.psts),
                contingencyLists: mapEquipmentsContainerToIds(pst.contingencyLists),
            };
        }),
        sensitivityNodes: parametersInfos.sensitivityNodes?.map((nodes) => {
            return {
                ...nodes,
                monitoredVoltageLevels: mapEquipmentsContainerToIds(nodes.monitoredVoltageLevels),
                equipmentsInVoltageRegulation: mapEquipmentsContainerToIds(nodes.equipmentsInVoltageRegulation),
                contingencyLists: mapEquipmentsContainerToIds(nodes.contingencyLists),
            };
        }),
    };
}

function getEquipmentsContainerIds(params: SensitivityAnalysisParametersInfos<UUID>): Set<string> {
    const allContainerIds = new Set<string>();

    params.sensitivityInjection?.forEach((i) => {
        i.monitoredBranches?.forEach((id) => allContainerIds.add(id));
        i.injections?.forEach((id) => allContainerIds.add(id));
        i.contingencyLists?.forEach((id) => allContainerIds.add(id));
    });

    params.sensitivityInjectionsSet?.forEach((is) => {
        is.monitoredBranches?.forEach((id) => allContainerIds.add(id));
        is.injections?.forEach((id) => allContainerIds.add(id));
        is.contingencyLists?.forEach((id) => allContainerIds.add(id));
    });

    params.sensitivityHVDC?.forEach((hvdc) => {
        hvdc.monitoredBranches?.forEach((id) => allContainerIds.add(id));
        hvdc.hvdcs?.forEach((id) => allContainerIds.add(id));
        hvdc.contingencyLists?.forEach((id) => allContainerIds.add(id));
    });

    params.sensitivityPST?.forEach((pst) => {
        pst.monitoredBranches?.forEach((id) => allContainerIds.add(id));
        pst.psts?.forEach((id) => allContainerIds.add(id));
        pst.contingencyLists?.forEach((id) => allContainerIds.add(id));
    });

    params.sensitivityNodes?.forEach((n) => {
        n.monitoredVoltageLevels?.forEach((id) => allContainerIds.add(id));
        n.equipmentsInVoltageRegulation?.forEach((id) => allContainerIds.add(id));
        n.contingencyLists?.forEach((id) => allContainerIds.add(id));
    });

    return allContainerIds;
}

function fetchElementNames(elementUuids: Set<string>) {
    console.info('fetch directory element names');

    const params = new URLSearchParams();
    elementUuids.forEach((id) => {
        params.append('ids', id);
    });

    const url = `${import.meta.env.VITE_API_GATEWAY}/explore/v1/explore/elements/name?${params.toString()}`;
    console.log(url);

    return backendFetchJson(url);
}

export function getSensitivityAnalysisParameters(studyUuid: UUID): Promise<SensitivityAnalysisParametersInfos<UUID>> {
    console.info('get sensitivity analysis parameters');
    const url = `${getStudyUrl(studyUuid)}/sensitivity-analysis/parameters`;
    console.debug(url);
    return backendFetchJson(url);
}

export function getSensitivityAnalysisParametersEnriched(
    studyUuid: UUID
): Promise<SensitivityAnalysisParametersInfos<EquipmentsContainer>> {
    const parametersPromise: Promise<SensitivityAnalysisParametersInfos<UUID>> =
        getSensitivityAnalysisParameters(studyUuid);

    // enrich directory elements with their names
    return parametersPromise.then(
        (
            parameters: SensitivityAnalysisParametersInfos<UUID>
        ): Promise<SensitivityAnalysisParametersInfos<EquipmentsContainer>> => {
            const allElementIds = getEquipmentsContainerIds(parameters);

            return fetchElementNames(allElementIds).then((elementNames) => {
                console.log(allElementIds);
                const mapIdsToEquipmentsContainer = (ids?: UUID[]): EquipmentsContainer[] => {
                    return ids
                        ? ids.map((id) => ({
                              [CONTAINER_ID]: id,
                              [CONTAINER_NAME]: elementNames.get(id) ?? null,
                          }))
                        : [];
                };

                return {
                    ...parameters,
                    sensitivityInjectionsSet: (parameters.sensitivityInjectionsSet
                        ? parameters.sensitivityInjectionsSet.map((is) => {
                              return {
                                  ...is,
                                  monitoredBranches: mapIdsToEquipmentsContainer(is.monitoredBranches),
                                  injections: mapIdsToEquipmentsContainer(is.injections),
                                  contingencyLists: mapIdsToEquipmentsContainer(is.contingencyLists),
                              };
                          })
                        : []) as SensitivityInjectionsSet<EquipmentsContainer>[],
                    sensitivityInjection: (parameters.sensitivityInjection
                        ? parameters.sensitivityInjection.map((i) => {
                              return {
                                  ...i,
                                  monitoredBranches: mapIdsToEquipmentsContainer(i.monitoredBranches),
                                  injections: mapIdsToEquipmentsContainer(i.injections),
                                  contingencyLists: mapIdsToEquipmentsContainer(i.contingencyLists),
                              };
                          })
                        : []) as SensitivityInjection<EquipmentsContainer>[],
                    sensitivityHVDC: (parameters.sensitivityHVDC
                        ? parameters.sensitivityHVDC.map((hvdc) => {
                              return {
                                  ...hvdc,
                                  monitoredBranches: mapIdsToEquipmentsContainer(hvdc.monitoredBranches),
                                  hvdcs: mapIdsToEquipmentsContainer(hvdc.hvdcs),
                                  contingencyLists: mapIdsToEquipmentsContainer(hvdc.contingencyLists),
                              };
                          })
                        : []) as SensitivityHVDC<EquipmentsContainer>[],
                    sensitivityPST: (parameters.sensitivityPST
                        ? parameters.sensitivityPST.map((pst) => {
                              return {
                                  ...pst,
                                  monitoredBranches: mapIdsToEquipmentsContainer(pst.monitoredBranches),
                                  psts: mapIdsToEquipmentsContainer(pst.psts),
                                  contingencyLists: mapIdsToEquipmentsContainer(pst.contingencyLists),
                              };
                          })
                        : []) as SensitivityPST<EquipmentsContainer>[],
                    sensitivityNodes: (parameters.sensitivityNodes
                        ? parameters.sensitivityNodes.map((n) => {
                              return {
                                  ...n,
                                  monitoredVoltageLevels: mapIdsToEquipmentsContainer(n.monitoredVoltageLevels),
                                  equipmentsInVoltageRegulation: mapIdsToEquipmentsContainer(
                                      n.equipmentsInVoltageRegulation
                                  ),
                                  contingencyLists: mapIdsToEquipmentsContainer(n.contingencyLists),
                              };
                          })
                        : []) as SensitivityNodes<EquipmentsContainer>[],
                };
            });
        }
    );
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
        body: JSON.stringify(mapSensitivityAnalysisParameters(newParams)),
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
