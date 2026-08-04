/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import type { UUID } from 'node:crypto';

export enum LimitTypes {
    HIGH_VOLTAGE = 'HIGH_VOLTAGE',
    LOW_VOLTAGE = 'LOW_VOLTAGE',
    CURRENT = 'CURRENT',
}

/**
 * globals filters are the filters applied to computation results
 * they may contain generic filters
 */

// data sent to the back
export interface GlobalFilters {
    voltageRanges?: number[][];
    countryCode?: string[];
    genericFilter?: string[]; // UUIDs of the generic filters (excluding voltage levels and substations)
    substationOrVoltageLevelFilter?: string[]; // UUIDs of the voltage levels and substations generic filters
    // substation property filters fetched from user configuration
    substationProperty?: Object; // Map<string, string[]>;
    limitViolationsTypes?: LimitTypes[];
}

// complete individual global filter
export interface GlobalFilter {
    id: string;
    label: string;
    filterType: string;
    filterSubtype?: string; // when filterType needs more precise subcategories
    filterTypeFromMetadata?: string; // only useful for generic filters
    unselectedDate?: number;
    uuid?: UUID; // only useful for generic filters
    equipmentType?: string; // only useful for generic filters
    path?: string; // only useful for generic filters
    minValue?: number; // only useful for voltage level filters
    maxValue?: number; // only useful for voltage level filters
    deleted?: boolean; // only useful for generic filters
}
