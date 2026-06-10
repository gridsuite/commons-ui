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
    toModificationOperation,
} from '../../../../utils';
import {
    getConnectivityFormDataProps,
    getConnectivityWithPositionEmptyFormDataProps,
    getConnectivityWithPositionSchema,
    getInjectionActiveReactivePowerEditDataProperties,
    getInjectionActiveReactivePowerEmptyFormDataProperties,
    getInjectionActiveReactivePowerValidationSchemaProperties,
    getPropertiesFromModification,
    modificationPropertiesSchema,
    toModificationProperties,
} from '../../common';
import {
    CHARACTERISTICS_CHOICES,
    getCharacteristicsEmptyFormData,
    getCharacteristicsFormData,
    getCharacteristicsFormValidationSchema,
} from '../common';
import { ShuntCompensatorModificationDto } from './shuntCompensatorModification.types';

export const shuntCompensatorModificationFormSchema = object()
    .shape({
        [FieldConstants.EQUIPMENT_ID]: string().required(),
        [FieldConstants.EQUIPMENT_NAME]: string().nullable(),
        [FieldConstants.CONNECTIVITY]: getConnectivityWithPositionSchema(true),
        [FieldConstants.STATE_ESTIMATION]: getInjectionActiveReactivePowerValidationSchemaProperties(),
        ...getCharacteristicsFormValidationSchema(true),
    })
    .concat(modificationPropertiesSchema)
    .required();

export type ShuntCompensatorModificationFormData = InferType<typeof shuntCompensatorModificationFormSchema>;

export const shuntCompensatorModificationEmptyFormData: DeepNullable<ShuntCompensatorModificationFormData> = {
    [FieldConstants.EQUIPMENT_ID]: '',
    [FieldConstants.EQUIPMENT_NAME]: '',
    [FieldConstants.CONNECTIVITY]: getConnectivityWithPositionEmptyFormDataProps(true),
    [FieldConstants.STATE_ESTIMATION]: getInjectionActiveReactivePowerEmptyFormDataProperties(),
    ...getCharacteristicsEmptyFormData(),
    [FieldConstants.ADDITIONAL_PROPERTIES]: [],
};

export const shuntCompensatorModificationDtoToForm = (
    shuntDto: ShuntCompensatorModificationDto,
    includePreviousValues = true
): ShuntCompensatorModificationFormData => ({
    [FieldConstants.EQUIPMENT_ID]: shuntDto.equipmentId,
    [FieldConstants.EQUIPMENT_NAME]: shuntDto.equipmentName?.value ?? '',
    [FieldConstants.CONNECTIVITY]: getConnectivityFormDataProps({
        voltageLevelId: shuntDto.voltageLevelId?.value ?? null,
        busbarSectionId: shuntDto.busOrBusbarSectionId?.value ?? null,
        connectionName: shuntDto.connectionName?.value ?? '',
        connectionDirection: shuntDto.connectionDirection?.value ?? null,
        connectionPosition: shuntDto.connectionPosition?.value ?? null,
        terminalConnected: shuntDto.terminalConnected?.value ?? null,
        isEquipmentModification: true,
    }),
    ...getCharacteristicsFormData({
        maxSusceptance: shuntDto.maxSusceptance?.value ?? null,
        maxQAtNominalV: shuntDto.maxQAtNominalV?.value ?? null,
        shuntCompensatorType: shuntDto.shuntCompensatorType?.value ?? null,
        sectionCount: shuntDto.sectionCount?.value ?? null,
        maximumSectionCount: shuntDto.maximumSectionCount?.value ?? null,
    }),
    [FieldConstants.STATE_ESTIMATION]: getInjectionActiveReactivePowerEditDataProperties(shuntDto),
    ...getPropertiesFromModification(shuntDto.properties, includePreviousValues),
});

export const shuntCompensatorModificationFormToDto = (
    shuntForm: ShuntCompensatorModificationFormData
): ShuntCompensatorModificationDto => {
    const choice = shuntForm[FieldConstants.CHARACTERISTICS_CHOICE];
    const stateEstimationData = shuntForm[FieldConstants.STATE_ESTIMATION];
    return {
        type: ModificationType.SHUNT_COMPENSATOR_MODIFICATION,
        equipmentId: shuntForm[FieldConstants.EQUIPMENT_ID],
        equipmentName: toModificationOperation(sanitizeString(shuntForm[FieldConstants.EQUIPMENT_NAME])),
        maximumSectionCount: toModificationOperation(shuntForm[FieldConstants.MAXIMUM_SECTION_COUNT]),
        sectionCount: toModificationOperation(shuntForm[FieldConstants.SECTION_COUNT]),
        maxSusceptance: toModificationOperation(
            choice === CHARACTERISTICS_CHOICES.SUSCEPTANCE.id ? shuntForm[FieldConstants.MAX_SUSCEPTANCE] : null
        ),
        maxQAtNominalV: toModificationOperation(
            choice === CHARACTERISTICS_CHOICES.Q_AT_NOMINAL_V.id ? shuntForm[FieldConstants.MAX_Q_AT_NOMINAL_V] : null
        ),
        shuntCompensatorType: toModificationOperation(
            choice === CHARACTERISTICS_CHOICES.Q_AT_NOMINAL_V.id
                ? shuntForm[FieldConstants.SHUNT_COMPENSATOR_TYPE]
                : null
        ),
        voltageLevelId: toModificationOperation(shuntForm[FieldConstants.CONNECTIVITY]?.voltageLevel?.id),
        busOrBusbarSectionId: toModificationOperation(shuntForm[FieldConstants.CONNECTIVITY]?.busOrBusbarSection?.id),
        connectionName: toModificationOperation(sanitizeString(shuntForm[FieldConstants.CONNECTIVITY]?.connectionName)),
        connectionDirection: toModificationOperation(shuntForm[FieldConstants.CONNECTIVITY]?.connectionDirection),
        connectionPosition: toModificationOperation(shuntForm[FieldConstants.CONNECTIVITY]?.connectionPosition),
        terminalConnected: toModificationOperation(shuntForm[FieldConstants.CONNECTIVITY]?.terminalConnected),
        qMeasurementValue: toModificationOperation(stateEstimationData?.measurementQ?.value),
        qMeasurementValidity: toModificationOperation(stateEstimationData?.measurementQ?.validity),
        properties: toModificationProperties(shuntForm),
    };
};
