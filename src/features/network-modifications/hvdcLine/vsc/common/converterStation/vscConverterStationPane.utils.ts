/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { InferType, object, boolean, number, string } from 'yup';
import {
    AttributeModification,
    FieldConstants,
    MUST_BE_GREATER_OR_EQUAL_TO_ZERO,
    NORMALIZED_PERCENTAGE,
    sanitizeString,
    toModificationOperation,
    UNDEFINED_CONNECTION_DIRECTION,
} from '../../../../../../utils';
import {
    getReactiveLimitsEmptyFormDataProps,
    getReactiveLimitsFormDataProps,
    getReactiveLimitsValidationSchema,
} from '../../../../common/reactiveLimits/reactiveLimits.utils';
import {
    getConnectivityFormDataProps,
    getConnectivityWithPositionEmptyFormDataProps,
    getConnectivityWithPositionSchema,
} from '../../../../common/connectivity/connectivityForm.utils';
import {
    getInjectionActiveReactivePowerEditDataProperties,
    getInjectionActiveReactivePowerEmptyFormDataProperties,
    getInjectionActiveReactivePowerValidationSchemaProperties,
} from '../../../../common/measurements/injectionActiveReactivePowerForm.utils';
import { ConverterStationCreationDto } from '../../creation/vscHvdcLineCreation.types';
import { ReactiveCapabilityCurvePoints } from '../../../../common';
import { ConverterStationInfos } from '../vscHvdcLine.types';

export type UpdateReactiveCapabilityCurveTableConverterStation = (
    action: string,
    index: number,
    converterStationName: 'converterStation1' | 'converterStation2'
) => void;

export const getVscConverterStationCreationSchema = () =>
    object().shape({
        [FieldConstants.CONVERTER_STATION_ID]: string().nullable().required(),
        [FieldConstants.CONVERTER_STATION_NAME]: string().nullable(),
        [FieldConstants.LOSS_FACTOR]: number()
            .nullable()
            .required()
            .min(0, NORMALIZED_PERCENTAGE)
            .max(100, NORMALIZED_PERCENTAGE),
        [FieldConstants.VOLTAGE_REGULATION_ON]: boolean(),
        [FieldConstants.REACTIVE_POWER]: number()
            .nullable()
            .default(null)
            .when([FieldConstants.VOLTAGE_REGULATION_ON], {
                is: false,
                then: (schema) => schema.required(),
            }),
        [FieldConstants.VOLTAGE]: number()
            .nullable()
            .default(null)
            .min(0, MUST_BE_GREATER_OR_EQUAL_TO_ZERO)
            .when([FieldConstants.VOLTAGE_REGULATION_ON], {
                is: true,
                then: (schema) => schema.required(),
            }),
        [FieldConstants.CONNECTIVITY]: getConnectivityWithPositionSchema(),
        [FieldConstants.REACTIVE_LIMITS]: getReactiveLimitsValidationSchema(false, true),
    });

export type VscConverterStationCreationFormData = InferType<ReturnType<typeof getVscConverterStationCreationSchema>>;

export const getVscConverterStationModificationSchema = () =>
    object().shape({
        [FieldConstants.CONVERTER_STATION_ID]: string(),
        [FieldConstants.CONVERTER_STATION_NAME]: string().nullable(),
        [FieldConstants.LOSS_FACTOR]: number().nullable().min(0, NORMALIZED_PERCENTAGE).max(100, NORMALIZED_PERCENTAGE),
        [FieldConstants.VOLTAGE_REGULATION_ON]: boolean().nullable(),
        [FieldConstants.REACTIVE_POWER]: number().nullable(),
        [FieldConstants.VOLTAGE]: number().nullable().min(0, MUST_BE_GREATER_OR_EQUAL_TO_ZERO),
        [FieldConstants.CONNECTIVITY]: getConnectivityWithPositionSchema(true),
        [FieldConstants.STATE_ESTIMATION]: getInjectionActiveReactivePowerValidationSchemaProperties(),
        [FieldConstants.REACTIVE_LIMITS]: getReactiveLimitsValidationSchema(true),
    });

export type VscConverterStationModificationFormData = InferType<
    ReturnType<typeof getVscConverterStationModificationSchema>
>;

export function getVscConverterStationEmptyFormData(isModification = false) {
    return {
        [FieldConstants.CONVERTER_STATION_ID]: isModification ? '' : null,
        [FieldConstants.CONVERTER_STATION_NAME]: isModification ? '' : null,
        [FieldConstants.LOSS_FACTOR]: null,
        [FieldConstants.REACTIVE_POWER]: null,
        [FieldConstants.VOLTAGE_REGULATION_ON]: isModification ? null : false,
        [FieldConstants.VOLTAGE]: null,
        [FieldConstants.CONNECTIVITY]: getConnectivityWithPositionEmptyFormDataProps(isModification),
        [FieldConstants.REACTIVE_LIMITS]: getReactiveLimitsEmptyFormDataProps(),
        [FieldConstants.STATE_ESTIMATION]: isModification
            ? getInjectionActiveReactivePowerEmptyFormDataProperties()
            : null,
    };
}

export function converterStationCreationFormToDto(
    formData: VscConverterStationCreationFormData
): ConverterStationCreationDto {
    const reactiveLimits = formData[FieldConstants.REACTIVE_LIMITS];
    const isReactiveCapabilityCurveOn = reactiveLimits[FieldConstants.REACTIVE_CAPABILITY_CURVE_CHOICE] === 'CURVE';
    return {
        equipmentId: formData[FieldConstants.CONVERTER_STATION_ID],
        equipmentName: formData[FieldConstants.CONVERTER_STATION_NAME] ?? null,
        lossFactor: formData[FieldConstants.LOSS_FACTOR],
        reactivePowerSetpoint: formData[FieldConstants.REACTIVE_POWER],
        voltageRegulationOn: formData[FieldConstants.VOLTAGE_REGULATION_ON],
        voltageSetpoint: formData[FieldConstants.VOLTAGE],
        voltageLevelId:
            formData[FieldConstants.CONNECTIVITY]?.[FieldConstants.VOLTAGE_LEVEL]?.[FieldConstants.ID] ?? '',
        busOrBusbarSectionId:
            formData[FieldConstants.CONNECTIVITY]?.[FieldConstants.BUS_OR_BUSBAR_SECTION]?.[FieldConstants.ID] ?? '',
        connectionName: sanitizeString(formData[FieldConstants.CONNECTIVITY]?.[FieldConstants.CONNECTION_NAME]),
        connectionDirection:
            formData[FieldConstants.CONNECTIVITY]?.[FieldConstants.CONNECTION_DIRECTION] ??
            UNDEFINED_CONNECTION_DIRECTION,
        connectionPosition: formData[FieldConstants.CONNECTIVITY]?.[FieldConstants.CONNECTION_POSITION],
        terminalConnected: formData[FieldConstants.CONNECTIVITY]?.[FieldConstants.CONNECTED],
        reactiveCapabilityCurve: isReactiveCapabilityCurveOn,
        minQ: isReactiveCapabilityCurveOn ? null : (reactiveLimits[FieldConstants.MINIMUM_REACTIVE_POWER] ?? null),
        maxQ: isReactiveCapabilityCurveOn ? null : (reactiveLimits[FieldConstants.MAXIMUM_REACTIVE_POWER] ?? null),
        reactiveCapabilityCurvePoints: isReactiveCapabilityCurveOn
            ? (reactiveLimits[FieldConstants.REACTIVE_CAPABILITY_CURVE_TABLE] ?? [])
            : [],
    };
}

function getConverterStationReactiveLimits(converterStation: ConverterStationCreationDto) {
    return converterStation.reactiveCapabilityCurve
        ? getReactiveLimitsFormDataProps({
              reactiveCapabilityCurveChoice: 'CURVE',
              minimumReactivePower: null,
              maximumReactivePower: null,
              reactiveCapabilityCurvePoints: converterStation.reactiveCapabilityCurvePoints,
          })
        : getReactiveLimitsFormDataProps({
              reactiveCapabilityCurveChoice: 'MINMAX',
              minimumReactivePower: converterStation.minQ,
              maximumReactivePower: converterStation.maxQ,
              reactiveCapabilityCurvePoints: converterStation?.reactiveCapabilityCurvePoints ?? null,
          });
}

export function converterStationCreationDtoToForm(
    dto: ConverterStationCreationDto
): VscConverterStationCreationFormData {
    return {
        [FieldConstants.CONVERTER_STATION_ID]: dto?.equipmentId,
        [FieldConstants.CONVERTER_STATION_NAME]: dto?.equipmentName ?? '',
        [FieldConstants.LOSS_FACTOR]: dto?.lossFactor ?? 0,
        [FieldConstants.REACTIVE_POWER]: dto?.reactivePowerSetpoint,
        [FieldConstants.VOLTAGE_REGULATION_ON]: dto?.voltageRegulationOn,
        [FieldConstants.VOLTAGE]: dto?.voltageSetpoint,
        [FieldConstants.CONNECTIVITY]: getConnectivityFormDataProps({
            voltageLevelId: dto.voltageLevelId,
            busbarSectionId: dto.busOrBusbarSectionId,
            connectionDirection: dto.connectionDirection,
            connectionName: dto.connectionName,
            connectionPosition: dto.connectionPosition,
            terminalConnected: dto.terminalConnected,
        }),
        [FieldConstants.REACTIVE_LIMITS]: getConverterStationReactiveLimits(dto),
    };
}

export function converterStationCreationFromCopy(
    converterStation?: ConverterStationInfos
): VscConverterStationCreationFormData {
    return {
        [FieldConstants.CONVERTER_STATION_ID]: `${converterStation?.id}(1)`,
        [FieldConstants.CONVERTER_STATION_NAME]: converterStation?.name ?? '',
        [FieldConstants.LOSS_FACTOR]: converterStation?.lossFactor ?? 0,
        [FieldConstants.REACTIVE_POWER]: converterStation?.reactivePowerSetpoint ?? null,
        [FieldConstants.VOLTAGE_REGULATION_ON]: converterStation?.voltageRegulatorOn,
        [FieldConstants.VOLTAGE]: converterStation?.voltageSetpoint ?? null,
        [FieldConstants.CONNECTIVITY]: getConnectivityFormDataProps({
            voltageLevelId: converterStation?.voltageLevelId,
            busbarSectionId: converterStation?.busOrBusbarSectionId,
            connectionDirection: converterStation?.connectablePosition?.connectionDirection,
            connectionName: converterStation?.connectablePosition?.connectionName,
            connectionPosition: null,
            terminalConnected: true,
        }),
        [FieldConstants.REACTIVE_LIMITS]: getReactiveLimitsFormDataProps({
            reactiveCapabilityCurveChoice: converterStation?.minMaxReactiveLimits ? 'MINMAX' : 'CURVE',
            minimumReactivePower: converterStation?.minMaxReactiveLimits?.minQ,
            maximumReactivePower: converterStation?.minMaxReactiveLimits?.maxQ,
            reactiveCapabilityCurvePoints: converterStation?.reactiveCapabilityCurvePoints ?? null,
        }),
    };
}

// cf ConverterStationModificationInfos server class
export interface VscConverterStationModificationDto {
    equipmentId: string;
    equipmentName: AttributeModification<string> | null;
    voltageLevelId: AttributeModification<string> | null;
    busOrBusbarSectionId: AttributeModification<string> | null;
    connectionDirection: AttributeModification<string> | null;
    connectionName?: AttributeModification<string> | null;
    connectionPosition?: AttributeModification<number> | null;
    terminalConnected?: AttributeModification<boolean> | null;
    pMeasurementValue: AttributeModification<number> | null;
    pMeasurementValidity: AttributeModification<boolean> | null;
    qMeasurementValue: AttributeModification<number> | null;
    qMeasurementValidity: AttributeModification<boolean> | null;
    lossFactor: AttributeModification<number> | null;
    reactivePowerSetpoint: AttributeModification<number> | null;
    voltageRegulationOn: AttributeModification<boolean> | null;
    voltageSetpoint: AttributeModification<number> | null;
    reactiveCapabilityCurve: AttributeModification<boolean> | null;
    minQ: AttributeModification<number> | null;
    maxQ: AttributeModification<number> | null;
    reactiveCapabilityCurvePoints: ReactiveCapabilityCurvePoints[];
}

export function converterStationModificationFormToDto(
    formData: VscConverterStationModificationFormData
): VscConverterStationModificationDto {
    const reactiveLimits = formData[FieldConstants.REACTIVE_LIMITS];
    const connectivity = formData[FieldConstants.CONNECTIVITY];
    const estim = formData[FieldConstants.STATE_ESTIMATION];
    const isReactiveCapabilityCurveOn = reactiveLimits[FieldConstants.REACTIVE_CAPABILITY_CURVE_CHOICE] === 'CURVE';

    return {
        equipmentId: formData[FieldConstants.CONVERTER_STATION_ID] ?? '',
        equipmentName: toModificationOperation(formData[FieldConstants.CONVERTER_STATION_NAME]),
        voltageLevelId: toModificationOperation(connectivity?.[FieldConstants.VOLTAGE_LEVEL]?.[FieldConstants.ID]),
        busOrBusbarSectionId: toModificationOperation(
            connectivity?.[FieldConstants.BUS_OR_BUSBAR_SECTION]?.[FieldConstants.ID]
        ),
        connectionDirection: toModificationOperation(connectivity?.[FieldConstants.CONNECTION_DIRECTION]),
        pMeasurementValue: toModificationOperation(estim?.[FieldConstants.MEASUREMENT_P]?.value),
        pMeasurementValidity: toModificationOperation(estim?.[FieldConstants.MEASUREMENT_P]?.validity),
        qMeasurementValue: toModificationOperation(estim?.[FieldConstants.MEASUREMENT_Q]?.value),
        qMeasurementValidity: toModificationOperation(estim?.[FieldConstants.MEASUREMENT_Q]?.validity),
        lossFactor: toModificationOperation(formData[FieldConstants.LOSS_FACTOR]),
        reactivePowerSetpoint: toModificationOperation(formData[FieldConstants.REACTIVE_POWER]),
        voltageRegulationOn: toModificationOperation(formData[FieldConstants.VOLTAGE_REGULATION_ON]),
        voltageSetpoint: toModificationOperation(formData[FieldConstants.VOLTAGE]),
        reactiveCapabilityCurve: toModificationOperation(isReactiveCapabilityCurveOn),
        minQ: toModificationOperation(
            isReactiveCapabilityCurveOn ? null : reactiveLimits[FieldConstants.MINIMUM_REACTIVE_POWER]
        ),
        maxQ: toModificationOperation(
            isReactiveCapabilityCurveOn ? null : reactiveLimits[FieldConstants.MAXIMUM_REACTIVE_POWER]
        ),
        reactiveCapabilityCurvePoints: isReactiveCapabilityCurveOn
            ? (reactiveLimits[FieldConstants.REACTIVE_CAPABILITY_CURVE_TABLE] ?? [])
            : [],
    };
}

export function converterStationModificationDtoToForm(
    dto: VscConverterStationModificationDto
): VscConverterStationModificationFormData {
    return {
        [FieldConstants.CONVERTER_STATION_ID]: dto?.equipmentId,
        [FieldConstants.CONVERTER_STATION_NAME]: dto?.equipmentName?.value ?? '',
        [FieldConstants.LOSS_FACTOR]: dto?.lossFactor?.value ?? null,
        [FieldConstants.REACTIVE_POWER]: dto?.reactivePowerSetpoint?.value ?? null,
        [FieldConstants.VOLTAGE_REGULATION_ON]: dto?.voltageRegulationOn?.value ?? null,
        [FieldConstants.VOLTAGE]: dto?.voltageSetpoint?.value ?? null,
        [FieldConstants.CONNECTIVITY]: getConnectivityFormDataProps({
            voltageLevelId: dto?.voltageLevelId?.value ?? null,
            busbarSectionId: dto?.busOrBusbarSectionId?.value ?? null,
            connectionName: dto?.connectionName?.value ?? null,
            connectionDirection: dto?.connectionDirection?.value ?? null,
            connectionPosition: dto?.connectionPosition?.value ?? null,
            terminalConnected: dto?.terminalConnected?.value ?? null,
            isEquipmentModification: true,
        }),
        [FieldConstants.REACTIVE_LIMITS]: getReactiveLimitsFormDataProps({
            reactiveCapabilityCurveChoice: dto?.reactiveCapabilityCurve?.value ? 'CURVE' : 'MINMAX',
            maximumReactivePower: dto?.maxQ?.value ?? null,
            minimumReactivePower: dto?.minQ?.value ?? null,
            reactiveCapabilityCurvePoints: dto?.reactiveCapabilityCurvePoints ?? null,
        }),
        [FieldConstants.STATE_ESTIMATION]: getInjectionActiveReactivePowerEditDataProperties(dto),
    };
}
