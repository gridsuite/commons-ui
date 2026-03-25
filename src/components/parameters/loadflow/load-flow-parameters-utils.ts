/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { UseFormReturn } from 'react-hook-form';
import { array, boolean, number, object, string } from 'yup';
import {
    COMMON_PARAMETERS,
    ILimitReductionsByVoltageLevel,
    IST_FORM,
    LIMIT_DURATION_FORM,
    LIMIT_REDUCTIONS_FORM,
    toFormValuesLimitReductions,
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

export enum TabValues {
    GENERAL = 'General',
    LIMIT_REDUCTIONS = 'LimitReductions',
}

export const getBasicLoadFlowParametersFormSchema = () => {
    return object().shape({
        [PHASE_SHIFTER_REGULATION_ON]: boolean().required(),
        [DC]: boolean().required(),
        [BALANCE_TYPE]: string().required(),
        [COUNTRIES_TO_BALANCE]: array().of(string()).required(),
        [CONNECTED_MODE]: string().required(),
        [HVDC_AC_EMULATION]: boolean().required(),
    });
};

export const getAdvancedLoadFlowParametersFormSchema = () => {
    return object().shape({
        [VOLTAGE_INIT_MODE]: string().required(),
        [USE_REACTIVE_LIMITS]: boolean().required(),
        [TWT_SPLIT_SHUNT_ADMITTANCE]: boolean().required(),
        [READ_SLACK_BUS]: boolean().required(),
        [WRITE_SLACK_BUS]: boolean().required(),
        [DISTRIBUTED_SLACK]: boolean().required(),
        [SHUNT_COMPENSATOR_VOLTAGE_CONTROL_ON]: boolean().required(),
        [DC_USE_TRANSFORMER_RATIO]: boolean().required(),
        [DC_POWER_FACTOR]: number()
            .required()
            .positive('dcPowerFactorGreaterThan0')
            .max(1, 'dcPowerFactorLessOrEqualThan1'),
    });
};

export const getCommonLoadFlowParametersFormSchema = () => {
    return object().shape({
        [COMMON_PARAMETERS]: object().shape({
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
