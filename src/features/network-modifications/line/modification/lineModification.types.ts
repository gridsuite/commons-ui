/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { Property } from '../../common/properties/properties.type';
import { AttributeModification, ModificationType } from '../../../../utils';
import { OperationalLimitsGroup } from '../../common/currentLimits/operationalLimitsGroups/operationalLimitsGroups.types';
import { LineSegmentInfos } from '../common/line.types';

export interface LineModificationDto {
    type: ModificationType;
    equipmentId: string;
    equipmentName: AttributeModification<string> | null;
    properties: Property[] | null;
    // branch
    r: AttributeModification<number> | null;
    x: AttributeModification<number> | null;
    enableOLGModification: boolean;
    operationalLimitsGroups: OperationalLimitsGroup[];
    operationalLimitsGroupsModificationType: 'MODIFY' | 'REPLACE' | null;
    selectedOperationalLimitsGroupId1: AttributeModification<string> | null;
    selectedOperationalLimitsGroupId2: AttributeModification<string> | null;
    voltageLevelId1: AttributeModification<string> | null;
    voltageLevelId2: AttributeModification<string> | null;
    busOrBusbarSectionId1: AttributeModification<string> | null;
    busOrBusbarSectionId2: AttributeModification<string> | null;
    connectionName1: AttributeModification<string> | null;
    connectionName2: AttributeModification<string> | null;
    connectionDirection1: AttributeModification<string> | null;
    connectionDirection2: AttributeModification<string> | null;
    connectionPosition1: AttributeModification<number> | null;
    connectionPosition2: AttributeModification<number> | null;
    terminal1Connected: AttributeModification<boolean> | null;
    terminal2Connected: AttributeModification<boolean> | null;
    p1MeasurementValue: AttributeModification<number> | null;
    p1MeasurementValidity: AttributeModification<boolean> | null;
    q1MeasurementValue: AttributeModification<number> | null;
    q1MeasurementValidity: AttributeModification<boolean> | null;
    p2MeasurementValue: AttributeModification<number> | null;
    p2MeasurementValidity: AttributeModification<boolean> | null;
    q2MeasurementValue: AttributeModification<number> | null;
    q2MeasurementValidity: AttributeModification<boolean> | null;
    // line only
    g1: AttributeModification<number> | null;
    b1: AttributeModification<number> | null;
    g2: AttributeModification<number> | null;
    b2: AttributeModification<number> | null;
    lineSegments?: LineSegmentInfos[];
    applySegmentsLimits: boolean;
}
