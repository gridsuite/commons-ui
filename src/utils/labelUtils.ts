/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { ALL_EQUIPMENTS } from './types';

export function getEquipmentTypeShortLabel(equipmentType: string | undefined): string {
    if (!equipmentType) {
        return '';
    }
    return ALL_EQUIPMENTS[equipmentType as keyof typeof ALL_EQUIPMENTS]?.shortLabel ?? '';
}
