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
    YUP_REQUIRED,
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
import { BatteryCreationDto } from './batteryCreation.types';
import {
    getActivePowerControlEmptyFormData,
    getActivePowerControlSchema,
    getReactiveLimitsEmptyFormData,
    getReactiveLimitsEmptyFormDataProps,
    getReactiveLimitsFormDataProps,
    getReactiveLimitsValidationSchema,
    getSetPointsEmptyFormData,
    getSetPointsSchema,
    getShortCircuitEmptyFormData,
    getShortCircuitFormData,
    getShortCircuitFormSchema,
} from '../../common';

export const batteryCreationFormSchema = object()
    .shape({
        [FieldConstants.EQUIPMENT_ID]: string().required(YUP_REQUIRED),
        [FieldConstants.EQUIPMENT_NAME]: string().nullable(),
        [FieldConstants.MAXIMUM_ACTIVE_POWER]: number().nullable().required(YUP_REQUIRED),
        [FieldConstants.MINIMUM_ACTIVE_POWER]: number().nullable().required(YUP_REQUIRED),
        [FieldConstants.CONNECTIVITY]: getConnectivityWithPositionSchema(false),
        [FieldConstants.REACTIVE_LIMITS]: getReactiveLimitsValidationSchema(),
        ...getSetPointsSchema(),
        ...getActivePowerControlSchema(),
        ...getShortCircuitFormSchema(),
    })
    .concat(creationPropertiesSchema)
    .required(YUP_REQUIRED);

export type BatteryCreationFormData = InferType<typeof batteryCreationFormSchema>;

export const batteryCreationEmptyFormData: DeepNullable<BatteryCreationFormData> = {
    equipmentID: '',
    equipmentName: '',
    maximumActivePower: null,
    minimumActivePower: null,
    connectivity: getConnectivityWithPositionEmptyFormDataProps(),
    reactiveLimits: getReactiveLimitsEmptyFormDataProps(),
    AdditionalProperties: [],
    ...getSetPointsEmptyFormData(),
    ...getReactiveLimitsEmptyFormData(),
    ...getActivePowerControlEmptyFormData(),
    ...getShortCircuitEmptyFormData(),
};

export const batteryCreationDtoToForm = (dto: BatteryCreationDto): BatteryCreationFormData => {
    return {
        equipmentID: dto.equipmentId,
        equipmentName: dto.equipmentName ?? '',
        maximumActivePower: dto.maxP,
        minimumActivePower: dto.minP,
        activePowerSetpoint: dto.targetP,
        reactivePowerSetpoint: dto.targetQ,
        frequencyRegulation: dto.participate,
        droop: dto.droop,
        connectivity: getConnectivityFormDataProps({
            voltageLevelId: dto.voltageLevelId,
            busbarSectionId: dto.busOrBusbarSectionId,
            connectionDirection: dto.connectionDirection,
            connectionName: dto.connectionName,
            connectionPosition: dto.connectionPosition,
            terminalConnected: dto.terminalConnected,
        }),
        reactiveLimits: getReactiveLimitsFormDataProps({
            reactiveCapabilityCurveChoice: dto?.reactiveCapabilityCurve ? 'CURVE' : 'MINMAX',
            minimumReactivePower: dto?.minQ,
            maximumReactivePower: dto?.maxQ,
            reactiveCapabilityCurvePoints: dto?.reactiveCapabilityCurve ? dto?.reactiveCapabilityCurvePoints : null,
        }),
        AdditionalProperties: getFilledPropertiesFromModification(dto.properties),
        ...getShortCircuitFormData({
            directTransX: dto.directTransX,
            stepUpTransformerX: dto.stepUpTransformerX,
        }),
    };
};

export const batteryCreationFormToDto = (form: BatteryCreationFormData): BatteryCreationDto => {
    const isReactiveCapabilityCurveOn = form.reactiveLimits.reactiveCapabilityCurveChoice === 'CURVE';
    return {
        type: ModificationType.BATTERY_CREATION,
        equipmentId: form.equipmentID,
        equipmentName: sanitizeString(form.equipmentName),
        voltageLevelId: form.connectivity.voltageLevel?.id ?? '',
        busOrBusbarSectionId: form.connectivity.busOrBusbarSection?.id ?? '',
        connectionDirection: form.connectivity.connectionDirection ?? UNDEFINED_CONNECTION_DIRECTION,
        connectionName: sanitizeString(form.connectivity.connectionName),
        connectionPosition: form.connectivity.connectionPosition,
        terminalConnected: form.connectivity.terminalConnected,
        properties: toModificationProperties(form),
        minP: form.minimumActivePower,
        maxP: form.maximumActivePower,
        reactiveCapabilityCurve: isReactiveCapabilityCurveOn,
        minQ: isReactiveCapabilityCurveOn ? null : (form.reactiveLimits.minimumReactivePower ?? null),
        maxQ: isReactiveCapabilityCurveOn ? null : (form.reactiveLimits.maximumReactivePower ?? null),
        reactiveCapabilityCurvePoints: isReactiveCapabilityCurveOn
            ? (form.reactiveLimits.reactiveCapabilityCurveTable ?? null)
            : null,
        targetP: form.activePowerSetpoint ?? 0,
        targetQ: form.reactivePowerSetpoint ?? 0,
        participate: form.frequencyRegulation ?? null,
        droop: form.droop ?? null,
        directTransX: form.directTransX ?? null,
        stepUpTransformerX: form.transformerReactance ?? null,
    };
};
