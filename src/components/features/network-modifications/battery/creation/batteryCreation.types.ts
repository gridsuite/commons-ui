/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Property, ReactiveCapabilityCurvePoints } from '../../common';
import { ModificationType } from '../../../../../utils';

export interface BatteryCreationDto {
    type: ModificationType;
    equipmentId: string;
    equipmentName: string | null;
    minP: number;
    maxP: number;
    reactiveCapabilityCurve?: boolean | null;
    targetP: number;
    targetQ: number;
    voltageLevelId: string | null;
    busOrBusbarSectionId: string | null;
    reactiveCapabilityCurvePoints: ReactiveCapabilityCurvePoints[] | null;
    directTransX: number | null;
    stepUpTransformerX: number | null;
    participate: boolean | null;
    droop: number | null;
    maxQ: number | null;
    minQ: number | null;
    connectionDirection: string | null;
    connectionName?: string | null;
    connectionPosition?: number | null;
    terminalConnected?: boolean | null;
    properties: Property[] | null;
}
