/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { ModificationType } from '../../../utils';

export enum ShiftEquipmentType {
    LOAD = 'LOAD',
    GENERATOR = 'GENERATOR',
}

export enum ShiftType {
    PROPORTIONAL = 'PROPORTIONAL',
    BALANCED = 'BALANCED',
}

export enum BalanceType {
    PROPORTIONAL_TO_GENERATION_P = 'PROPORTIONAL_TO_GENERATION_P',
    PROPORTIONAL_TO_GENERATION_P_MAX = 'PROPORTIONAL_TO_GENERATION_P_MAX',
    PROPORTIONAL_TO_LOAD = 'PROPORTIONAL_TO_LOAD',
    PROPORTIONAL_TO_CONFORM_LOAD = 'PROPORTIONAL_TO_CONFORM_LOAD',
}

export interface BalancesAdjustmentZoneDto {
    name: string;
    countries: string[];
    shiftEquipmentType: ShiftEquipmentType;
    shiftType: ShiftType;
    netPosition: number;
}

export interface BalancesAdjustmentDto {
    type: ModificationType;
    uuid?: string;
    maxNumberIterations: number;
    thresholdNetPosition: number;
    countriesToBalance: string[];
    balanceType: BalanceType;
    withLoadFlow: boolean;
    loadFlowParametersId: string | null;
    withRatioTapChangers: boolean;
    subtractLoadFlowBalancing: boolean;
    areas: BalancesAdjustmentZoneDto[];
}
