/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import type { UUID } from 'node:crypto';
import {
    CONTINGENCY_LISTS_INFOS,
    PARAM_SA_FLOW_PROPORTIONAL_THRESHOLD,
    PARAM_SA_HIGH_VOLTAGE_ABSOLUTE_THRESHOLD,
    PARAM_SA_HIGH_VOLTAGE_PROPORTIONAL_THRESHOLD,
    PARAM_SA_LOW_VOLTAGE_ABSOLUTE_THRESHOLD,
    PARAM_SA_LOW_VOLTAGE_PROPORTIONAL_THRESHOLD,
    PARAM_SA_PROVIDER,
} from '../common/constants';
import { ContingencyListsInfos } from '../common/contingency-table/types';
import { ILimitReductionsByVoltageLevel } from '../common/limitreductions/columns-definitions';

export interface SAParameters {
    uuid?: UUID;
    [PARAM_SA_PROVIDER]: string;
    [CONTINGENCY_LISTS_INFOS]: ContingencyListsInfos[];
    limitReductions: ILimitReductionsByVoltageLevel[];
    [PARAM_SA_FLOW_PROPORTIONAL_THRESHOLD]: number;
    [PARAM_SA_LOW_VOLTAGE_PROPORTIONAL_THRESHOLD]: number;
    [PARAM_SA_LOW_VOLTAGE_ABSOLUTE_THRESHOLD]: number;
    [PARAM_SA_HIGH_VOLTAGE_PROPORTIONAL_THRESHOLD]: number;
    [PARAM_SA_HIGH_VOLTAGE_ABSOLUTE_THRESHOLD]: number;
}
