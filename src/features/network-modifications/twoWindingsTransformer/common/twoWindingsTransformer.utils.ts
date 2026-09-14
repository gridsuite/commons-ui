/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { FieldConstants } from '../../../../utils';

export enum TwoWindingsTransformerDialogTab {
    CONNECTIVITY_TAB = 0,
    CHARACTERISTICS_TAB = 1,
    LIMITS_TAB = 2,
    STATE_ESTIMATION_TAB = 3,
    RATIO_TAP_TAB = 4,
    PHASE_TAP_TAB = 5,
}

export const TWT_TAB_FIELDS: Readonly<Partial<Record<TwoWindingsTransformerDialogTab, FieldConstants[]>>> = {
    [TwoWindingsTransformerDialogTab.CONNECTIVITY_TAB]: [FieldConstants.CONNECTIVITY],
    [TwoWindingsTransformerDialogTab.CHARACTERISTICS_TAB]: [
        FieldConstants.CHARACTERISTICS,
        FieldConstants.ADDITIONAL_PROPERTIES,
    ],
    [TwoWindingsTransformerDialogTab.LIMITS_TAB]: [FieldConstants.LIMITS],
    [TwoWindingsTransformerDialogTab.STATE_ESTIMATION_TAB]: [
        FieldConstants.STATE_ESTIMATION,
        FieldConstants.TO_BE_ESTIMATED,
    ],
    [TwoWindingsTransformerDialogTab.RATIO_TAP_TAB]: [FieldConstants.RATIO_TAP_CHANGER],
    [TwoWindingsTransformerDialogTab.PHASE_TAP_TAB]: [FieldConstants.PHASE_TAP_CHANGER],
};
