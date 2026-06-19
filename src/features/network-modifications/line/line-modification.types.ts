/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { OperationalLimitsGroupsFormSchema } from '../common/limits/operationalLimitsGroups.types';
import { FieldConstants } from '../../../utils';
import { Property } from '../common/properties/properties.type';

// FIXME TODO DBR used by line cre/modif + 2wt ... any types ....
export interface LineModificationFormSchema {
    [FieldConstants.EQUIPMENT_ID]?: string;
    [FieldConstants.EQUIPMENT_NAME]?: string;
    [FieldConstants.CONNECTIVITY]: any;
    [FieldConstants.CHARACTERISTICS]: any;
    [FieldConstants.LIMITS]: OperationalLimitsGroupsFormSchema;
    [FieldConstants.ADDITIONAL_PROPERTIES]?: Property[];
    [FieldConstants.STATE_ESTIMATION]: any;
    // TODO DBR [FieldConstants.LINE_SEGMENTS]?: LineSegmentInfos[];
    [FieldConstants.APPLY_SEGMENTS_LIMITS]?: boolean;
}
