/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

export enum FieldType {
    ID = 'ID',
    NAME = 'NAME',
    FREE_PROPERTIES = 'FREE_PROPERTIES',
    NOMINAL_VOLTAGE = 'NOMINAL_VOLTAGE',
    MIN_P = 'MIN_P',
    MAX_P = 'MAX_P',
    P = 'P',
    Q = 'Q',
    P_ABSOLUTE = 'P_ABSOLUTE',
    Q_ABSOLUTE = 'Q_ABSOLUTE',
    TARGET_V = 'TARGET_V',
    TARGET_P = 'TARGET_P',
    TARGET_Q = 'TARGET_Q',
    ENERGY_SOURCE = 'ENERGY_SOURCE',
    COUNTRY = 'COUNTRY',
    VOLTAGE_REGULATOR_ON = 'VOLTAGE_REGULATOR_ON',
    PLANNED_ACTIVE_POWER_SET_POINT = 'PLANNED_ACTIVE_POWER_SET_POINT',
    RATED_S = 'RATED_S',
    RATED_S1 = 'RATED_S1',
    RATED_S2 = 'RATED_S2',
    RATED_S3 = 'RATED_S3',
    MARGINAL_COST = 'MARGINAL_COST',
    PLANNED_OUTAGE_RATE = 'PLANNED_OUTAGE_RATE',
    FORCED_OUTAGE_RATE = 'FORCED_OUTAGE_RATE',
    VOLTAGE_LEVEL_ID = 'VOLTAGE_LEVEL_ID',
    P0 = 'P0',
    Q0 = 'Q0',
    LOW_VOLTAGE_LIMIT = 'LOW_VOLTAGE_LIMIT',
    HIGH_VOLTAGE_LIMIT = 'HIGH_VOLTAGE_LIMIT',
    SECTION_COUNT = 'SECTION_COUNT',
    MAXIMUM_SECTION_COUNT = 'MAXIMUM_SECTION_COUNT',
    SHUNT_COMPENSATOR_TYPE = 'SHUNT_COMPENSATOR_TYPE',
    CONNECTED = 'CONNECTED',
    MAX_Q_AT_NOMINAL_V = 'MAX_Q_AT_NOMINAL_V',
    MIN_Q_AT_NOMINAL_V = 'MIN_Q_AT_NOMINAL_V',
    FIX_Q_AT_NOMINAL_V = 'FIX_Q_AT_NOMINAL_V',
    SWITCHED_ON_Q_AT_NOMINAL_V = 'SWITCHED_ON_Q_AT_NOMINAL_V',
    MAX_SUSCEPTANCE = 'MAX_SUSCEPTANCE',
    MIN_SUSCEPTANCE = 'MIN_SUSCEPTANCE',
    SWITCHED_ON_SUSCEPTANCE = 'SWITCHED_ON_SUSCEPTANCE',
    CONNECTED_1 = 'CONNECTED_1',
    CONNECTED_2 = 'CONNECTED_2',
    CONNECTED_3 = 'CONNECTED_3',
    VOLTAGE_LEVEL_ID_1 = 'VOLTAGE_LEVEL_ID_1',
    VOLTAGE_LEVEL_ID_2 = 'VOLTAGE_LEVEL_ID_2',
    VOLTAGE_LEVEL_ID_3 = 'VOLTAGE_LEVEL_ID_3',
    NOMINAL_VOLTAGE_1 = 'NOMINAL_VOLTAGE_1',
    NOMINAL_VOLTAGE_2 = 'NOMINAL_VOLTAGE_2',
    NOMINAL_VOLTAGE_3 = 'NOMINAL_VOLTAGE_3',
    COUNTRY_1 = 'COUNTRY_1',
    COUNTRY_2 = 'COUNTRY_2',
    SERIE_RESISTANCE = 'SERIE_RESISTANCE',
    SERIE_RESISTANCE_1 = 'SERIE_RESISTANCE_1',
    SERIE_RESISTANCE_2 = 'SERIE_RESISTANCE_2',
    SERIE_RESISTANCE_3 = 'SERIE_RESISTANCE_3',
    SERIE_REACTANCE = 'SERIE_REACTANCE',
    SERIE_REACTANCE_1 = 'SERIE_REACTANCE_1',
    SERIE_REACTANCE_2 = 'SERIE_REACTANCE_2',
    SERIE_REACTANCE_3 = 'SERIE_REACTANCE_3',
    SHUNT_CONDUCTANCE = 'SHUNT_CONDUCTANCE',
    SHUNT_CONDUCTANCE_1 = 'SHUNT_CONDUCTANCE_1',
    SHUNT_CONDUCTANCE_2 = 'SHUNT_CONDUCTANCE_2',
    SHUNT_SUSCEPTANCE = 'SHUNT_SUSCEPTANCE',
    SHUNT_SUSCEPTANCE_1 = 'SHUNT_SUSCEPTANCE_1',
    SHUNT_SUSCEPTANCE_2 = 'SHUNT_SUSCEPTANCE_2',
    MAGNETIZING_CONDUCTANCE = 'MAGNETIZING_CONDUCTANCE',
    MAGNETIZING_CONDUCTANCE_1 = 'MAGNETIZING_CONDUCTANCE_1',
    MAGNETIZING_CONDUCTANCE_2 = 'MAGNETIZING_CONDUCTANCE_2',
    MAGNETIZING_CONDUCTANCE_3 = 'MAGNETIZING_CONDUCTANCE_3',
    MAGNETIZING_SUSCEPTANCE = 'MAGNETIZING_SUSCEPTANCE',
    MAGNETIZING_SUSCEPTANCE_1 = 'MAGNETIZING_SUSCEPTANCE_1',
    MAGNETIZING_SUSCEPTANCE_2 = 'MAGNETIZING_SUSCEPTANCE_2',
    MAGNETIZING_SUSCEPTANCE_3 = 'MAGNETIZING_SUSCEPTANCE_3',
    LOAD_TYPE = 'LOAD_TYPE',
    RATED_VOLTAGE_0 = 'RATED_VOLTAGE_0',
    RATED_VOLTAGE_1 = 'RATED_VOLTAGE_1',
    RATED_VOLTAGE_2 = 'RATED_VOLTAGE_2',
    RATED_VOLTAGE_3 = 'RATED_VOLTAGE_3',
    HAS_RATIO_TAP_CHANGER = 'HAS_RATIO_TAP_CHANGER',
    HAS_RATIO_TAP_CHANGER_1 = 'HAS_RATIO_TAP_CHANGER_1',
    HAS_RATIO_TAP_CHANGER_2 = 'HAS_RATIO_TAP_CHANGER_2',
    HAS_RATIO_TAP_CHANGER_3 = 'HAS_RATIO_TAP_CHANGER_3',
    LOAD_TAP_CHANGING_CAPABILITIES = 'LOAD_TAP_CHANGING_CAPABILITIES',
    LOAD_TAP_CHANGING_CAPABILITIES_1 = 'LOAD_TAP_CHANGING_CAPABILITIES_1',
    LOAD_TAP_CHANGING_CAPABILITIES_2 = 'LOAD_TAP_CHANGING_CAPABILITIES_2',
    LOAD_TAP_CHANGING_CAPABILITIES_3 = 'LOAD_TAP_CHANGING_CAPABILITIES_3',
    RATIO_REGULATION_MODE = 'RATIO_REGULATION_MODE',
    RATIO_REGULATION_MODE_1 = 'RATIO_REGULATION_MODE_1',
    RATIO_REGULATION_MODE_2 = 'RATIO_REGULATION_MODE_2',
    RATIO_REGULATION_MODE_3 = 'RATIO_REGULATION_MODE_3',
    RATIO_TARGET_V = 'RATIO_TARGET_V',
    RATIO_TARGET_V1 = 'RATIO_TARGET_V1',
    RATIO_TARGET_V2 = 'RATIO_TARGET_V2',
    RATIO_TARGET_V3 = 'RATIO_TARGET_V3',
    HAS_PHASE_TAP_CHANGER = 'HAS_PHASE_TAP_CHANGER',
    HAS_PHASE_TAP_CHANGER_1 = 'HAS_PHASE_TAP_CHANGER_1',
    HAS_PHASE_TAP_CHANGER_2 = 'HAS_PHASE_TAP_CHANGER_2',
    HAS_PHASE_TAP_CHANGER_3 = 'HAS_PHASE_TAP_CHANGER_3',
    PHASE_REGULATION_MODE = 'PHASE_REGULATION_MODE',
    PHASE_REGULATION_MODE_1 = 'PHASE_REGULATION_MODE_1',
    PHASE_REGULATION_MODE_2 = 'PHASE_REGULATION_MODE_2',
    PHASE_REGULATION_MODE_3 = 'PHASE_REGULATION_MODE_3',
    PHASE_REGULATION_VALUE = 'PHASE_REGULATION_VALUE',
    PHASE_REGULATION_VALUE_1 = 'PHASE_REGULATION_VALUE_1',
    PHASE_REGULATION_VALUE_2 = 'PHASE_REGULATION_VALUE_2',
    PHASE_REGULATION_VALUE_3 = 'PHASE_REGULATION_VALUE_3',
    SUBSTATION_ID = 'SUBSTATION_ID',
    SUBSTATION_ID_1 = 'SUBSTATION_ID_1',
    SUBSTATION_ID_2 = 'SUBSTATION_ID_2',
    SUBSTATION_PROPERTIES = 'SUBSTATION_PROPERTIES',
    SUBSTATION_PROPERTIES_1 = 'SUBSTATION_PROPERTIES_1',
    SUBSTATION_PROPERTIES_2 = 'SUBSTATION_PROPERTIES_2',
    VOLTAGE_LEVEL_PROPERTIES = 'VOLTAGE_LEVEL_PROPERTIES',
    VOLTAGE_LEVEL_PROPERTIES_1 = 'VOLTAGE_LEVEL_PROPERTIES_1',
    VOLTAGE_LEVEL_PROPERTIES_2 = 'VOLTAGE_LEVEL_PROPERTIES_2',
    VOLTAGE_LEVEL_PROPERTIES_3 = 'VOLTAGE_LEVEL_PROPERTIES_3',
    SVAR_REGULATION_MODE = 'SVAR_REGULATION_MODE',
    VOLTAGE_SET_POINT = 'VOLTAGE_SET_POINT',
    ACTIVE_POWER_SET_POINT = 'ACTIVE_POWER_SET_POINT',
    REACTIVE_POWER_SET_POINT = 'REACTIVE_POWER_SET_POINT',
    REMOTE_REGULATED_TERMINAL = 'REMOTE_REGULATED_TERMINAL',
    REGULATING_TERMINAL_VL_ID = 'REGULATING_TERMINAL_VL_ID',
    REGULATING_TERMINAL_CONNECTABLE_ID = 'REGULATING_TERMINAL_CONNECTABLE_ID',
    REGULATION_TYPE = 'REGULATION_TYPE',
    AUTOMATE = 'AUTOMATE',
    LOW_VOLTAGE_SET_POINT = 'LOW_VOLTAGE_SET_POINT',
    HIGH_VOLTAGE_SET_POINT = 'HIGH_VOLTAGE_SET_POINT',
    LOW_VOLTAGE_THRESHOLD = 'LOW_VOLTAGE_THRESHOLD',
    HIGH_VOLTAGE_THRESHOLD = 'HIGH_VOLTAGE_THRESHOLD',
    SUSCEPTANCE_FIX = 'SUSCEPTANCE_FIX',
    PAIRED = 'PAIRED',
    CONVERTERS_MODE = 'CONVERTERS_MODE',
    CONVERTER_STATION_ID_1 = 'CONVERTER_STATION_ID_1',
    CONVERTER_STATION_ID_2 = 'CONVERTER_STATION_ID_2',
    CONVERTER_STATION_NOMINAL_VOLTAGE_1 = 'CONVERTER_STATION_NOMINAL_VOLTAGE_1',
    CONVERTER_STATION_NOMINAL_VOLTAGE_2 = 'CONVERTER_STATION_NOMINAL_VOLTAGE_2',
    DC_NOMINAL_VOLTAGE = 'DC_NOMINAL_VOLTAGE',
    PAIRING_KEY = 'PAIRING_KEY',
    TIE_LINE_ID = 'TIE_LINE_ID',
    LOW_SHORT_CIRCUIT_CURRENT_LIMIT = 'LOW_SHORT_CIRCUIT_CURRENT_LIMIT',
    HIGH_SHORT_CIRCUIT_CURRENT_LIMIT = 'HIGH_SHORT_CIRCUIT_CURRENT_LIMIT',
    R = 'R',
    X = 'X',
    G = 'G',
    G1 = 'G1',
    G2 = 'G2',
    B = 'B',
    B1 = 'B1',
    B2 = 'B2',
    RATED_NOMINAL_POWER = 'RATED_NOMINAL_POWER',
    MINIMUM_ACTIVE_POWER = 'MINIMUM_ACTIVE_POWER',
    MAXIMUM_ACTIVE_POWER = 'MAXIMUM_ACTIVE_POWER',
    DROOP = 'DROOP',
    TRANSIENT_REACTANCE = 'TRANSIENT_REACTANCE',
    STEP_UP_TRANSFORMER_REACTANCE = 'STEP_UP_TRANSFORMER_REACTANCE',
    Q_PERCENT = 'Q_PERCENT',
    ACTIVE_POWER = 'ACTIVE_POWER',
    REACTIVE_POWER = 'REACTIVE_POWER',
    RATED_U1 = 'RATED_U1',
    RATED_U2 = 'RATED_U2',
    RATIO_LOW_TAP_POSITION = 'RATIO_LOW_TAP_POSITION',
    RATIO_TAP_POSITION = 'RATIO_TAP_POSITION',
    RATIO_TARGET_DEADBAND = 'RATIO_TARGET_DEADBAND',
    REGULATION_VALUE = 'REGULATION_VALUE',
    PHASE_LOW_TAP_POSITION = 'PHASE_LOW_TAP_POSITION',
    PHASE_TAP_POSITION = 'PHASE_TAP_POSITION',
    PHASE_TARGET_DEADBAND = 'PHASE_TARGET_DEADBAND',
    SELECTED_OPERATIONAL_LIMITS_GROUP_1 = 'SELECTED_OPERATIONAL_LIMITS_GROUP_1',
    SELECTED_OPERATIONAL_LIMITS_GROUP_2 = 'SELECTED_OPERATIONAL_LIMITS_GROUP_2',
}
