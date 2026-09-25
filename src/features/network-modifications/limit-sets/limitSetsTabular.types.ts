/*
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 * SPDX-License-Identifier: MPL-2.0
 */

import type { UUID } from 'node:crypto';
import { AttributeModification, ModificationType } from '../../../utils';
import type { TabularModificationRow } from '../tabular/tabular.types';

export type LimitSetsTemporaryLimit = {
    name: AttributeModification<string>;
    value: AttributeModification<number>;
    acceptableDuration: AttributeModification<number>;
};

export type LimitSetsCurrentLimits = {
    permanentLimit: number;
    temporaryLimits: LimitSetsTemporaryLimit[];
};

export type LimitSetsOperationalLimitGroup = {
    id: string;
    modificationType: string;
    temporaryLimitsModificationType: string;
    selectedOperationalLimitsGroupId: string;
    applicability: string;
    currentLimits: LimitSetsCurrentLimits;
    type: string;
};

export type LimitSetsEquipmentModification = {
    uuid: string;
    type: string;
    activated: boolean;
    date: string;
    equipmentId: string;
    operationalLimitsGroups: LimitSetsOperationalLimitGroup[];
    selectedOperationalLimitsGroupId1: AttributeModification<string>;
    selectedOperationalLimitsGroupId2: AttributeModification<string>;
    stashed: boolean;
};

export type LimitSetsTabularModificationDto = {
    activated: boolean;
    date: string;
    modificationType: string;
    modifications: LimitSetsEquipmentModification[];
    stashed: boolean;
    type: string;
    uuid: UUID;
    csvFilename: string;
};

/** Payload sent to the back-end for a limit sets tabular modification. */
export type LimitSetsTabularModificationFormDto = {
    type: ModificationType.LIMIT_SETS_TABULAR_MODIFICATION;
    modificationType: string;
    modifications: TabularModificationRow[];
    csvFilename?: string;
};
