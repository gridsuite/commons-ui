/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import type { UUID } from 'node:crypto';
import { fetchElementNames } from '../../services/directory';

export enum DistributionType {
    PROPORTIONAL = 'PROPORTIONAL',
    PROPORTIONAL_MAXP = 'PROPORTIONAL_MAXP',
    REGULAR = 'REGULAR',
    VENTILATION = 'VENTILATION',
}

export enum SensitivityType {
    DELTA_MW = 'DELTA_MW',
    DELTA_A = 'DELTA_A',
}

interface EquipmentsContainer {
    containerId: string;
    containerName: string;
}

type EquipmentsInfos = EquipmentsContainer | UUID;

interface SensitivityParamsCommon<T extends EquipmentsInfos> {
    contingencies?: T[];
    activated?: boolean | null;
}

export interface SensitivityInjectionsSet<T extends EquipmentsInfos> extends SensitivityParamsCommon<T> {
    monitoredBranches?: T[];
    injections?: T[];
    distributionType?: DistributionType;
}

export interface SensitivityInjection<T extends EquipmentsInfos> extends SensitivityParamsCommon<T> {
    monitoredBranches?: T[];
    injections?: T[];
}

export interface SensitivityHVDC<T extends EquipmentsInfos> extends SensitivityParamsCommon<T> {
    monitoredBranches?: T[];
    sensitivityType?: SensitivityType;
    hvdcs?: T[];
}

export interface SensitivityPST<T extends EquipmentsInfos> extends SensitivityParamsCommon<T> {
    monitoredBranches?: T[];
    sensitivityType?: SensitivityType;
    psts?: T[];
}

export interface SensitivityNodes<T extends EquipmentsInfos> extends SensitivityParamsCommon<T> {
    monitoredVoltageLevels?: T[];
    equipmentsInVoltageRegulation?: T[];
}

export interface SensitivityAnalysisParameters<T extends EquipmentsInfos> {
    provider: string;
    uuid?: UUID;
    date?: Date;
    name?: string;
    flowFlowSensitivityValueThreshold: number;
    angleFlowSensitivityValueThreshold: number;
    flowVoltageSensitivityValueThreshold: number;
    sensitivityInjectionsSet?: SensitivityInjectionsSet<T>[];
    sensitivityInjection?: SensitivityInjection<T>[];
    sensitivityHVDC?: SensitivityHVDC<T>[];
    sensitivityPST?: SensitivityPST<T>[];
    sensitivityNodes?: SensitivityNodes<T>[];
}

export type SensitivityAnalysisParametersInfosEnriched = SensitivityAnalysisParameters<EquipmentsContainer>;
export type SensitivityAnalysisParametersInfos = SensitivityAnalysisParameters<UUID>;

export interface FactorsCount {
    resultCount: number;
    variableCount: number;
}

// result types
export type SelectorFilterOptions = {
    tabSelection: string;
    functionType: string;
};
export type CsvConfig = {
    csvHeaders: string[];
    resultTab: string;
    sensitivityFunctionType?: string;
};
export type SensitivityOfTo = {
    type: 'SensitivityOfTo' | 'SensitivityWithContingency'; // discrimination field
    funcId: string;
    varId: string;
    varIsAFilter: boolean;
    value: number;
    functionReference: number;
};
export type SensitivityWithContingency = SensitivityOfTo & {
    contingencyId: string;
    valueAfter: number;
    functionReferenceAfter: number;
};
export type Sensitivity = SensitivityOfTo | SensitivityWithContingency;
export type SensitivityResult = {
    resultTab: string; // should be enum ResultTab
    functionType: string; // should be enum SensitivityFunctionType
    requestedChunkSize: number;
    chunkOffset: number;
    totalSensitivitiesCount: number;
    filteredSensitivitiesCount: number;
    sensitivities: Sensitivity[];
};
export type SensitivityResultFilterOptions = {
    allContingencyIds?: string[];
    allFunctionIds?: string[];
    allVariableIds?: string[];
};

export function mapSensitivityAnalysisParameters(
    parameters: SensitivityAnalysisParametersInfosEnriched
): SensitivityAnalysisParametersInfos {
    const mapEquipmentsContainerToIds = (containers: EquipmentsContainer[] | undefined): UUID[] => {
        return (containers ? containers.map((c) => c.containerId) : []) as UUID[];
    };
    return {
        ...parameters,
        sensitivityInjectionsSet: parameters.sensitivityInjectionsSet?.map((injectionsSet) => {
            return {
                ...injectionsSet,
                monitoredBranches: mapEquipmentsContainerToIds(injectionsSet.monitoredBranches),
                injections: mapEquipmentsContainerToIds(injectionsSet.injections),
                contingencies: mapEquipmentsContainerToIds(injectionsSet.contingencies),
            };
        }),
        sensitivityInjection: parameters.sensitivityInjection?.map((injection) => {
            return {
                ...injection,
                monitoredBranches: mapEquipmentsContainerToIds(injection.monitoredBranches),
                injections: mapEquipmentsContainerToIds(injection.injections),
                contingencies: mapEquipmentsContainerToIds(injection.contingencies),
            };
        }),
        sensitivityHVDC: parameters.sensitivityHVDC?.map((hvdc) => {
            return {
                ...hvdc,
                monitoredBranches: mapEquipmentsContainerToIds(hvdc.monitoredBranches),
                hvdcs: mapEquipmentsContainerToIds(hvdc.hvdcs),
                contingencies: mapEquipmentsContainerToIds(hvdc.contingencies),
            };
        }),
        sensitivityPST: parameters.sensitivityPST?.map((pst) => {
            return {
                ...pst,
                monitoredBranches: mapEquipmentsContainerToIds(pst.monitoredBranches),
                psts: mapEquipmentsContainerToIds(pst.psts),
                contingencies: mapEquipmentsContainerToIds(pst.contingencies),
            };
        }),
        sensitivityNodes: parameters.sensitivityNodes?.map((nodes) => {
            return {
                ...nodes,
                monitoredVoltageLevels: mapEquipmentsContainerToIds(nodes.monitoredVoltageLevels),
                equipmentsInVoltageRegulation: mapEquipmentsContainerToIds(nodes.equipmentsInVoltageRegulation),
                contingencies: mapEquipmentsContainerToIds(nodes.contingencies),
            };
        }),
    };
}

function getEquipmentsContainerIds(parameters: SensitivityAnalysisParametersInfos): Set<string> {
    const allContainerIds = new Set<string>();

    parameters.sensitivityInjection?.forEach((i) => {
        i.monitoredBranches?.forEach((id) => allContainerIds.add(id));
        i.injections?.forEach((id) => allContainerIds.add(id));
        i.contingencies?.forEach((id) => allContainerIds.add(id));
    });

    parameters.sensitivityInjectionsSet?.forEach((is) => {
        is.monitoredBranches?.forEach((id) => allContainerIds.add(id));
        is.injections?.forEach((id) => allContainerIds.add(id));
        is.contingencies?.forEach((id) => allContainerIds.add(id));
    });

    parameters.sensitivityHVDC?.forEach((hvdc) => {
        hvdc.monitoredBranches?.forEach((id) => allContainerIds.add(id));
        hvdc.hvdcs?.forEach((id) => allContainerIds.add(id));
        hvdc.contingencies?.forEach((id) => allContainerIds.add(id));
    });

    parameters.sensitivityPST?.forEach((pst) => {
        pst.monitoredBranches?.forEach((id) => allContainerIds.add(id));
        pst.psts?.forEach((id) => allContainerIds.add(id));
        pst.contingencies?.forEach((id) => allContainerIds.add(id));
    });

    parameters.sensitivityNodes?.forEach((n) => {
        n.monitoredVoltageLevels?.forEach((id) => allContainerIds.add(id));
        n.equipmentsInVoltageRegulation?.forEach((id) => allContainerIds.add(id));
        n.contingencies?.forEach((id) => allContainerIds.add(id));
    });

    return allContainerIds;
}

export function enrichSensitivityAnalysisParameters(
    parameters: SensitivityAnalysisParametersInfos
): Promise<SensitivityAnalysisParametersInfosEnriched> {
    const allElementIds = getEquipmentsContainerIds(parameters);

    const elementNamesPromise = allElementIds.size === 0 ? Promise.resolve(null) : fetchElementNames(allElementIds);

    return elementNamesPromise.then((elementNames) => {
        const mapIdsToEquipmentsContainer = (ids: UUID[] | undefined): EquipmentsContainer[] => {
            return ids
                ? ids.map((id) => ({
                      containerId: id,
                      containerName: elementNames?.[id] ?? null,
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
