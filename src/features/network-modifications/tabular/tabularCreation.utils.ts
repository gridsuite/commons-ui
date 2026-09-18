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
    ENERGY_SOURCES,
    FieldConstants,
    MODIFICATION_TYPES,
    ModificationType,
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
    { id: TabularFieldConstants.REACTIVE_CAPABILITY_CURVE, required: true, type: TABULAR_BOOLEAN },
    { id: TabularFieldConstants.REACTIVE_CAPABILITY_CURVE_P_MIN, required: false, type: TABULAR_NUMBER },
    { id: TabularFieldConstants.REACTIVE_CAPABILITY_CURVE_Q_MIN_P_MIN, required: false, type: TABULAR_NUMBER },
    { id: TabularFieldConstants.REACTIVE_CAPABILITY_CURVE_Q_MAX_P_MIN, required: false, type: TABULAR_NUMBER },
    { id: TabularFieldConstants.REACTIVE_CAPABILITY_CURVE_P_0, required: false, type: TABULAR_NUMBER },
    { id: TabularFieldConstants.REACTIVE_CAPABILITY_CURVE_Q_MIN_P_0, required: false, type: TABULAR_NUMBER },
    { id: TabularFieldConstants.REACTIVE_CAPABILITY_CURVE_Q_MAX_P_0, required: false, type: TABULAR_NUMBER },
    { id: TabularFieldConstants.REACTIVE_CAPABILITY_CURVE_P_MAX, required: false, type: TABULAR_NUMBER },
    { id: TabularFieldConstants.REACTIVE_CAPABILITY_CURVE_Q_MIN_P_MAX, required: false, type: TABULAR_NUMBER },
    { id: TabularFieldConstants.REACTIVE_CAPABILITY_CURVE_Q_MAX_P_MAX, required: false, type: TABULAR_NUMBER },
];

const CONNECTION_FIELDS: TabularField[] = [
    { id: FieldConstants.CONNECTED, required: true, type: TABULAR_BOOLEAN },
    { id: FieldConstants.CONNECTION_NAME, required: false },
    {
        id: FieldConstants.CONNECTION_DIRECTION,
        required: false,
        type: TABULAR_ENUM,
        options: CONNECTION_DIRECTIONS.map((direction) => direction.id),
    },
    { id: FieldConstants.CONNECTION_POSITION, required: false, type: TABULAR_NUMBER },
];

const VOLTAGE_REGULATION_FIELDS: TabularField[] = [
    { id: TabularFieldConstants.VOLTAGE_REGULATION_ON, required: true, type: TABULAR_BOOLEAN },
    { id: FieldConstants.TARGET_V, required: false, type: TABULAR_NUMBER },
    { id: TabularFieldConstants.REGULATING_TERMINAL_ID, required: false },
    {
        id: TabularFieldConstants.REGULATING_TERMINAL_TYPE,
        required: false,
        type: TABULAR_ENUM,
        options: REGULATING_TERMINAL_TYPES,
    },
    { id: FieldConstants.REGULATING_TERMINAL_VOLTAGE_LEVEL_ID, required: false },
];

export const TABULAR_CREATION_FIELDS: TabularFields = {
    GENERATOR: [
        { id: TabularFieldConstants.EQUIPMENT_ID, required: true },
        { id: FieldConstants.EQUIPMENT_NAME, required: false },
        {
            id: FieldConstants.ENERGY_SOURCE,
            required: true,
            type: TABULAR_ENUM,
            options: ENERGY_SOURCES.map((energy) => energy.id),
        },
        { id: FieldConstants.VOLTAGE_LEVEL_ID, required: true },
        { id: TabularFieldConstants.BUS_OR_BUSBAR_SECTION_ID, required: true },
        ...CONNECTION_FIELDS,
        { id: TabularFieldConstants.MIN_P, required: true, type: TABULAR_NUMBER },
        { id: TabularFieldConstants.MAX_P, required: true, type: TABULAR_NUMBER },
        { id: FieldConstants.RATED_S, required: false, type: TABULAR_NUMBER },
        { id: FieldConstants.MIN_Q, required: false, type: TABULAR_NUMBER },
        { id: FieldConstants.MAX_Q, required: false, type: TABULAR_NUMBER },
        ...REACTIVE_CAPABILITY_CURVE_FIELDS,
        { id: TabularFieldConstants.TARGET_P, required: true, type: TABULAR_NUMBER },
        { id: TabularFieldConstants.TARGET_Q, required: true, type: TABULAR_NUMBER },
        ...VOLTAGE_REGULATION_FIELDS,
        { id: FieldConstants.Q_PERCENT, required: false, type: TABULAR_NUMBER },
        { id: TabularFieldConstants.PARTICIPATE, required: true, type: TABULAR_BOOLEAN },
        { id: FieldConstants.DROOP, required: false, type: TABULAR_NUMBER },
        { id: FieldConstants.TRANSIENT_REACTANCE, required: false, type: TABULAR_NUMBER },
        { id: TabularFieldConstants.STEP_UP_TRANSFORMER_REACTANCE, required: false, type: TABULAR_NUMBER },
        { id: FieldConstants.PLANNED_ACTIVE_POWER_SET_POINT, required: false, type: TABULAR_NUMBER },
        { id: FieldConstants.MARGINAL_COST, required: false, type: TABULAR_NUMBER },
        { id: FieldConstants.PLANNED_OUTAGE_RATE, required: false, type: TABULAR_NUMBER },
        { id: FieldConstants.FORCED_OUTAGE_RATE, required: false, type: TABULAR_NUMBER },
    ],
    LOAD: [
        { id: TabularFieldConstants.EQUIPMENT_ID, required: true },
        { id: FieldConstants.EQUIPMENT_NAME, required: false },
        {
            id: FieldConstants.LOAD_TYPE,
            required: true,
            type: TABULAR_ENUM,
            options: LOAD_TYPES_FOR_LOAD_TABULAR_CREATION_MODIFICATION.map((load) => load.id),
        },
        { id: FieldConstants.VOLTAGE_LEVEL_ID, required: true },
        { id: TabularFieldConstants.BUS_OR_BUSBAR_SECTION_ID, required: true },
        ...CONNECTION_FIELDS,
        { id: TabularFieldConstants.P0, required: true, type: TABULAR_NUMBER },
        { id: FieldConstants.Q0, required: true, type: TABULAR_NUMBER },
    ],
    BATTERY: [
        { id: TabularFieldConstants.EQUIPMENT_ID, required: true },
        { id: FieldConstants.EQUIPMENT_NAME, required: false },
        { id: FieldConstants.VOLTAGE_LEVEL_ID, required: true },
        { id: TabularFieldConstants.BUS_OR_BUSBAR_SECTION_ID, required: true },
        ...CONNECTION_FIELDS,
        { id: TabularFieldConstants.MIN_P, required: true, type: TABULAR_NUMBER },
        { id: TabularFieldConstants.MAX_P, required: true, type: TABULAR_NUMBER },
        { id: FieldConstants.MIN_Q, required: false, type: TABULAR_NUMBER },
        { id: FieldConstants.MAX_Q, required: false, type: TABULAR_NUMBER },
        ...REACTIVE_CAPABILITY_CURVE_FIELDS,
        { id: TabularFieldConstants.TARGET_P, required: true, type: TABULAR_NUMBER },
        { id: TabularFieldConstants.TARGET_Q, required: true, type: TABULAR_NUMBER },
        { id: TabularFieldConstants.PARTICIPATE, required: true, type: TABULAR_BOOLEAN },
        { id: FieldConstants.DROOP, required: false, type: TABULAR_NUMBER },
        ...VOLTAGE_REGULATION_FIELDS,
    ],
    SHUNT_COMPENSATOR: [
        { id: TabularFieldConstants.EQUIPMENT_ID, required: true },
        { id: FieldConstants.EQUIPMENT_NAME, required: false },
        { id: FieldConstants.VOLTAGE_LEVEL_ID, required: true },
        { id: TabularFieldConstants.BUS_OR_BUSBAR_SECTION_ID, required: true },
        ...CONNECTION_FIELDS,
        { id: FieldConstants.MAXIMUM_SECTION_COUNT, required: true, type: TABULAR_NUMBER },
        { id: FieldConstants.SECTION_COUNT, required: true, type: TABULAR_NUMBER },
        {
            id: FieldConstants.SHUNT_COMPENSATOR_TYPE,
            requiredIf: { id: FieldConstants.MAX_Q_AT_NOMINAL_V },
            type: TABULAR_ENUM,
            options: Object.keys(SHUNT_COMPENSATOR_TYPES),
        },
        {
            id: FieldConstants.MAX_Q_AT_NOMINAL_V,
            requiredIf: { id: FieldConstants.SHUNT_COMPENSATOR_TYPE },
            type: TABULAR_NUMBER,
        },
        { id: FieldConstants.MAX_SUSCEPTANCE, required: false, type: TABULAR_NUMBER },
    ],
};

export const TABULAR_CREATION_TYPES: { [key: string]: string } = {
    GENERATOR: MODIFICATION_TYPES.GENERATOR_CREATION.type,
    BATTERY: MODIFICATION_TYPES.BATTERY_CREATION.type,
    LOAD: MODIFICATION_TYPES.LOAD_CREATION.type,
    SHUNT_COMPENSATOR: MODIFICATION_TYPES.SHUNT_COMPENSATOR_CREATION.type,
};

export const convertCreationFieldFromBackToFront = (key: string, value: any) => {
    if (key === TabularFieldConstants.REACTIVE_CAPABILITY_CURVE_POINTS) {
        return convertReactiveCapabilityCurvePointsFromBackToFront(value as ReactiveCapabilityCurvePoints[]);
    }
    return { key, value };
};

export const convertCreationFieldFromFrontToBack = (key: string, value: string | number | boolean) => {
    if (key === FieldConstants.CONNECTION_DIRECTION) {
        return { key, value: value ?? 'UNDEFINED' };
    }
    return { key, value };
};

export const getEquipmentTypeFromCreationType = (type: string) => {
    return Object.keys(TABULAR_CREATION_TYPES).find((key) => TABULAR_CREATION_TYPES[key] === type);
};

export const convertCreations = (creations: TabularModificationRow[]): TabularModificationRow[] => {
    return creations.map((creat: TabularModificationRow) => {
        const creation: TabularModificationRow = {};
        Object.keys(formatModification(creat)).forEach((key) => {
            const entry = convertCreationFieldFromBackToFront(key, creat[key]);
            (Array.isArray(entry) ? entry : [entry]).forEach((item) => {
                creation[item.key] = item.value;
            });
        });
        return addPropertiesFromBack(creation, creat?.[TabularFieldConstants.TABULAR_PROPERTIES]);
    });
};

/** Convert a single form row into its back-end creation representation. */
export const transformRowToBackEndCreation = (
    row: TabularModificationRow,
    modificationType: string
): TabularModificationRow => {
    const creation: TabularModificationRow = {
        type: modificationType,
    };
    // first transform and clean "property_*" fields
    const propertiesModifications = transformProperties(row);

    // then transform all other fields
    Object.keys(row).forEach((key) => {
        const entry = convertCreationFieldFromFrontToBack(key, row[key]);
        creation[entry.key] = entry.value;
    });
    // For now, we do not manage reactive limits by diagram
    if (
        modificationType === ModificationType.GENERATOR_CREATION ||
        modificationType === ModificationType.BATTERY_CREATION
    ) {
        convertReactiveCapabilityCurvePointsFromFrontToBack(creation);
    }

    if (propertiesModifications.length > 0) {
        creation[TabularFieldConstants.TABULAR_PROPERTIES] = propertiesModifications;
    }
    return creation;
};

export const transformCreationsTable = (
    modificationType: string,
    creationsTable: TabularModificationRow[] = []
): TabularModificationRow[] => creationsTable.map((row) => transformRowToBackEndCreation(row, modificationType));

export const tabularCreationDtoToForm = (dto: TabularModificationDto): TabularFormType => {
    const creations = convertCreations(dto?.modifications ?? []).map((creation) => ({
        [FieldConstants.AG_GRID_ROW_UUID]: uuid4(),
        ...creation,
    }));
    return {
        [FieldConstants.TYPE]: getEquipmentTypeFromCreationType(dto?.modificationType) ?? '',
        [TabularFieldConstants.MODIFICATIONS_TABLE]: creations,
        [TabularFieldConstants.TABULAR_PROPERTIES]: dto?.properties,
        [TabularFieldConstants.CSV_FILENAME]: dto?.csvFilename,
    };
};

export const tabularCreationFormToDto = (form: TabularFormType): TabularFormDto => {
    const modificationType = TABULAR_CREATION_TYPES[form[FieldConstants.TYPE]];
    return {
        type: ModificationType.TABULAR_CREATION,
        modificationType,
        modifications: transformCreationsTable(modificationType, form[TabularFieldConstants.MODIFICATIONS_TABLE]),
        csvFilename: form[TabularFieldConstants.CSV_FILENAME],
        properties: form[TabularFieldConstants.TABULAR_PROPERTIES],
    };
};
