/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import type { UUID } from 'node:crypto';

import { EquipmentsContainer } from '../../../utils';

type EquipmentInfos = EquipmentsContainer | UUID;

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

interface SensitivityParamsCommon<T extends EquipmentInfos> {
    contingencyLists?: T[];
    activated?: boolean | null;
}

export interface SensitivityInjectionsSet<T extends EquipmentInfos> extends SensitivityParamsCommon<T> {
    monitoredBranches?: T[];
    injections?: T[];
    distributionType?: DistributionType;
}

export interface SensitivityInjection<T extends EquipmentInfos> extends SensitivityParamsCommon<T> {
    monitoredBranches?: T[];
    injections?: T[];
}

export interface SensitivityHVDC<T extends EquipmentInfos> extends SensitivityParamsCommon<T> {
    monitoredBranches?: T[];
    sensitivityType?: SensitivityType;
    hvdcs?: T[];
}

export interface SensitivityPST<T extends EquipmentInfos> extends SensitivityParamsCommon<T> {
    monitoredBranches?: T[];
    sensitivityType?: SensitivityType;
    psts?: T[];
}

export interface SensitivityNodes<T extends EquipmentInfos> extends SensitivityParamsCommon<T> {
    monitoredVoltageLevels?: T[];
    equipmentsInVoltageRegulation?: T[];
}

export interface SensitivityAnalysisParameters<T extends EquipmentInfos> {
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

export type SensitivityAnalysisParametersInfos = SensitivityAnalysisParameters<UUID>;
export type SensitivityAnalysisParametersInfosEnriched = SensitivityAnalysisParameters<EquipmentsContainer>;

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
