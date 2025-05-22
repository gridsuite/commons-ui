/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { INITIAL_VOLTAGE, PREDEFINED_PARAMETERS } from './constants';

export interface VoltageRange {
    minimumNominalVoltage: number;
    maximumNominalVoltage: number;
}

export interface ShortCircuitParametersDto {
    withFeederResult: boolean;
    withLoads: boolean;
    withVSCConverterStations: boolean;
    withShuntCompensators: boolean;
    withNeutralPosition: boolean;
    initialVoltageProfileMode: INITIAL_VOLTAGE;
    voltageRanges?: VoltageRange[];
}

export interface ShortCircuitParametersInfos {
    parameters: ShortCircuitParametersDto;
    predefinedParameters: PREDEFINED_PARAMETERS;
    cei909VoltageRanges?: any;
}

interface VoltageRanges {
    maximumNominalVoltage: number;
    minimumNominalVoltage: number;
    voltage: number;
    voltageRangeCoefficient: number;
}
export interface ShortCircuitParameters {
    predefinedParameters: NonNullable<PREDEFINED_PARAMETERS | undefined>;
    parameters: {
        withFeederResult: boolean;
        withLoads: boolean;
        withVSCConverterStations: boolean;
        withShuntCompensators: boolean;
        withNeutralPosition: boolean;
        initialVoltageProfileMode: NonNullable<INITIAL_VOLTAGE | undefined>;
        voltageRanges?: VoltageRanges;
    };
}
