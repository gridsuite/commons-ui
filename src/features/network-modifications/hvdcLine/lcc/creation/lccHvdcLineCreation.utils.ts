/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as yup from 'yup';
import { InferType } from 'yup';
import {
    ACTIVE_POWER_SETPOINT_MAX_VALUE_ERROR,
    ACTIVE_POWER_SETPOINT_MIN_VALUE_ERROR,
    DC_RESISTANCE_MUST_BE_GREATER_OR_EQUAL_TO_ZERO,
    FieldConstants,
    MAX_P_MUST_BE_GREATER_OR_EQUAL_TO_ZERO,
    MODIFICATION_TYPES,
    NOMINAL_V_MUST_BE_GREATER_OR_EQUAL_TO_ZERO,
    NORMALIZED_PERCENTAGE,
    Q_MAX_AT_NOMINAL_V_MUST_BE_GREATER_THAN_ZERO,
    sanitizeString,
    UNDEFINED_CONNECTION_DIRECTION,
} from '../../../../../utils';
import {
    creationPropertiesSchema,
    getConnectivityFormDataProps,
    getConnectivityWithPositionEmptyFormData,
    getConnectivityWithPositionSchema,
    getFilledPropertiesFromModification,
    toModificationProperties,
} from '../../../common';
import {
    LccConverterStationCreationDto,
    LccHvdcLineCreationDto,
    LccShuntCompensatorCreationDto,
} from './lccHvdcLineCreation.types';
import {
    getEmptyShuntCompensatorOnSideFormData,
    getLccHvdcLineEmptyFormData,
    ShuntCompensatorFormSchema,
} from '../common';

const getLccConverterStationSchema = () =>
    yup.object().shape({
        [FieldConstants.CONVERTER_STATION_ID]: yup.string().nullable().required(),
        [FieldConstants.CONVERTER_STATION_NAME]: yup.string().nullable(),
        [FieldConstants.LOSS_FACTOR]: yup
            .number()
            .nullable()
            .min(0, NORMALIZED_PERCENTAGE)
            .max(100, NORMALIZED_PERCENTAGE)
            .required(),
        [FieldConstants.POWER_FACTOR]: yup
            .number()
            .nullable()
            .min(-1, 'powerFactorMinValueError')
            .max(1, 'powerFactorMaxValueError')
            .required(),
        [FieldConstants.FILTERS_SHUNT_COMPENSATOR_TABLE]: yup
            .array()
            .of(
                yup.object().shape({
                    [FieldConstants.SHUNT_COMPENSATOR_ID]: yup.string().nullable().required(),
                    [FieldConstants.SHUNT_COMPENSATOR_NAME]: yup.string().nullable(),
                    [FieldConstants.MAX_Q_AT_NOMINAL_V]: yup
                        .number()
                        .nullable()
                        .min(0, Q_MAX_AT_NOMINAL_V_MUST_BE_GREATER_THAN_ZERO)
                        .required(),
                    [FieldConstants.SHUNT_COMPENSATOR_SELECTED]: yup.boolean().nullable(),
                })
            )
            .nullable(),
        [FieldConstants.CONNECTIVITY]: getConnectivityWithPositionSchema(false),
    });

export type LccConverterStationFormData = InferType<ReturnType<typeof getLccConverterStationSchema>>;

const getLccHvdcLineTabSchema = () =>
    yup
        .object()
        .shape({
            [FieldConstants.NOMINAL_V]: yup
                .number()
                .nullable()
                .min(0, NOMINAL_V_MUST_BE_GREATER_OR_EQUAL_TO_ZERO)
                .required(),
            [FieldConstants.R]: yup
                .number()
                .nullable()
                .min(0, DC_RESISTANCE_MUST_BE_GREATER_OR_EQUAL_TO_ZERO)
                .required(),
            [FieldConstants.MAX_P]: yup.number().nullable().min(0, MAX_P_MUST_BE_GREATER_OR_EQUAL_TO_ZERO).required(),
            [FieldConstants.ACTIVE_POWER_SET_POINT]: yup
                .number()
                .nullable()
                .min(0, ACTIVE_POWER_SETPOINT_MIN_VALUE_ERROR)
                .max(yup.ref(FieldConstants.MAX_P), ACTIVE_POWER_SETPOINT_MAX_VALUE_ERROR)
                .required(),
            [FieldConstants.CONVERTERS_MODE]: yup.string().required(),
        })
        .concat(creationPropertiesSchema);

export type LccHvdcLineTabCreationFormData = InferType<ReturnType<typeof getLccHvdcLineTabSchema>>;

export const lccHvdcLineCreationFormSchema = yup
    .object()
    .shape({
        [FieldConstants.EQUIPMENT_ID]: yup.string().required(),
        [FieldConstants.EQUIPMENT_NAME]: yup.string().nullable(),
        [FieldConstants.HVDC_LINE_TAB]: getLccHvdcLineTabSchema(),
        [FieldConstants.CONVERTER_STATION_1]: getLccConverterStationSchema(),
        [FieldConstants.CONVERTER_STATION_2]: getLccConverterStationSchema(),
    })
    .required();

export type LccHvdcLineCreationFormData = InferType<typeof lccHvdcLineCreationFormSchema>;

const getEmptyFiltersShuntCompensatorTableFormData = (count = 0) =>
    Array.from({ length: count }, () => getEmptyShuntCompensatorOnSideFormData());

function getLccConverterStationEmptyFormData() {
    return {
        [FieldConstants.CONVERTER_STATION_ID]: null,
        [FieldConstants.CONVERTER_STATION_NAME]: null,
        [FieldConstants.LOSS_FACTOR]: null,
        [FieldConstants.POWER_FACTOR]: null,
        [FieldConstants.FILTERS_SHUNT_COMPENSATOR_TABLE]: getEmptyFiltersShuntCompensatorTableFormData(),
        ...getConnectivityWithPositionEmptyFormData(),
    };
}

export const lccHvdcLineCreationEmptyFormData = {
    [FieldConstants.EQUIPMENT_ID]: '',
    [FieldConstants.EQUIPMENT_NAME]: '',
    [FieldConstants.HVDC_LINE_TAB]: getLccHvdcLineEmptyFormData(),
    [FieldConstants.CONVERTER_STATION_1]: getLccConverterStationEmptyFormData(),
    [FieldConstants.CONVERTER_STATION_2]: getLccConverterStationEmptyFormData(),
};

const getShuntCompensatorOnSideFormData = (
    shuntCompensatorCreationDtos?: LccShuntCompensatorCreationDto[]
): ShuntCompensatorFormSchema[] => {
    return (
        shuntCompensatorCreationDtos?.map((shuntCp) => ({
            [FieldConstants.SHUNT_COMPENSATOR_ID]: shuntCp.id ?? null,
            [FieldConstants.SHUNT_COMPENSATOR_NAME]: shuntCp.name ?? '',
            [FieldConstants.MAX_Q_AT_NOMINAL_V]: shuntCp.maxQAtNominalV ?? 0,
            [FieldConstants.SHUNT_COMPENSATOR_SELECTED]: shuntCp.connectedToHvdc ?? true,
        })) ?? []
    );
};

function getLccConverterStationCreationDtoToForm(
    lccConverterStationCreationInfos: LccConverterStationCreationDto
): LccConverterStationFormData {
    return {
        [FieldConstants.CONVERTER_STATION_ID]: lccConverterStationCreationInfos.equipmentId,
        [FieldConstants.CONVERTER_STATION_NAME]: lccConverterStationCreationInfos?.equipmentName ?? '',
        [FieldConstants.LOSS_FACTOR]: lccConverterStationCreationInfos.lossFactor ?? 0,
        [FieldConstants.POWER_FACTOR]: lccConverterStationCreationInfos.powerFactor ?? 0,
        [FieldConstants.FILTERS_SHUNT_COMPENSATOR_TABLE]: getShuntCompensatorOnSideFormData(
            lccConverterStationCreationInfos?.shuntCompensatorsOnSide
        ),
        [FieldConstants.CONNECTIVITY]: getConnectivityFormDataProps({
            voltageLevelId: lccConverterStationCreationInfos?.voltageLevelId,
            busbarSectionId: lccConverterStationCreationInfos?.busOrBusbarSectionId,
            connectionDirection: lccConverterStationCreationInfos?.connectionDirection,
            connectionName: lccConverterStationCreationInfos?.connectionName,
            terminalConnected: lccConverterStationCreationInfos?.terminalConnected,
            connectionPosition: lccConverterStationCreationInfos?.connectionPosition,
        }),
    };
}

function getLccHvdcLineTabCreationDtoToForm(lccCreationDto: LccHvdcLineCreationDto): LccHvdcLineTabCreationFormData {
    return {
        [FieldConstants.NOMINAL_V]: lccCreationDto.nominalV ?? 0,
        [FieldConstants.R]: lccCreationDto.r ?? 0,
        [FieldConstants.MAX_P]: lccCreationDto.maxP ?? 0,
        [FieldConstants.CONVERTERS_MODE]: lccCreationDto.convertersMode,
        [FieldConstants.ACTIVE_POWER_SET_POINT]: lccCreationDto.activePowerSetpoint ?? 0,
        [FieldConstants.ADDITIONAL_PROPERTIES]: getFilledPropertiesFromModification(lccCreationDto.properties),
    };
}

export const lccHvdcLineCreationDtoToForm = (lccCreationDto: LccHvdcLineCreationDto): LccHvdcLineCreationFormData => {
    return {
        [FieldConstants.EQUIPMENT_ID]: lccCreationDto.equipmentId,
        [FieldConstants.EQUIPMENT_NAME]: lccCreationDto.equipmentName ?? '',
        [FieldConstants.HVDC_LINE_TAB]: getLccHvdcLineTabCreationDtoToForm(lccCreationDto),
        [FieldConstants.CONVERTER_STATION_1]: getLccConverterStationCreationDtoToForm(lccCreationDto.converterStation1),
        [FieldConstants.CONVERTER_STATION_2]: getLccConverterStationCreationDtoToForm(lccCreationDto.converterStation2),
    };
};

const getShuntCompensatorOnSideCreateData = (
    shuntCompensatorInfos?: ShuntCompensatorFormSchema[]
): LccShuntCompensatorCreationDto[] => {
    return (
        shuntCompensatorInfos?.map((shuntCp) => ({
            id: shuntCp.shuntCompensatorId,
            name: shuntCp.shuntCompensatorName,
            maxQAtNominalV: shuntCp.maxQAtNominalV,
            connectedToHvdc: shuntCp.connectedToHvdc,
            type: 'LCC_SHUNT_CREATION',
        })) ?? []
    );
};

function getLccConverterStationCreationData(
    converterStation: LccConverterStationFormData
): LccConverterStationCreationDto {
    return {
        type: MODIFICATION_TYPES.LCC_CONVERTER_STATION_CREATION.type,
        equipmentId: converterStation.converterStationId,
        equipmentName: converterStation.converterStationName ?? null,
        lossFactor: converterStation.lossFactor,
        powerFactor: converterStation.powerFactor,
        voltageLevelId: converterStation.connectivity.voltageLevel?.id ?? '',
        busOrBusbarSectionId: converterStation.connectivity.busOrBusbarSection?.id ?? '',
        connectionName: sanitizeString(converterStation.connectivity.connectionName),
        connectionDirection: converterStation.connectivity.connectionDirection ?? UNDEFINED_CONNECTION_DIRECTION,
        connectionPosition: converterStation.connectivity.connectionPosition ?? null,
        terminalConnected: converterStation.connectivity.terminalConnected ?? false,
        shuntCompensatorsOnSide: getShuntCompensatorOnSideCreateData(converterStation.shuntCompensatorInfos ?? []),
    };
}

export const lccHvdcLineCreationFormToDto = (lccHvdcLine: LccHvdcLineCreationFormData): LccHvdcLineCreationDto => {
    const { hvdcLineTab } = lccHvdcLine;
    const lccConverterStation1 = getLccConverterStationCreationData(lccHvdcLine.converterStation1);
    const lccConverterStation2 = getLccConverterStationCreationData(lccHvdcLine.converterStation2);
    return {
        type: MODIFICATION_TYPES.LCC_CREATION.type,
        equipmentId: lccHvdcLine.equipmentID,
        equipmentName: sanitizeString(lccHvdcLine.equipmentName),
        nominalV: hvdcLineTab.nominalV,
        r: hvdcLineTab.r,
        maxP: hvdcLineTab.maxP,
        convertersMode: hvdcLineTab.convertersMode,
        activePowerSetpoint: hvdcLineTab.activePowerSetpoint,
        converterStation1: lccConverterStation1,
        converterStation2: lccConverterStation2,
        properties: toModificationProperties(hvdcLineTab),
    };
};
