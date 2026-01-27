/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { ALL_EQUIPMENTS, Identifiable } from './types';

export function getEquipmentTypeShortLabel(equipmentType: string | undefined): string {
    if (!equipmentType) {
        return '';
    }
    return ALL_EQUIPMENTS[equipmentType as keyof typeof ALL_EQUIPMENTS]?.shortLabel ?? '';
}

export function getEquipmentTypeTagLabel(equipmentType: string | undefined): string {
    if (!equipmentType) {
        return '';
    }
    return ALL_EQUIPMENTS[equipmentType as keyof typeof ALL_EQUIPMENTS]?.tagLabel ?? '';
}

export function getIdentifiableNameOrId(useName: boolean, infos?: Identifiable | null): string {
    if (infos) {
        const name = infos.name;
        return useName && name != null && name.trim() !== '' ? name : infos?.id;
    }
    return '';
}

export type namingConventionValues = 'name' | 'id';

export function getUseNameKey(useName: boolean): namingConventionValues {
    if (useName) {
        return 'name';
    }
    return 'id';
}
