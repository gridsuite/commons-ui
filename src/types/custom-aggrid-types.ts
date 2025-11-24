/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import type { GridApi } from 'ag-grid-community';

// Minimal, app-agnostic types for commons-ui AG Grid helpers

export type SortConfig = {
    colId: string;
    sort: SortWay;
    children?: boolean;
};

export enum SortWay {
    ASC = 'asc',
    DESC = 'desc',
}

export type FilterData = {
    dataType?: string;
    type?: string;
    originalType?: string;
    value: unknown;
    tolerance?: number;
};

export type FilterConfig = FilterData & {
    column: string;
};

export type FilterParams = {
    // kept as string to avoid coupling to app-specific enums
    type: string;
    tab: string;
    dataType?: string;
    comparators?: string[];
    debounceMs?: number;
    updateFilterCallback?: (api?: GridApi, filters?: FilterConfig[]) => void;
    // store-agnostic filtering: provide current filters and a setter
    filters?: FilterConfig[];
    setFilters?: (newFilters: FilterConfig[]) => void;
};
