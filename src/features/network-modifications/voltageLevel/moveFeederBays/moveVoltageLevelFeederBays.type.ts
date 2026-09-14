/*
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 * SPDX-License-Identifier: MPL-2.0
 */

import { ConnectablePositionInfos } from '../../common';
import { ModificationType } from '../../../../utils';

export type FeederBaysFormInfos = {
    equipmentId: string | null;
    busbarSectionId: string | null; // for selected value
    busbarSectionIds: string[] | null; // for options
    connectionSide: string | null;
    connectionName: string | null;
    connectionDirection: string | null;
    connectionPosition: number | null;
    isRemoved: boolean;
    rowId: string | null;
};

export type FeederBayInfos = {
    busbarSectionId: string;
    connectionSide: string | null;
    connectablePositionInfos: ConnectablePositionInfos;
};

export type FeederBays = (FeederBayInfos & {
    equipmentId: string;
    rowId: string;
})[];

export interface MoveVoltageLevelFeederBaysDto {
    type: ModificationType.MOVE_VOLTAGE_LEVEL_FEEDER_BAYS;
    uuid?: string;
    voltageLevelId: string;
    feederBays: MoveFeederBayDto[];
}

export interface MoveFeederBayDto {
    equipmentId: string;
    busbarSectionId: string;
    connectionSide: string | null;
    connectionPosition: string | null;
    connectionName: string | null;
    connectionDirection: string | null;
}
