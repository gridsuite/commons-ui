/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useCallback, useEffect, useState } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { Box, useTheme } from '@mui/material';
import type { CellEditingStoppedEvent, ColumnState, SortChangedEvent } from 'ag-grid-community';
import { BottomRightButtons } from './BottomRightButtons';
import { FieldConstants } from '../../../../utils/constants/fieldConstants';
import { CustomAGGrid, type CustomAGGridProps } from '../../../customAGGrid';

const style = (customProps: any) => ({
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

export type CustomAgGridTableProps = Required<
    Pick<
        CustomAGGridProps,
        | 'columnDefs'
        | 'defaultColDef'
        | 'pagination'
        | 'paginationPageSize'
        | 'alwaysShowVerticalScroll'
        | 'stopEditingWhenCellsLoseFocus'
    >
> &
    Pick<CustomAGGridProps, 'rowSelection' | 'overrideLocales'> & {
        name: string;
        makeDefaultRowData: any;
        csvProps: unknown;
        cssProps: unknown;
    };

export function CustomAgGridTable({
    name,
    makeDefaultRowData,
    csvProps,
    cssProps,
    rowSelection,
    ...props
}: Readonly<CustomAgGridTableProps>) {
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
                    rowDragEntireRow
                    rowDragManaged
                    onRowDragEnd={(e) => move(getIndex(e.node.data), e.overIndex)}
                    detailRowAutoHeight
                    onSelectionChanged={() => {
                        setSelectedRows(gridApi.api.getSelectedRows());
                    }}
                    onRowDataUpdated={newRowAdded ? onRowDataUpdated : undefined}
                    onCellEditingStopped={onCellEditingStopped}
                    onSortChanged={onSortChanged}
                    getRowId={(row) => row.data[FieldConstants.AG_GRID_ROW_UUID]}
                    theme="legacy"
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
