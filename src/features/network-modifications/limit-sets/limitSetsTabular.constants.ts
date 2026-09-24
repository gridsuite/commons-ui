/*
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 * SPDX-License-Identifier: MPL-2.0
 */

import { EquipmentType, FieldConstants, MODIFICATION_TYPES } from '../../../utils';
import {
    APPLICABILITY,
    OPERATIONAL_LIMITS_GROUPS_MODIFICATION_TYPE,
    TEMPORARY_LIMIT_MODIFICATION_TYPE,
} from '../common';
import { TABULAR_BOOLEAN, TABULAR_ENUM, TABULAR_NUMBER, TabularFieldConstants } from '../tabular/tabular.constants';
import type { TabularField } from '../tabular/tabular.types';

/** Equipment types handled by the limit sets tabular modification, mapped to their back-end modification type. */
export const LIMIT_SETS_TABULAR_MODIFICATION_EQUIPMENTS: { [key: string]: string } = {
    [EquipmentType.LINE]: MODIFICATION_TYPES.LINE_MODIFICATION.type,
    [EquipmentType.TWO_WINDINGS_TRANSFORMER]: MODIFICATION_TYPES.TWO_WINDINGS_TRANSFORMER_MODIFICATION.type,
};

export const LIMIT_SETS_TABULAR_MODIFICATION_EQUIPMENT_TYPES = Object.keys(LIMIT_SETS_TABULAR_MODIFICATION_EQUIPMENTS);

export const DEFAULT_AMOUNT_TEMPORARY_LIMITS = 1;
export const MIN_AMOUNT_TEMPORARY_LIMITS = 1;
export const MAX_AMOUNT_TEMPORARY_LIMITS = 50;

/** CSV columns always present, whatever the number of temporary limits. */
export const LIMIT_SETS_TABULAR_MODIFICATION_FIXED_FIELDS: TabularField[] = [
    { id: TabularFieldConstants.EQUIPMENT_ID, required: true },
    {
        id: FieldConstants.SIDE,
        required: true,
        type: TABULAR_ENUM,
        options: Object.values(APPLICABILITY).map((applicability) => applicability.id),
    },
    { id: FieldConstants.LIMIT_GROUP_NAME, required: true },
    { id: FieldConstants.IS_ACTIVE, required: false, type: TABULAR_BOOLEAN },
    { id: FieldConstants.PERMANENT_LIMIT, required: false, type: TABULAR_NUMBER },
    {
        id: FieldConstants.MODIFICATION_TYPE,
        required: true,
        type: TABULAR_ENUM,
        options: Object.values(OPERATIONAL_LIMITS_GROUPS_MODIFICATION_TYPE),
    },
    {
        id: FieldConstants.TEMPORARY_LIMITS_MODIFICATION_TYPE,
        required: false,
        type: TABULAR_ENUM,
        options: Object.values(TEMPORARY_LIMIT_MODIFICATION_TYPE),
    },
];

/** CSV columns repeated once per temporary limit (suffixed by the 1-based limit index). */
export const LIMIT_SETS_TABULAR_MODIFICATION_REPEATABLE_FIELDS: TabularField[] = [
    { id: FieldConstants.TEMPORARY_LIMIT_NAME, required: false },
    { id: FieldConstants.TEMPORARY_LIMIT_DURATION, required: false, type: TABULAR_NUMBER },
    { id: FieldConstants.TEMPORARY_LIMIT_VALUE, required: false, type: TABULAR_NUMBER },
];
