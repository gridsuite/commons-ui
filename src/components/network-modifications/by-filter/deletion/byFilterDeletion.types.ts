/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import type { EquipmentType, ModificationType } from '../../../../utils';

export type Filter = {
    id: string;
    name: string;
};

export type ByFilterDeletionDto = {
    uuid: string;
    type: ModificationType;
    equipmentType: EquipmentType;
    filters: Filter[];
};

export type ByFilterDeletionFormData = {
    type: EquipmentType | null;
    filters: Filter[];
};
