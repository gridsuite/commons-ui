/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useCallback, useEffect, useState } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { Grid, useTheme } from '@mui/material';
import { useIntl } from 'react-intl';
import { ColDef, GridApi, GridOptions } from 'ag-grid-community';
import BottomRightButtons, { BottomRightButtonsProps } from './BottomRightButtons';
import FieldConstants from '../../../../utils/constants/fieldConstants';

type AgGridFn<TFn extends keyof GridOptions, TData> = NonNullable<GridOptions<TData>[TFn]>;

export const ROW_DRAGGING_SELECTION_COLUMN_DEF = [
    {
        rowDrag: true,
        headerCheckboxSelection: true,
        checkboxSelection: true,
        maxWidth: 50,
    },
] as const satisfies Readonly<ColDef[]>;

const style = (customProps: object = {}) => ({
    grid: (theme: any) => ({
        width: 'auto',
        height: '100%',
        position: 'relative',

        // - AG Grid colors override -
        // It shouldn't be exactly like this, but I couldn't make it works otherwise
        // https://www.ag-grid.com/react-data-grid/global-style-customisation/
        '--ag-alpine-active-color': `${theme.palette.primary.main} !important`,
        '--ag-checkbox-indeterminate-color': `${theme.palette.primary.main} !important`,
        '--ag-background-color': `${theme.agGridBackground.color} !important`,
        '--ag-header-background-color': `${theme.agGridBackground.color} !important`,
        '--ag-odd-row-background-color': `${theme.agGridBackground.color} !important`,
        '--ag-modal-overlay-background-color': `${theme.agGridBackground.color} !important`,
        '--ag-selected-row-background-color': 'transparent !important',
        '--ag-range-selection-border-color': 'transparent !important',

        // overrides the default computed max height for ag grid default selector editor to make it more usable
        // can be removed if a custom selector editor is implemented
        '& .ag-select-list': {
            maxHeight: '300px !important',
        },
        '& .ag-root-wrapper-body': {
            maxHeight: '500px',
        },
        '& .ag-cell': {
            boxShadow: 'none',
        },
        '& .ag-cell-edit-wrapper': {
            height: 'inherit',
        },
        '& .ag-row-hover': {
            cursor: 'text',
        },
        '& .ag-overlay-loading-center': {
            border: 'none',
            boxShadow: 'none',
        },
        '& .numeric-input': {
            fontSize: 'calc(var(--ag-font-size) + 1px)',
            paddingLeft: 'calc(var(--ag-cell-horizontal-padding) - 1px)',
            width: '100%',
            height: '100%',
            border: 'inherit',
            outline: 'inherit',
            backgroundColor: theme.agGridBackground.color,
        },
        '& .Mui-focused .MuiOutlinedInput-root': {
            // borders moves row height
            outline: 'var(--ag-borders-input) var(--ag-input-focus-border-color)',
            outlineOffset: '-1px',
            backgroundColor: theme.agGridBackground.color,
        },
        ...customProps,
    }),
});

export interface CustomAgGridTableProps<TData, TValue> {
    name: string;
    columnDefs: ColDef<TData, TValue>[];
    makeDefaultRowData: () => unknown;
    csvProps: BottomRightButtonsProps['csvProps'];
    cssProps?: object;
    defaultColDef: GridOptions<TData>['defaultColDef'];
    pagination: boolean;
    paginationPageSize: number;
    suppressRowClickSelection: boolean;
    alwaysShowVerticalScroll: boolean;
    stopEditingWhenCellsLoseFocus: boolean;
}

// TODO: rename ContingencyAgGridTable
// TODO: used only once in gridexplore, move to gridexplore?
function CustomAgGridTable<TData = unknown, TValue = unknown>({
    name,
    columnDefs,
    makeDefaultRowData,
    csvProps,
    cssProps,
    defaultColDef,
    pagination,
    paginationPageSize,
    suppressRowClickSelection,
    alwaysShowVerticalScroll,
    stopEditingWhenCellsLoseFocus,
}: Readonly<CustomAgGridTableProps<TData, TValue>>) {
    const theme: any = useTheme();
    const [gridApi, setGridApi] = useState<GridApi<TData>>();
    const [selectedRows, setSelectedRows] = useState<TData[]>([]);
    const [newRowAdded, setNewRowAdded] = useState(false);
    const [isSortApplied, setIsSortApplied] = useState(false);

    const { control, getValues, watch } = useFormContext();
    const useFieldArrayOutput = useFieldArray({
        control,
        name,
    });
    const { append, remove, update, swap, move } = useFieldArrayOutput;

    const rowData = watch(name); // TODO: use correct types for useFormContext<...>()

    const isFirstSelected = Boolean(
        rowData?.length && gridApi?.getRowNode(rowData[0][FieldConstants.AG_GRID_ROW_UUID])?.isSelected()
    );

    const isLastSelected = Boolean(
        rowData?.length &&
            gridApi?.getRowNode(rowData[rowData.length - 1][FieldConstants.AG_GRID_ROW_UUID])?.isSelected()
    );

    const noRowSelected = selectedRows.length === 0;

    const getIndex = useCallback(
        (val: any) => {
            return getValues(name).findIndex(
                (row: any) => row[FieldConstants.AG_GRID_ROW_UUID] === val[FieldConstants.AG_GRID_ROW_UUID]
            );
        },
        [getValues, name]
    );

    const handleMoveRowUp = useCallback(() => {
        selectedRows
            .map(getIndex)
            .sort()
            .forEach((idx) => {
                swap(idx, idx - 1);
            });
    }, [getIndex, selectedRows, swap]);

    const handleMoveRowDown = useCallback(() => {
        selectedRows
            .map(getIndex)
            .sort()
            .reverse()
            .forEach((idx) => {
                swap(idx, idx + 1);
            });
    }, [getIndex, selectedRows, swap]);

    const handleDeleteRows = useCallback(() => {
        if (selectedRows.length === rowData.length) {
            remove();
        } else {
            selectedRows.forEach((val) => {
                const idx = getIndex(val);
                remove(idx);
            });
        }
    }, [getIndex, remove, rowData.length, selectedRows]);

    const handleAddRow = useCallback(() => {
        append(makeDefaultRowData());
        setNewRowAdded(true);
    }, [append, makeDefaultRowData]);

    useEffect(() => {
        gridApi?.refreshCells({
            force: true,
        });
    }, [gridApi, rowData]);

    useEffect(() => {
        gridApi?.sizeColumnsToFit();
    }, [columnDefs, gridApi]);

    const intl = useIntl();
    const getLocaleText = useCallback<AgGridFn<'getLocaleText', TData>>(
        (params) => intl.formatMessage({ id: `agGrid.${params.key}`, defaultMessage: params.defaultValue }),
        [intl]
    );

    const onGridReady = useCallback<AgGridFn<'onGridReady', TData>>((event) => {
        setGridApi(event.api);
    }, []);

    const onRowDragEnd = useCallback<AgGridFn<'onRowDragEnd', TData>>(
        (e) => move(getIndex(e.node.data), e.overIndex),
        [getIndex, move]
    );

    const onSelectionChanged = useCallback<AgGridFn<'onSelectionChanged', TData>>(
        // @ts-expect-error TODO manage null api case (not possible at runtime?)
        () => setSelectedRows(gridApi.getSelectedRows()),
        [gridApi]
    );

    const onRowDataUpdated = useCallback<AgGridFn<'onRowDataUpdated', TData>>(
        (/* event */) => {
            setNewRowAdded(false);
            if (gridApi) {
                // update due to new appended row, let's scroll
                const lastIndex = rowData.length - 1;
                gridApi.paginationGoToLastPage();
                gridApi.ensureIndexVisible(lastIndex, 'bottom');
            }
        },
        [gridApi, rowData.length]
    );

    const onCellEditingStopped = useCallback<AgGridFn<'onCellEditingStopped', TData>>(
        (event) => {
            const rowIndex = getIndex(event.data);
            if (rowIndex === -1) {
                return;
            }
            update(rowIndex, event.data);
        },
        [getIndex, update]
    );

    const onSortChanged = useCallback<AgGridFn<'onSortChanged', TData>>(
        (event) => setIsSortApplied(event.api.getColumnState().some((col) => col.sort)),
        []
    );

    const getRowId = useCallback<AgGridFn<'getRowId', TData>>(
        // @ts-expect-error: we don't know at compile time if TData has a "FieldConstants.AG_GRID_ROW_UUID" field
        // TODO maybe force TData type to have this field?
        (row) => row.data[FieldConstants.AG_GRID_ROW_UUID],
        []
    );

    return (
        <Grid container spacing={2}>
            <Grid item xs={12} className={theme.aggrid.theme} sx={style(cssProps).grid}>
                <AgGridReact<TData>
                    rowData={rowData}
                    onGridReady={onGridReady}
                    getLocaleText={getLocaleText}
                    cacheOverflowSize={10}
                    rowSelection="multiple"
                    domLayout="autoHeight"
                    rowDragEntireRow
                    rowDragManaged
                    onRowDragEnd={onRowDragEnd}
                    suppressBrowserResizeObserver
                    defaultColDef={defaultColDef}
                    columnDefs={columnDefs}
                    detailRowAutoHeight
                    onSelectionChanged={onSelectionChanged}
                    onRowDataUpdated={newRowAdded ? onRowDataUpdated : undefined}
                    onCellEditingStopped={onCellEditingStopped}
                    onSortChanged={onSortChanged}
                    getRowId={getRowId}
                    pagination={pagination}
                    paginationPageSize={paginationPageSize}
                    suppressRowClickSelection={suppressRowClickSelection}
                    alwaysShowVerticalScroll={alwaysShowVerticalScroll}
                    stopEditingWhenCellsLoseFocus={stopEditingWhenCellsLoseFocus}
                />
            </Grid>
            <BottomRightButtons
                name={name}
                handleAddRow={handleAddRow}
                handleDeleteRows={handleDeleteRows}
                handleMoveRowDown={handleMoveRowDown}
                handleMoveRowUp={handleMoveRowUp}
                disableUp={noRowSelected || isFirstSelected || isSortApplied}
                disableDown={noRowSelected || isLastSelected || isSortApplied}
                disableDelete={noRowSelected}
                csvProps={csvProps}
                useFieldArrayOutput={useFieldArrayOutput}
            />
        </Grid>
    );
}

export default CustomAgGridTable;
