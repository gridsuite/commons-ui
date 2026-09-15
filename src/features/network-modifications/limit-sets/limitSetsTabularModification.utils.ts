/*
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 * SPDX-License-Identifier: MPL-2.0
 */

import * as yup from 'yup';
import {
    AMOUNT_TEMPORARY_LIMITS_ERROR,
    EquipmentType,
    FieldConstants,
    MODIFICATIONS_REQUIRED_TAB_ERROR,
    ModificationType,
    toModificationOperation,
} from '../../../utils';
import { APPLICABILITY, OPERATIONAL_LIMITS_GROUPS_MODIFICATION_TYPE } from '../common';
import { TabularFieldConstants } from '../tabular/tabular.constants';
import type { TabularModificationRow } from '../tabular/tabular.types';
import { formatModification } from '../tabular/tabular.utils';
import {
    DEFAULT_AMOUNT_TEMPORARY_LIMITS,
    LIMIT_SETS_TABULAR_MODIFICATION_EQUIPMENTS,
    MAX_AMOUNT_TEMPORARY_LIMITS,
    MIN_AMOUNT_TEMPORARY_LIMITS,
} from './limitSetsTabular.constants';
import type {
    LimitSetsEquipmentModification,
    LimitSetsOperationalLimitGroup,
    LimitSetsTabularModificationDto,
    LimitSetsTabularModificationFormDto,
    LimitSetsTemporaryLimit,
} from './limitSetsTabular.types';

export const limitSetsTabularModificationFormSchema = yup
    .object()
    .shape({
        [FieldConstants.TYPE]: yup.string().nullable().required(),
        [FieldConstants.AMOUNT_TEMPORARY_LIMITS]: yup
            .number()
            .min(MIN_AMOUNT_TEMPORARY_LIMITS, AMOUNT_TEMPORARY_LIMITS_ERROR)
            .max(MAX_AMOUNT_TEMPORARY_LIMITS, AMOUNT_TEMPORARY_LIMITS_ERROR)
            .required(),
        [TabularFieldConstants.MODIFICATIONS_TABLE]: yup.array().min(1, MODIFICATIONS_REQUIRED_TAB_ERROR).required(),
        [TabularFieldConstants.CSV_FILENAME]: yup.string().nullable().required(),
    })
    .required();

export type LimitSetsTabularModificationFormType = yup.InferType<typeof limitSetsTabularModificationFormSchema>;

export const limitSetsTabularModificationEmptyFormData: LimitSetsTabularModificationFormType = {
    [FieldConstants.TYPE]: EquipmentType.LINE,
    [FieldConstants.AMOUNT_TEMPORARY_LIMITS]: DEFAULT_AMOUNT_TEMPORARY_LIMITS,
    [TabularFieldConstants.MODIFICATIONS_TABLE]: [],
    [TabularFieldConstants.CSV_FILENAME]: '',
};

const getAmountTemporaryLimits = (dto: LimitSetsTabularModificationDto) =>
    // We check all modifications to determine the max limits number.
    (dto.modifications ?? [])
        .flatMap((modification) => modification?.operationalLimitsGroups ?? [])
        .reduce(
            (maxLength, group) => Math.max(maxLength, group.currentLimits?.temporaryLimits?.length ?? 0),
            DEFAULT_AMOUNT_TEMPORARY_LIMITS
        );

export const formatTemporaryLimitsFrontToBack = (
    modification: TabularModificationRow,
    amountMaxTemporaryLimits: number
) => {
    const temporaryLimits = [];
    for (let i = 1; i <= amountMaxTemporaryLimits; i++) {
        temporaryLimits.push({
            name: toModificationOperation(modification[FieldConstants.TEMPORARY_LIMIT_NAME + i]),
            value: toModificationOperation(modification[FieldConstants.TEMPORARY_LIMIT_VALUE + i]),
            acceptableDuration: toModificationOperation(modification[FieldConstants.TEMPORARY_LIMIT_DURATION + i]),
            modificationType: modification[FieldConstants.TEMPORARY_LIMITS_MODIFICATION_TYPE],
        });
    }
    return temporaryLimits;
};

/* eslint-disable no-param-reassign -- the modification is updated in place, as expected by the callers */
export const formatSelectedOperationalGroupId = (modification: TabularModificationRow) => {
    if (modification[FieldConstants.IS_ACTIVE]) {
        const limitGroupName = toModificationOperation(modification[FieldConstants.LIMIT_GROUP_NAME]);
        const side = modification[FieldConstants.SIDE];
        if (side === APPLICABILITY.SIDE1.id) {
            modification[FieldConstants.SELECTED_OPERATIONAL_LIMITS_GROUP_ID1] = limitGroupName;
        } else if (side === APPLICABILITY.SIDE2.id) {
            modification[FieldConstants.SELECTED_OPERATIONAL_LIMITS_GROUP_ID2] = limitGroupName;
        } else if (side === APPLICABILITY.EQUIPMENT.id) {
            modification[FieldConstants.SELECTED_OPERATIONAL_LIMITS_GROUP_ID1] = limitGroupName;
            modification[FieldConstants.SELECTED_OPERATIONAL_LIMITS_GROUP_ID2] = limitGroupName;
        }
    }
};
/* eslint-enable no-param-reassign */

export const formatOperationalLimitGroupsFrontToBack = (
    modification: TabularModificationRow,
    amountMaxTemporaryLimits: number
) => ({
    id: modification[FieldConstants.LIMIT_GROUP_NAME],
    applicability: modification[FieldConstants.SIDE],
    modificationType: modification[FieldConstants.MODIFICATION_TYPE],
    temporaryLimitsModificationType: modification[FieldConstants.TEMPORARY_LIMITS_MODIFICATION_TYPE],
    currentLimits: {
        permanentLimit: modification[FieldConstants.PERMANENT_LIMIT],
        temporaryLimits: formatTemporaryLimitsFrontToBack(modification, amountMaxTemporaryLimits),
    },
});

const formatTemporaryLimitsBackToFront = (temporaryLimits: LimitSetsTemporaryLimit[]) => {
    const modification: TabularModificationRow = {};
    for (let i = 0; i < temporaryLimits.length; i++) {
        const index = i + 1; // Fields are 1-indexed
        const tempLimit = temporaryLimits[i];

        modification[FieldConstants.TEMPORARY_LIMIT_NAME + index] = tempLimit.name?.value;
        modification[FieldConstants.TEMPORARY_LIMIT_VALUE + index] = tempLimit.value?.value;
        modification[FieldConstants.TEMPORARY_LIMIT_DURATION + index] = tempLimit.acceptableDuration?.value;
    }
    return modification;
};

export const getEquipmentTypeFromLimitSetsModificationType = (type: string) =>
    Object.keys(LIMIT_SETS_TABULAR_MODIFICATION_EQUIPMENTS).find(
        (key) => LIMIT_SETS_TABULAR_MODIFICATION_EQUIPMENTS[key] === type
    );

const mapOperationalLimitGroupBackToFront = (
    modification: LimitSetsEquipmentModification,
    group: LimitSetsOperationalLimitGroup
): TabularModificationRow => {
    const row: TabularModificationRow = {};
    row[TabularFieldConstants.EQUIPMENT_ID] = modification[TabularFieldConstants.EQUIPMENT_ID];
    row[FieldConstants.IS_ACTIVE] =
        (modification[FieldConstants.SELECTED_OPERATIONAL_LIMITS_GROUP_ID1]?.value === group.id &&
            group.applicability === APPLICABILITY.SIDE1.id) ||
        (modification[FieldConstants.SELECTED_OPERATIONAL_LIMITS_GROUP_ID2]?.value === group.id &&
            group.applicability === APPLICABILITY.SIDE2.id) ||
        (modification[FieldConstants.SELECTED_OPERATIONAL_LIMITS_GROUP_ID2]?.value === group.id &&
            modification[FieldConstants.SELECTED_OPERATIONAL_LIMITS_GROUP_ID1]?.value === group.id &&
            group.applicability === APPLICABILITY.EQUIPMENT.id);
    row[FieldConstants.SIDE] = group[FieldConstants.APPLICABILITY_FIELD];
    row[FieldConstants.LIMIT_GROUP_NAME] = group.id;
    row[FieldConstants.MODIFICATION_TYPE] = group.modificationType;
    row[FieldConstants.TEMPORARY_LIMITS_MODIFICATION_TYPE] = group.temporaryLimitsModificationType;
    row[FieldConstants.PERMANENT_LIMIT] = group.currentLimits.permanentLimit;

    return {
        ...row,
        ...formatTemporaryLimitsBackToFront(group.currentLimits.temporaryLimits),
    };
};

const formatOperationalLimitGroupsBackToFront = (dto: LimitSetsTabularModificationDto): TabularModificationRow[] =>
    (dto.modifications ?? []).flatMap((modification) =>
        (modification?.operationalLimitsGroups ?? []).map((operationalLimitGroup) =>
            mapOperationalLimitGroupBackToFront(modification, operationalLimitGroup)
        )
    );

export const limitSetsTabularModificationDtoToForm = (
    dto: LimitSetsTabularModificationDto
): LimitSetsTabularModificationFormType => ({
    [FieldConstants.TYPE]: getEquipmentTypeFromLimitSetsModificationType(dto.modificationType) ?? '',
    [FieldConstants.AMOUNT_TEMPORARY_LIMITS]: getAmountTemporaryLimits(dto),
    [TabularFieldConstants.MODIFICATIONS_TABLE]: formatOperationalLimitGroupsBackToFront(dto),
    [TabularFieldConstants.CSV_FILENAME]: dto.csvFilename,
});

export const limitSetsTabularModificationFormToDto = (
    form: LimitSetsTabularModificationFormType
): LimitSetsTabularModificationFormDto => {
    const amountMaxTemporaryLimits = form[FieldConstants.AMOUNT_TEMPORARY_LIMITS];
    const equipmentModificationType = LIMIT_SETS_TABULAR_MODIFICATION_EQUIPMENTS[form[FieldConstants.TYPE]];
    const modifications = (form[TabularFieldConstants.MODIFICATIONS_TABLE] ?? []).map((row: TabularModificationRow) => {
        const modification = formatModification(row);
        modification[FieldConstants.OPERATIONAL_LIMITS_GROUPS] = [
            formatOperationalLimitGroupsFrontToBack(modification, amountMaxTemporaryLimits),
        ];
        formatSelectedOperationalGroupId(modification);
        modification.type = equipmentModificationType; // ex: LINE_MODIFICATION
        if (row[FieldConstants.MODIFICATION_TYPE] === OPERATIONAL_LIMITS_GROUPS_MODIFICATION_TYPE.REPLACE) {
            // when 'modificationType' CSV column is REPLACE : activate the 'replace' back-end mode to delete
            // all existing limit sets before adding a new one.
            modification[FieldConstants.OLGS_MODIFICATION_TYPE] = OPERATIONAL_LIMITS_GROUPS_MODIFICATION_TYPE.REPLACE;
        }
        return modification;
    });

    return {
        type: ModificationType.LIMIT_SETS_TABULAR_MODIFICATION,
        modificationType: equipmentModificationType,
        modifications,
        csvFilename: form[TabularFieldConstants.CSV_FILENAME] ?? undefined,
    };
};
