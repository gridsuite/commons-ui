/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Key, RefObject, useCallback } from 'react';
import { ColDef, GridReadyEvent, RowClassParams, RowStyle } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import { Box } from '@mui/material';
import { GsLangUser, MuiStyles } from '../../utils';
import { CsvExport, CustomAGGrid } from '../../components';

const styles = {
    gridContainer: {
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
    },
    csvExport: {
        display: 'flex',
        alignItems: 'baseline',
        marginTop: '-45px',
    },
    grid: {
        flexGrow: '1',
    },
} as const satisfies MuiStyles;

export interface RenderTableAndExportCsvProps {
    gridRef: RefObject<AgGridReact | null>;
    columns: ColDef[];
    defaultColDef: ColDef;
    tableName: string;
    rows: any[];
    language: GsLangUser;
    getRowStyle?: (params: RowClassParams) => RowStyle | undefined;
    overlayNoRowsTemplate: string | undefined;
    skipColumnHeaders: boolean;
    exportCsvResetKey?: Key;
    onGridReady?: (params: GridReadyEvent) => void;
}

export function RenderTableAndExportCsv({
    gridRef,
    columns,
    defaultColDef,
    tableName,
    rows,
    language,
    getRowStyle,
    overlayNoRowsTemplate,
    skipColumnHeaders = false,
    exportCsvResetKey,
    onGridReady,
}: RenderTableAndExportCsvProps) {
    const isRowsEmpty = !rows || rows.length === 0;

    const onRowDataUpdated = useCallback((params: any) => {
        if (params.api) {
            params.api.sizeColumnsToFit();
        }
    }, []);

    return (
        <Box sx={styles.gridContainer}>
            <Box sx={styles.csvExport}>
                <Box style={{ flexGrow: 1 }} />
                <CsvExport
                    columns={columns}
                    tableName={tableName}
                    disabled={isRowsEmpty}
                    language={language}
                    skipColumnHeaders={skipColumnHeaders}
                    getData={(params: any) => gridRef.current?.api?.exportDataAsCsv(params)}
                    resetKey={exportCsvResetKey}
                />
            </Box>
            {rows && (
                <Box sx={styles.grid}>
                    <CustomAGGrid
                        ref={gridRef}
                        rowData={rows}
                        defaultColDef={defaultColDef}
                        columnDefs={columns}
                        onRowDataUpdated={onRowDataUpdated}
                        onGridReady={onGridReady}
                        getRowStyle={getRowStyle}
                        overlayNoRowsTemplate={overlayNoRowsTemplate}
                        onModelUpdated={({ api }) => {
                            if (api.getDisplayedRowCount()) {
                                api.hideOverlay();
                            } else {
                                api.showNoRowsOverlay();
                            }
                        }}
                    />
                </Box>
            )}
        </Box>
    );
}
