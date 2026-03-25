/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */
import { number, object, string } from 'yup';
import {
    CONTINGENCY_LISTS_INFOS,
    getLimitReductionsFormSchema,
    ILimitReductionsByVoltageLevel,
    PARAM_SA_FLOW_PROPORTIONAL_THRESHOLD,
    PARAM_SA_HIGH_VOLTAGE_ABSOLUTE_THRESHOLD,
    PARAM_SA_HIGH_VOLTAGE_PROPORTIONAL_THRESHOLD,
    PARAM_SA_LOW_VOLTAGE_ABSOLUTE_THRESHOLD,
    PARAM_SA_LOW_VOLTAGE_PROPORTIONAL_THRESHOLD,
    PARAM_SA_PROVIDER,
    toFormValuesLimitReductions,
} from '../common';
import { getNameElementEditorSchema } from '../common/name-element-editor';
import { SAParameters } from './types';
import { getContingencyListsInfosFormSchema, toFormValuesContingencyListsInfos } from '../common/contingency-table';
import { NORMALIZED_PERCENTAGE } from '../../../utils';

export const getSAParametersFormSchema = (name: string | null, limitReductions?: ILimitReductionsByVoltageLevel[]) => {
    const providerSchema = object().shape({
        [PARAM_SA_PROVIDER]: string().required(),
    });

    const contingencyListsInfosSchema = getContingencyListsInfosFormSchema();

    const limitReductionsSchema = getLimitReductionsFormSchema(
        limitReductions?.length ? limitReductions[0].temporaryLimitReductions.length : 0
    );

    const thresholdsSchema = object().shape({
        [PARAM_SA_FLOW_PROPORTIONAL_THRESHOLD]: number()
            .min(0, NORMALIZED_PERCENTAGE)
            .max(100, NORMALIZED_PERCENTAGE)
            .required(),
        [PARAM_SA_LOW_VOLTAGE_PROPORTIONAL_THRESHOLD]: number()
            .min(0, NORMALIZED_PERCENTAGE)
            .max(100, NORMALIZED_PERCENTAGE)
            .required(),
        [PARAM_SA_LOW_VOLTAGE_ABSOLUTE_THRESHOLD]: number().required(),
        [PARAM_SA_HIGH_VOLTAGE_PROPORTIONAL_THRESHOLD]: number()
            .min(0, NORMALIZED_PERCENTAGE)
            .max(100, NORMALIZED_PERCENTAGE)
            .required(),
        [PARAM_SA_HIGH_VOLTAGE_ABSOLUTE_THRESHOLD]: number().required(),
    });

    return object()
        .shape({
            ...providerSchema.fields,
            ...contingencyListsInfosSchema.fields,
            ...limitReductionsSchema.fields,
            ...thresholdsSchema.fields,
        })
        .concat(getNameElementEditorSchema(name));
};

export const toFormValueSaParameters = (params: SAParameters) => ({
    [PARAM_SA_PROVIDER]: params[PARAM_SA_PROVIDER],
    ...toFormValuesContingencyListsInfos(params?.[CONTINGENCY_LISTS_INFOS]),
    ...toFormValuesLimitReductions(params?.limitReductions),
    // SA specific form values
    [PARAM_SA_FLOW_PROPORTIONAL_THRESHOLD]: params[PARAM_SA_FLOW_PROPORTIONAL_THRESHOLD] * 100,
    [PARAM_SA_LOW_VOLTAGE_PROPORTIONAL_THRESHOLD]: params[PARAM_SA_LOW_VOLTAGE_PROPORTIONAL_THRESHOLD] * 100,
    [PARAM_SA_LOW_VOLTAGE_ABSOLUTE_THRESHOLD]: params[PARAM_SA_LOW_VOLTAGE_ABSOLUTE_THRESHOLD],
    [PARAM_SA_HIGH_VOLTAGE_PROPORTIONAL_THRESHOLD]: params[PARAM_SA_HIGH_VOLTAGE_PROPORTIONAL_THRESHOLD] * 100,
    [PARAM_SA_HIGH_VOLTAGE_ABSOLUTE_THRESHOLD]: params[PARAM_SA_HIGH_VOLTAGE_ABSOLUTE_THRESHOLD],
});
