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
    DeepNullable,
    FieldConstants,
    MAX_P_MUST_BE_GREATER_OR_EQUAL_TO_ZERO,
    MODIFICATION_TYPES,
    NOMINAL_V_MUST_BE_GREATER_OR_EQUAL_TO_ZERO,
    NORMALIZED_PERCENTAGE,
    POWER_FACTOR_INTERVAL_VALUE_ERROR,
    Q_MAX_AT_NOMINAL_V_MUST_BE_GREATER_THAN_ZERO,
    sanitizeString,
    toModificationOperation,
} from '../../../../../utils';
import {
    getLccHvdcLineEmptyFormData,
    ShuntCompensatorModificationFormSchema,
    getEmptyShuntCompensatorOnSideFormData,
    ShuntCompensatorFormSchema,
} from '../common';
import {
    LccConverterStationModificationDto,
    LccModificationDto,
    LccShuntCompensatorModificationInfos,
} from './lccHvdcLineModification.types';
import { getPropertiesFromModification, modificationPropertiesSchema, toModificationProperties } from '../../../common';

const getLccConverterStationModificationSchema = () =>
    yup.object().shape({
        [FieldConstants.CONVERTER_STATION_ID]: yup.string().nullable().required(),
        [FieldConstants.CONVERTER_STATION_NAME]: yup.string().nullable(),
        [FieldConstants.LOSS_FACTOR]: yup
            .number()
            .nullable()
            .min(0, NORMALIZED_PERCENTAGE)
            .max(100, NORMALIZED_PERCENTAGE),
        [FieldConstants.POWER_FACTOR]: yup
            .number()
            .nullable()
            .min(0, POWER_FACTOR_INTERVAL_VALUE_ERROR)
            .max(1, POWER_FACTOR_INTERVAL_VALUE_ERROR),
        [FieldConstants.FILTERS_SHUNT_COMPENSATOR_TABLE]: yup
            .array()
            .of(
                yup.object().shape({
                    [FieldConstants.SHUNT_COMPENSATOR_ID]: yup.string().required(),
                    [FieldConstants.SHUNT_COMPENSATOR_NAME]: yup.string().nullable(),
                    [FieldConstants.MAX_Q_AT_NOMINAL_V]: yup
                        .number()
                        .nullable()
                        .min(0, Q_MAX_AT_NOMINAL_V_MUST_BE_GREATER_THAN_ZERO)
                        .required(),
                    [FieldConstants.SHUNT_COMPENSATOR_SELECTED]: yup.boolean().nullable(),
                    [FieldConstants.DELETION_MARK]: yup.boolean().nullable(),
                })
            )
            .nullable(),
    });

type LccConverterStationModificationFormData = InferType<ReturnType<typeof getLccConverterStationModificationSchema>>;

export const getLccHvdcLineModificationSchema = () =>
    yup
        .object()
        .shape({
            [FieldConstants.NOMINAL_V]: yup.number().nullable().min(0, NOMINAL_V_MUST_BE_GREATER_OR_EQUAL_TO_ZERO),
            [FieldConstants.R]: yup.number().nullable().min(0, DC_RESISTANCE_MUST_BE_GREATER_OR_EQUAL_TO_ZERO),
            [FieldConstants.MAX_P]: yup.number().nullable().min(0, MAX_P_MUST_BE_GREATER_OR_EQUAL_TO_ZERO),
            [FieldConstants.ACTIVE_POWER_SET_POINT]: yup
                .number()
                .nullable()
                .min(0, ACTIVE_POWER_SETPOINT_MIN_VALUE_ERROR)
                .max(yup.ref(FieldConstants.MAX_P), ACTIVE_POWER_SETPOINT_MAX_VALUE_ERROR),
            [FieldConstants.CONVERTERS_MODE]: yup.string().nullable(),
        })
        .concat(modificationPropertiesSchema);

export const lccHvdcLineModificationFormSchema = yup
    .object()
    .shape({
        [FieldConstants.EQUIPMENT_ID]: yup.string().required(),
        [FieldConstants.EQUIPMENT_NAME]: yup.string().nullable(),
        [FieldConstants.HVDC_LINE_TAB]: getLccHvdcLineModificationSchema(),
        [FieldConstants.CONVERTER_STATION_1]: getLccConverterStationModificationSchema(),
        [FieldConstants.CONVERTER_STATION_2]: getLccConverterStationModificationSchema(),
    })
    .required();

export type LccHvdcLineModificationFormData = InferType<typeof lccHvdcLineModificationFormSchema>;

export const getEmptyShuntCompensatorOnSideModificationFormData = () => ({
    ...getEmptyShuntCompensatorOnSideFormData(),
    [FieldConstants.DELETION_MARK]: false,
});

export const getEmptyFiltersShuntCompensatorModificationTableFormData = (count = 0) =>
    Array.from({ length: count }, () => getEmptyShuntCompensatorOnSideModificationFormData());

function getLccConverterStationModificationEmptyFormData() {
    return {
        [FieldConstants.CONVERTER_STATION_ID]: null,
        [FieldConstants.CONVERTER_STATION_NAME]: null,
        [FieldConstants.LOSS_FACTOR]: null,
        [FieldConstants.POWER_FACTOR]: null,
        [FieldConstants.FILTERS_SHUNT_COMPENSATOR_TABLE]: getEmptyFiltersShuntCompensatorModificationTableFormData(),
    };
}

export const lccHvdcLineModificationEmptyFormData: DeepNullable<LccHvdcLineModificationFormData> = {
    [FieldConstants.EQUIPMENT_ID]: '',
    [FieldConstants.EQUIPMENT_NAME]: '',
    [FieldConstants.HVDC_LINE_TAB]: getLccHvdcLineEmptyFormData(),
    [FieldConstants.CONVERTER_STATION_1]: getLccConverterStationModificationEmptyFormData(),
    [FieldConstants.CONVERTER_STATION_2]: getLccConverterStationModificationEmptyFormData(),
};

export function getLccHvdcLineModificationDtoToForm(hvdcLine: LccModificationDto, includePreviousValues = true) {
    return {
        [FieldConstants.NOMINAL_V]: hvdcLine.nominalV?.value ?? null,
        [FieldConstants.R]: hvdcLine.r?.value ?? null,
        [FieldConstants.MAX_P]: hvdcLine.maxP?.value ?? null,
        [FieldConstants.CONVERTERS_MODE]: hvdcLine.convertersMode?.value ?? null,
        [FieldConstants.ACTIVE_POWER_SET_POINT]: hvdcLine.activePowerSetpoint?.value ?? null,
        ...getPropertiesFromModification(hvdcLine.properties, includePreviousValues),
    };
}

const getShuntCompensatorOnSideFormModificationData = (
    infos?: LccShuntCompensatorModificationInfos[]
): ShuntCompensatorFormSchema[] => {
    return (
        infos?.map((shuntCp) => ({
            [FieldConstants.SHUNT_COMPENSATOR_ID]: shuntCp.id ?? null,
            [FieldConstants.SHUNT_COMPENSATOR_NAME]: shuntCp.name ?? '',
            [FieldConstants.MAX_Q_AT_NOMINAL_V]: shuntCp.maxQAtNominalV ?? null,
            [FieldConstants.SHUNT_COMPENSATOR_SELECTED]: shuntCp.connectedToHvdc ?? null,
            [FieldConstants.DELETION_MARK]: shuntCp.deletionMark ?? false,
        })) ?? []
    );
};

export function getLccConverterStationModificationDtoToForm(
    lccConverterStationInfos: LccConverterStationModificationDto
) {
    return {
        [FieldConstants.CONVERTER_STATION_ID]: lccConverterStationInfos.equipmentId,
        [FieldConstants.CONVERTER_STATION_NAME]: lccConverterStationInfos?.equipmentName?.value ?? '',
        [FieldConstants.LOSS_FACTOR]: lccConverterStationInfos.lossFactor?.value ?? undefined,
        [FieldConstants.POWER_FACTOR]: lccConverterStationInfos.powerFactor?.value ?? undefined,
        [FieldConstants.FILTERS_SHUNT_COMPENSATOR_TABLE]: getShuntCompensatorOnSideFormModificationData(
            lccConverterStationInfos?.shuntCompensatorsOnSide
        ),
    };
}

export const lccHvdcLineModificationDtoToForm = (
    lccModificationInfos: LccModificationDto,
    includePreviousValues = true
): LccHvdcLineModificationFormData => {
    return {
        [FieldConstants.EQUIPMENT_ID]: lccModificationInfos.equipmentId,
        [FieldConstants.EQUIPMENT_NAME]: lccModificationInfos.equipmentName?.value ?? '',
        [FieldConstants.HVDC_LINE_TAB]: getLccHvdcLineModificationDtoToForm(
            lccModificationInfos,
            includePreviousValues
        ),
        [FieldConstants.CONVERTER_STATION_1]: getLccConverterStationModificationDtoToForm(
            lccModificationInfos.converterStation1
        ),
        [FieldConstants.CONVERTER_STATION_2]: getLccConverterStationModificationDtoToForm(
            lccModificationInfos.converterStation2
        ),
    };
};

const getShuntCompensatorOnSideModificationData = (
    shuntCompensatorInfos?: ShuntCompensatorModificationFormSchema[] | null
): LccShuntCompensatorModificationInfos[] => {
    return (
        shuntCompensatorInfos?.map((shuntCp) => ({
            id: shuntCp.shuntCompensatorId,
            name: shuntCp.shuntCompensatorName,
            maxQAtNominalV: shuntCp.maxQAtNominalV,
            connectedToHvdc: shuntCp.connectedToHvdc,
            deletionMark: shuntCp.deletionMark ?? false,
            type: 'LCC_SHUNT_MODIFICATION',
        })) ?? []
    );
};

function lccConverterStationModificationFormToDto(
    converterStation: LccConverterStationModificationFormData
): LccConverterStationModificationDto {
    return {
        type: MODIFICATION_TYPES.LCC_CONVERTER_STATION_MODIFICATION.type,
        equipmentId: converterStation.converterStationId,
        equipmentName: toModificationOperation(converterStation.converterStationName),
        lossFactor: toModificationOperation(converterStation.lossFactor),
        powerFactor: toModificationOperation(converterStation.powerFactor),
        shuntCompensatorsOnSide: getShuntCompensatorOnSideModificationData(converterStation.shuntCompensatorInfos),
    };
}

export const lccHvdcLineModificationFormToDto = (lccHvdcLine: LccHvdcLineModificationFormData): LccModificationDto => {
    const hvdcLineTab = lccHvdcLine[FieldConstants.HVDC_LINE_TAB];
    return {
        type: MODIFICATION_TYPES.LCC_MODIFICATION.type,
        equipmentId: lccHvdcLine.equipmentID,
        equipmentName: toModificationOperation(sanitizeString(lccHvdcLine.equipmentName)),
        nominalV: toModificationOperation(hvdcLineTab.nominalV),
        r: toModificationOperation(hvdcLineTab.r),
        maxP: toModificationOperation(hvdcLineTab.maxP),
        convertersMode: toModificationOperation(hvdcLineTab.convertersMode),
        activePowerSetpoint: toModificationOperation(hvdcLineTab.activePowerSetpoint),
        converterStation1: lccConverterStationModificationFormToDto(lccHvdcLine.converterStation1),
        converterStation2: lccConverterStationModificationFormToDto(lccHvdcLine.converterStation2),
        properties: toModificationProperties(hvdcLineTab),
    };
};
