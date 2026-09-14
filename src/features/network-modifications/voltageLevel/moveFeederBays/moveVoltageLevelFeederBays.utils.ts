/*
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 * SPDX-License-Identifier: MPL-2.0
 */

import * as yup from 'yup';
import { InferType } from 'yup';
import { isNumber } from 'mathjs';
import { FieldConstants, ModificationType } from '../../../../utils';
import { MoveFeederBayDto, MoveVoltageLevelFeederBaysDto } from './moveVoltageLevelFeederBays.type';

export const emptyMoveVoltageLevelFeederBaysFormData = {
    [FieldConstants.EQUIPMENT_ID]: null,
    [FieldConstants.MOVE_VOLTAGE_LEVEL_FEEDER_BAYS_TABLE]: [
        {
            [FieldConstants.EQUIPMENT_ID]: null,
            [FieldConstants.BUSBAR_SECTION_ID]: null,
            [FieldConstants.BUSBAR_SECTION_IDS]: [],
            [FieldConstants.CONNECTION_SIDE]: null,
            [FieldConstants.CONNECTION_NAME]: null,
            [FieldConstants.CONNECTION_DIRECTION]: null,
            [FieldConstants.CONNECTION_POSITION]: null,
            [FieldConstants.IS_REMOVED]: false,
            [FieldConstants.IS_SEPARATOR]: false,
        },
    ],
};

function requiredWhenActive<T extends yup.Schema>(schema: T) {
    return schema.when(
        [FieldConstants.IS_REMOVED, FieldConstants.IS_SEPARATOR],
        ([isRemoved, isSeparator], baseSchema) =>
            !isRemoved && !isSeparator ? baseSchema.nullable().required() : baseSchema.nullable()
    );
}

export const moveVoltageLevelFeederBaysFormSchema = yup.object().shape({
    [FieldConstants.EQUIPMENT_ID]: yup.string().required(),
    [FieldConstants.MOVE_VOLTAGE_LEVEL_FEEDER_BAYS_TABLE]: yup.array().of(
        yup.object().shape({
            [FieldConstants.EQUIPMENT_ID]: requiredWhenActive(yup.string()),
            [FieldConstants.BUSBAR_SECTION_ID]: requiredWhenActive(yup.string()),
            [FieldConstants.BUSBAR_SECTION_IDS]: requiredWhenActive(yup.array().of(yup.string())),
            [FieldConstants.CONNECTION_SIDE]: yup.string().nullable(),
            [FieldConstants.CONNECTION_NAME]: yup.string().nullable(),
            [FieldConstants.CONNECTION_DIRECTION]: yup.string().nullable(),
            [FieldConstants.CONNECTION_POSITION]: yup.number().nullable().positive(),
            [FieldConstants.IS_REMOVED]: yup.boolean(),
            [FieldConstants.IS_SEPARATOR]: yup.boolean(),
        })
    ),
});

export type MoveVoltageLevelFeederBaysFormSchemaType = InferType<typeof moveVoltageLevelFeederBaysFormSchema>;

export const moveVoltageLevelFeederBaysDtoToForm = (
    moveVoltageLevelFeederBays: MoveVoltageLevelFeederBaysDto
): MoveVoltageLevelFeederBaysFormSchemaType => {
    const moveVoltageLevelFeederBaysTable = moveVoltageLevelFeederBays.feederBays.map((row, index) => ({
        [FieldConstants.EQUIPMENT_ID]: row.equipmentId ?? '',
        [FieldConstants.BUSBAR_SECTION_ID]: row.busbarSectionId ?? '',
        [FieldConstants.BUSBAR_SECTION_IDS]: [],
        [FieldConstants.CONNECTION_SIDE]: row.connectionSide ?? null,
        [FieldConstants.CONNECTION_NAME]: row.connectionName ?? null,
        [FieldConstants.CONNECTION_DIRECTION]: row.connectionDirection ?? null,
        [FieldConstants.CONNECTION_POSITION]: isNumber(row.connectionPosition)
            ? Number.parseInt(row.connectionPosition, 10)
            : null,
        [FieldConstants.IS_REMOVED]: false,
        [FieldConstants.IS_SEPARATOR]: false,
        [FieldConstants.ROW_ID]: `${row.equipmentId}-${row.connectionSide}-${index}`,
    }));
    return {
        [FieldConstants.EQUIPMENT_ID]: moveVoltageLevelFeederBays.voltageLevelId,
        [FieldConstants.MOVE_VOLTAGE_LEVEL_FEEDER_BAYS_TABLE]: moveVoltageLevelFeederBaysTable,
    };
};

export const moveVoltageLevelFeederBaysFormToDto = (
    moveVoltageLevelFeederBays: MoveVoltageLevelFeederBaysFormSchemaType
): MoveVoltageLevelFeederBaysDto => {
    const tableData = moveVoltageLevelFeederBays[FieldConstants.MOVE_VOLTAGE_LEVEL_FEEDER_BAYS_TABLE];
    const feederBays: MoveFeederBayDto[] =
        tableData && Array.isArray(tableData)
            ? tableData
                  .filter((row): row is NonNullable<typeof row> => row != null)
                  .map((row) => ({
                      equipmentId: row[FieldConstants.EQUIPMENT_ID] ?? '',
                      busbarSectionId: row[FieldConstants.BUSBAR_SECTION_ID] ?? '',
                      connectionSide: row[FieldConstants.CONNECTION_SIDE] ?? null,
                      connectionPosition: isNumber(row[FieldConstants.CONNECTION_POSITION])
                          ? row[FieldConstants.CONNECTION_POSITION].toString()
                          : null,
                      connectionName: row[FieldConstants.CONNECTION_NAME] ?? null,
                      connectionDirection: row[FieldConstants.CONNECTION_DIRECTION] ?? null,
                  }))
            : [];
    return {
        type: ModificationType.MOVE_VOLTAGE_LEVEL_FEEDER_BAYS,
        voltageLevelId: moveVoltageLevelFeederBays[FieldConstants.EQUIPMENT_ID],
        feederBays,
    };
};
