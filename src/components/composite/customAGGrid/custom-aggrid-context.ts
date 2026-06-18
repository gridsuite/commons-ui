/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { createContext, useContext } from 'react';
import { GridApi } from 'ag-grid-community';
import { FilterConfig, FilterParams, SortConfig, SortParams } from './custom-aggrid-types';

// ─── Sort ─────────────────────────────────────────────────────────────────────

export interface CustomAggridSortContextValue {
    /** Returns the current SortConfig[] for the given sortParams, or undefined. */
    getSortConfig: (sortParams: SortParams | undefined) => SortConfig[] | undefined;
    /** Persists / dispatches a new sort configuration. */
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

// ─── Filter ───────────────────────────────────────────────────────────────────

export interface CustomAggridFilterContextValue {
    /** Returns the active FilterConfig[] for the given (type, tab). */
    getFilters: (params: Pick<FilterParams, 'type' | 'tab'>) => FilterConfig[];
    /**
     * Called when the user changes a filter value.
     * The implementor is responsible for persisting / dispatching the change.
     */
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
