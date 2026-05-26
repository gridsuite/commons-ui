/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { FieldConstants } from '../../../../utils';

export enum LoadDialogTab {
    CONNECTIVITY_TAB = 0,
    CHARACTERISTICS_TAB = 1,
    STATE_ESTIMATION_TAB = 2,
}

export const LOAD_TAB_FIELDS: Readonly<Partial<Record<LoadDialogTab, FieldConstants[]>>> = {
    [LoadDialogTab.CONNECTIVITY_TAB]: [FieldConstants.CONNECTIVITY],
    [LoadDialogTab.CHARACTERISTICS_TAB]: [
        FieldConstants.ACTIVE_POWER_SET_POINT,
        FieldConstants.REACTIVE_POWER_SET_POINT,
        FieldConstants.ADDITIONAL_PROPERTIES,
    ],
    [LoadDialogTab.STATE_ESTIMATION_TAB]: [FieldConstants.STATE_ESTIMATION],
};
