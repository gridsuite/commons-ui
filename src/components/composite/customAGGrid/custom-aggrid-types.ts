/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { ColDef, ComponentType, GridApi, IFilterOptionDef } from 'ag-grid-community';
import { UUID } from 'crypto';
import { TableType } from '../../../utils';
import {
    DYNAMIC_SIMULATION_RESULT_SORT_STORE,
    LOADFLOW_RESULT_SORT_STORE,
    PCCMIN_ANALYSIS_RESULT_SORT_STORE,
    SECURITY_ANALYSIS_RESULT_SORT_STORE,
    SENSITIVITY_ANALYSIS_RESULT_SORT_STORE,
    SHORTCIRCUIT_ANALYSIS_RESULT_SORT_STORE,
    SPREADSHEET_SORT_STORE,
    STATEESTIMATION_RESULT_SORT_STORE,
} from '../../../utils/store-sort-filter-fields';

export type FilterParams = {
    type: TableType;
    tab: string;
    dataType?: string;
    comparators?: string[];
    debounceMs?: number;
};

export interface CustomAggridFilterParams {
    api: GridApi;
    colId: string;
    filterParams: FilterParams;
}

export enum UndisplayedFilterNumberComparators {
    GREATER_THAN = 'greaterThan',
    LESS_THAN = 'lessThan',
}

export type FilterData = {
    dataType?: string;
    type?: string;
    originalType?: string; // used to store the original type of the filter before any transformation (e.g EQUALS and NOT_EQUAL in number filters)
    value: unknown;
    tolerance?: number; // tolerance when comparing values. Only useful for the number type
};

export type FilterConfig = FilterData & {
    column: string;
};

export type SortConfig = {
    colId: string;
    sort: SortWay;
    children?: boolean;
};

export enum SortWay {
    ASC = 'asc',
    DESC = 'desc',
}

export type TableSortConfig = Record<string, SortConfig[]>;

export type TableSort = {
    [SPREADSHEET_SORT_STORE]: TableSortConfig;
    [LOADFLOW_RESULT_SORT_STORE]: TableSortConfig;
    [SECURITY_ANALYSIS_RESULT_SORT_STORE]: TableSortConfig;
    [SENSITIVITY_ANALYSIS_RESULT_SORT_STORE]: TableSortConfig;
    [DYNAMIC_SIMULATION_RESULT_SORT_STORE]: TableSortConfig;
    [SHORTCIRCUIT_ANALYSIS_RESULT_SORT_STORE]: TableSortConfig;
    [STATEESTIMATION_RESULT_SORT_STORE]: TableSortConfig;
    [PCCMIN_ANALYSIS_RESULT_SORT_STORE]: TableSortConfig;
};
export type TableSortKeysType = keyof TableSort;

export type SortParams = {
    table: TableSortKeysType;
    tab: string;
    isChildren?: boolean;
    persistSort?: (api: GridApi, sort: SortConfig) => Promise<void>;
};

export enum ColumnTypes {
    TEXT = 'TEXT',
    ENUM = 'ENUM',
    NUMBER = 'NUMBER',
    BOOLEAN = 'BOOLEAN',
}

export interface ColumnContext<F extends CustomAggridFilterParams = CustomAggridFilterParams> {
    agGridFilterParams?: {
        filterOptions: IFilterOptionDef[];
    };
    tabUuid?: UUID;
    columnType?: ColumnTypes;
    columnWidth?: number;
    fractionDigits?: number;
    isDefaultSort?: boolean;
    numeric?: boolean;
    forceDisplayFilterIcon?: boolean;
    tabIndex?: number;
    isCustomColumn?: boolean;
    Menu?: React.ComponentType<any>;
    filterComponent?: ComponentType<F>;
    // We omit colId and api here to avoid duplicating its declaration, we reinject it later inside CustomHeaderComponent
    filterComponentParams?: Omit<F, 'colId' | 'api'>;
    sortParams?: SortParams;
}

export type CustomCellType = {
    cellValue: number;
    tooltipValue: number;
};

export interface ValidationError {
    error: string;
}
export type CustomAggridValue = boolean | string | number | CustomCellType | ValidationError;

export interface CustomColDef<
    TData = any,
    F extends CustomAggridFilterParams = CustomAggridFilterParams,
> extends ColDef<TData, CustomAggridValue> {
    colId: string;
    context?: ColumnContext<F>;
}
