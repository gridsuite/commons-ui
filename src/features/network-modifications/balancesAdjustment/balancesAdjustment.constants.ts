/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { FieldConstants } from '../../../utils';

export enum BalancesAdjustmentTab {
    AREAS_TAB = 0,
    ADVANCED_TAB = 1,
}

export const BALANCES_ADJUSTMENT_TAB_FIELDS: Readonly<Record<BalancesAdjustmentTab, string[]>> = {
    [BalancesAdjustmentTab.AREAS_TAB]: [
        `${FieldConstants.BALANCES_ADJUSTMENT}.${FieldConstants.BALANCES_ADJUSTMENT_ZONES}`,
    ],
    [BalancesAdjustmentTab.ADVANCED_TAB]: [
        `${FieldConstants.BALANCES_ADJUSTMENT}.${FieldConstants.BALANCES_ADJUSTMENT_ADVANCED}`,
    ],
};
