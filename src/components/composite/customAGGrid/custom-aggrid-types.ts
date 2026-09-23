/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { ColDef, ComponentType, GridApi, IFilterOptionDef } from 'ag-grid-community';
import { UUID } from 'crypto';

export enum TableType {
    Loadflow = 'Loadflow',
    SecurityAnalysis = 'SecurityAnalysis',
    SensitivityAnalysis = 'SensitivityAnalysis',
    ShortcircuitAnalysis = 'ShortcircuitAnalysis',
    DynamicSimulation = 'DynamicSimulation',
    Spreadsheet = 'Spreadsheet',
    Logs = 'Logs',
    StateEstimation = 'StateEstimation',
    PccMin = 'PccMin',
    VoltageInit = 'VoltageInit',
    ProcessExecutionHistory = 'ProcessExecutionHistory',
}

// Filter operators

export enum FilterDataTypes {
    TEXT = 'text',
    NUMBER = 'number',
    BOOLEAN = 'boolean',
}

export enum FilterTextComparators {
    EQUALS = 'equals',
    CONTAINS = 'contains',
    STARTS_WITH = 'startsWith',
    IS_EMPTY = 'blank',
    IS_NOT_EMPTY = 'notBlank',
}

export enum FilterNumberComparators {
    EQUALS = 'equals',
    NOT_EQUAL = 'notEqual',
    LESS_THAN_OR_EQUAL = 'lessThanOrEqual',
    GREATER_THAN_OR_EQUAL = 'greaterThanOrEqual',
}

export enum UndisplayedFilterNumberComparators {
    GREATER_THAN = 'greaterThan',
    LESS_THAN = 'lessThan',
}

// Pagination

export type PaginationConfig = {
    page: number;
    rowsPerPage: number | { value: number; label: string };
};

// Filters

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

export type ColumnFilterConfig = Record<string, FilterConfig[]>;

export type TableColumnFilter = Record<string, ColumnFilterConfig>;

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

// Sorting

export enum SortWay {
    ASC = 'asc',
    DESC = 'desc',
}

export type SortConfig = {
    colId: string;
    sort: SortWay;
    children?: boolean;
};

export type TableSortConfig = Record<string, SortConfig[]>;

export type TableSort = Record<string, TableSortConfig>;

export type SortParams = {
    table: string;
    tab: string;
    isChildren?: boolean;
    persistSort?: (api: GridApi, sort: SortConfig) => Promise<void>;
};

// Columns

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
