/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { AttributeModification } from '../../../../utils';
import { LineSegmentInfos } from '../common/line.types';
import { BranchModificationDto } from '../../common';

export interface LineModificationDto extends BranchModificationDto {
    g1: AttributeModification<number> | null;
    b1: AttributeModification<number> | null;
    g2: AttributeModification<number> | null;
    b2: AttributeModification<number> | null;
    lineSegments?: LineSegmentInfos[];
    applySegmentsLimits: boolean;
}
