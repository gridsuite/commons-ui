/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { forwardRef, useCallback, useEffect, useImperativeHandle, useState } from 'react';
import { type FieldValues, useFieldArray, type UseFieldArrayReturn, useFormContext } from 'react-hook-form';
import { Box, useTheme } from '@mui/material';
import type { CellEditingStoppedEvent, ColumnState, SortChangedEvent } from 'ag-grid-community';
import { BottomTableButtons } from './BottomTableButtons';
import { type CsvProps, hasNonEmptyRows } from './agGridTable-utils';
import { FieldConstants } from '../../../utils';
import { CustomAGGrid, type CustomAGGridProps } from '../customAGGrid';

const style = (customProps: any) => ({
    grid: (theme: any) => ({
        width: 'auto',
        height: '100%',

        // overrides the default computed max height for ag grid default selector editor to make it more usable
        // can be removed if a custom selector editor is implemented
        '& .ag-select-list': {
            maxHeight: '300px !important',
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
        // Color the checkbox (checked & indeterminate) grey instead of AG Grid's default accent (blue).
        '& .ag-checkbox-input-wrapper.ag-checked::after, & .ag-checkbox-input-wrapper.ag-indeterminate::after': {
            color: `${theme.palette.text.secondary}`,
        },
        '& .Mui-focused .MuiOutlinedInput-root': {
            // borders moves row height
            outline: 'var(--ag-borders-input) var(--ag-input-focus-border-color)',
            outlineOffset: '-1px',
            backgroundColor: theme.agGridBackground.color,
        },
        // The selection column carries the row-drag handle on each row (see selectionColumnDef).
        // Nudge the row checkbox slightly to the right, and align the header "select all" checkbox.
        '& .ag-selection-checkbox': {
            marginLeft: '6px',
        },
        '& .ag-header-select-all': {
            marginLeft: '33px',
        },
        ...customProps,
    }),
});

export type CustomAgGridTableProps = Required<Pick<CustomAGGridProps, 'columnDefs'>> &
    Pick<
        CustomAGGridProps,
        | 'defaultColDef'
        | 'pagination'
        | 'paginationPageSize'
        | 'alwaysShowVerticalScroll'
        | 'stopEditingWhenCellsLoseFocus'
        | 'rowSelection'
        | 'overrideLocales'
        | 'loading'
    > & {
        name: string;
        makeDefaultRowData: any;
        csvProps?: CsvProps;
        cssProps?: unknown;
    };

export const CustomAgGridTable = forwardRef<UseFieldArrayReturn<FieldValues, string>, Readonly<CustomAgGridTableProps>>(
    function CustomAgGridTable(
        { name, makeDefaultRowData, csvProps, cssProps, rowSelection, stopEditingWhenCellsLoseFocus = true, ...props },
        ref
    ) {
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

        useImperativeHandle(ref, () => useFieldArrayOutput, [useFieldArrayOutput]);

        const rowData = watch(name);

        const hasTableData = hasNonEmptyRows(rowData);

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
                <Box className={theme.aggrid.theme} sx={style(cssProps).grid}>
                    <CustomAGGrid
                        rowData={rowData}
                        onGridReady={onGridReady}
                        cacheOverflowSize={10}
                        rowSelection={rowSelection ?? 'multiple'}
                        selectionColumnDef={{ rowDrag: true, width: 80, pinned: 'left' }}
                        onRowDragMove={(e) => move(getIndex(e.node.data), e.overIndex)}
                        detailRowAutoHeight
                        onSelectionChanged={() => {
                            setSelectedRows(gridApi.api.getSelectedRows());
                        }}
                        onRowDataUpdated={newRowAdded ? onRowDataUpdated : undefined}
                        onCellEditingStopped={onCellEditingStopped}
                        onSortChanged={onSortChanged}
                        getRowId={(row) => row.data[FieldConstants.AG_GRID_ROW_UUID]}
                        stopEditingWhenCellsLoseFocus={stopEditingWhenCellsLoseFocus}
                        theme="legacy"
                        {...props}
                    />
                </Box>
                <BottomTableButtons
                    name={name}
                    handleAddRow={handleAddRow}
                    handleDeleteRows={handleDeleteRows}
                    handleMoveRowDown={handleMoveRowDown}
                    handleMoveRowUp={handleMoveRowUp}
                    disableUp={noRowSelected || isFirstSelected || isSortApplied}
                    disableDown={noRowSelected || isLastSelected || isSortApplied}
                    disableDelete={noRowSelected}
                    csvProps={csvProps && { ...csvProps, hasTableData }}
                />
            </>
        );
    }
);
