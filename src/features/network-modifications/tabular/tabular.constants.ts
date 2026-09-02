/*
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 * SPDX-License-Identifier: MPL-2.0
 */

import { LOAD_TYPES, UNDEFINED_LOAD_TYPE } from '../../../utils';

/**
 * Field names specific to the tabular creation/modification CSV format.
 * Every other column name comes from {@link FieldConstants}.
 */
export enum TabularFieldConstants {
    // /!\ the tabular CSV column is 'equipmentId', not FieldConstants.EQUIPMENT_ID ('equipmentID')
    EQUIPMENT_ID = 'equipmentId',
    CSV_FILENAME = 'csvFilename',
    MODIFICATIONS_TABLE = 'modificationsTable',
    TABULAR_PROPERTIES = 'properties',
    PREDEFINED = 'predefined',
    BUS_OR_BUSBAR_SECTION_ID = 'busOrBusbarSectionId',
    MIN_P = 'minP',
    MAX_P = 'maxP',
    P0 = 'p0',
    TARGET_P = 'targetP',
    TARGET_Q = 'targetQ',
    PARTICIPATE = 'participate',
    VOLTAGE_REGULATION_ON = 'voltageRegulationOn',
    REGULATING_TERMINAL_ID = 'regulatingTerminalId',
    REGULATING_TERMINAL_TYPE = 'regulatingTerminalType',
    STEP_UP_TRANSFORMER_REACTANCE = 'stepUpTransformerX',
    REACTIVE_CAPABILITY_CURVE = 'reactiveCapabilityCurve',
    REACTIVE_CAPABILITY_CURVE_POINTS = 'reactiveCapabilityCurvePoints',
    REACTIVE_CAPABILITY_CURVE_P_MIN = 'reactiveCapabilityCurvePmin',
    REACTIVE_CAPABILITY_CURVE_Q_MIN_P_MIN = 'reactiveCapabilityCurveQminPmin',
    REACTIVE_CAPABILITY_CURVE_Q_MAX_P_MIN = 'reactiveCapabilityCurveQmaxPmin',
    REACTIVE_CAPABILITY_CURVE_P_0 = 'reactiveCapabilityCurveP0',
    REACTIVE_CAPABILITY_CURVE_Q_MIN_P_0 = 'reactiveCapabilityCurveQminP0',
    REACTIVE_CAPABILITY_CURVE_Q_MAX_P_0 = 'reactiveCapabilityCurveQmaxP0',
    REACTIVE_CAPABILITY_CURVE_P_MAX = 'reactiveCapabilityCurvePmax',
    REACTIVE_CAPABILITY_CURVE_Q_MIN_P_MAX = 'reactiveCapabilityCurveQminPmax',
    REACTIVE_CAPABILITY_CURVE_Q_MAX_P_MAX = 'reactiveCapabilityCurveQmaxPmax',
    CONNECTED1 = 'terminal1Connected',
    CONNECTED2 = 'terminal2Connected',
    CONNECTION_NAME1 = 'connectionName1',
    CONNECTION_NAME2 = 'connectionName2',
    CONNECTION_DIRECTION1 = 'connectionDirection1',
    CONNECTION_DIRECTION2 = 'connectionDirection2',
    CONNECTION_POSITION1 = 'connectionPosition1',
    CONNECTION_POSITION2 = 'connectionPosition2',
    IP_MIN = 'ipMin',
    IP_MAX = 'ipMax',
    RATIO_TAP_CHANGER_LOAD_TAP_CHANGING_CAPABILITIES = 'ratioTapChangerLoadTapChangingCapabilities',
    RATIO_TAP_CHANGER_REGULATION_SIDE = 'ratioTapChangerRegulationSide',
}

/** Cell data types handled by the tabular table (they match AG Grid cell data types). */
export const TABULAR_NUMBER = 'number';
export const TABULAR_ENUM = 'enum';
export const TABULAR_BOOLEAN = 'boolean';

/** Prefix of the CSV columns holding a user defined equipment property. */
export const PROPERTY_CSV_COLUMN_PREFIX = 'property_';

export const REGULATING_TERMINAL_TYPES = [
    'LINE',
    'TWO_WINDINGS_TRANSFORMER',
    'GENERATOR',
    'LOAD',
    'BATTERY',
    'SHUNT_COMPENSATOR',
    'STATIC_VAR_COMPENSATOR',
    'BOUNDARY_LINE',
    'HVDC_CONVERTER_STATION',
    'BUSBAR_SECTION',
];

// For load tabular creations/modifications, we allow the UNDEFINED value
export const LOAD_TYPES_FOR_LOAD_TABULAR_CREATION_MODIFICATION = [
    ...LOAD_TYPES,
    { id: UNDEFINED_LOAD_TYPE, label: 'Undefined' },
] as const;
