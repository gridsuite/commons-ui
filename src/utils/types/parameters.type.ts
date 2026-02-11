/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import type { UUID } from 'node:crypto';
import { ComputingType } from '../../components/parameters/common/computing-type';
import { LoadFlowParametersInfos } from './loadflow.type';
import { DynamicSecurityAnalysisParametersFetchReturn } from './dynamic-security-analysis.type';
import type { ILimitReductionsByVoltageLevel } from '../../components/parameters/common/limitreductions/columns-definitions';
import { DynamicSimulationParametersFetchReturn } from './dynamic-simulation.type';
import { SensitivityAnalysisParametersInfos } from './sensitivity-analysis.type';
import { type ShortCircuitParametersInfos } from '../../components/parameters/short-circuit/short-circuit-parameters.type';
import { ISAParameters } from '../../components/parameters/security-analysis/type';

export enum ParameterType {
    BOOLEAN = 'BOOLEAN',
    STRING = 'STRING',
    STRING_LIST = 'STRING_LIST',
    DOUBLE = 'DOUBLE',
    INTEGER = 'INTEGER',
    COUNTRIES = 'COUNTRIES',
}

export type SpecificParameterInfos = {
    name: string;
    type: ParameterType;
    names?: string[];
    defaultValue?: any;
    possibleValues?: any[];
    categoryKey?: string;
    description?: string;
    label?: string;
};

export type SpecificParametersDescription = Record<string, SpecificParameterInfos[]>;
export type SpecificParametersValues = Record<string, any>;
export type SpecificParametersPerProvider = Record<string, SpecificParametersValues>;

export type ParametersInfos<T extends ComputingType> = T extends ComputingType.SENSITIVITY_ANALYSIS
    ? SensitivityAnalysisParametersInfos
    : T extends ComputingType.SECURITY_ANALYSIS
      ? ISAParameters
      : T extends ComputingType.LOAD_FLOW
        ? LoadFlowParametersInfos
        : T extends ComputingType.DYNAMIC_SIMULATION
          ? DynamicSimulationParametersFetchReturn
          : T extends ComputingType.DYNAMIC_SECURITY_ANALYSIS
            ? DynamicSecurityAnalysisParametersFetchReturn
            : T extends ComputingType.SHORT_CIRCUIT
              ? ShortCircuitParametersInfos
              : Record<string, any>;

export type UseParametersBackendReturnProps<T extends ComputingType> = [
    Record<string, string>,
    string | undefined,
    (studyUuid: UUID) => void,
    (newProvider: string) => void,
    () => void,
    ParametersInfos<T> | null,
    (studyUuid: UUID) => void,
    (newParams: ParametersInfos<T>) => void,
    () => Promise<void> | undefined,
    SpecificParametersDescription | null,
    ILimitReductionsByVoltageLevel[],
];
