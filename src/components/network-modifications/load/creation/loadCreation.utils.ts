/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { InferType, number, object, string } from 'yup';
import {
    DeepNullable,
    FieldConstants,
    ModificationType,
    sanitizeString,
    UNDEFINED_CONNECTION_DIRECTION,
    UNDEFINED_LOAD_TYPE,
} from '../../../../utils';
import {
    getConnectivityFormDataProps,
    getConnectivityWithPositionEmptyFormDataProps,
    getConnectivityWithPositionSchema,
} from '../../common/connectivity/';
import {
    creationPropertiesSchema,
    getFilledPropertiesFromModification,
    toModificationProperties,
} from '../../common/properties/';
import { LoadCreationDto } from './loadCreation.types';

export const loadCreationFormSchema = object()
    .shape({
        [FieldConstants.EQUIPMENT_ID]: string().required(),
        [FieldConstants.EQUIPMENT_NAME]: string().nullable(),
        [FieldConstants.LOAD_TYPE]: string().nullable(),
        [FieldConstants.ACTIVE_POWER_SET_POINT]: number().nullable().required(),
        [FieldConstants.REACTIVE_POWER_SET_POINT]: number().nullable().required(),
        [FieldConstants.CONNECTIVITY]: getConnectivityWithPositionSchema(false),
    })
    .concat(creationPropertiesSchema)
    .required();

export type LoadCreationFormData = InferType<typeof loadCreationFormSchema>;

export const loadCreationEmptyFormData: DeepNullable<LoadCreationFormData> = {
    equipmentID: '',
    equipmentName: '',
    loadType: null,
    activePowerSetpoint: null,
    reactivePowerSetpoint: null,
    AdditionalProperties: [],
    connectivity: getConnectivityWithPositionEmptyFormDataProps(),
};

export const loadCreationDtoToForm = (loadDto: LoadCreationDto): LoadCreationFormData => {
    return {
        equipmentID: loadDto.equipmentId,
        equipmentName: loadDto.equipmentName ?? '',
        loadType: loadDto.loadType,
        activePowerSetpoint: loadDto.p0,
        reactivePowerSetpoint: loadDto.q0,
        AdditionalProperties: getFilledPropertiesFromModification(loadDto.properties),
        connectivity: getConnectivityFormDataProps({
            voltageLevelId: loadDto.voltageLevelId,
            busbarSectionId: loadDto.busOrBusbarSectionId,
            connectionDirection: loadDto.connectionDirection,
            connectionName: loadDto.connectionName,
            connectionPosition: loadDto.connectionPosition,
            terminalConnected: loadDto.terminalConnected,
        }),
    };
};

export const loadCreationFormToDto = (loadForm: LoadCreationFormData): LoadCreationDto => {
    return {
        type: ModificationType.LOAD_CREATION,
        equipmentId: loadForm.equipmentID,
        equipmentName: sanitizeString(loadForm.equipmentName),
        loadType: loadForm.loadType ?? UNDEFINED_LOAD_TYPE,
        p0: loadForm.activePowerSetpoint,
        q0: loadForm.reactivePowerSetpoint,
        voltageLevelId: loadForm.connectivity.voltageLevel?.id ?? '',
        busOrBusbarSectionId: loadForm.connectivity.busOrBusbarSection?.id ?? '',
        connectionDirection: loadForm.connectivity.connectionDirection ?? UNDEFINED_CONNECTION_DIRECTION,
        connectionName: sanitizeString(loadForm.connectivity.connectionName),
        connectionPosition: loadForm.connectivity.connectionPosition,
        terminalConnected: loadForm.connectivity.terminalConnected,
        properties: toModificationProperties(loadForm),
    };
};
