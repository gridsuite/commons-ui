/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import type { UUID } from 'node:crypto';
import { Property } from '../../../common';
import { ModificationType } from '../../../../../utils';

export interface LccShuntCompensatorCreationDto {
    id: string;
    name?: string | null;
    maxQAtNominalV: number | null;
    connectedToHvdc?: boolean | null;
    terminalConnected?: boolean | null;
    type: string;
}

export interface LccConverterStationCreationDto {
    type: ModificationType;
    equipmentId: string;
    equipmentName: string | null;
    lossFactor: number | null;
    powerFactor: number | null;
    voltageLevelId: string;
    busOrBusbarSectionId: string;
    terminalConnected: boolean;
    connectionDirection: string | null;
    connectionName: string | null;
    connectionPosition: number | null;
    shuntCompensatorsOnSide: LccShuntCompensatorCreationDto[];
}
export interface LccHvdcLineCreationDto {
    uuid?: UUID;
    type: ModificationType;
    equipmentId: string;
    equipmentName: string | null;
    nominalV: number | null;
    r: number | null;
    maxP: number | null;
    convertersMode: string;
    activePowerSetpoint: number | null;
    converterStation1: LccConverterStationCreationDto;
    converterStation2: LccConverterStationCreationDto;
    properties: Property[] | null;
}
