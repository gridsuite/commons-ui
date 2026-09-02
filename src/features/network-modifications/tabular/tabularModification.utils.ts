/*
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 * SPDX-License-Identifier: MPL-2.0
 */

import { v4 as uuid4 } from 'uuid';
import {
    CONNECTION_DIRECTIONS,
    convertInputValue,
    convertOutputValue,
    ENERGY_SOURCES,
    FieldConstants,
    FieldType,
    MODIFICATION_TYPES,
    ModificationType,
    REGULATION_SIDES,
    toModificationOperation,
} from '../../../utils';
import { ReactiveCapabilityCurvePoints } from '../common';
import { SHUNT_COMPENSATOR_TYPES } from '../shunt-compensator';
import {
    LOAD_TYPES_FOR_LOAD_TABULAR_CREATION_MODIFICATION,
    REGULATING_TERMINAL_TYPES,
    TABULAR_BOOLEAN,
    TABULAR_ENUM,
    TABULAR_NUMBER,
    TabularFieldConstants,
} from './tabular.constants';
import type {
    TabularField,
    TabularFields,
    TabularFormDto,
    TabularModificationDto,
    TabularModificationRow,
} from './tabular.types';
import {
    addPropertiesFromBack,
    convertReactiveCapabilityCurvePointsFromBackToFront,
    convertReactiveCapabilityCurvePointsFromFrontToBack,
    formatModification,
    TabularFormType,
    transformProperties,
} from './tabular.utils';

const REACTIVE_CAPABILITY_CURVE_FIELDS: TabularField[] = [
    { id: TabularFieldConstants.REACTIVE_CAPABILITY_CURVE, type: TABULAR_BOOLEAN },
    { id: TabularFieldConstants.REACTIVE_CAPABILITY_CURVE_P_MIN, type: TABULAR_NUMBER },
    { id: TabularFieldConstants.REACTIVE_CAPABILITY_CURVE_Q_MIN_P_MIN, type: TABULAR_NUMBER },
    { id: TabularFieldConstants.REACTIVE_CAPABILITY_CURVE_Q_MAX_P_MIN, type: TABULAR_NUMBER },
    { id: TabularFieldConstants.REACTIVE_CAPABILITY_CURVE_P_0, type: TABULAR_NUMBER },
    { id: TabularFieldConstants.REACTIVE_CAPABILITY_CURVE_Q_MIN_P_0, type: TABULAR_NUMBER },
    { id: TabularFieldConstants.REACTIVE_CAPABILITY_CURVE_Q_MAX_P_0, type: TABULAR_NUMBER },
    { id: TabularFieldConstants.REACTIVE_CAPABILITY_CURVE_P_MAX, type: TABULAR_NUMBER },
    { id: TabularFieldConstants.REACTIVE_CAPABILITY_CURVE_Q_MIN_P_MAX, type: TABULAR_NUMBER },
    { id: TabularFieldConstants.REACTIVE_CAPABILITY_CURVE_Q_MAX_P_MAX, type: TABULAR_NUMBER },
];

const VOLTAGE_REGULATION_FIELDS: TabularField[] = [
    { id: TabularFieldConstants.VOLTAGE_REGULATION_ON, type: TABULAR_BOOLEAN },
    { id: FieldConstants.TARGET_V, type: TABULAR_NUMBER },
    { id: TabularFieldConstants.REGULATING_TERMINAL_ID },
    { id: TabularFieldConstants.REGULATING_TERMINAL_TYPE, type: TABULAR_ENUM, options: REGULATING_TERMINAL_TYPES },
    { id: FieldConstants.REGULATING_TERMINAL_VOLTAGE_LEVEL_ID },
];

const CONNECTION_FIELDS: TabularField[] = [
    { id: FieldConstants.CONNECTED, type: TABULAR_BOOLEAN },
    { id: FieldConstants.CONNECTION_NAME },
    {
        id: FieldConstants.CONNECTION_DIRECTION,
        type: TABULAR_ENUM,
        options: CONNECTION_DIRECTIONS.map((direction) => direction.id),
    },
    { id: FieldConstants.CONNECTION_POSITION, type: TABULAR_NUMBER },
];

const TWO_SIDES_CONNECTION_FIELDS: TabularField[] = [
    { id: TabularFieldConstants.CONNECTED1, type: TABULAR_BOOLEAN },
    { id: TabularFieldConstants.CONNECTION_NAME1 },
    {
        id: TabularFieldConstants.CONNECTION_DIRECTION1,
        type: TABULAR_ENUM,
        options: CONNECTION_DIRECTIONS.map((direction) => direction.id),
    },
    { id: TabularFieldConstants.CONNECTION_POSITION1, type: TABULAR_NUMBER },
    { id: TabularFieldConstants.CONNECTED2, type: TABULAR_BOOLEAN },
    { id: TabularFieldConstants.CONNECTION_NAME2 },
    {
        id: TabularFieldConstants.CONNECTION_DIRECTION2,
        type: TABULAR_ENUM,
        options: CONNECTION_DIRECTIONS.map((direction) => direction.id),
    },
    { id: TabularFieldConstants.CONNECTION_POSITION2, type: TABULAR_NUMBER },
];

export const TABULAR_MODIFICATION_FIELDS: TabularFields = {
    SUBSTATION: [
        { id: TabularFieldConstants.EQUIPMENT_ID, required: true },
        { id: FieldConstants.EQUIPMENT_NAME },
        { id: FieldConstants.COUNTRY },
    ],
    VOLTAGE_LEVEL: [
        { id: TabularFieldConstants.EQUIPMENT_ID, required: true },
        { id: FieldConstants.EQUIPMENT_NAME },
        { id: FieldConstants.NOMINAL_V, type: TABULAR_NUMBER },
        { id: FieldConstants.LOW_VOLTAGE_LIMIT, type: TABULAR_NUMBER },
        { id: FieldConstants.HIGH_VOLTAGE_LIMIT, type: TABULAR_NUMBER },
        { id: TabularFieldConstants.IP_MIN, type: TABULAR_NUMBER },
        { id: TabularFieldConstants.IP_MAX, type: TABULAR_NUMBER },
    ],
    LINE: [
        { id: TabularFieldConstants.EQUIPMENT_ID, required: true },
        { id: FieldConstants.EQUIPMENT_NAME },
        { id: FieldConstants.R, type: TABULAR_NUMBER },
        { id: FieldConstants.X, type: TABULAR_NUMBER },
        { id: FieldConstants.G1, type: TABULAR_NUMBER },
        { id: FieldConstants.G2, type: TABULAR_NUMBER },
        { id: FieldConstants.B1, type: TABULAR_NUMBER },
        { id: FieldConstants.B2, type: TABULAR_NUMBER },
        ...TWO_SIDES_CONNECTION_FIELDS,
    ],
    TWO_WINDINGS_TRANSFORMER: [
        { id: TabularFieldConstants.EQUIPMENT_ID, required: true },
        { id: FieldConstants.EQUIPMENT_NAME },
        { id: FieldConstants.R, type: TABULAR_NUMBER },
        { id: FieldConstants.X, type: TABULAR_NUMBER },
        { id: FieldConstants.G, type: TABULAR_NUMBER },
        { id: FieldConstants.B, type: TABULAR_NUMBER },
        { id: FieldConstants.RATED_U1, type: TABULAR_NUMBER },
        { id: FieldConstants.RATED_U2, type: TABULAR_NUMBER },
        { id: FieldConstants.RATED_S, type: TABULAR_NUMBER },
        ...TWO_SIDES_CONNECTION_FIELDS,
        { id: TabularFieldConstants.RATIO_TAP_CHANGER_LOAD_TAP_CHANGING_CAPABILITIES, type: TABULAR_BOOLEAN },
        {
            id: TabularFieldConstants.RATIO_TAP_CHANGER_REGULATION_SIDE,
            type: TABULAR_ENUM,
            options: Object.values(REGULATION_SIDES).map((side) => side.id),
        },
    ],
    GENERATOR: [
        { id: TabularFieldConstants.EQUIPMENT_ID, required: true },
        { id: FieldConstants.EQUIPMENT_NAME },
        { id: FieldConstants.ENERGY_SOURCE, type: TABULAR_ENUM, options: ENERGY_SOURCES.map((energy) => energy.id) },
        ...CONNECTION_FIELDS,
        { id: TabularFieldConstants.MIN_P, type: TABULAR_NUMBER },
        { id: TabularFieldConstants.MAX_P, type: TABULAR_NUMBER },
        { id: FieldConstants.RATED_S, type: TABULAR_NUMBER },
        { id: FieldConstants.MIN_Q, type: TABULAR_NUMBER },
        { id: FieldConstants.MAX_Q, type: TABULAR_NUMBER },
        ...REACTIVE_CAPABILITY_CURVE_FIELDS,
        { id: TabularFieldConstants.TARGET_P, type: TABULAR_NUMBER },
        { id: TabularFieldConstants.TARGET_Q, type: TABULAR_NUMBER },
        ...VOLTAGE_REGULATION_FIELDS,
        { id: FieldConstants.Q_PERCENT, type: TABULAR_NUMBER },
        { id: TabularFieldConstants.PARTICIPATE, type: TABULAR_BOOLEAN },
        { id: FieldConstants.DROOP, type: TABULAR_NUMBER },
        { id: FieldConstants.TRANSIENT_REACTANCE, type: TABULAR_NUMBER },
        { id: TabularFieldConstants.STEP_UP_TRANSFORMER_REACTANCE, type: TABULAR_NUMBER },
        { id: FieldConstants.PLANNED_ACTIVE_POWER_SET_POINT, type: TABULAR_NUMBER },
        { id: FieldConstants.MARGINAL_COST, type: TABULAR_NUMBER },
        { id: FieldConstants.PLANNED_OUTAGE_RATE, type: TABULAR_NUMBER },
        { id: FieldConstants.FORCED_OUTAGE_RATE, type: TABULAR_NUMBER },
    ],
    LOAD: [
        { id: TabularFieldConstants.EQUIPMENT_ID, required: true },
        { id: FieldConstants.EQUIPMENT_NAME },
        {
            id: FieldConstants.LOAD_TYPE,
            type: TABULAR_ENUM,
            options: LOAD_TYPES_FOR_LOAD_TABULAR_CREATION_MODIFICATION.map((load) => load.id),
        },
        ...CONNECTION_FIELDS,
        { id: TabularFieldConstants.P0, type: TABULAR_NUMBER },
        { id: FieldConstants.Q0, type: TABULAR_NUMBER },
    ],
    BATTERY: [
        { id: TabularFieldConstants.EQUIPMENT_ID, required: true },
        { id: FieldConstants.EQUIPMENT_NAME },
        ...CONNECTION_FIELDS,
        { id: TabularFieldConstants.MIN_P, type: TABULAR_NUMBER },
        { id: TabularFieldConstants.MAX_P, type: TABULAR_NUMBER },
        { id: FieldConstants.MIN_Q, type: TABULAR_NUMBER },
        { id: FieldConstants.MAX_Q, type: TABULAR_NUMBER },
        ...REACTIVE_CAPABILITY_CURVE_FIELDS,
        { id: TabularFieldConstants.TARGET_P, type: TABULAR_NUMBER },
        { id: TabularFieldConstants.TARGET_Q, type: TABULAR_NUMBER },
        { id: TabularFieldConstants.PARTICIPATE, type: TABULAR_BOOLEAN },
        { id: FieldConstants.DROOP, type: TABULAR_NUMBER },
        ...VOLTAGE_REGULATION_FIELDS,
    ],
    SHUNT_COMPENSATOR: [
        { id: TabularFieldConstants.EQUIPMENT_ID, required: true },
        { id: FieldConstants.EQUIPMENT_NAME },
        ...CONNECTION_FIELDS,
        { id: FieldConstants.MAXIMUM_SECTION_COUNT, type: TABULAR_NUMBER },
        { id: FieldConstants.SECTION_COUNT, type: TABULAR_NUMBER },
        {
            id: FieldConstants.SHUNT_COMPENSATOR_TYPE,
            type: TABULAR_ENUM,
            options: Object.keys(SHUNT_COMPENSATOR_TYPES),
        },
        { id: FieldConstants.MAX_Q_AT_NOMINAL_V, type: TABULAR_NUMBER },
        { id: FieldConstants.MAX_SUSCEPTANCE, type: TABULAR_NUMBER },
    ],
};

export const TABULAR_MODIFICATION_TYPES: { [key: string]: string } = {
    GENERATOR: MODIFICATION_TYPES.GENERATOR_MODIFICATION.type,
    LOAD: MODIFICATION_TYPES.LOAD_MODIFICATION.type,
    BATTERY: MODIFICATION_TYPES.BATTERY_MODIFICATION.type,
    VOLTAGE_LEVEL: MODIFICATION_TYPES.VOLTAGE_LEVEL_MODIFICATION.type,
    SHUNT_COMPENSATOR: MODIFICATION_TYPES.SHUNT_COMPENSATOR_MODIFICATION.type,
    LINE: MODIFICATION_TYPES.LINE_MODIFICATION.type,
    TWO_WINDINGS_TRANSFORMER: MODIFICATION_TYPES.TWO_WINDINGS_TRANSFORMER_MODIFICATION.type,
    SUBSTATION: MODIFICATION_TYPES.SUBSTATION_MODIFICATION.type,
};

export const getEquipmentTypeFromModificationType = (type: string) => {
    return Object.keys(TABULAR_MODIFICATION_TYPES).find((key) => TABULAR_MODIFICATION_TYPES[key] === type);
};

/**
 * Convert a camelCase string to SNAKE_CASE format and map it to a key in the FieldType enum.
 * @param key - The camelCase string to be converted.
 * @returns The corresponding value from the FieldType enum.
 */
const convertCamelToSnake = (key: string) =>
    FieldType[
        key
            .split(/\.?(?=[A-Z])/)
            .join('_')
            .toUpperCase() as keyof typeof FieldType
    ];

export const convertInputValues = (key: string, value: { value: string | number }) => {
    if (key === TabularFieldConstants.EQUIPMENT_ID) {
        return value;
    }
    return convertInputValue(convertCamelToSnake(key), value?.value);
};

export const convertOutputValues = (key: string, value: string | number) => {
    if (key === TabularFieldConstants.EQUIPMENT_ID) {
        return value;
    }
    return toModificationOperation(convertOutputValue(convertCamelToSnake(key), value));
};

export const getTabularFieldType = (modificationType: string, key: string) => {
    let fieldType = key;
    // In some cases, the key used in tabular modification does not match the key used in atomic modification,
    // criteria filters, and commons-ui convert functions.
    if (modificationType === TABULAR_MODIFICATION_TYPES.VOLTAGE_LEVEL) {
        if (key === TabularFieldConstants.IP_MIN) {
            fieldType = FieldConstants.LOW_SHORT_CIRCUIT_CURRENT_LIMIT;
        } else if (key === TabularFieldConstants.IP_MAX) {
            fieldType = FieldConstants.HIGH_SHORT_CIRCUIT_CURRENT_LIMIT;
        }
    }
    return fieldType;
};

export const convertGeneratorOrBatteryModificationFromBackToFront = (modification: TabularModificationRow) => {
    const formattedModification: TabularModificationRow = {};
    Object.keys(modification).forEach((key) => {
        if (key === TabularFieldConstants.REACTIVE_CAPABILITY_CURVE_POINTS) {
            convertReactiveCapabilityCurvePointsFromBackToFront(
                modification[key] as ReactiveCapabilityCurvePoints[]
            ).forEach((point) => {
                formattedModification[point.key] = point.value;
            });
        } else {
            formattedModification[key] = convertInputValues(key, modification[key]);
        }
    });
    return formattedModification;
};

export const convertGeneratorOrBatteryModificationFromFrontToBack = (modification: TabularModificationRow) => {
    const formattedModification: TabularModificationRow = { ...modification };
    convertReactiveCapabilityCurvePointsFromFrontToBack(formattedModification);
    // Remove the individual reactive capability curve fields
    REACTIVE_CAPABILITY_CURVE_FIELDS.forEach((field) => {
        if (field.id !== TabularFieldConstants.REACTIVE_CAPABILITY_CURVE) {
            delete formattedModification[field.id];
        }
    });
    Object.keys(formattedModification).forEach((key) => {
        if (key !== TabularFieldConstants.REACTIVE_CAPABILITY_CURVE_POINTS) {
            formattedModification[key] = convertOutputValues(key, formattedModification[key]);
        }
    });
    return formattedModification;
};

export const TWT_TAP_CHANGER_FIELDS = [
    TabularFieldConstants.RATIO_TAP_CHANGER_LOAD_TAP_CHANGING_CAPABILITIES,
    TabularFieldConstants.RATIO_TAP_CHANGER_REGULATION_SIDE,
];

export const convertTWTTapChangerModificationFromFrontToBack = (modification: TabularModificationRow) => {
    if (!modification) {
        return {};
    }
    const formattedModification: TabularModificationRow = { ...modification };

    // Check if we have tap changer fields and restructure if needed
    if (TWT_TAP_CHANGER_FIELDS.some((field) => field in formattedModification)) {
        formattedModification[FieldConstants.RATIO_TAP_CHANGER] = {
            [FieldConstants.LOAD_TAP_CHANGING_CAPABILITIES]:
                formattedModification[TabularFieldConstants.RATIO_TAP_CHANGER_LOAD_TAP_CHANGING_CAPABILITIES],
            [FieldConstants.REGULATION_SIDE]:
                formattedModification[TabularFieldConstants.RATIO_TAP_CHANGER_REGULATION_SIDE],
        };

        // Remove the flat tap changer fields
        TWT_TAP_CHANGER_FIELDS.forEach((field) => {
            delete formattedModification[field];
        });
    }
    // Convert all fields to output format
    Object.keys(formattedModification).forEach((key) => {
        if (key === FieldConstants.RATIO_TAP_CHANGER) {
            // Convert nested tap changer fields
            Object.keys(formattedModification[FieldConstants.RATIO_TAP_CHANGER]).forEach((ratioKey) => {
                formattedModification[FieldConstants.RATIO_TAP_CHANGER][ratioKey] = convertOutputValues(
                    ratioKey,
                    formattedModification[FieldConstants.RATIO_TAP_CHANGER][ratioKey]
                );
            });
        } else {
            // Convert regular fields
            formattedModification[key] = convertOutputValues(key, formattedModification[key]);
        }
    });
    return formattedModification;
};

/**
 * Type definition for modification transformation strategies
 */
export type ModificationTransformationStrategy = {
    [key: string]: (row: TabularModificationRow, modificationType: string) => TabularModificationRow;
};

/**
 * Transformation strategies from front-end to back-end for different modification types
 */
export const MODIFICATION_TRANSFORMATION_STRATEGIES: ModificationTransformationStrategy = {
    [TABULAR_MODIFICATION_TYPES.GENERATOR]: (row) => convertGeneratorOrBatteryModificationFromFrontToBack(row),

    [TABULAR_MODIFICATION_TYPES.BATTERY]: (row) => convertGeneratorOrBatteryModificationFromFrontToBack(row),

    [TABULAR_MODIFICATION_TYPES.TWO_WINDINGS_TRANSFORMER]: (row) =>
        convertTWTTapChangerModificationFromFrontToBack(row),

    // Default strategy for other modification types
    default: (row, modificationType) => {
        const transformedRow: TabularModificationRow = {};

        Object.keys(row).forEach((key) => {
            transformedRow[key] = convertOutputValues(getTabularFieldType(modificationType, key), row[key]);
        });

        return transformedRow;
    },
};

/**
 * Transforms a single row of form data into a modification object for the back-end
 * @param row - The form data row to transform
 * @param modificationType - The type of modification being performed
 * @returns The transformed modification object
 */
export const transformRowToBackEndModification = (
    row: TabularModificationRow,
    modificationType: string
): TabularModificationRow => {
    // first transform and clean "property_*" fields
    const propertiesModifications = transformProperties(row);

    // then transform all fields according to the type
    const transformationStrategy =
        MODIFICATION_TRANSFORMATION_STRATEGIES[modificationType] ?? MODIFICATION_TRANSFORMATION_STRATEGIES.default;
    const transformedData = transformationStrategy(row, modificationType);

    if (propertiesModifications.length > 0) {
        transformedData[TabularFieldConstants.TABULAR_PROPERTIES] = propertiesModifications;
    }

    return {
        type: modificationType,
        ...transformedData,
    };
};

/**
 * Transforms form data modifications table into an array of back-end modification objects
 * @param modificationsTable - Array of form data rows
 * @param modificationType - The type of modification being performed
 * @returns Array of transformed modification objects
 */
export const transformModificationsTable = (
    modificationType: string,
    modificationsTable: TabularModificationRow[] = []
): TabularModificationRow[] => {
    if (!modificationsTable?.length) {
        return [];
    }

    return modificationsTable.map((row) => transformRowToBackEndModification(row, modificationType));
};

export const tabularModificationDtoToForm = (dto: TabularModificationDto): TabularFormType => {
    const { modificationType } = dto;
    const modifications = (dto?.modifications ?? []).map((modif: TabularModificationRow) => {
        let modification = formatModification(modif);
        if (
            modificationType === TABULAR_MODIFICATION_TYPES.GENERATOR ||
            modificationType === TABULAR_MODIFICATION_TYPES.BATTERY
        ) {
            modification = convertGeneratorOrBatteryModificationFromBackToFront(modification);
        } else {
            Object.keys(modification).forEach((key) => {
                modification[key] = convertInputValues(getTabularFieldType(modificationType, key), modif[key]);
            });
        }
        modification = addPropertiesFromBack(modification, modif?.[TabularFieldConstants.TABULAR_PROPERTIES]);
        return { [FieldConstants.AG_GRID_ROW_UUID]: uuid4(), ...modification };
    });
    return {
        [FieldConstants.TYPE]: getEquipmentTypeFromModificationType(modificationType) ?? '',
        [TabularFieldConstants.MODIFICATIONS_TABLE]: modifications,
        [TabularFieldConstants.TABULAR_PROPERTIES]: dto?.properties,
        [TabularFieldConstants.CSV_FILENAME]: dto?.csvFilename,
    };
};

export const tabularModificationFormToDto = (form: TabularFormType): TabularFormDto => {
    const modificationType = TABULAR_MODIFICATION_TYPES[form[FieldConstants.TYPE]];
    return {
        type: ModificationType.TABULAR_MODIFICATION,
        modificationType,
        modifications: transformModificationsTable(modificationType, form[TabularFieldConstants.MODIFICATIONS_TABLE]),
        csvFilename: form[TabularFieldConstants.CSV_FILENAME],
        properties: form[TabularFieldConstants.TABULAR_PROPERTIES],
    };
};
