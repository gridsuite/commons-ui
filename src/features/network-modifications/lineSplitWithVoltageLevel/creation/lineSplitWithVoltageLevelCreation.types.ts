/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { ModificationType } from '../../../../utils';
import { VoltageLevelCreationDto } from '../../voltageLevel/creation/voltageLevelCreation.types';

export interface LineSplitWithVoltageLevelCreationDto {
    type: ModificationType;
    uuid?: string;
    lineToSplitId: string;
    percent: number;
    mayNewVoltageLevelInfos: VoltageLevelCreationDto | null;
    existingVoltageLevelId: string;
    bbsOrBusId: string;
    newLine1Id: string;
    newLine1Name?: string | null;
    newLine2Id: string;
    newLine2Name?: string | null;
}
