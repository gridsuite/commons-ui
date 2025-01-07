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
import { Box, useTheme } from '@mui/material';
import { useIntl } from 'react-intl';
import { CellEditingStoppedEvent, ColumnState, SortChangedEvent } from 'ag-grid-community';
import { BottomRightButtons } from './BottomRightButtons';
import { FieldConstants } from '../../../../utils/constants/fieldConstants';
import type { MuiStyle, MuiStyleObj } from '../../../../utils';

export const ROW_DRAGGING_SELECTION_COLUMN_DEF = [
    {
        rowDrag: true,
        headerCheckboxSelection: true,
        checkboxSelection: true,
        maxWidth: 50,
    },
];

const style =
    (customProps: MuiStyleObj = {}): MuiStyle =>
    (theme) => ({
        width: 'auto',
        height: '100%',
        position: 'relative',

        // - AG Grid colors override -
        // It shouldn't be exactly like this, but I couldn't make it works otherwise
        // https://www.ag-grid.com/react-data-grid/global-style-customisation/
        '--ag-alpine-active-color': `${theme.palette.primary.main} !important`,
        '--ag-checkbox-indeterminate-color': `${theme.palette.primary.main} !important`,
        '--ag-background-color': `${theme.aggrid.background.color} !important`,
        '--ag-header-background-color': `${theme.aggrid.background.color} !important`,
        '--ag-odd-row-background-color': `${theme.aggrid.background.color} !important`,
        '--ag-modal-overlay-background-color': `${theme.aggrid.background.color} !important`,
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
            backgroundColor: theme.aggrid.background.color,
        },
        '& .Mui-focused .MuiOutlinedInput-root': {
            // borders moves row height
            outline: 'var(--ag-borders-input) var(--ag-input-focus-border-color)',
            outlineOffset: '-1px',
            backgroundColor: theme.aggrid.background.color,
        },
        ...customProps,
    });

export interface CustomAgGridTableProps {
    name: string;
    columnDefs: any;
    makeDefaultRowData: any;
    csvProps: unknown;
    cssProps?: MuiStyleObj;
    defaultColDef: unknown;
    pagination: boolean;
    paginationPageSize: number;
    suppressRowClickSelection: boolean;
    alwaysShowVerticalScroll: boolean;
    stopEditingWhenCellsLoseFocus: boolean;
}

export function CustomAgGridTable({
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
    ...props
}: CustomAgGridTableProps) {
    // FIXME: right type => Theme -->  not defined there ( gridStudy and gridExplore definition not the same )
    const theme: any = useTheme();
    const [gridApi, setGridApi] = useState<any>(null);
    const [selectedRows, setSelectedRows] = useState([]);
    const [newRowAdded, setNewRowAdded] = useState(false);
    const [isSortApplied, setIsSortApplied] = useState(false);

    const { control, getValues, watch } = useFormContext();
    const useFieldArrayOutput = useFieldArray({
        control,
        name,
    });
    const { append, remove, update, swap, move } = useFieldArrayOutput;

    const rowData = watch(name);

    const isFirstSelected = Boolean(
        rowData?.length && gridApi?.api.getRowNode(rowData[0][FieldConstants.AG_GRID_ROW_UUID])?.isSelected()
    );

    const isLastSelected = Boolean(
        rowData?.length &&
            gridApi?.api.getRowNode(rowData[rowData.length - 1][FieldConstants.AG_GRID_ROW_UUID])?.isSelected()
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

    const handleMoveRowUp = () => {
        selectedRows
            .map((row) => getIndex(row))
            .sort((n1, n2) => n1 - n2)
            .forEach((idx) => {
                swap(idx, idx - 1);
            });
    };

    const handleMoveRowDown = () => {
        selectedRows
            .map((row) => getIndex(row))
            .sort((n1, n2) => n1 - n2)
            .reverse()
            .forEach((idx) => {
                swap(idx, idx + 1);
            });
    };

    const handleDeleteRows = () => {
        if (selectedRows.length === rowData.length) {
            remove();
        } else {
            selectedRows.forEach((val) => {
                const idx = getIndex(val);
                remove(idx);
            });
        }
    };

    useEffect(() => {
        if (gridApi) {
            gridApi.api.refreshCells({
                force: true,
            });
        }
    }, [gridApi, rowData]);

    const handleAddRow = () => {
        append(makeDefaultRowData());
        setNewRowAdded(true);
    };

    useEffect(() => {
        if (gridApi) {
            gridApi.api.sizeColumnsToFit();
        }
    }, [columnDefs, gridApi]);

    const intl = useIntl();
    const getLocaleText = useCallback(
        (params: any) => {
            const key = `agGrid.${params.key}`;
            return intl.messages[key] || params.defaultValue;
        },
        [intl]
    );

    const onGridReady = (params: any) => {
        setGridApi(params);
    };

    const onRowDataUpdated = () => {
        setNewRowAdded(false);
        if (gridApi?.api) {
            // update due to new appended row, let's scroll
            const lastIndex = rowData.length - 1;
            gridApi.api.paginationGoToLastPage();
            gridApi.api.ensureIndexVisible(lastIndex, 'bottom');
        }
    };

    const onCellEditingStopped = useCallback(
        (event: CellEditingStoppedEvent) => {
            const rowIndex = getIndex(event.data);
            if (rowIndex === -1) {
                return;
            }
            update(rowIndex, event.data);
        },
        [getIndex, update]
    );

    const onSortChanged = useCallback((event: SortChangedEvent) => {
        const isAnycolumnhasSort = event.api.getColumnState().some((col: ColumnState) => col.sort);
        setIsSortApplied(isAnycolumnhasSort);
    }, []);

    return (
        <>
            <Box className={theme.aggrid.theme} sx={style(cssProps)}>
                <AgGridReact
                    rowData={rowData}
                    onGridReady={onGridReady}
                    getLocaleText={getLocaleText}
                    cacheOverflowSize={10}
                    rowSelection="multiple"
                    rowDragEntireRow
                    rowDragManaged
                    onRowDragEnd={(e) => move(getIndex(e.node.data), e.overIndex)}
                    suppressBrowserResizeObserver
                    columnDefs={columnDefs}
                    detailRowAutoHeight
                    onSelectionChanged={() => {
                        setSelectedRows(gridApi.api.getSelectedRows());
                    }}
                    onRowDataUpdated={newRowAdded ? onRowDataUpdated : undefined}
                    onCellEditingStopped={onCellEditingStopped}
                    onSortChanged={onSortChanged}
                    getRowId={(row) => row.data[FieldConstants.AG_GRID_ROW_UUID]}
                    pagination={pagination}
                    paginationPageSize={paginationPageSize}
                    suppressRowClickSelection={suppressRowClickSelection}
                    alwaysShowVerticalScroll={alwaysShowVerticalScroll}
                    stopEditingWhenCellsLoseFocus={stopEditingWhenCellsLoseFocus}
                    {...props}
                />
            </Box>
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
        </>
    );
}
