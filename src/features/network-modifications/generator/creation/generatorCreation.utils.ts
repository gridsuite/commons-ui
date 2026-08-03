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
    MUST_BE_GREATER_OR_EQUAL_TO_ZERO,
    REAL_PERCENTAGE,
    sanitizeString,
    UNDEFINED_CONNECTION_DIRECTION,
} from '../../../../utils';
import {
    getConnectivityFormDataProps,
    getConnectivityWithPositionEmptyFormDataProps,
    getConnectivityWithPositionSchema,
} from '../../common/connectivity';
import {
    creationPropertiesSchema,
    getFilledPropertiesFromModification,
    toModificationProperties,
} from '../../common/properties';
import { GeneratorCreationDto } from './generatorCreation.types';
import {
    getActivePowerControlEmptyFormData,
    getActivePowerControlSchema,
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
    REGULATION_TYPES,
    testValueWithinPowerInterval,
    toReactiveCapabilityCurveChoiceForGeneratorCreation,
} from '../../common';

export const generatorCreationFormSchema = object()
    .shape({
        [FieldConstants.EQUIPMENT_ID]: string().required(),
        [FieldConstants.EQUIPMENT_NAME]: string().nullable(),
        [FieldConstants.ENERGY_SOURCE]: string().nullable().required(),
        [FieldConstants.MAXIMUM_ACTIVE_POWER]: number().nullable().required(),
        [FieldConstants.MINIMUM_ACTIVE_POWER]: number()
            .nullable()
            .max(ref(FieldConstants.MAXIMUM_ACTIVE_POWER), 'generatorMinimumActivePowerMaxValueError')
            .required(),
        [FieldConstants.RATED_NOMINAL_POWER]: number().nullable().min(0, MUST_BE_GREATER_OR_EQUAL_TO_ZERO),
        ...getShortCircuitFormSchema(),
        [FieldConstants.PLANNED_ACTIVE_POWER_SET_POINT]: number()
            .nullable()
            .default(null)
            .test(
                'activePowerSetPoint',
                'PlannedActivePowerSetPointMustBeBetweenMinAndMaxActivePower',
                testValueWithinPowerInterval
            ),
        [FieldConstants.MARGINAL_COST]: number().nullable(),
        [FieldConstants.PLANNED_OUTAGE_RATE]: number().nullable().min(0, REAL_PERCENTAGE).max(1, REAL_PERCENTAGE),
        [FieldConstants.FORCED_OUTAGE_RATE]: number().nullable().min(0, REAL_PERCENTAGE).max(1, REAL_PERCENTAGE),
        [FieldConstants.CONNECTIVITY]: getConnectivityWithPositionSchema(),
        ...getSetPointsSchema(),
        [FieldConstants.REACTIVE_LIMITS]: getReactiveLimitsValidationSchema(),
        ...getVoltageRegulationSchema(),
        ...getActivePowerControlSchema(),
    })
    .concat(creationPropertiesSchema)
    .required();

export type GeneratorCreationFormData = InferType<typeof generatorCreationFormSchema>;

export const generatorCreationEmptyFormData: DeepNullable<GeneratorCreationFormData> = {
    [FieldConstants.EQUIPMENT_ID]: '',
    [FieldConstants.EQUIPMENT_NAME]: '',
    [FieldConstants.ENERGY_SOURCE]: 'OTHER',
    [FieldConstants.MAXIMUM_ACTIVE_POWER]: null,
    [FieldConstants.MINIMUM_ACTIVE_POWER]: null,
    [FieldConstants.RATED_NOMINAL_POWER]: null,
    ...getShortCircuitEmptyFormData(),
    [FieldConstants.PLANNED_ACTIVE_POWER_SET_POINT]: null,
    [FieldConstants.MARGINAL_COST]: null,
    [FieldConstants.PLANNED_OUTAGE_RATE]: null,
    [FieldConstants.FORCED_OUTAGE_RATE]: null,
    [FieldConstants.CONNECTIVITY]: getConnectivityWithPositionEmptyFormDataProps(),
    [FieldConstants.REACTIVE_LIMITS]: getReactiveLimitsEmptyFormDataProps(),
    ...getSetPointsEmptyFormData(),
    ...getVoltageRegulationEmptyFormData(),
    ...getActivePowerControlEmptyFormData(),
    [FieldConstants.ADDITIONAL_PROPERTIES]: [],
};

export const generatorCreationDtoToForm = (dto: GeneratorCreationDto): GeneratorCreationFormData => {
    return {
        equipmentID: dto.equipmentId,
        equipmentName: dto.equipmentName ?? '',
        energySource: dto.energySource ?? 'OTHER',
        maximumActivePower: dto.maxP,
        minimumActivePower: dto.minP,
        ratedNominalPower: dto.ratedS,
        activePowerSetpoint: dto.targetP ?? undefined,
        voltageRegulation: dto.voltageRegulationOn,
        voltageSetpoint: dto.targetV,
        reactivePowerSetpoint: dto.targetQ,
        plannedActivePowerSetPoint: dto.plannedActivePowerSetPoint,
        marginalCost: dto.marginalCost,
        plannedOutageRate: dto.plannedOutageRate,
        forcedOutageRate: dto.forcedOutageRate,
        frequencyRegulation: dto.participate,
        droop: dto.droop,
        ...getShortCircuitFormData({
            directTransX: dto.directTransX,
            stepUpTransformerX: dto.stepUpTransformerX,
        }),
        voltageRegulationType: dto?.regulatingTerminalId ? REGULATION_TYPES.DISTANT.id : REGULATION_TYPES.LOCAL.id,
        qPercent: dto.qPercent,
        reactiveLimits: getReactiveLimitsFormDataProps({
            reactiveCapabilityCurveChoice: dto?.reactiveCapabilityCurve ? 'CURVE' : 'MINMAX',
            minimumReactivePower: dto?.minQ,
            maximumReactivePower: dto?.maxQ,
            reactiveCapabilityCurvePoints: dto?.reactiveCapabilityCurve ? dto?.reactiveCapabilityCurvePoints : null,
        }),
        voltageLevel: getRegulatingTerminalVoltageLevelData({
            voltageLevelId: dto.regulatingTerminalVlId,
        }),
        equipment: getRegulatingTerminalEquipmentData({
            equipmentId: dto.regulatingTerminalId,
            equipmentType: dto.regulatingTerminalType ?? undefined,
        }),
        connectivity: getConnectivityFormDataProps({
            voltageLevelId: dto.voltageLevelId,
            busbarSectionId: dto.busOrBusbarSectionId,
            connectionDirection: dto.connectionDirection,
            connectionName: dto.connectionName,
            connectionPosition: dto.connectionPosition,
            terminalConnected: dto.terminalConnected,
        }),
        AdditionalProperties: getFilledPropertiesFromModification(dto.properties),
    };
};

export const generatorCreationFormToDto = (
    form: GeneratorCreationFormData,
    dto?: GeneratorCreationDto
): GeneratorCreationDto => {
    const isReactiveCapabilityCurveOn = toReactiveCapabilityCurveChoiceForGeneratorCreation(form, dto) === 'CURVE';
    const isDistantRegulation = form[FieldConstants.VOLTAGE_REGULATION_TYPE] === REGULATION_TYPES.DISTANT.id;
    return {
        type: ModificationType.GENERATOR_CREATION,
        equipmentId: form.equipmentID,
        equipmentName: sanitizeString(form.equipmentName),
        energySource: form.energySource,
        minP: form.minimumActivePower,
        maxP: form.maximumActivePower,
        ratedS: form.ratedNominalPower ?? null,
        targetP: form.activePowerSetpoint ?? null,
        targetQ: form.reactivePowerSetpoint ?? null,
        voltageRegulationOn: form.voltageRegulation ?? null,
        targetV: form.voltageSetpoint ?? null,
        qPercent: form.qPercent ?? null,
        voltageLevelId: form.connectivity.voltageLevel?.id ?? '',
        busOrBusbarSectionId: form.connectivity.busOrBusbarSection?.id ?? '',
        connectionDirection: form.connectivity.connectionDirection ?? UNDEFINED_CONNECTION_DIRECTION,
        connectionName: sanitizeString(form.connectivity.connectionName),
        connectionPosition: form.connectivity.connectionPosition ?? null,
        terminalConnected: form.connectivity.terminalConnected ?? null,
        plannedActivePowerSetPoint: form.plannedActivePowerSetPoint ?? null,
        marginalCost: form.marginalCost ?? null,
        plannedOutageRate: form.plannedOutageRate ?? null,
        forcedOutageRate: form.forcedOutageRate ?? null,
        directTransX: form.directTransX ?? null,
        stepUpTransformerX: form.transformerReactance ?? null,
        regulatingTerminalId: isDistantRegulation ? (form.equipment?.id ?? null) : null,
        regulatingTerminalType: isDistantRegulation ? (form.equipment?.type ?? null) : null,
        regulatingTerminalVlId: isDistantRegulation ? (form.voltageLevel?.id ?? null) : null,
        reactiveCapabilityCurve: isReactiveCapabilityCurveOn,
        participate: form.frequencyRegulation ?? null,
        droop: form.droop ?? null,
        maxQ: isReactiveCapabilityCurveOn ? null : (form.reactiveLimits.maximumReactivePower ?? null),
        minQ: isReactiveCapabilityCurveOn ? null : (form.reactiveLimits.minimumReactivePower ?? null),
        reactiveCapabilityCurvePoints: isReactiveCapabilityCurveOn
            ? (form.reactiveLimits.reactiveCapabilityCurveTable ?? null)
            : null,
        properties: toModificationProperties(form),
    };
};
