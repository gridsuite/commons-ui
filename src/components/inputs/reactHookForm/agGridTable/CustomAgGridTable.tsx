/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useCallback, useEffect, useState } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { type SxProps, type Theme as MuiTheme } from '@mui/material';
import { useIntl } from 'react-intl';
import {
    type CellEditingStoppedEvent,
    type ColumnState,
    createPart,
    type SortChangedEvent,
    type ThemeDefaultParams,
} from 'ag-grid-community';
import { BottomRightButtons } from './BottomRightButtons';
import { FieldConstants } from '../../../../utils/constants/fieldConstants';
import { CustomAGGrid, type CustomAgGridProps, type ExtendAgGridTheme } from '../../../customAGGrid';
import css from './CustomAgGridTable.css?inline';

export type CustomAgGridTableProps = CustomAgGridProps & {
    name: string;
    makeDefaultRowData: any;
    csvProps: unknown;
    cssProps?: SxProps<MuiTheme>;
};

export function CustomAgGridTable({
    name,
    columnDefs,
    makeDefaultRowData,
    csvProps,
    cssProps,
    pagination,
    paginationPageSize,
    rowSelection,
    alwaysShowVerticalScroll,
    stopEditingWhenCellsLoseFocus,
    ...props
}: Readonly<CustomAgGridTableProps>) {
    const [gridApi, setGridApi] = useState<any>(null);
    const [selectedRows, setSelectedRows] = useState([]);
    const [newRowAdded, setNewRowAdded] = useState(false);
    const [isSortApplied, setIsSortApplied] = useState(false);

    const customizeGridTheme = useCallback<ExtendAgGridTheme<ThemeDefaultParams>>((agTheme, muiTheme) => {
        // - AG Grid colors override -
        // It shouldn't be exactly like this, but I couldn't make it works otherwise
        // https://www.ag-grid.com/react-data-grid/global-style-customisation/
        const customize = createPart({
            feature: 'CustomAgGridTable',
            params: {
                muiPalettePrimaryMain: muiTheme.palette.primary.main,
                customBackgroundColor:
                    muiTheme.aggrid.defaultParams?.customBackgroundColor ?? muiTheme.palette.background.default,
            },
            css,
        });
        return agTheme.withPart(customize);
    }, []);

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
            <CustomAGGrid
                rowData={rowData}
                onGridReady={onGridReady}
                getLocaleText={getLocaleText}
                cacheOverflowSize={10}
                rowSelection={rowSelection ?? 'multiple'}
                rowDragEntireRow
                rowDragManaged
                onRowDragEnd={(e) => move(getIndex(e.node.data), e.overIndex)}
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
                alwaysShowVerticalScroll={alwaysShowVerticalScroll}
                stopEditingWhenCellsLoseFocus={stopEditingWhenCellsLoseFocus}
                sx={cssProps}
                customizeGridTheme={customizeGridTheme}
                {...props}
            />
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
