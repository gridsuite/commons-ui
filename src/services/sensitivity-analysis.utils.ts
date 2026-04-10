/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { fetchElementNames } from './directory';
import { mapEquipmentsContainerToIds, mapIdsToEquipmentsContainer } from '../components/parameters/common/utils';
import {
    SensitivityAnalysisParametersInfos,
    SensitivityAnalysisParametersInfosEnriched,
} from '../components/parameters/sensi/sensitivity-analysis.type';

export function mapSensitivityAnalysisParameters(
    parametersInfos: SensitivityAnalysisParametersInfosEnriched
): SensitivityAnalysisParametersInfos {
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

function getEquipmentsContainerIds(params: SensitivityAnalysisParametersInfos): Set<string> {
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

export function enrichSensitivityAnalysisParameters(
    parameters: SensitivityAnalysisParametersInfos
): Promise<SensitivityAnalysisParametersInfosEnriched> {
    const allElementIds = getEquipmentsContainerIds(parameters);

    return fetchElementNames(allElementIds).then((elementNames) => {
        return {
            ...parameters,
            sensitivityInjectionsSet: parameters.sensitivityInjectionsSet
                ? parameters.sensitivityInjectionsSet.map((is) => {
                      return {
                          ...is,
                          monitoredBranches: mapIdsToEquipmentsContainer(is.monitoredBranches, elementNames),
                          injections: mapIdsToEquipmentsContainer(is.injections, elementNames),
                          contingencyLists: mapIdsToEquipmentsContainer(is.contingencyLists, elementNames),
                      };
                  })
                : [],
            sensitivityInjection: parameters.sensitivityInjection
                ? parameters.sensitivityInjection.map((i) => {
                      return {
                          ...i,
                          monitoredBranches: mapIdsToEquipmentsContainer(i.monitoredBranches, elementNames),
                          injections: mapIdsToEquipmentsContainer(i.injections, elementNames),
                          contingencyLists: mapIdsToEquipmentsContainer(i.contingencyLists, elementNames),
                      };
                  })
                : [],
            sensitivityHVDC: parameters.sensitivityHVDC
                ? parameters.sensitivityHVDC.map((hvdc) => {
                      return {
                          ...hvdc,
                          monitoredBranches: mapIdsToEquipmentsContainer(hvdc.monitoredBranches, elementNames),
                          hvdcs: mapIdsToEquipmentsContainer(hvdc.hvdcs, elementNames),
                          contingencyLists: mapIdsToEquipmentsContainer(hvdc.contingencyLists, elementNames),
                      };
                  })
                : [],
            sensitivityPST: parameters.sensitivityPST
                ? parameters.sensitivityPST.map((pst) => {
                      return {
                          ...pst,
                          monitoredBranches: mapIdsToEquipmentsContainer(pst.monitoredBranches, elementNames),
                          psts: mapIdsToEquipmentsContainer(pst.psts, elementNames),
                          contingencyLists: mapIdsToEquipmentsContainer(pst.contingencyLists, elementNames),
                      };
                  })
                : [],
            sensitivityNodes: parameters.sensitivityNodes
                ? parameters.sensitivityNodes.map((n) => {
                      return {
                          ...n,
                          monitoredVoltageLevels: mapIdsToEquipmentsContainer(n.monitoredVoltageLevels, elementNames),
                          equipmentsInVoltageRegulation: mapIdsToEquipmentsContainer(
                              n.equipmentsInVoltageRegulation,
                              elementNames
                          ),
                          contingencyLists: mapIdsToEquipmentsContainer(n.contingencyLists, elementNames),
                      };
                  })
                : [],
        };
    });
}
