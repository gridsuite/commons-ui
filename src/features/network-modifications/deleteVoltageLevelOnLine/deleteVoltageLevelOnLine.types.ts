/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { FieldConstants, ModificationType } from '../../../utils';

export interface DeleteVoltageLevelOnLineFormData {
    [FieldConstants.LINE_TO_ATTACH_TO_1_ID]: string | null;
    [FieldConstants.LINE_TO_ATTACH_TO_2_ID]: string | null;
    [FieldConstants.REPLACING_LINE_1_ID]: string;
    [FieldConstants.REPLACING_LINE_1_NAME]: string;
}

export interface DeleteVoltageLevelOnLineDto {
    type: ModificationType;
    uuid?: string | null;
    [FieldConstants.LINE_TO_ATTACH_TO_1_ID]: string | null;
    [FieldConstants.LINE_TO_ATTACH_TO_2_ID]: string | null;
    [FieldConstants.REPLACING_LINE_1_ID]: string;
    [FieldConstants.REPLACING_LINE_1_NAME]: string;
}
