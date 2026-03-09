/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Property } from '../../common';

export interface LoadCreationDto {
    type: string;
    equipmentId: string;
    equipmentName: string | null;
    loadType: string;
    p0: number;
    q0: number;
    voltageLevelId: string;
    busOrBusbarSectionId: string;
    connectionDirection: string | null;
    connectionName?: string | null;
    connectionPosition?: number | null;
    terminalConnected?: boolean | null;
    properties: Property[] | null;
}
