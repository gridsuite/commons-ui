/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { FullField } from 'react-querybuilder';
import { UUID } from 'crypto';

export enum OperatorType {
    EQUALS = 'EQUALS',
    NOT_EQUALS = 'NOT_EQUALS',
    LOWER = 'LOWER',
    LOWER_OR_EQUALS = 'LOWER_OR_EQUALS',
    GREATER = 'GREATER',
    GREATER_OR_EQUALS = 'GREATER_OR_EQUALS',
    BETWEEN = 'BETWEEN',
    IN = 'IN',
    IS = 'IS',
    CONTAINS = 'CONTAINS',
    BEGINS_WITH = 'BEGINS_WITH',
    ENDS_WITH = 'ENDS_WITH',
    EXISTS = 'EXISTS',
    NOT_EXISTS = 'NOT_EXISTS',
    IS_PART_OF = 'IS_PART_OF',
    IS_NOT_PART_OF = 'IS_NOT_PART_OF',
}

export enum CombinatorType {
    AND = 'AND',
    OR = 'OR',
}

export enum FieldType {
    ID = 'ID',
    NAME = 'NAME',
    NOMINAL_VOLTAGE = 'NOMINAL_VOLTAGE',
    MIN_P = 'MIN_P',
    MAX_P = 'MAX_P',
    TARGET_V = 'TARGET_V',
    TARGET_P = 'TARGET_P',
    TARGET_Q = 'TARGET_Q',
    ENERGY_SOURCE = 'ENERGY_SOURCE',
    COUNTRY = 'COUNTRY',
    VOLTAGE_REGULATOR_ON = 'VOLTAGE_REGULATOR_ON',
    PLANNED_ACTIVE_POWER_SET_POINT = 'PLANNED_ACTIVE_POWER_SET_POINT',
    RATED_S = 'RATED_S',
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
    VOLTAGE_LEVEL_ID_1 = 'VOLTAGE_LEVEL_ID_1',
    VOLTAGE_LEVEL_ID_2 = 'VOLTAGE_LEVEL_ID_2',
    NOMINAL_VOLTAGE_1 = 'NOMINAL_VOLTAGE_1',
    NOMINAL_VOLTAGE_2 = 'NOMINAL_VOLTAGE_2',
    COUNTRY_1 = 'COUNTRY_1',
    COUNTRY_2 = 'COUNTRY_2',
    SERIE_RESISTANCE = 'SERIE_RESISTANCE',
    SERIE_REACTANCE = 'SERIE_REACTANCE',
    SHUNT_CONDUCTANCE_1 = 'SHUNT_CONDUCTANCE_1',
    SHUNT_CONDUCTANCE_2 = 'SHUNT_CONDUCTANCE_2',
    SHUNT_SUSCEPTANCE_1 = 'SHUNT_SUSCEPTANCE_1',
    SHUNT_SUSCEPTANCE_2 = 'SHUNT_SUSCEPTANCE_2',
    MAGNETIZING_CONDUCTANCE = 'MAGNETIZING_CONDUCTANCE',
    MAGNETIZING_SUSCEPTANCE = 'MAGNETIZING_SUSCEPTANCE',
    LOAD_TYPE = 'LOAD_TYPE',
    RATED_VOLTAGE_1 = 'RATED_VOLTAGE_1',
    RATED_VOLTAGE_2 = 'RATED_VOLTAGE_2',
    HAS_RATIO_TAP_CHANGER = 'HAS_RATIO_TAP_CHANGER',
    LOAD_TAP_CHANGING_CAPABILITIES = 'LOAD_TAP_CHANGING_CAPABILITIES',
    RATIO_REGULATION_MODE = 'RATIO_REGULATION_MODE',
    RATIO_TARGET_V = 'RATIO_TARGET_V',
    HAS_PHASE_TAP_CHANGER = 'HAS_PHASE_TAP_CHANGER',
    PHASE_REGULATION_MODE = 'PHASE_REGULATION_MODE',
    PHASE_REGULATION_VALUE = 'PHASE_REGULATION_VALUE',
    PROPERTY = 'FREE_PROPERTIES',
    SUBSTATION_PROPERTY = 'SUBSTATION_PROPERTIES',
    SUBSTATION_PROPERTY_1 = 'SUBSTATION_PROPERTIES_1',
    SUBSTATION_PROPERTY_2 = 'SUBSTATION_PROPERTIES_2',
    VOLTAGE_LEVEL_PROPERTY = 'VOLTAGE_LEVEL_PROPERTIES',
    VOLTAGE_LEVEL_PROPERTY_1 = 'VOLTAGE_LEVEL_PROPERTIES_1',
    VOLTAGE_LEVEL_PROPERTY_2 = 'VOLTAGE_LEVEL_PROPERTIES_2',
    SVAR_REGULATION_MODE = 'SVAR_REGULATION_MODE',
    VOLTAGE_SET_POINT = 'VOLTAGE_SET_POINT',
    ACTIVE_POWER_SET_POINT = 'ACTIVE_POWER_SET_POINT',
    REACTIVE_POWER_SET_POINT = 'REACTIVE_POWER_SET_POINT',
    REMOTE_REGULATED_TERMINAL = 'REMOTE_REGULATED_TERMINAL', // composite rule of REGULATING_TERMINAL_VL_ID and/or REGULATING_TERMINAL_CONNECTABLE_ID
    REGULATING_TERMINAL_VL_ID = 'REGULATING_TERMINAL_VL_ID',
    REGULATING_TERMINAL_CONNECTABLE_ID = 'REGULATING_TERMINAL_CONNECTABLE_ID',
    REGULATION_TYPE = 'REGULATION_TYPE',
    AUTOMATE = 'AUTOMATE',
    LOW_VOLTAGE_SET_POINT = 'LOW_VOLTAGE_SET_POINT',
    HIGH_VOLTAGE_SET_POINT = 'HIGH_VOLTAGE_SET_POINT',
    LOW_VOLTAGE_THRESHOLD = 'LOW_VOLTAGE_THRESHOLD',
    HIGH_VOLTAGE_THRESHOLD = 'HIGH_VOLTAGE_THRESHOLD',
    SUSCEPTANCE_FIX = 'SUSCEPTANCE_FIX',
    CONVERTERS_MODE = 'CONVERTERS_MODE',
    CONVERTER_STATION_ID_1 = 'CONVERTER_STATION_ID_1',
    CONVERTER_STATION_ID_2 = 'CONVERTER_STATION_ID_2',
    CONVERTER_STATION_NOMINAL_VOLTAGE_1 = 'CONVERTER_STATION_NOMINAL_VOLTAGE_1',
    CONVERTER_STATION_NOMINAL_VOLTAGE_2 = 'CONVERTER_STATION_NOMINAL_VOLTAGE_2',
    DC_NOMINAL_VOLTAGE = 'DC_NOMINAL_VOLTAGE',
    P_ABSOLUTE = 'P_ABSOLUTE',
}

export enum DataType {
    STRING = 'STRING',
    ENUM = 'ENUM',
    NUMBER = 'NUMBER',
    BOOLEAN = 'BOOLEAN',
    COMBINATOR = 'COMBINATOR',
    FILTER_UUID = 'FILTER_UUID',
    PROPERTY = 'PROPERTIES',
}

export type OperatorOption = {
    name: string;
    customName: string;
    label: string;
};

// This type is equivalent to a (partial) union type of BooleanExpertRule,
// NumberExpertRule, StringExpertRule, PropertiesExpertRule in filter library
export interface RuleTypeExport {
    id?: UUID;
    field: FieldType;
    operator: OperatorType;
    value: string | number | undefined;
    values: string[] | number[] | undefined;
    dataType: DataType;
    propertyName?: string;
    propertyValues?: string[];
}

// This type is equivalent to CombinatorExpertRule in filter library
export interface RuleGroupTypeExport {
    id?: UUID;
    combinator: CombinatorType;
    dataType: DataType;
    field?: FieldType; // used in case of composite rule
    operator?: OperatorType; // used in case of composite rule
    rules: (RuleTypeExport | RuleGroupTypeExport)[];
}

// typing composite rule schema
export interface CompositeField extends FullField {
    combinator?: string;
    children?: { [field: string]: FullField };
}

// typing composite rule value
export interface CompositeGroup {
    id?: string;
    combinator: string;
    rules: {
        [field: string]: CompositeRule;
    };
}

export interface CompositeRule {
    operator: string;
    value: any;
}
