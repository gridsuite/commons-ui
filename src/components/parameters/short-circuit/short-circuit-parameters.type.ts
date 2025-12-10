/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { SpecificParametersPerProvider } from '../../../utils';
import { InitialVoltage, PredefinedParameters } from './constants';

export interface VoltageRange {
    minimumNominalVoltage: number;
    maximumNominalVoltage: number;
    voltage: number;
    voltageRangeCoefficient: number;
}

export interface PowerElectronicsMaterial {
    alpha: number;
    u0: number;
    usMin: number;
    usMax: number;
    type: 'WIND' | 'SOLAR' | 'HVDC';
}

export interface ShortCircuitParametersDto {
    withFeederResult: boolean;
    withLoads: boolean;
    withVSCConverterStations: boolean;
    withShuntCompensators: boolean;
    withNeutralPosition: boolean;
    initialVoltageProfileMode: InitialVoltage;
    voltageRanges?: VoltageRange[];
}

export interface ShortCircuitParametersInfos {
    provider: string;
    predefinedParameters: PredefinedParameters;
    commonParameters: ShortCircuitParametersDto;
    specificParametersPerProvider: SpecificParametersPerProvider;
    cei909VoltageRanges?: VoltageRange[];
}
