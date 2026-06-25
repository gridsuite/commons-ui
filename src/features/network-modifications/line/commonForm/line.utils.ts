/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { FieldConstants } from '../../../../utils';

export interface LineDialogOptions {
    isModification?: boolean;
    withConnectivity?: boolean;
    clearableFields?: boolean;
}

export const enum LineDialogTab {
    CONNECTIVITY_TAB = 0,
    CHARACTERISTICS_TAB = 1,
    LIMITS_TAB = 2,
    STATE_ESTIMATION_TAB = 3,
}

export const LINE_TAB_FIELDS: Readonly<Partial<Record<LineDialogTab, FieldConstants[]>>> = {
    [LineDialogTab.CONNECTIVITY_TAB]: [FieldConstants.CONNECTIVITY],
    [LineDialogTab.CHARACTERISTICS_TAB]: [FieldConstants.CHARACTERISTICS, FieldConstants.ADDITIONAL_PROPERTIES],
    [LineDialogTab.LIMITS_TAB]: [FieldConstants.LIMITS],
    [LineDialogTab.STATE_ESTIMATION_TAB]: [FieldConstants.STATE_ESTIMATION],
};
