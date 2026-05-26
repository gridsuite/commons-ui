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
    getSetPointsSchema,
    modificationPropertiesSchema,
    toModificationProperties,
} from '../../common';
import { LoadModificationDto } from './loadModification.types';

export const loadModificationFormSchema = object()
    .shape({
        [FieldConstants.EQUIPMENT_ID]: string().required(),
        [FieldConstants.EQUIPMENT_NAME]: string().nullable(),
        [FieldConstants.LOAD_TYPE]: string().nullable(),
        ...getSetPointsSchema(true),
        [FieldConstants.CONNECTIVITY]: getConnectivityWithPositionSchema(true),
        [FieldConstants.STATE_ESTIMATION]: getInjectionActiveReactivePowerValidationSchemaProperties(),
    })
    .concat(modificationPropertiesSchema)
    .required();

export type LoadModificationFormData = InferType<typeof loadModificationFormSchema>;

export const loadModificationEmptyFormData: DeepNullable<LoadModificationFormData> = {
    equipmentID: '',
    equipmentName: '',
    loadType: null,
    activePowerSetpoint: null,
    reactivePowerSetpoint: null,
    connectivity: getConnectivityWithPositionEmptyFormDataProps(true),
    stateEstimation: getInjectionActiveReactivePowerEmptyFormDataProperties(),
    AdditionalProperties: [],
};

export const loadModificationDtoToForm = (
    loadDto: LoadModificationDto,
    includePreviousValues = true
): LoadModificationFormData => {
    return {
        equipmentID: loadDto.equipmentId,
        equipmentName: loadDto.equipmentName?.value ?? '',
        loadType: loadDto?.loadType?.value ?? null,
        activePowerSetpoint: loadDto.p0?.value ?? undefined,
        reactivePowerSetpoint: loadDto.q0?.value ?? undefined,
        connectivity: getConnectivityFormDataProps({
            voltageLevelId: loadDto?.voltageLevelId?.value ?? null,
            busbarSectionId: loadDto?.busOrBusbarSectionId?.value ?? null,
            connectionName: loadDto?.connectionName?.value ?? '',
            connectionDirection: loadDto?.connectionDirection?.value ?? null,
            connectionPosition: loadDto?.connectionPosition?.value ?? null,
            terminalConnected: loadDto?.terminalConnected?.value ?? null,
            isEquipmentModification: true,
        }),
        stateEstimation: getInjectionActiveReactivePowerEditDataProperties(loadDto),
        ...getPropertiesFromModification(loadDto?.properties, includePreviousValues),
    };
};

export const loadModificationFormToDto = (loadForm: LoadModificationFormData): LoadModificationDto => {
    return {
        type: ModificationType.LOAD_MODIFICATION,
        equipmentId: loadForm.equipmentID,
        equipmentName: toModificationOperation(sanitizeString(loadForm?.equipmentName)),
        loadType: toModificationOperation(loadForm?.loadType),
        p0: toModificationOperation(loadForm?.activePowerSetpoint),
        q0: toModificationOperation(loadForm?.reactivePowerSetpoint),
        voltageLevelId: toModificationOperation(loadForm.connectivity?.voltageLevel?.id),
        busOrBusbarSectionId: toModificationOperation(loadForm.connectivity?.busOrBusbarSection?.id),
        connectionName: toModificationOperation(sanitizeString(loadForm.connectivity?.connectionName)),
        connectionDirection: toModificationOperation(loadForm.connectivity?.connectionDirection),
        connectionPosition: toModificationOperation(loadForm.connectivity?.connectionPosition),
        terminalConnected: toModificationOperation(loadForm.connectivity?.terminalConnected),
        pMeasurementValue: toModificationOperation(loadForm.stateEstimation?.measurementP?.value),
        pMeasurementValidity: toModificationOperation(loadForm.stateEstimation?.measurementP?.validity),
        qMeasurementValue: toModificationOperation(loadForm.stateEstimation?.measurementQ?.value),
        qMeasurementValidity: toModificationOperation(loadForm.stateEstimation?.measurementQ?.validity),
        properties: toModificationProperties(loadForm),
    };
};
