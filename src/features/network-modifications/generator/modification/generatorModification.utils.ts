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
    getRegulatingTerminalEquipmentData,
    getRegulatingTerminalVoltageLevelData,
    getSetPointsEmptyFormData,
    getSetPointsSchema,
    getShortCircuitEmptyFormData,
    getShortCircuitFormData,
    getShortCircuitFormSchema,
    getVoltageRegulationEmptyFormData,
    getVoltageRegulationSchema,
    modificationPropertiesSchema,
    toModificationProperties,
    toReactiveCapabilityCurveChoiceForGeneratorModification,
} from '../../common';
import { GeneratorModificationDto } from './generatorModification.types';
import { GeneratorFormInfos } from '../generatorDialog.type';

export const generatorModificationFormSchema = object()
    .shape({
        [FieldConstants.EQUIPMENT_ID]: string().required(),
        [FieldConstants.EQUIPMENT_NAME]: string().nullable(),
        [FieldConstants.ENERGY_SOURCE]: string().nullable(),
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
        [FieldConstants.RATED_NOMINAL_POWER]: number().nullable().min(0, 'mustBeGreaterOrEqualToZero'),
        ...getShortCircuitFormSchema(),
        [FieldConstants.PLANNED_ACTIVE_POWER_SET_POINT]: number().nullable(),
        [FieldConstants.MARGINAL_COST]: number().nullable(),

        [FieldConstants.PLANNED_OUTAGE_RATE]: number().nullable().min(0, 'RealPercentage').max(1, 'RealPercentage'),
        [FieldConstants.FORCED_OUTAGE_RATE]: number().nullable().min(0, 'RealPercentage').max(1, 'RealPercentage'),
        [FieldConstants.CONNECTIVITY]: getConnectivityWithPositionSchema(true),
        [FieldConstants.REACTIVE_LIMITS]: getReactiveLimitsValidationSchema(true),
        ...getSetPointsSchema(true),
        ...getVoltageRegulationSchema(true),
        ...getActivePowerControlSchema(true),
        [FieldConstants.STATE_ESTIMATION]: getInjectionActiveReactivePowerValidationSchemaProperties(),
    })
    .concat(modificationPropertiesSchema)
    .required();

export type GeneratorModificationFormData = InferType<typeof generatorModificationFormSchema>;

export const generatorModificationEmptyFormData: DeepNullable<GeneratorModificationFormData> = {
    equipmentID: '',
    equipmentName: '',
    energySource: null,
    maximumActivePower: null,
    minimumActivePower: null,
    ratedNominalPower: null,
    plannedActivePowerSetPoint: null,
    marginalCost: null,
    plannedOutageRate: null,
    forcedOutageRate: null,
    connectivity: getConnectivityWithPositionEmptyFormDataProps(true),
    ...getShortCircuitEmptyFormData(),
    ...getSetPointsEmptyFormData(true),
    ...getActivePowerControlEmptyFormData(true),
    ...getVoltageRegulationEmptyFormData(true),
    reactiveLimits: getReactiveLimitsEmptyFormDataProps(),
    stateEstimation: getInjectionActiveReactivePowerEmptyFormDataProperties(),
    AdditionalProperties: [],
};

export const generatorModificationDtoToForm = (
    dto: GeneratorModificationDto,
    includePreviousValues = true
): GeneratorModificationFormData => {
    return {
        equipmentID: dto?.equipmentId,
        equipmentName: dto?.equipmentName?.value ?? '',
        energySource: dto?.energySource?.value ?? null,
        maximumActivePower: dto?.maxP?.value ?? null,
        minimumActivePower: dto?.minP?.value ?? null,
        ratedNominalPower: dto?.ratedS?.value ?? null,
        activePowerSetpoint: dto?.targetP?.value ?? undefined,
        voltageRegulation: dto?.voltageRegulationOn?.value ?? null,
        voltageSetpoint: dto?.targetV?.value ?? null,
        reactivePowerSetpoint: dto?.targetQ?.value ?? null,
        plannedActivePowerSetPoint: dto?.plannedActivePowerSetPoint?.value ?? null,
        marginalCost: dto?.marginalCost?.value ?? null,
        plannedOutageRate: dto?.plannedOutageRate?.value ?? null,
        forcedOutageRate: dto?.forcedOutageRate?.value ?? null,
        frequencyRegulation: dto?.participate?.value ?? null,
        droop: dto?.droop?.value ?? null,
        ...getShortCircuitFormData({
            directTransX: dto?.directTransX?.value ?? null,
            stepUpTransformerX: dto?.stepUpTransformerX?.value ?? null,
        }),
        voltageRegulationType: dto?.voltageRegulationType?.value ?? null,
        qPercent: dto?.qPercent?.value ?? null,
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
            reactiveCapabilityCurvePoints: dto?.reactiveCapabilityCurvePoints ?? null,
        }),
        voltageLevel: getRegulatingTerminalVoltageLevelData({
            voltageLevelId: dto.regulatingTerminalVlId?.value,
        }),
        equipment: getRegulatingTerminalEquipmentData({
            equipmentId: dto.regulatingTerminalId?.value,
            equipmentType: dto.regulatingTerminalType?.value,
        }),
        stateEstimation: getInjectionActiveReactivePowerEditDataProperties(dto),
        ...getPropertiesFromModification(dto?.properties, includePreviousValues),
    };
};

export const generatorModificationFormToDto = (
    form: GeneratorModificationFormData,
    dto: GeneratorModificationDto | undefined,
    equipment?: GeneratorFormInfos
): GeneratorModificationDto => {
    const isReactiveCapabilityCurveOn =
        toReactiveCapabilityCurveChoiceForGeneratorModification(form, equipment, dto) === 'CURVE';
    console.log('DBG DBR sub', form, dto, isReactiveCapabilityCurveOn);
    return {
        type: ModificationType.GENERATOR_MODIFICATION,
        equipmentId: form.equipmentID,
        equipmentName: toModificationOperation(sanitizeString(form.equipmentName)),
        energySource: toModificationOperation(form.energySource),
        minP: toModificationOperation(form.minimumActivePower),
        maxP: toModificationOperation(form.maximumActivePower),
        ratedS: toModificationOperation(form.ratedNominalPower),
        targetP: toModificationOperation(form.activePowerSetpoint),
        targetQ: toModificationOperation(form.reactivePowerSetpoint),
        voltageRegulationOn: toModificationOperation(form.voltageRegulation),
        targetV: toModificationOperation(form.voltageSetpoint),
        voltageLevelId: toModificationOperation(form.connectivity?.voltageLevel?.id),
        busOrBusbarSectionId: toModificationOperation(form.connectivity?.busOrBusbarSection?.id),
        connectionDirection: toModificationOperation(form.connectivity?.connectionDirection),
        connectionName: toModificationOperation(sanitizeString(form.connectivity?.connectionName)),
        connectionPosition: toModificationOperation(form.connectivity?.connectionPosition),
        terminalConnected: toModificationOperation(form.connectivity?.terminalConnected),
        qPercent: toModificationOperation(form.qPercent),
        plannedActivePowerSetPoint: toModificationOperation(form.plannedActivePowerSetPoint),
        marginalCost: toModificationOperation(form.marginalCost),
        plannedOutageRate: toModificationOperation(form.plannedOutageRate),
        forcedOutageRate: toModificationOperation(form.forcedOutageRate),
        directTransX: toModificationOperation(form.directTransX),
        stepUpTransformerX: toModificationOperation(form.transformerReactance),
        voltageRegulationType: toModificationOperation(form.voltageRegulationType),
        regulatingTerminalId: toModificationOperation(form.equipment?.id),
        regulatingTerminalType: toModificationOperation(form.equipment?.type),
        regulatingTerminalVlId: toModificationOperation(form.voltageLevel?.id),
        reactiveCapabilityCurve: toModificationOperation(isReactiveCapabilityCurveOn),
        participate: toModificationOperation(form.frequencyRegulation),
        droop: toModificationOperation(form.droop) ?? null,
        minQ: toModificationOperation(isReactiveCapabilityCurveOn ? null : form.reactiveLimits?.minimumReactivePower),
        maxQ: toModificationOperation(isReactiveCapabilityCurveOn ? null : form.reactiveLimits?.maximumReactivePower),
        reactiveCapabilityCurvePoints: isReactiveCapabilityCurveOn
            ? (form.reactiveLimits.reactiveCapabilityCurveTable ?? null)
            : null,
        pMeasurementValue: toModificationOperation(form.stateEstimation?.measurementP?.value),
        pMeasurementValidity: toModificationOperation(form.stateEstimation?.measurementP?.validity),
        qMeasurementValue: toModificationOperation(form.stateEstimation?.measurementQ?.value),
        qMeasurementValidity: toModificationOperation(form.stateEstimation?.measurementQ?.validity),
        properties: toModificationProperties(form) ?? null,
    };
};
