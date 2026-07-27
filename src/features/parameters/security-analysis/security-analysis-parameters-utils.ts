/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { CONTINGENCY_LISTS_INFOS, LIMIT_REDUCTIONS_FORM } from '../common';
import {
    FLOW_PROPORTIONAL_THRESHOLD,
    HIGH_VOLTAGE_ABSOLUTE_THRESHOLD,
    HIGH_VOLTAGE_PROPORTIONAL_THRESHOLD,
    LOW_VOLTAGE_ABSOLUTE_THRESHOLD,
    LOW_VOLTAGE_PROPORTIONAL_THRESHOLD,
    TabValues,
} from './constants';

export const TAB_FIELDS: Record<TabValues, string[]> = {
    [TabValues.Contingencies]: [CONTINGENCY_LISTS_INFOS],
    [TabValues.Aggravation]: [
        FLOW_PROPORTIONAL_THRESHOLD,
        LOW_VOLTAGE_PROPORTIONAL_THRESHOLD,
        LOW_VOLTAGE_ABSOLUTE_THRESHOLD,
        HIGH_VOLTAGE_PROPORTIONAL_THRESHOLD,
        HIGH_VOLTAGE_ABSOLUTE_THRESHOLD,
    ],
    [TabValues.LimitReductions]: [LIMIT_REDUCTIONS_FORM],
};
