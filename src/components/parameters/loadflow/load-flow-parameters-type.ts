/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import type { UUID } from 'node:crypto';
import { ILimitReductionsByVoltageLevel } from '../common';
import { SpecificParametersPerProvider } from '../../../utils';

export interface LoadFlowParametersInfos {
    uuid?: UUID;
    provider: string;
    limitReduction: number;
    commonParameters: Record<string, boolean | string | string[] | number>;
    specificParametersPerProvider: SpecificParametersPerProvider;
    limitReductions: ILimitReductionsByVoltageLevel[];
}
