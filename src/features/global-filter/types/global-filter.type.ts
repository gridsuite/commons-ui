/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import type { UUID } from 'node:crypto';
import { LimitTypes } from './limit-violation.type';
import { FilterConfig, SortConfig } from '../../../components';

/**
 * Global filters types
 * the order of those enum values is the default order for global filter displays : do not move them around
 */
export enum GlobalFilterType {
    VOLTAGE_LEVEL = 'voltageLevel',
    COUNTRY = 'country',
    SUBSTATION_PROPERTY = 'substationProperty',
    SUBSTATION_OR_VL = 'substationOrVoltageLevelFilter', // voltage levels and substation generic filters which uses the filter library
    GENERIC_FILTER = 'genericFilter', // generic filters which uses the filter library (except voltage level and substation filters)
}

export function isCriteriaFilterType(filterType: string | undefined): boolean {
    return (
        filterType !== undefined &&
        (filterType === GlobalFilterType.GENERIC_FILTER || filterType === GlobalFilterType.SUBSTATION_OR_VL)
    );
}

export function isCriteriaFilter(filter: GlobalFilter): boolean {
    return isCriteriaFilterType(filter.filterType);
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

export interface RecentGlobalFilter {
    id: string;
    unselectedDate: number;
}

export interface ResultsQueryParams {
    sort?: SortConfig[];
    filters: FilterConfig[] | null; // column filters
    globalFilters?: GlobalFilters; // global filters, may contain generic filters applied to all the equipments
}
