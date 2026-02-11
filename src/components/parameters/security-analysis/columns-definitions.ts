/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */
import {
    CONTINGENCY_LISTS,
    PARAM_SA_FLOW_PROPORTIONAL_THRESHOLD,
    PARAM_SA_HIGH_VOLTAGE_ABSOLUTE_THRESHOLD,
    PARAM_SA_HIGH_VOLTAGE_PROPORTIONAL_THRESHOLD,
    PARAM_SA_LOW_VOLTAGE_ABSOLUTE_THRESHOLD,
    PARAM_SA_LOW_VOLTAGE_PROPORTIONAL_THRESHOLD,
    PARAM_SA_PROVIDER,
    ILimitReductionsByVoltageLevel,
    getLimitReductionsFormSchema,
    toFormValuesLimitReductions,
} from '../common';
import yup from '../../../utils/yupConfig';
import { getNameElementEditorSchema } from '../common/name-element-editor';
import { ISAParameters } from './types';
import { getContingencyListsFormSchema, toFormValuesContingencyLists } from '../common/contingency-table';

export const getSAParametersFormSchema = (name: string | null, limitReductions?: ILimitReductionsByVoltageLevel[]) => {
    const providerSchema = yup.object().shape({
        [PARAM_SA_PROVIDER]: yup.string().required(),
    });

    const contingencyListsSchema = getContingencyListsFormSchema();

    const limitReductionsSchema = getLimitReductionsFormSchema(
        limitReductions?.length ? limitReductions[0].temporaryLimitReductions.length : 0
    );

    const thresholdsSchema = yup.object().shape({
        [PARAM_SA_FLOW_PROPORTIONAL_THRESHOLD]: yup
            .number()
            .min(0, 'NormalizedPercentage')
            .max(100, 'NormalizedPercentage')
            .required(),
        [PARAM_SA_LOW_VOLTAGE_PROPORTIONAL_THRESHOLD]: yup
            .number()
            .min(0, 'NormalizedPercentage')
            .max(100, 'NormalizedPercentage')
            .required(),
        [PARAM_SA_LOW_VOLTAGE_ABSOLUTE_THRESHOLD]: yup.number().required(),
        [PARAM_SA_HIGH_VOLTAGE_PROPORTIONAL_THRESHOLD]: yup
            .number()
            .min(0, 'NormalizedPercentage')
            .max(100, 'NormalizedPercentage')
            .required(),
        [PARAM_SA_HIGH_VOLTAGE_ABSOLUTE_THRESHOLD]: yup.number().required(),
    });

    return yup
        .object()
        .shape({
            ...providerSchema.fields,
            ...contingencyListsSchema.fields,
            ...limitReductionsSchema.fields,
            ...thresholdsSchema.fields,
        })
        .concat(getNameElementEditorSchema(name));
};

export const toFormValueSaParameters = (params: ISAParameters) => ({
    [PARAM_SA_PROVIDER]: params[PARAM_SA_PROVIDER],
    ...toFormValuesContingencyLists(params?.[CONTINGENCY_LISTS]),
    ...toFormValuesLimitReductions(params?.limitReductions),
    // SA specific form values
    [PARAM_SA_FLOW_PROPORTIONAL_THRESHOLD]: params[PARAM_SA_FLOW_PROPORTIONAL_THRESHOLD] * 100,
    [PARAM_SA_LOW_VOLTAGE_PROPORTIONAL_THRESHOLD]: params[PARAM_SA_LOW_VOLTAGE_PROPORTIONAL_THRESHOLD] * 100,
    [PARAM_SA_LOW_VOLTAGE_ABSOLUTE_THRESHOLD]: params[PARAM_SA_LOW_VOLTAGE_ABSOLUTE_THRESHOLD],
    [PARAM_SA_HIGH_VOLTAGE_PROPORTIONAL_THRESHOLD]: params[PARAM_SA_HIGH_VOLTAGE_PROPORTIONAL_THRESHOLD] * 100,
    [PARAM_SA_HIGH_VOLTAGE_ABSOLUTE_THRESHOLD]: params[PARAM_SA_HIGH_VOLTAGE_ABSOLUTE_THRESHOLD],
});
