/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { createContext, useContext } from 'react';
import { GridApi } from 'ag-grid-community';
import { FilterConfig, FilterParams, SortConfig, SortParams } from '../custom-aggrid-types';

export interface CustomAggridSortContextValue {
    getSortConfig: (sortParams: SortParams | undefined) => SortConfig[] | undefined;
    setSortConfig: (sortParams: SortParams, updatedSortConfig: SortConfig[], api: GridApi | undefined) => void;
}

export const CustomAggridSortContext = createContext<CustomAggridSortContextValue | null>(null);

export const useCustomAggridSortContext = (): CustomAggridSortContextValue => {
    const ctx = useContext(CustomAggridSortContext);
    if (!ctx) {
        throw new Error('useCustomAggridSortContext must be used within a CustomAggridSortContext.Provider');
    }
    return ctx;
};

export interface CustomAggridFilterContextValue {
    getFilters: (params: Pick<FilterParams, 'type' | 'tab'>) => FilterConfig[];
    updateFilter: (
        colId: string,
        filterParams: FilterParams,
        updatedFilters: FilterConfig[],
        colFilter: FilterConfig | undefined
    ) => void;
}

export const CustomAggridFilterContext = createContext<CustomAggridFilterContextValue | null>(null);

export const useCustomAggridFilterContext = (): CustomAggridFilterContextValue => {
    const ctx = useContext(CustomAggridFilterContext);
    if (!ctx) {
        throw new Error('useCustomAggridFilterContext must be used within a CustomAggridFilterContext.Provider');
    }
    return ctx;
};
