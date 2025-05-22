/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import yup, { type NumberSchema } from 'yup';
import type { UUID } from 'crypto';
import { type IntlShape } from 'react-intl';
import {
    PARAM_SA_FLOW_PROPORTIONAL_THRESHOLD,
    PARAM_SA_HIGH_VOLTAGE_ABSOLUTE_THRESHOLD,
    PARAM_SA_HIGH_VOLTAGE_PROPORTIONAL_THRESHOLD,
    PARAM_SA_LOW_VOLTAGE_ABSOLUTE_THRESHOLD,
    PARAM_SA_LOW_VOLTAGE_PROPORTIONAL_THRESHOLD,
    PARAM_SA_PROVIDER,
} from '../constant';

export const LIMIT_REDUCTIONS_FORM = 'limitReductionsForm';
export const VOLTAGE_LEVELS_FORM = 'voltageLevelsForm';
export const IST_FORM = 'istForm';
export const LIMIT_DURATION_FORM = 'limitReductionForm';

export interface IVoltageLevel {
    nominalV: number;
    lowBound: number;
    highBound: number;
}

export interface ILimitDuration {
    lowBound: number;
    lowClosed: boolean;
    highBound: number;
    highClosed: boolean;
}

export interface ITemporaryLimitReduction {
    reduction: number;
    limitDuration: ILimitDuration;
}

export interface ILimitReductionsByVoltageLevel {
    voltageLevel: IVoltageLevel;
    permanentLimitReduction: number;
    temporaryLimitReductions: ITemporaryLimitReduction[];
}

export interface ISAParameters {
    uuid?: UUID;
    [PARAM_SA_PROVIDER]: string;
    limitReductions: ILimitReductionsByVoltageLevel[];
    [PARAM_SA_FLOW_PROPORTIONAL_THRESHOLD]: number;
    [PARAM_SA_LOW_VOLTAGE_PROPORTIONAL_THRESHOLD]: number;
    [PARAM_SA_LOW_VOLTAGE_ABSOLUTE_THRESHOLD]: number;
    [PARAM_SA_HIGH_VOLTAGE_PROPORTIONAL_THRESHOLD]: number;
    [PARAM_SA_HIGH_VOLTAGE_ABSOLUTE_THRESHOLD]: number;
}

export enum TabValues {
    'General' = 0,
    'LimitReductions' = 1,
}

export const TAB_INFO = [
    { label: TabValues[TabValues.General], developerModeOnly: false },
    { label: TabValues[TabValues.LimitReductions], developerModeOnly: false },
];

export interface IColumnsDef {
    label: string;
    dataKey: string;
    tooltip: string;
    width?: string;
}

export const COLUMNS_DEFINITIONS_LIMIT_REDUCTIONS: IColumnsDef[] = [
    {
        label: 'voltageRange',
        dataKey: VOLTAGE_LEVELS_FORM,
        tooltip: 'voltageRange',
    },
    {
        label: 'IST',
        dataKey: IST_FORM,
        tooltip: 'IST',
    },
];

/* TODO: a cleaner solution can be done by using yup.array()
 * Instead of creating a schema for each limit duration individually,
 * we can use yup.array() to define an array of limit durations directly. */
function getLimitDurationsFormSchema(intl: IntlShape, nbLimits: number) {
    return Array.from<never>({ length: nbLimits }).reduce(
        (acc, _, idx) => {
            acc[`${LIMIT_DURATION_FORM}${idx}`] = yup
                .number()
                .min(0, intl.formatMessage({ id: 'RealPercentage' }))
                .max(1, intl.formatMessage({ id: 'RealPercentage' }))
                .nullable()
                .required();
            return acc;
        },
        {} as Record<`${typeof LIMIT_DURATION_FORM}${number}`, NumberSchema>
    );
}

export function getLimitReductionsFormSchema(intl: IntlShape, nbTemporaryLimits: number) {
    return yup
        .object()
        .shape({
            [LIMIT_REDUCTIONS_FORM]: yup.array().of(
                yup.object().shape({
                    [VOLTAGE_LEVELS_FORM]: yup.string(),
                    [IST_FORM]: yup
                        .number()
                        .min(0, intl.formatMessage({ id: 'RealPercentage' }))
                        .max(1, intl.formatMessage({ id: 'RealPercentage' }))
                        .nullable()
                        .required(),
                    ...getLimitDurationsFormSchema(intl, nbTemporaryLimits),
                })
            ),
        })
        .required();
}

export function getSAParametersFromSchema(intl: IntlShape, limitReductions?: ILimitReductionsByVoltageLevel[]) {
    return yup.object().shape({
        // providerSchema fields
        [PARAM_SA_PROVIDER]: yup.string().required(),
        // limitReductionsSchema fields
        ...getLimitReductionsFormSchema(
            intl,
            limitReductions?.length ? limitReductions[0].temporaryLimitReductions.length : 0
        ).fields,
        // thresholdsSchema fields
        [PARAM_SA_FLOW_PROPORTIONAL_THRESHOLD]: yup
            .number()
            .min(0, intl.formatMessage({ id: 'NormalizedPercentage' }))
            .max(100, intl.formatMessage({ id: 'NormalizedPercentage' }))
            .required(),
        [PARAM_SA_LOW_VOLTAGE_PROPORTIONAL_THRESHOLD]: yup
            .number()
            .min(0, intl.formatMessage({ id: 'NormalizedPercentage' }))
            .max(100, intl.formatMessage({ id: 'NormalizedPercentage' }))
            .required(),
        [PARAM_SA_LOW_VOLTAGE_ABSOLUTE_THRESHOLD]: yup.number().required(),
        [PARAM_SA_HIGH_VOLTAGE_PROPORTIONAL_THRESHOLD]: yup
            .number()
            .min(0, intl.formatMessage({ id: 'NormalizedPercentage' }))
            .max(100, intl.formatMessage({ id: 'NormalizedPercentage' }))
            .required(),
        [PARAM_SA_HIGH_VOLTAGE_ABSOLUTE_THRESHOLD]: yup.number().required(),
    });
}
