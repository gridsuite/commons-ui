/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { AttributeModification, FieldConstants } from '../../../../utils';
import { CurrentLimits, LimitsProperty } from './limits.types';

// Determines how all the operational limits groups will be modified as a group
export const OPERATIONAL_LIMITS_GROUPS_MODIFICATION_TYPE = {
    ADD: 'ADD',
    // Modification types for Tabular modifications :
    MODIFY: 'MODIFY', // standard mode : the olg modifications are applied. The unspecified olg are not changed at all
    MODIFY_OR_ADD: 'MODIFY_OR_ADD', // if the opLG exists it is modified, if not it is created
    // Modification type for simple form modifications :
    REPLACE: 'REPLACE', // All the olg are removed, then the olg modification/add etc are applied
    DELETE: 'DELETE',
} as const;

export interface LimitsFormSchema {
    [FieldConstants.LIMITS]: OperationalLimitsGroupsFormSchema;
}

export interface OperationalLimitsGroupsFormSchema {
    [FieldConstants.OPERATIONAL_LIMITS_GROUPS]: OperationalLimitsGroupFormSchema[];
    [FieldConstants.SELECTED_OPERATIONAL_LIMITS_GROUP_ID1]?: string;
    [FieldConstants.SELECTED_OPERATIONAL_LIMITS_GROUP_ID2]?: string;
    [FieldConstants.ENABLE_OLG_MODIFICATION]: boolean;
}

export interface OperationalLimitsGroupFormSchema {
    [FieldConstants.ID]: string;
    [FieldConstants.NAME]: string;
    [FieldConstants.APPLICABILITY_FIELD]: string;
    [FieldConstants.OLG_IS_DUPLICATE]?: boolean;
    [FieldConstants.CURRENT_LIMITS]: CurrentLimitsFormSchema;
    [FieldConstants.LIMITS_PROPERTIES]?: LimitsPropertyFormSchema[];
}

export interface CurrentLimitsFormSchema {
    [FieldConstants.ID]?: string;
    [FieldConstants.PERMANENT_LIMIT]: number;
    [FieldConstants.TEMPORARY_LIMITS]: TemporaryLimitFormSchema[];
}

interface LimitsPropertyFormSchema {
    [FieldConstants.NAME]: string;
    [FieldConstants.VALUE]: string;
}

export interface TemporaryLimitFormSchema {
    [FieldConstants.TEMPORARY_LIMIT_DURATION]?: number | null;
    [FieldConstants.TEMPORARY_LIMIT_VALUE]?: number | null;
    [FieldConstants.TEMPORARY_LIMIT_NAME]?: string | null;
}

export interface OperationalLimitsGroup {
    id: string;
    name: string;
    applicability?: string;
    limitsProperties?: LimitsProperty[];
    currentLimits: CurrentLimits;
    modificationType?: string | null; // only needed when the data is used for a branch modification
}

export interface LimitsPropertyInfos {
    name: string;
    value: string;
}

export interface CurrentTemporaryLimitModificationInfos {
    name: AttributeModification<string> | null;
    value: AttributeModification<number> | null;
    acceptableDuration: AttributeModification<number> | null;
    modificationType: string | null;
}

export interface CurrentLimitsModificationInfos {
    permanentLimit: number | null;
    temporaryLimits: CurrentTemporaryLimitModificationInfos[] | null;
}

export interface OperationalLimitsGroupModificationInfos {
    id: string;
    currentLimits: CurrentLimitsModificationInfos | null;
    modificationType?: string | null;
    temporaryLimitsModificationType?: string | null;
    limitsProperties?: LimitsPropertyInfos[] | null;
    applicability: string | null;
}
