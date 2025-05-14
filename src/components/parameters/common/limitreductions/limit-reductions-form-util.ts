/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import {
    ILimitReductionsByVoltageLevel,
    ISAParameters,
    IST_FORM,
    ITemporaryLimitReduction,
    LIMIT_DURATION_FORM,
    LIMIT_REDUCTIONS_FORM,
    VOLTAGE_LEVELS_FORM,
} from './columns-definitions';
import {
    PARAM_SA_PROVIDER,
    PARAM_SA_FLOW_PROPORTIONAL_THRESHOLD,
    PARAM_SA_LOW_VOLTAGE_PROPORTIONAL_THRESHOLD,
    PARAM_SA_LOW_VOLTAGE_ABSOLUTE_THRESHOLD,
    PARAM_SA_HIGH_VOLTAGE_PROPORTIONAL_THRESHOLD,
    PARAM_SA_HIGH_VOLTAGE_ABSOLUTE_THRESHOLD,
} from '../constant';

const toFormValuesFromTemporaryLimits = (limits: ITemporaryLimitReduction[]) =>
    limits.reduce((acc: Record<string, number>, limit, index) => {
        acc[LIMIT_DURATION_FORM + index] = limit.reduction;
        return acc;
    }, {});

export const toFormValuesLimitReductions = (limits: ILimitReductionsByVoltageLevel[]) =>
    !limits
        ? {}
        : {
              [LIMIT_REDUCTIONS_FORM]: limits.map((vlLimits) => ({
                  [VOLTAGE_LEVELS_FORM]: `${vlLimits.voltageLevel.nominalV} kV`,
                  [IST_FORM]: vlLimits.permanentLimitReduction,
                  ...toFormValuesFromTemporaryLimits(vlLimits.temporaryLimitReductions),
              })),
          };

export const toFormValueSaParameters = (params: ISAParameters) => ({
    [PARAM_SA_PROVIDER]: params[PARAM_SA_PROVIDER],
    ...toFormValuesLimitReductions(params?.limitReductions),
    // SA specific form values
    [PARAM_SA_FLOW_PROPORTIONAL_THRESHOLD]: params[PARAM_SA_FLOW_PROPORTIONAL_THRESHOLD] * 100,
    [PARAM_SA_LOW_VOLTAGE_PROPORTIONAL_THRESHOLD]: params[PARAM_SA_LOW_VOLTAGE_PROPORTIONAL_THRESHOLD] * 100,
    [PARAM_SA_LOW_VOLTAGE_ABSOLUTE_THRESHOLD]: params[PARAM_SA_LOW_VOLTAGE_ABSOLUTE_THRESHOLD],
    [PARAM_SA_HIGH_VOLTAGE_PROPORTIONAL_THRESHOLD]: params[PARAM_SA_HIGH_VOLTAGE_PROPORTIONAL_THRESHOLD] * 100,
    [PARAM_SA_HIGH_VOLTAGE_ABSOLUTE_THRESHOLD]: params[PARAM_SA_HIGH_VOLTAGE_ABSOLUTE_THRESHOLD],
});
