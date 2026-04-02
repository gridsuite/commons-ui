/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { FieldConstants } from '../../../../utils';

export enum VoltageLevelTab {
    SUBSTATION_TAB = 0,
    CHARACTERISTICS_TAB = 1,
    STRUCTURE_TAB = 2,
    ADDITIONAL_INFORMATION_TAB = 3,
}

export const VOLTAGE_LEVEL_TAB_FIELDS: Readonly<Record<VoltageLevelTab, FieldConstants[]>> = {
    [VoltageLevelTab.SUBSTATION_TAB]: [
        FieldConstants.ADD_SUBSTATION_CREATION,
        FieldConstants.SUBSTATION_ID,
        FieldConstants.SUBSTATION_NAME,
        FieldConstants.SUBSTATION_CREATION_ID,
        FieldConstants.SUBSTATION_CREATION,
        FieldConstants.COUNTRY,
    ],
    [VoltageLevelTab.CHARACTERISTICS_TAB]: [
        FieldConstants.HIDE_NOMINAL_VOLTAGE,
        FieldConstants.NOMINAL_V,
        FieldConstants.LOW_VOLTAGE_LIMIT,
        FieldConstants.HIGH_VOLTAGE_LIMIT,
        FieldConstants.LOW_SHORT_CIRCUIT_CURRENT_LIMIT,
        FieldConstants.HIGH_SHORT_CIRCUIT_CURRENT_LIMIT,
    ],
    [VoltageLevelTab.STRUCTURE_TAB]: [
        FieldConstants.HIDE_BUS_BAR_SECTION,
        FieldConstants.BUS_BAR_COUNT,
        FieldConstants.SECTION_COUNT,
        FieldConstants.SWITCHES_BETWEEN_SECTIONS,
        FieldConstants.SWITCH_KINDS,
        FieldConstants.TOPOLOGY_KIND,
        FieldConstants.COUPLING_OMNIBUS,
    ],
    [VoltageLevelTab.ADDITIONAL_INFORMATION_TAB]: [FieldConstants.ADDITIONAL_PROPERTIES],
};
