/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { InferType, number, object, ref, string } from 'yup';
import {
    DeepNullable,
    FieldConstants,
    ModificationType,
    sanitizeString,
    toModificationOperation,
} from '../../../../utils';
import {
    getActivePowerControlEmptyFormData,
    getActivePowerControlSchema,
    getConnectivityFormDataProps,
    getConnectivityWithPositionEmptyFormDataProps,
    getConnectivityWithPositionSchema,
    getInjectionActiveReactivePowerEditDataProperties,
    getInjectionActiveReactivePowerEmptyFormDataProperties,
    getInjectionActiveReactivePowerValidationSchemaProperties,
    getPropertiesFromModification,
    getReactiveLimitsEmptyFormDataProps,
    getReactiveLimitsFormDataProps,
    getReactiveLimitsValidationSchema,
    getSetPointsEmptyFormData,
    getSetPointsSchema,
    getShortCircuitEmptyFormData,
    getShortCircuitFormData,
    getShortCircuitFormSchema,
    modificationPropertiesSchema,
    toModificationProperties,
} from '../../common';
import { BatteryModificationDto } from './batteryModification.types';

export const batteryModificationFormSchema = object()
    .shape({
        [FieldConstants.EQUIPMENT_ID]: string().required(),
        [FieldConstants.EQUIPMENT_NAME]: string().nullable(),
        [FieldConstants.MAXIMUM_ACTIVE_POWER]: number().nullable(),
        [FieldConstants.MINIMUM_ACTIVE_POWER]: number()
            .nullable()
            .when([FieldConstants.MAXIMUM_ACTIVE_POWER], {
                is: (maximumActivePower: number) => maximumActivePower != null,
                then: (schema) =>
                    schema.max(
                        ref(FieldConstants.MAXIMUM_ACTIVE_POWER),
                        'MinActivePowerMustBeLessOrEqualToMaxActivePower'
                    ),
            }),
        [FieldConstants.CONNECTIVITY]: getConnectivityWithPositionSchema(true),
        [FieldConstants.REACTIVE_LIMITS]: getReactiveLimitsValidationSchema(true),
        [FieldConstants.STATE_ESTIMATION]: getInjectionActiveReactivePowerValidationSchemaProperties(),
        ...getSetPointsSchema(true),
        ...getActivePowerControlSchema(true),
        ...getShortCircuitFormSchema(true),
    })
    .concat(modificationPropertiesSchema)
    .required();

export type BatteryModificationFormData = InferType<typeof batteryModificationFormSchema>;

export const batteryModificationEmptyFormData: DeepNullable<BatteryModificationFormData> = {
    equipmentID: '',
    equipmentName: '',
    maximumActivePower: null,
    minimumActivePower: null,
    connectivity: getConnectivityWithPositionEmptyFormDataProps(true),
    reactiveLimits: getReactiveLimitsEmptyFormDataProps(),
    ...getSetPointsEmptyFormData(true),
    ...getActivePowerControlEmptyFormData(true),
    AdditionalProperties: [],
    ...getShortCircuitEmptyFormData(),
    stateEstimation: getInjectionActiveReactivePowerEmptyFormDataProperties(),
};

export const batteryModificationDtoToForm = (
    dto: BatteryModificationDto,
    includePreviousValues = true
): BatteryModificationFormData => {
    return {
        equipmentID: dto?.equipmentId,
        equipmentName: dto?.equipmentName?.value ?? '',
        maximumActivePower: dto?.maxP?.value ?? null,
        minimumActivePower: dto?.minP?.value ?? null,
        activePowerSetpoint: dto?.targetP?.value ?? undefined,
        reactivePowerSetpoint: dto?.targetQ?.value ?? null,
        frequencyRegulation: dto?.participate?.value ?? null,
        droop: dto?.droop?.value ?? null,
        connectivity: getConnectivityFormDataProps({
            voltageLevelId: dto?.voltageLevelId?.value ?? null,
            busbarSectionId: dto?.busOrBusbarSectionId?.value ?? null,
            connectionName: dto?.connectionName?.value ?? '',
            connectionDirection: dto?.connectionDirection?.value ?? null,
            connectionPosition: dto?.connectionPosition?.value ?? null,
            terminalConnected: dto?.terminalConnected?.value ?? null,
            isEquipmentModification: true,
        }),
        reactiveLimits: getReactiveLimitsFormDataProps({
            reactiveCapabilityCurveChoice: dto?.reactiveCapabilityCurve?.value ? 'CURVE' : 'MINMAX',
            minimumReactivePower: dto?.minQ?.value ?? null,
            maximumReactivePower: dto?.maxQ?.value ?? null,
            reactiveCapabilityCurvePoints: dto?.reactiveCapabilityCurve?.value
                ? dto?.reactiveCapabilityCurvePoints
                : null,
        }),
        stateEstimation: getInjectionActiveReactivePowerEditDataProperties(dto),
        ...getShortCircuitFormData({
            directTransX: dto?.directTransX?.value ?? null,
            stepUpTransformerX: dto?.stepUpTransformerX?.value ?? null,
        }),
        ...getPropertiesFromModification(dto?.properties, includePreviousValues),
    };
};

export const batteryModificationFormToDto = (form: BatteryModificationFormData): BatteryModificationDto => {
    const isReactiveCapabilityCurveOn = form.reactiveLimits?.reactiveCapabilityCurveChoice === 'CURVE';
    return {
        type: ModificationType.BATTERY_MODIFICATION,
        equipmentId: form.equipmentID ?? '',
        equipmentName: toModificationOperation(sanitizeString(form.equipmentName)),
        minP: toModificationOperation(form.minimumActivePower),
        maxP: toModificationOperation(form.maximumActivePower),
        targetP: toModificationOperation(form.activePowerSetpoint),
        targetQ: toModificationOperation(form.reactivePowerSetpoint),
        participate: toModificationOperation(form.frequencyRegulation),
        droop: toModificationOperation(form.droop) ?? null,
        reactiveCapabilityCurve: toModificationOperation(isReactiveCapabilityCurveOn),
        minQ: toModificationOperation(isReactiveCapabilityCurveOn ? null : form.reactiveLimits?.minimumReactivePower),
        maxQ: toModificationOperation(isReactiveCapabilityCurveOn ? null : form.reactiveLimits?.maximumReactivePower),
        reactiveCapabilityCurvePoints: isReactiveCapabilityCurveOn
            ? (form.reactiveLimits.reactiveCapabilityCurveTable ?? null)
            : null,
        voltageLevelId: toModificationOperation(form.connectivity?.voltageLevel?.id),
        busOrBusbarSectionId: toModificationOperation(form.connectivity?.busOrBusbarSection?.id),
        connectionDirection: toModificationOperation(form.connectivity?.connectionDirection),
        connectionName: toModificationOperation(sanitizeString(form.connectivity?.connectionName)),
        connectionPosition: toModificationOperation(form.connectivity?.connectionPosition),
        terminalConnected: toModificationOperation(form.connectivity?.terminalConnected),
        pMeasurementValue: toModificationOperation(form.stateEstimation?.measurementP?.value),
        pMeasurementValidity: toModificationOperation(form.stateEstimation?.measurementP?.validity),
        qMeasurementValue: toModificationOperation(form.stateEstimation?.measurementQ?.value),
        qMeasurementValidity: toModificationOperation(form.stateEstimation?.measurementQ?.validity),
        properties: toModificationProperties(form) ?? null,
        directTransX: toModificationOperation(form.directTransX),
        stepUpTransformerX: toModificationOperation(form.transformerReactance),
    };
};
