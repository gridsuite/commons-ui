/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { InferType, object, boolean, number, string } from 'yup';
import { FieldConstants, MUST_BE_GREATER_OR_EQUAL_TO_ZERO } from '../../../../../../utils';
import { VscHvdcLineInfo } from '../vscHvdcLine.types';
import { VscHdvLineCreationDto } from '../../creation/vscHvdcLineCreation.types';
import { VscHdvLineModificationDto } from '../../modification/vscHvdcLineModification.types';

export const getVscHvdcLineCharacteristicsCreationSchema = () =>
    object().shape(
        {
            [FieldConstants.NOMINAL_V]: number().nullable().min(0, MUST_BE_GREATER_OR_EQUAL_TO_ZERO).required(),
            [FieldConstants.R]: number().nullable().min(0, MUST_BE_GREATER_OR_EQUAL_TO_ZERO).required(),
            [FieldConstants.MAX_P]: number().nullable().required(),
            [FieldConstants.OPERATOR_ACTIVE_POWER_LIMIT_SIDE1]: number().nullable(),
            [FieldConstants.OPERATOR_ACTIVE_POWER_LIMIT_SIDE2]: number().nullable(),
            [FieldConstants.CONVERTERS_MODE]: string().required(),
            [FieldConstants.ANGLE_DROOP_ACTIVE_POWER_CONTROL]: boolean(),
            [FieldConstants.ACTIVE_POWER_SET_POINT]: number().nullable().required(),
            [FieldConstants.P0]: number()
                .nullable()
                .default(null)
                .when([FieldConstants.ANGLE_DROOP_ACTIVE_POWER_CONTROL, FieldConstants.DROOP], {
                    is: (angleDroopActivePowerControl: boolean, droop: number) =>
                        angleDroopActivePowerControl || (droop !== null && droop !== undefined),
                    then: (schema) => schema.required(),
                }),
            [FieldConstants.DROOP]: number()
                .nullable()
                .default(null)
                .when([FieldConstants.ANGLE_DROOP_ACTIVE_POWER_CONTROL, FieldConstants.P0], {
                    is: (angleDroopActivePowerControl: boolean, p0: number) =>
                        angleDroopActivePowerControl || (p0 !== null && p0 !== undefined),
                    then: (schema) => schema.required(),
                }),
        },
        // p0 and droop are mutually dependent via when(), causing a cyclic dependency at runtime.
        [[FieldConstants.P0, FieldConstants.DROOP]] // excludedEdges => skip during cycle detection
    );

export type VscHvdcLineCharacteristicsCreationFormData = InferType<
    ReturnType<typeof getVscHvdcLineCharacteristicsCreationSchema>
>;

export const getVscHvdcLineCharacteristicsModificationSchema = () =>
    object().shape({
        [FieldConstants.NOMINAL_V]: number().nullable().min(0, MUST_BE_GREATER_OR_EQUAL_TO_ZERO),
        [FieldConstants.R]: number().nullable().min(0, MUST_BE_GREATER_OR_EQUAL_TO_ZERO),
        [FieldConstants.MAX_P]: number().nullable(),
        [FieldConstants.OPERATOR_ACTIVE_POWER_LIMIT_SIDE1]: number().nullable(),
        [FieldConstants.OPERATOR_ACTIVE_POWER_LIMIT_SIDE2]: number().nullable(),
        [FieldConstants.CONVERTERS_MODE]: string().nullable(),
        [FieldConstants.ANGLE_DROOP_ACTIVE_POWER_CONTROL]: boolean().nullable(),
        [FieldConstants.ACTIVE_POWER_SET_POINT]: number().nullable().nullable(),
        [FieldConstants.P0]: number().nullable(),
        [FieldConstants.DROOP]: number().nullable(),
    });

export type VscHvdcLineCharacteristicsModificationFormData = InferType<
    ReturnType<typeof getVscHvdcLineCharacteristicsModificationSchema>
>;

export function getVscHvdcLineCharacteristicsEmptyFormData(isModification: boolean) {
    return {
        [FieldConstants.NOMINAL_V]: null,
        [FieldConstants.R]: null,
        [FieldConstants.MAX_P]: null,
        [FieldConstants.OPERATOR_ACTIVE_POWER_LIMIT_SIDE1]: null,
        [FieldConstants.OPERATOR_ACTIVE_POWER_LIMIT_SIDE2]: null,
        [FieldConstants.CONVERTERS_MODE]: null,
        [FieldConstants.ACTIVE_POWER_SET_POINT]: null,
        [FieldConstants.ANGLE_DROOP_ACTIVE_POWER_CONTROL]: isModification ? null : false,
        [FieldConstants.P0]: null,
        [FieldConstants.DROOP]: null,
    };
}

export function getVscHvdcLineCharacteristicsFromCopy(
    hvdcLine: VscHvdcLineInfo
): VscHvdcLineCharacteristicsCreationFormData {
    return {
        [FieldConstants.NOMINAL_V]: hvdcLine?.nominalV,
        [FieldConstants.R]: hvdcLine?.r,
        [FieldConstants.MAX_P]: hvdcLine?.maxP,
        [FieldConstants.OPERATOR_ACTIVE_POWER_LIMIT_SIDE1]: hvdcLine?.hvdcOperatorActivePowerRange?.oprFromCS1toCS2,
        [FieldConstants.OPERATOR_ACTIVE_POWER_LIMIT_SIDE2]: hvdcLine?.hvdcOperatorActivePowerRange?.oprFromCS1toCS2,
        [FieldConstants.CONVERTERS_MODE]: hvdcLine?.convertersMode,
        [FieldConstants.ACTIVE_POWER_SET_POINT]: hvdcLine?.activePowerSetpoint,
        [FieldConstants.ANGLE_DROOP_ACTIVE_POWER_CONTROL]: hvdcLine?.hvdcAngleDroopActivePowerControl?.isEnabled,
        [FieldConstants.P0]: hvdcLine?.hvdcAngleDroopActivePowerControl?.p0,
        [FieldConstants.DROOP]: hvdcLine?.hvdcAngleDroopActivePowerControl?.droop,
    };
}

export function getVscHvdcLineCharacteristicsCreationDtoToForm(
    dto: VscHdvLineCreationDto
): VscHvdcLineCharacteristicsCreationFormData {
    return {
        [FieldConstants.NOMINAL_V]: dto.nominalV ?? 0,
        [FieldConstants.R]: dto.r ?? 0,
        [FieldConstants.MAX_P]: dto.maxP ?? 0,
        [FieldConstants.OPERATOR_ACTIVE_POWER_LIMIT_SIDE1]: dto?.operatorActivePowerLimitFromSide2ToSide1,
        [FieldConstants.OPERATOR_ACTIVE_POWER_LIMIT_SIDE2]: dto?.operatorActivePowerLimitFromSide1ToSide2,
        [FieldConstants.CONVERTERS_MODE]: dto.convertersMode,
        [FieldConstants.ACTIVE_POWER_SET_POINT]: dto.activePowerSetpoint ?? 0,
        [FieldConstants.ANGLE_DROOP_ACTIVE_POWER_CONTROL]: dto?.angleDroopActivePowerControl ?? undefined,
        [FieldConstants.P0]: dto?.p0,
        [FieldConstants.DROOP]: dto?.droop,
    };
}

export function getVscHvdcLineCharacteristicsModificationDtoToForm(
    dto: VscHdvLineModificationDto
): VscHvdcLineCharacteristicsModificationFormData {
    return {
        [FieldConstants.NOMINAL_V]: dto.nominalV?.value ?? null,
        [FieldConstants.R]: dto.r?.value ?? null,
        [FieldConstants.MAX_P]: dto.maxP?.value ?? null,
        [FieldConstants.OPERATOR_ACTIVE_POWER_LIMIT_SIDE1]:
            dto?.operatorActivePowerLimitFromSide2ToSide1?.value ?? null,
        [FieldConstants.OPERATOR_ACTIVE_POWER_LIMIT_SIDE2]:
            dto?.operatorActivePowerLimitFromSide1ToSide2?.value ?? null,
        [FieldConstants.CONVERTERS_MODE]: dto.convertersMode?.value ?? null,
        [FieldConstants.ACTIVE_POWER_SET_POINT]: dto.activePowerSetpoint?.value ?? null,
        [FieldConstants.ANGLE_DROOP_ACTIVE_POWER_CONTROL]: dto?.angleDroopActivePowerControl?.value ?? null,
        [FieldConstants.P0]: dto?.p0?.value ?? null,
        [FieldConstants.DROOP]: dto?.droop?.value ?? null,
    };
}
