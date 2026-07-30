/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { LineSegmentInfos } from '../common/line.types';
import { BranchCreationDto } from '../../common/branch/branchCreation.types';

// cf LineCreationInfos back DTO class
export interface LineCreationDto extends BranchCreationDto {
    g1: number | null;
    b1: number | null;
    g2: number | null;
    b2: number | null;
    lineSegments?: LineSegmentInfos[];
}
