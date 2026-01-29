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

// common parameters
export const SHORT_CIRCUIT_WITH_FEEDER_RESULT = 'withFeederResult';
export const SHORT_CIRCUIT_PREDEFINED_PARAMS = 'predefinedParameters';
export const SHORT_CIRCUIT_WITH_LOADS = 'withLoads';
export const SHORT_CIRCUIT_WITH_VSC_CONVERTER_STATIONS = 'withVSCConverterStations';
export const SHORT_CIRCUIT_WITH_SHUNT_COMPENSATORS = 'withShuntCompensators';
export const SHORT_CIRCUIT_WITH_NEUTRAL_POSITION = 'withNeutralPosition';
export const SHORT_CIRCUIT_INITIAL_VOLTAGE_PROFILE_MODE = 'initialVoltageProfileMode';
export const SHORT_CIRCUIT_VOLTAGE_RANGES = 'voltageRanges';

// specific parameters
export const SHORT_CIRCUIT_ONLY_STARTED_GENERATORS_IN_CALCULATION_CLUSTER = 'onlyStartedGeneratorsInCalculationCluster';
export const SHORT_CIRCUIT_ONLY_STARTED_GENERATORS_OUTSIDE_CALCULATION_CLUSTER =
    'onlyStartedGeneratorsOutsideCalculationCluster';
export const SHORT_CIRCUIT_IN_CALCULATION_CLUSTER_FILTERS = 'inCalculationClusterFilters';
export const SHORT_CIRCUIT_MODEL_POWER_ELECTRONICS = 'modelPowerElectronics';
export const SHORT_CIRCUIT_POWER_ELECTRONICS_MATERIALS = 'powerElectronicsMaterials';

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

export const onlyStartedGeneratorsOptions = {
    ALL: {
        id: 'false',
        label: 'ShortCircuitAllLabel',
    },
    STARTED: {
        id: 'true',
        label: 'ShortCircuitStartedLabel',
    },
};

export enum ShortCircuitTabValues {
    'General' = 0,
    'StudyArea' = 1,
}
