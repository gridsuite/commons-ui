/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { number, object, ref, string } from 'yup';
import {
    creationPropertiesSchema,
    getFilledPropertiesFromModification,
    toModificationProperties,
} from '../../common/properties/propertyUtils';
import { FieldConstants, sanitizeString, YUP_REQUIRED } from '../../../../utils';
import { convertInputValue, convertOutputValue } from '../../../../utils/conversionUtils';
import { FieldType } from '../../../../utils/types/fieldType';
import { FilledProperty } from '../../common';
import { VoltageLevelCreationDto } from './voltageLevelCreation.types';

// Form field name constants for voltage level creation
export const VL_SUBSTATION_ID = 'substationId';
export const VL_NOMINAL_V = 'nominalV';
export const VL_LOW_VOLTAGE_LIMIT = 'lowVoltageLimit';
export const VL_HIGH_VOLTAGE_LIMIT = 'highVoltageLimit';
export const VL_LOW_SHORT_CIRCUIT_CURRENT_LIMIT = 'lowShortCircuitCurrentLimit';
export const VL_HIGH_SHORT_CIRCUIT_CURRENT_LIMIT = 'highShortCircuitCurrentLimit';

export const voltageLevelCreationFormSchema = object()
    .shape({
        [FieldConstants.EQUIPMENT_ID]: string().required(YUP_REQUIRED),
        [FieldConstants.EQUIPMENT_NAME]: string().nullable(),
        [VL_SUBSTATION_ID]: string().nullable().required(YUP_REQUIRED),
        [VL_NOMINAL_V]: number().nullable().min(0, 'mustBeGreaterOrEqualToZero').required(YUP_REQUIRED),
        [VL_LOW_VOLTAGE_LIMIT]: number()
            .nullable()
            .min(0, 'mustBeGreaterOrEqualToZero')
            .max(ref(VL_HIGH_VOLTAGE_LIMIT), 'voltageLevelNominalVoltageMaxValueError'),
        [VL_HIGH_VOLTAGE_LIMIT]: number().nullable().min(0, 'mustBeGreaterOrEqualToZero'),
        [VL_LOW_SHORT_CIRCUIT_CURRENT_LIMIT]: number()
            .nullable()
            .min(0, 'ShortCircuitCurrentLimitMustBeGreaterOrEqualToZero')
            .max(ref(VL_HIGH_SHORT_CIRCUIT_CURRENT_LIMIT), 'ShortCircuitCurrentLimitMinMaxError'),
        [VL_HIGH_SHORT_CIRCUIT_CURRENT_LIMIT]: number()
            .nullable()
            .min(0, 'ShortCircuitCurrentLimitMustBeGreaterOrEqualToZero')
            .when([VL_LOW_SHORT_CIRCUIT_CURRENT_LIMIT], {
                is: (lowShortCircuitCurrentLimit: number | null) => lowShortCircuitCurrentLimit != null,
                then: (schema) => schema.required(YUP_REQUIRED),
            }),
    })
    .concat(creationPropertiesSchema);

export interface VoltageLevelCreationFormData {
    [FieldConstants.EQUIPMENT_ID]: string;
    [FieldConstants.EQUIPMENT_NAME]: string | null;
    [VL_SUBSTATION_ID]: string | null;
    [VL_NOMINAL_V]: number | null;
    [VL_LOW_VOLTAGE_LIMIT]: number | null;
    [VL_HIGH_VOLTAGE_LIMIT]: number | null;
    [VL_LOW_SHORT_CIRCUIT_CURRENT_LIMIT]: number | null;
    [VL_HIGH_SHORT_CIRCUIT_CURRENT_LIMIT]: number | null;
    [FieldConstants.ADDITIONAL_PROPERTIES]?: FilledProperty[];
}

export const voltageLevelCreationEmptyFormData: VoltageLevelCreationFormData = {
    [FieldConstants.EQUIPMENT_ID]: '',
    [FieldConstants.EQUIPMENT_NAME]: '',
    [VL_SUBSTATION_ID]: null,
    [VL_NOMINAL_V]: null,
    [VL_LOW_VOLTAGE_LIMIT]: null,
    [VL_HIGH_VOLTAGE_LIMIT]: null,
    [VL_LOW_SHORT_CIRCUIT_CURRENT_LIMIT]: null,
    [VL_HIGH_SHORT_CIRCUIT_CURRENT_LIMIT]: null,
    [FieldConstants.ADDITIONAL_PROPERTIES]: [],
};

export const voltageLevelCreationFormToDto = (
    voltageLevelForm: VoltageLevelCreationFormData
): VoltageLevelCreationDto => {
    return {
        type: 'VOLTAGE_LEVEL_CREATION',
        equipmentId: voltageLevelForm[FieldConstants.EQUIPMENT_ID],
        equipmentName: sanitizeString(voltageLevelForm[FieldConstants.EQUIPMENT_NAME]),
        substationId: voltageLevelForm[VL_SUBSTATION_ID] ?? null,
        nominalV: voltageLevelForm[VL_NOMINAL_V] ?? null,
        lowVoltageLimit: voltageLevelForm[VL_LOW_VOLTAGE_LIMIT] ?? null,
        highVoltageLimit: voltageLevelForm[VL_HIGH_VOLTAGE_LIMIT] ?? null,
        ipMin: convertOutputValue(
            FieldType.LOW_SHORT_CIRCUIT_CURRENT_LIMIT,
            voltageLevelForm[VL_LOW_SHORT_CIRCUIT_CURRENT_LIMIT]
        ),
        ipMax: convertOutputValue(
            FieldType.HIGH_SHORT_CIRCUIT_CURRENT_LIMIT,
            voltageLevelForm[VL_HIGH_SHORT_CIRCUIT_CURRENT_LIMIT]
        ),
        properties: toModificationProperties(voltageLevelForm),
    };
};

export const voltageLevelCreationDtoToForm = (
    voltageLevelDto: VoltageLevelCreationDto
): VoltageLevelCreationFormData => {
    return {
        [FieldConstants.EQUIPMENT_ID]: voltageLevelDto.equipmentId,
        [FieldConstants.EQUIPMENT_NAME]: voltageLevelDto.equipmentName ?? '',
        [VL_SUBSTATION_ID]: voltageLevelDto.substationId,
        [VL_NOMINAL_V]: voltageLevelDto.nominalV,
        [VL_LOW_VOLTAGE_LIMIT]: voltageLevelDto.lowVoltageLimit,
        [VL_HIGH_VOLTAGE_LIMIT]: voltageLevelDto.highVoltageLimit,
        [VL_LOW_SHORT_CIRCUIT_CURRENT_LIMIT]: convertInputValue(
            FieldType.LOW_SHORT_CIRCUIT_CURRENT_LIMIT,
            voltageLevelDto.ipMin
        ),
        [VL_HIGH_SHORT_CIRCUIT_CURRENT_LIMIT]: convertInputValue(
            FieldType.HIGH_SHORT_CIRCUIT_CURRENT_LIMIT,
            voltageLevelDto.ipMax
        ),
        [FieldConstants.ADDITIONAL_PROPERTIES]: getFilledPropertiesFromModification(voltageLevelDto.properties),
    };
};
