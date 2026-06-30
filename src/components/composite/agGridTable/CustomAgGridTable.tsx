/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { forwardRef, useCallback, useEffect, useImperativeHandle, useState } from 'react';
import { type FieldValues, useFieldArray, type UseFieldArrayReturn, useFormContext } from 'react-hook-form';
import { Box, useTheme } from '@mui/material';
import type {
    CellEditingStoppedEvent,
    ColumnState,
    RowDataUpdatedEvent,
    RowDragCancelEvent,
    RowDragEndEvent,
    RowDragLeaveEvent,
    RowDragMoveEvent,
    SortChangedEvent,
} from 'ag-grid-community';
import { BottomTableButtons } from './BottomTableButtons';
import { type CsvProps } from './agGridTable-utils';
import { FieldConstants, hasNonEmptyRows } from '../../../utils';
import { CustomAGGrid, type CustomAGGridProps } from '../customAGGrid';

const getDropIndicatorPosition = ({ overNode, y }: RowDragMoveEvent | RowDragEndEvent) => {
    if (!overNode) {
        return null;
    }

    const overNodeTop = overNode.rowTop ?? 0;
    const overNodeHeight = overNode.rowHeight ?? 0;
    const overNodeMiddle = overNodeTop + overNodeHeight / 2;
    return y < overNodeMiddle ? 'above' : 'below';
};

const style = (customProps: any) => ({
    grid: (theme: any) => ({
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
    function CustomAgGridTableComponent(
        { name, makeDefaultRowData, csvProps, cssProps, rowSelection, stopEditingWhenCellsLoseFocus = true, ...props },
        ref
    ) {
        // FIXME: right type => Theme -->  not defined there ( gridStudy and gridExplore definition not the same )
        const theme: any = useTheme();
        const [gridApi, setGridApi] = useState<any>(null);
        const [selectedRows, setSelectedRows] = useState<FieldValues[]>([]);
        const [newRowAdded, setNewRowAdded] = useState(false);
        const [isSortApplied, setIsSortApplied] = useState(false);

        const { control, getValues, watch, clearErrors } = useFormContext();
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

        const onRowDataUpdated = (event: RowDataUpdatedEvent) => {
            setNewRowAdded(false);
            // update due to new appended row, let's scroll
            const lastIndex = rowData.length - 1;
            event.api.paginationGoToLastPage();
            event.api.ensureIndexVisible(lastIndex, 'bottom');
        };

        const onCellEditingStopped = useCallback(
            (event: CellEditingStoppedEvent) => {
                const rowIndex = getIndex(event.data);
                if (rowIndex === -1) {
                    return;
                }
                update(rowIndex, event.data);
                // Editing a cell clears any field-level error set on the table (e.g. a CSV import
                // validation error), so the user can recover and submit after correcting a value.
                // TODO remove when yup will be set up for tabular form
                clearErrors(name);
            },
            [getIndex, update, clearErrors, name]
        );

        const onSortChanged = useCallback((event: SortChangedEvent) => {
            const isAnycolumnhasSort = event.api.getColumnState().some((col: ColumnState) => col.sort);
            setIsSortApplied(isAnycolumnhasSort);
        }, []);

        // While dragging the row, the setRowDropPositionIndicator API method is called
        // to display the projected row drop location using a horizontal line indicator.
        // from https://www.ag-grid.com/react-data-grid/row-dragging-unmanaged/#example-events
        const onRowDragMove = useCallback((event: RowDragMoveEvent) => {
            const { api, overNode } = event;
            const dropIndicatorPosition = getDropIndicatorPosition(event);

            if (!overNode || !dropIndicatorPosition) {
                api.setRowDropPositionIndicator(null);
                return;
            }

            api.setRowDropPositionIndicator({
                row: overNode,
                dropIndicatorPosition,
            });
        }, []);

        const onRowDragEnd = useCallback(
            (event: RowDragEndEvent) => {
                const { api, node, overNode } = event;
                api.setRowDropPositionIndicator(null);

                const dropIndicatorPosition = getDropIndicatorPosition(event);
                if (!overNode || !dropIndicatorPosition) {
                    return;
                }

                const rowIndex = getIndex(node.data);
                const overIndex = getIndex(overNode.data);

                if (rowIndex === -1 || overIndex === -1 || rowIndex === overIndex) {
                    return;
                }

                const insertionIndex = dropIndicatorPosition === 'above' ? overIndex : overIndex + 1;
                const targetIndex = rowIndex < insertionIndex ? insertionIndex - 1 : insertionIndex;

                if (rowIndex !== targetIndex) {
                    move(rowIndex, targetIndex);
                }
            },
            [getIndex, move]
        );

        const clearRowDropPositionIndicator = useCallback(({ api }: RowDragLeaveEvent | RowDragCancelEvent) => {
            api.setRowDropPositionIndicator(null);
        }, []);

        return (
            <>
                <Box className={theme.aggrid.theme} sx={style(cssProps).grid}>
                    <CustomAGGrid
                        rowData={rowData}
                        onGridReady={onGridReady}
                        cacheOverflowSize={10}
                        rowSelection={rowSelection ?? { mode: 'multiRow' }}
                        selectionColumnDef={{ rowDrag: true, width: 80, pinned: 'left' }}
                        onRowDragMove={onRowDragMove}
                        onRowDragEnd={onRowDragEnd}
                        onRowDragLeave={clearRowDropPositionIndicator}
                        onRowDragCancel={clearRowDropPositionIndicator}
                        detailRowAutoHeight
                        onSelectionChanged={(event) => {
                            setSelectedRows(event.api.getSelectedRows());
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
