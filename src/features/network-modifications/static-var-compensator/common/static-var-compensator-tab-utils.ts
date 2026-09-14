/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { FieldConstants } from '../../../../utils';

export enum StaticVarCompensatorDialogTab {
    CONNECTIVITY_TAB = 0,
    SET_POINTS_LIMITS_TAB = 1,
    AUTOMATON_TAB = 2,
    ADDITIONAL_INFO_TAB = 3,
}

export const STATIC_VAR_COMPENSATOR_TAB_FIELDS: Readonly<
    Partial<Record<StaticVarCompensatorDialogTab, FieldConstants[]>>
> = {
    [StaticVarCompensatorDialogTab.CONNECTIVITY_TAB]: [FieldConstants.CONNECTIVITY],
    [StaticVarCompensatorDialogTab.SET_POINTS_LIMITS_TAB]: [FieldConstants.SETPOINTS_LIMITS],
    [StaticVarCompensatorDialogTab.AUTOMATON_TAB]: [FieldConstants.AUTOMATON],
    [StaticVarCompensatorDialogTab.ADDITIONAL_INFO_TAB]: [FieldConstants.ADDITIONAL_PROPERTIES],
};
