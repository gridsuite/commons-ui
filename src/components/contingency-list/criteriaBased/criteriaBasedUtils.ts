/**
 * Copyright (c) 2021, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { type ObjectSchema } from 'yup';
import { FieldConstants } from '../../../utils/constants/fieldConstants';
import yup from '../../../utils/yupConfig';
import {
    DEFAULT_RANGE_VALUE,
    getRangeInputSchema,
    type RangeInputData,
} from '../../inputs/reactHookForm/numbers/RangeInput';

export type CriteriaBasedData = {
    [FieldConstants.COUNTRIES]?: string[];
    [FieldConstants.COUNTRIES_1]?: string[];
    [FieldConstants.COUNTRIES_2]?: string[];
    [FieldConstants.NOMINAL_VOLTAGE]?: RangeInputData | null;
    [FieldConstants.NOMINAL_VOLTAGE_1]?: RangeInputData | null;
    [FieldConstants.NOMINAL_VOLTAGE_2]?: RangeInputData | null;
    [FieldConstants.NOMINAL_VOLTAGE_3]?: RangeInputData | null;
    [key: string]: any;
};

export function getCriteriaBasedSchema(extraFields: Record<string, yup.AnyObject | null> = {}) {
    return {
        [FieldConstants.CRITERIA_BASED]: yup.object().shape({
            [FieldConstants.COUNTRIES]: yup.array().of(yup.string().required()),
            [FieldConstants.COUNTRIES_1]: yup.array().of(yup.string().required()),
            [FieldConstants.COUNTRIES_2]: yup.array().of(yup.string().required()),
            ...getRangeInputSchema(FieldConstants.NOMINAL_VOLTAGE),
            ...getRangeInputSchema(FieldConstants.NOMINAL_VOLTAGE_1),
            ...getRangeInputSchema(FieldConstants.NOMINAL_VOLTAGE_2),
            ...getRangeInputSchema(FieldConstants.NOMINAL_VOLTAGE_3),
            ...extraFields,
        }),
    } as const satisfies Record<FieldConstants.CRITERIA_BASED, ObjectSchema<CriteriaBasedData>>;
}

export function getCriteriaBasedFormData(
    criteriaValues?: Record<string, any>,
    extraFields: Record<string, yup.AnyObject | null> = {}
) {
    return {
        [FieldConstants.CRITERIA_BASED]: {
            [FieldConstants.COUNTRIES]: criteriaValues?.[FieldConstants.COUNTRIES] ?? [],
            [FieldConstants.COUNTRIES_1]: criteriaValues?.[FieldConstants.COUNTRIES_1] ?? [],
            [FieldConstants.COUNTRIES_2]: criteriaValues?.[FieldConstants.COUNTRIES_2] ?? [],
            [FieldConstants.NOMINAL_VOLTAGE]: criteriaValues?.[FieldConstants.NOMINAL_VOLTAGE] ?? DEFAULT_RANGE_VALUE,
            [FieldConstants.NOMINAL_VOLTAGE_1]:
                criteriaValues?.[FieldConstants.NOMINAL_VOLTAGE_1] ?? DEFAULT_RANGE_VALUE,
            [FieldConstants.NOMINAL_VOLTAGE_2]:
                criteriaValues?.[FieldConstants.NOMINAL_VOLTAGE_2] ?? DEFAULT_RANGE_VALUE,
            [FieldConstants.NOMINAL_VOLTAGE_3]:
                criteriaValues?.[FieldConstants.NOMINAL_VOLTAGE_3] ?? DEFAULT_RANGE_VALUE,
            ...extraFields,
        },
    } as const;
}
