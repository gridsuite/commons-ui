/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import {
    LIMIT_REDUCTIONS_FORM,
    PARAM_SA_FLOW_PROPORTIONAL_THRESHOLD,
    PARAM_SA_HIGH_VOLTAGE_ABSOLUTE_THRESHOLD,
    PARAM_SA_HIGH_VOLTAGE_PROPORTIONAL_THRESHOLD,
    PARAM_SA_LOW_VOLTAGE_ABSOLUTE_THRESHOLD,
    PARAM_SA_LOW_VOLTAGE_PROPORTIONAL_THRESHOLD,
    TabValues,
} from '../common';

export const TAB_FIELDS: Record<TabValues, string[]> = {
    [TabValues.General]: [
        PARAM_SA_FLOW_PROPORTIONAL_THRESHOLD,
        PARAM_SA_LOW_VOLTAGE_PROPORTIONAL_THRESHOLD,
        PARAM_SA_LOW_VOLTAGE_ABSOLUTE_THRESHOLD,
        PARAM_SA_HIGH_VOLTAGE_PROPORTIONAL_THRESHOLD,
        PARAM_SA_HIGH_VOLTAGE_ABSOLUTE_THRESHOLD,
    ],
    [TabValues.LimitReductions]: [LIMIT_REDUCTIONS_FORM],
};
