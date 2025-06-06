/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

export enum InitialVoltage {
    NOMINAL = 'NOMINAL',
    CEI909 = 'CEI909',
    CONFIGURED = 'CONFIGURED',
}

export enum PredefinedParameters {
    ICC_MAX_WITH_NOMINAL_VOLTAGE_MAP = 'ICC_MAX_WITH_NOMINAL_VOLTAGE_MAP',
    ICC_MAX_WITH_CEI909 = 'ICC_MAX_WITH_CEI909',
    ICC_MIN_WITH_NOMINAL_VOLTAGE_MAP = 'ICC_MIN_WITH_NOMINAL_VOLTAGE_MAP',
}

export const SHORT_CIRCUIT_WITH_FEEDER_RESULT = 'withFeederResult';
export const SHORT_CIRCUIT_PREDEFINED_PARAMS = 'predefinedParameters';
export const SHORT_CIRCUIT_WITH_LOADS = 'withLoads';
export const SHORT_CIRCUIT_WITH_VSC_CONVERTER_STATIONS = 'withVSCConverterStations';
export const SHORT_CIRCUIT_WITH_SHUNT_COMPENSATORS = 'withShuntCompensators';
export const SHORT_CIRCUIT_WITH_NEUTRAL_POSITION = 'withNeutralPosition';
export const SHORT_CIRCUIT_INITIAL_VOLTAGE_PROFILE_MODE = 'initialVoltageProfileMode';

export const intlPredefinedParametersOptions = () => [
    {
        id: 'ICC_MAX_WITH_NOMINAL_VOLTAGE_MAP',
        label: 'iccMawWithNominalVoltageMapPredefinedParams',
    },
    {
        id: 'ICC_MAX_WITH_CEI909',
        label: 'iccMaxWithCEIPredefinedParams',
    },
    {
        id: 'ICC_MIN_WITH_NOMINAL_VOLTAGE_MAP',
        label: 'iscMinWithNominalVoltageMapPredefinedParams',
    },
];

export const intlInitialVoltageProfileMode = () => {
    return {
        NOMINAL: {
            id: 'NOMINAL',
            label: 'nominalInitialVoltageProfileMode',
        },
        CEI909: {
            id: 'CEI909',
            label: 'cei909InitialVoltageProfileMode',
        },
    };
};
