/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { ModificationType } from '../../../../utils';
import { Property } from '../../common/properties/properties.type';
import { OperationalLimitsGroupFormSchema } from '../../common/limits/operationalLimitsGroups.types';

export interface LineSegmentInfos {
    segmentTypeId: string; // used to fetch LineTypeInfo
    segmentDistanceValue: number;
    area: string | null;
    temperature: string;
    shapeFactor: number | null;
}

export interface LineCreationDto {
    type: ModificationType;
    uuid?: string | null;
    equipmentId: string;
    equipmentName: string | null;
    r: number | null;
    x: number | null;
    g1: number | null;
    b1: number | null;
    g2: number | null;
    b2: number | null;
    operationalLimitsGroups: OperationalLimitsGroupFormSchema[];
    selectedOperationalLimitsGroupId1?: string | null;
    selectedOperationalLimitsGroupId2?: string | null;
    voltageLevelId1: string | null;
    busOrBusbarSectionId1: string | null;
    connectionName1: string | null;
    connectionDirection1?: string | null;
    connectionPosition1?: number | null;
    connected1?: boolean | null;
    voltageLevelId2: string | null;
    busOrBusbarSectionId2: string | null;
    connectionName2: string | null;
    connectionDirection2?: string | null;
    connectionPosition2?: number | null;
    connected2?: boolean | null;
    properties: Property[] | null;
    lineSegments?: LineSegmentInfos[];
}
