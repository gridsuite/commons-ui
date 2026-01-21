/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { UseFormReturn } from 'react-hook-form';
import {
    COMMON_PARAMETERS,
    ILimitReductionsByVoltageLevel,
    IST_FORM,
    LIMIT_DURATION_FORM,
    LIMIT_REDUCTIONS_FORM,
} from '../common';
import {
    BALANCE_TYPE,
    CONNECTED_MODE,
    COUNTRIES_TO_BALANCE,
    DC,
    DC_POWER_FACTOR,
    DC_USE_TRANSFORMER_RATIO,
    DEFAULT_LIMIT_REDUCTION_VALUE,
    DISTRIBUTED_SLACK,
    HVDC_AC_EMULATION,
    PARAM_LIMIT_REDUCTION,
    PARAM_PROVIDER_OPENLOADFLOW,
    PHASE_SHIFTER_REGULATION_ON,
    READ_SLACK_BUS,
    SHUNT_COMPENSATOR_VOLTAGE_CONTROL_ON,
    TWT_SPLIT_SHUNT_ADMITTANCE,
    USE_REACTIVE_LIMITS,
    VOLTAGE_INIT_MODE,
    WRITE_SLACK_BUS,
} from './constants';
import { toFormValuesLimitReductions } from '../common/limitreductions/limit-reductions-form-util';
import yup from '../../../utils/yupConfig';

export enum TabValues {
    GENERAL = 'General',
    LIMIT_REDUCTIONS = 'LimitReductions',
}

export const getBasicLoadFlowParametersFormSchema = () => {
    return yup.object().shape({
        [PHASE_SHIFTER_REGULATION_ON]: yup.boolean().required(),
        [DC]: yup.boolean().required(),
        [BALANCE_TYPE]: yup.string().required(),
        [COUNTRIES_TO_BALANCE]: yup.array().of(yup.string()).required(),
        [CONNECTED_MODE]: yup.string().required(),
        [HVDC_AC_EMULATION]: yup.boolean().required(),
    });
};

export const getAdvancedLoadFlowParametersFormSchema = () => {
    return yup.object().shape({
        [VOLTAGE_INIT_MODE]: yup.string().required(),
        [USE_REACTIVE_LIMITS]: yup.boolean().required(),
        [TWT_SPLIT_SHUNT_ADMITTANCE]: yup.boolean().required(),
        [READ_SLACK_BUS]: yup.boolean().required(),
        [WRITE_SLACK_BUS]: yup.boolean().required(),
        [DISTRIBUTED_SLACK]: yup.boolean().required(),
        [SHUNT_COMPENSATOR_VOLTAGE_CONTROL_ON]: yup.boolean().required(),
        [DC_USE_TRANSFORMER_RATIO]: yup.boolean().required(),
        [DC_POWER_FACTOR]: yup
            .number()
            .required()
            .positive('dcPowerFactorGreaterThan0')
            .max(1, 'dcPowerFactorLessOrEqualThan1'),
    });
};

export const getCommonLoadFlowParametersFormSchema = () => {
    return yup.object().shape({
        [COMMON_PARAMETERS]: yup.object().shape({
            ...getBasicLoadFlowParametersFormSchema().fields,
            ...getAdvancedLoadFlowParametersFormSchema().fields,
        }),
    });
};

export const setLimitReductions = (
    provider: string,
    defaultLimitReductions: ILimitReductionsByVoltageLevel[],
    formMethods: UseFormReturn
) => {
    if (provider === PARAM_PROVIDER_OPENLOADFLOW) {
        formMethods.setValue(
            LIMIT_REDUCTIONS_FORM,
            toFormValuesLimitReductions(defaultLimitReductions)[LIMIT_REDUCTIONS_FORM]
        );
        formMethods.setValue(PARAM_LIMIT_REDUCTION, null);
    } else {
        formMethods.setValue(PARAM_LIMIT_REDUCTION, DEFAULT_LIMIT_REDUCTION_VALUE);
        formMethods.setValue(LIMIT_REDUCTIONS_FORM, []);
        formMethods.clearErrors(LIMIT_REDUCTIONS_FORM);
    }
};

export const mapLimitReductions = (
    vlLimits: ILimitReductionsByVoltageLevel,
    formLimits: Record<string, unknown>[],
    indexVl: number
): ILimitReductionsByVoltageLevel => {
    const vlLNewLimits: ILimitReductionsByVoltageLevel = {
        ...vlLimits,
        permanentLimitReduction: formLimits[indexVl][IST_FORM] as number,
    };
    vlLimits.temporaryLimitReductions.forEach((temporaryLimit, index) => {
        vlLNewLimits.temporaryLimitReductions[index] = {
            ...temporaryLimit,
            reduction: formLimits[indexVl][LIMIT_DURATION_FORM + index] as number,
        };
    });
    return vlLNewLimits;
};
