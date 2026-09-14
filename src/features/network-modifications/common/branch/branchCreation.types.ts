/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { ModificationType } from '../../../../utils';
import { Property } from '../../common/properties/properties.type';
import { OperationalLimitsGroupFormSchema } from '../../common/currentLimits/operationalLimitsGroups/operationalLimitsGroups.types';

// cf BranchCreationInfos back DTO class
export interface BranchCreationDto {
    type: ModificationType;
    equipmentId: string;
    equipmentName: string | null;
    properties: Property[] | null;
    r: number | null;
    x: number | null;
    voltageLevelId1: string | null;
    voltageLevelId2: string | null;
    busOrBusbarSectionId1: string | null;
    busOrBusbarSectionId2: string | null;
    operationalLimitsGroups: OperationalLimitsGroupFormSchema[];
    selectedOperationalLimitsGroupId1?: string | null;
    selectedOperationalLimitsGroupId2?: string | null;
    connectionName1: string | null;
    connectionDirection1?: string | null;
    connectionName2: string | null;
    connectionDirection2?: string | null;
    connectionPosition1?: number | null;
    connectionPosition2?: number | null;
    connected1?: boolean | null;
    connected2?: boolean | null;
}
