/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */
import * as yup from 'yup';
import {
    getLimitReductionsFormSchema,
    ILimitReductionsByVoltageLevel,
    PROVIDER,
    toFormValuesLimitReductions,
} from '../common';
import { getNameElementEditorSchema } from '../common/name-element-editor';
import { getContingencyListsInfosFormSchema, toFormValuesContingencyListsInfos } from '../common/contingency-table';
import { SAParametersEnriched } from '../../../utils';
import {
    FLOW_PROPORTIONAL_THRESHOLD,
    HIGH_VOLTAGE_ABSOLUTE_THRESHOLD,
    HIGH_VOLTAGE_PROPORTIONAL_THRESHOLD,
    LOW_VOLTAGE_ABSOLUTE_THRESHOLD,
    LOW_VOLTAGE_PROPORTIONAL_THRESHOLD,
} from './constants';

export const getSAParametersFormSchema = (name: string | null, limitReductions?: ILimitReductionsByVoltageLevel[]) => {
    const providerSchema = yup.object().shape({
        [PROVIDER]: yup.string().required(),
    });

    const contingencyListsInfosSchema = getContingencyListsInfosFormSchema();

    const limitReductionsSchema = getLimitReductionsFormSchema(
        limitReductions?.length ? limitReductions[0].temporaryLimitReductions.length : 0
    );

    const thresholdsSchema = yup.object().shape({
        [FLOW_PROPORTIONAL_THRESHOLD]: yup
            .number()
            .min(0, 'NormalizedPercentage')
            .max(100, 'NormalizedPercentage')
            .required(),
        [LOW_VOLTAGE_PROPORTIONAL_THRESHOLD]: yup
            .number()
            .min(0, 'NormalizedPercentage')
            .max(100, 'NormalizedPercentage')
            .required(),
        [LOW_VOLTAGE_ABSOLUTE_THRESHOLD]: yup.number().required(),
        [HIGH_VOLTAGE_PROPORTIONAL_THRESHOLD]: yup
            .number()
            .min(0, 'NormalizedPercentage')
            .max(100, 'NormalizedPercentage')
            .required(),
        [HIGH_VOLTAGE_ABSOLUTE_THRESHOLD]: yup.number().required(),
    });

    return yup
        .object()
        .shape({
            ...providerSchema.fields,
            ...contingencyListsInfosSchema.fields,
            ...limitReductionsSchema.fields,
            ...thresholdsSchema.fields,
        })
        .concat(getNameElementEditorSchema(name));
};

export const toFormValueSaParameters = (params: SAParametersEnriched) => ({
    [PROVIDER]: params.provider,
    ...toFormValuesContingencyListsInfos(params?.contingencyListsInfos ?? []),
    ...toFormValuesLimitReductions(params?.limitReductions),
    // SA specific form values
    [FLOW_PROPORTIONAL_THRESHOLD]: params.flowProportionalThreshold * 100,
    [LOW_VOLTAGE_PROPORTIONAL_THRESHOLD]: params.lowVoltageProportionalThreshold * 100,
    [LOW_VOLTAGE_ABSOLUTE_THRESHOLD]: params.lowVoltageAbsoluteThreshold,
    [HIGH_VOLTAGE_PROPORTIONAL_THRESHOLD]: params.highVoltageProportionalThreshold * 100,
    [HIGH_VOLTAGE_ABSOLUTE_THRESHOLD]: params.highVoltageAbsoluteThreshold,
});
