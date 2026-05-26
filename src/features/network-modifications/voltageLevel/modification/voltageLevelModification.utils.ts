/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { boolean, InferType, number, object, ref, string } from 'yup';
import {
    getPropertiesFromModification,
    modificationPropertiesSchema,
    toModificationProperties,
} from '../../common/properties/propertyUtils';
import { convertInputValue, convertOutputValue } from '../../../../utils/conversionUtils';
import {
    FieldConstants,
    ModificationType,
    sanitizeString,
    toModificationOperation,
    YUP_NOT_TYPE_NUMBER,
    YUP_REQUIRED,
} from '../../../../utils';
import { FieldType } from '../../../../utils/types/fieldType';
import { VoltageLevelModificationDto } from './voltageLevelModification.types';

export const voltageLevelModificationFormSchema = object()
    .shape({
        [FieldConstants.EQUIPMENT_ID]: string().required(YUP_REQUIRED),
        [FieldConstants.EQUIPMENT_NAME]: string().nullable(),
        [FieldConstants.HIDE_SUBSTATION_FIELD]: boolean().required(YUP_REQUIRED),
        [FieldConstants.SUBSTATION_ID]: string().nullable(),
        [FieldConstants.NOMINAL_V]: number()
            .typeError(YUP_NOT_TYPE_NUMBER)
            .nullable()
            .min(0, 'mustBeGreaterOrEqualToZero'),
        [FieldConstants.LOW_VOLTAGE_LIMIT]: number()
            .typeError(YUP_NOT_TYPE_NUMBER)
            .nullable()
            .min(0, 'mustBeGreaterOrEqualToZero')
            .when([FieldConstants.HIGH_VOLTAGE_LIMIT], {
                is: (highVoltageLimit: number) => highVoltageLimit != null,
                then: (schema) =>
                    schema.max(ref(FieldConstants.HIGH_VOLTAGE_LIMIT), 'voltageLevelNominalVoltageMaxValueError'),
            }),
        [FieldConstants.HIGH_VOLTAGE_LIMIT]: number()
            .typeError(YUP_NOT_TYPE_NUMBER)
            .nullable()
            .min(0, 'mustBeGreaterOrEqualToZero'),
        [FieldConstants.LOW_SHORT_CIRCUIT_CURRENT_LIMIT]: number()
            .typeError(YUP_NOT_TYPE_NUMBER)
            .nullable()
            .min(0, 'ShortCircuitCurrentLimitMustBeGreaterOrEqualToZero')
            .when([FieldConstants.HIGH_SHORT_CIRCUIT_CURRENT_LIMIT], {
                is: (highShortCircuitCurrentLimit: number) => highShortCircuitCurrentLimit != null,
                then: (schema) =>
                    schema.max(
                        ref(FieldConstants.HIGH_SHORT_CIRCUIT_CURRENT_LIMIT),
                        'ShortCircuitCurrentLimitMinMaxError'
                    ),
            }),
        [FieldConstants.HIGH_SHORT_CIRCUIT_CURRENT_LIMIT]: number()
            .typeError(YUP_NOT_TYPE_NUMBER)
            .nullable()
            .min(0, 'ShortCircuitCurrentLimitMustBeGreaterOrEqualToZero'),
    })
    .concat(modificationPropertiesSchema);

export type VoltageLevelModificationFormData = InferType<typeof voltageLevelModificationFormSchema>;

export const voltageLevelModificationEmptyFormData: VoltageLevelModificationFormData = {
    equipmentID: '',
    equipmentName: '',
    hideSubstationField: true,
    nominalV: null,
    lowVoltageLimit: null,
    highVoltageLimit: null,
    lowShortCircuitCurrentLimit: null,
    highShortCircuitCurrentLimit: null,
    AdditionalProperties: [],
};

export const voltageLevelModificationFormToDto = (
    formData: VoltageLevelModificationFormData
): VoltageLevelModificationDto => ({
    type: ModificationType.VOLTAGE_LEVEL_MODIFICATION,
    equipmentId: formData.equipmentID,
    equipmentName: toModificationOperation(sanitizeString(formData.equipmentName)),
    nominalV: toModificationOperation(formData.nominalV ?? null),
    lowVoltageLimit: toModificationOperation(formData.lowVoltageLimit ?? null),
    highVoltageLimit: toModificationOperation(formData.highVoltageLimit ?? null),
    ipMin: toModificationOperation(
        convertOutputValue(FieldType.LOW_SHORT_CIRCUIT_CURRENT_LIMIT, formData.lowShortCircuitCurrentLimit)
    ),
    ipMax: toModificationOperation(
        convertOutputValue(FieldType.HIGH_SHORT_CIRCUIT_CURRENT_LIMIT, formData.highShortCircuitCurrentLimit)
    ),
    properties: toModificationProperties(formData),
});

export const voltageLevelModificationDtoToForm = (
    voltageLevelDto: VoltageLevelModificationDto,
    includePreviousValues = true
): VoltageLevelModificationFormData => ({
    equipmentID: voltageLevelDto.equipmentId,
    equipmentName: voltageLevelDto.equipmentName?.value ?? '',
    hideSubstationField: true,
    nominalV: voltageLevelDto.nominalV?.value ?? null,
    lowVoltageLimit: voltageLevelDto.lowVoltageLimit?.value ?? null,
    highVoltageLimit: voltageLevelDto.highVoltageLimit?.value ?? null,
    lowShortCircuitCurrentLimit:
        convertInputValue(FieldType.LOW_SHORT_CIRCUIT_CURRENT_LIMIT, voltageLevelDto.ipMin?.value) ?? null,
    highShortCircuitCurrentLimit:
        convertInputValue(FieldType.HIGH_SHORT_CIRCUIT_CURRENT_LIMIT, voltageLevelDto.ipMax?.value) ?? null,
    ...getPropertiesFromModification(voltageLevelDto.properties, includePreviousValues),
});
