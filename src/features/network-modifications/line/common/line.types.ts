/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { ConnectablePositionInfos } from '../../common/connectivity/connectivity.type';
import { CurrentLimitsData } from '../../common/currentLimits/limits.types';
import { EquipmentWithProperties } from '../../common/properties/propertyUtils';

export interface LineSegmentInfos {
    segmentTypeId: string; // used to fetch LineTypeInfo
    segmentDistanceValue: number;
    area: string | null;
    temperature: string;
    shapeFactor: number | null;
}

export type BranchInfos = EquipmentWithProperties & {
    name: string;
    voltageLevelId1: string;
    voltageLevelId2: string;
    busOrBusbarSectionId1: string;
    busOrBusbarSectionId2: string;
    currentLimits: CurrentLimitsData[];
    selectedOperationalLimitsGroupId1: string;
    selectedOperationalLimitsGroupId2: string;
    r?: number;
    x?: number;
    g1?: number;
    b1?: number;
    g2?: number;
    b2?: number;
};

export interface LineFormInfos {
    id: string;
    name: string | null;
    voltageLevelId1: string;
    voltageLevelId2: string;
    terminal1Connected: boolean;
    terminal2Connected: boolean;
    p1: number;
    q1: number;
    p2: number;
    q2: number;
    i1: number;
    i2: number;
    r: number;
    x: number;
    g1?: number;
    b1?: number;
    g2?: number;
    b2?: number;
    busOrBusbarSectionId1: string;
    busOrBusbarSectionId2: string;
    selectedOperationalLimitsGroupId1: string;
    selectedOperationalLimitsGroupId2: string;
    connectablePosition1: ConnectablePositionInfos;
    connectablePosition2: ConnectablePositionInfos;
    currentLimits: CurrentLimitsData[];
    properties: Record<string, string>;
}
