/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { InferType, object, string } from 'yup';
import {
    DeepNullable,
    FieldConstants,
    ModificationType,
    sanitizeString,
    UNDEFINED_CONNECTION_DIRECTION,
    YUP_REQUIRED,
} from '../../../../utils';
import {
    creationPropertiesSchema,
    getConnectivityFormDataProps,
    getConnectivityWithPositionEmptyFormDataProps,
    getConnectivityWithPositionSchema,
    getFilledPropertiesFromModification,
    toModificationProperties,
} from '../../common';
import {
    CHARACTERISTICS_CHOICES,
    getCharacteristicsEmptyFormData,
    getCharacteristicsFormData,
    getCharacteristicsFormValidationSchema,
} from '../common';
import { ShuntCompensatorCreationDto } from './shuntCompensatorCreation.types';

export const shuntCompensatorCreationFormSchema = object()
    .shape({
        [FieldConstants.EQUIPMENT_ID]: string().required(YUP_REQUIRED),
        [FieldConstants.EQUIPMENT_NAME]: string().nullable(),
        [FieldConstants.CONNECTIVITY]: getConnectivityWithPositionSchema(false),
        ...getCharacteristicsFormValidationSchema(false),
    })
    .concat(creationPropertiesSchema)
    .required(YUP_REQUIRED);

export type ShuntCompensatorCreationFormData = InferType<typeof shuntCompensatorCreationFormSchema>;

export const shuntCompensatorCreationEmptyFormData: DeepNullable<ShuntCompensatorCreationFormData> = {
    [FieldConstants.EQUIPMENT_ID]: '',
    [FieldConstants.EQUIPMENT_NAME]: '',
    [FieldConstants.CONNECTIVITY]: getConnectivityWithPositionEmptyFormDataProps(),
    ...getCharacteristicsEmptyFormData(),
    [FieldConstants.ADDITIONAL_PROPERTIES]: [],
};

export const shuntCompensatorCreationDtoToForm = (
    shuntDto: ShuntCompensatorCreationDto
): ShuntCompensatorCreationFormData => ({
    [FieldConstants.EQUIPMENT_ID]: shuntDto.equipmentId,
    [FieldConstants.EQUIPMENT_NAME]: shuntDto.equipmentName ?? '',
    [FieldConstants.CONNECTIVITY]: getConnectivityFormDataProps({
        voltageLevelId: shuntDto.voltageLevelId,
        busbarSectionId: shuntDto.busOrBusbarSectionId,
        connectionDirection: shuntDto.connectionDirection,
        connectionName: shuntDto.connectionName,
        connectionPosition: shuntDto.connectionPosition,
        terminalConnected: shuntDto.terminalConnected,
    }),
    ...getCharacteristicsFormData({
        maxSusceptance: shuntDto.maxSusceptance ?? null,
        maxQAtNominalV: shuntDto.maxQAtNominalV ?? null,
        shuntCompensatorType: shuntDto.shuntCompensatorType,
        sectionCount: shuntDto.sectionCount,
        maximumSectionCount: shuntDto.maximumSectionCount,
    }),
    [FieldConstants.ADDITIONAL_PROPERTIES]: getFilledPropertiesFromModification(shuntDto?.properties),
});

export const shuntCompensatorCreationFormToDto = (
    shuntForm: ShuntCompensatorCreationFormData
): ShuntCompensatorCreationDto => {
    const choice = shuntForm[FieldConstants.CHARACTERISTICS_CHOICE];
    return {
        type: ModificationType.SHUNT_COMPENSATOR_CREATION,
        equipmentId: shuntForm[FieldConstants.EQUIPMENT_ID],
        equipmentName: sanitizeString(shuntForm[FieldConstants.EQUIPMENT_NAME]),
        maxSusceptance:
            choice === CHARACTERISTICS_CHOICES.SUSCEPTANCE.id
                ? (shuntForm[FieldConstants.MAX_SUSCEPTANCE] ?? null)
                : null,
        maxQAtNominalV:
            choice === CHARACTERISTICS_CHOICES.Q_AT_NOMINAL_V.id
                ? (shuntForm[FieldConstants.MAX_Q_AT_NOMINAL_V] ?? null)
                : null,
        shuntCompensatorType:
            choice === CHARACTERISTICS_CHOICES.Q_AT_NOMINAL_V.id
                ? (shuntForm[FieldConstants.SHUNT_COMPENSATOR_TYPE] ?? null)
                : null,
        sectionCount: shuntForm[FieldConstants.SECTION_COUNT] ?? null,
        maximumSectionCount: shuntForm[FieldConstants.MAXIMUM_SECTION_COUNT] ?? null,
        voltageLevelId: shuntForm[FieldConstants.CONNECTIVITY]?.voltageLevel?.id ?? '',
        busOrBusbarSectionId: shuntForm[FieldConstants.CONNECTIVITY]?.busOrBusbarSection?.id ?? '',
        connectionDirection:
            shuntForm[FieldConstants.CONNECTIVITY]?.connectionDirection ?? UNDEFINED_CONNECTION_DIRECTION,
        connectionName: sanitizeString(shuntForm[FieldConstants.CONNECTIVITY]?.connectionName),
        connectionPosition: shuntForm[FieldConstants.CONNECTIVITY]?.connectionPosition ?? null,
        terminalConnected: shuntForm[FieldConstants.CONNECTIVITY]?.terminalConnected ?? null,
        properties: toModificationProperties(shuntForm),
    };
};
