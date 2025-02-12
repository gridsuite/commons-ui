/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { EQUIPMENT_TYPE, EquipmentType } from './equipmentType';

export const ExtendedEquipmentType = {
    ...EquipmentType,
    HVDC_LINE_LCC: 'HVDC_LINE_LCC',
    HVDC_LINE_VSC: 'HVDC_LINE_VSC',
} as const;

export const EQUIPMENT_INDEXED_TYPE: Record<
    ExtendedEquipmentTypes,
    { name: ExtendedEquipmentTypes; tagLabel: string } | undefined
> = {
    ...EQUIPMENT_TYPE,
    [ExtendedEquipmentType.HVDC_LINE_LCC]: {
        name: ExtendedEquipmentType.HVDC_LINE_LCC,
        tagLabel: 'equipment_search/hvdcLineLccTag',
    },
    [ExtendedEquipmentType.HVDC_LINE_VSC]: {
        name: ExtendedEquipmentType.HVDC_LINE_VSC,
        tagLabel: 'equipment_search/hvdcLineVscTag',
    },
};

export type ExtendedEquipmentTypes = (typeof ExtendedEquipmentType)[keyof typeof ExtendedEquipmentType];
