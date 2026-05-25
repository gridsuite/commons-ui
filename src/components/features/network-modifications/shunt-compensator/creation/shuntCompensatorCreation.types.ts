/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { ModificationType } from '../../../../../utils';
import { Property } from '../../common';

export interface ShuntCompensatorCreationDto {
    type: ModificationType;
    uuid?: string;
    equipmentId: string;
    equipmentName: string | null;
    maxSusceptance: number | null;
    maxQAtNominalV: number | null;
    shuntCompensatorType: string | null;
    sectionCount: number | null;
    maximumSectionCount: number | null;
    voltageLevelId: string;
    busOrBusbarSectionId: string;
    connectionDirection: string | null;
    connectionName?: string | null;
    connectionPosition?: number | null;
    terminalConnected?: boolean | null;
    properties: Property[] | null;
}
