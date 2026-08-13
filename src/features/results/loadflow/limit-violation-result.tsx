/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useCallback, useMemo, useRef } from 'react';
import { useIntl } from 'react-intl';
import { Box, LinearProgress, useTheme } from '@mui/material';
import { RowClassParams } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import { LimitViolationResultProps } from './load-flow-result.type';
import { RunningStatus } from '../../../utils/running-status';
import { useOpenLoaderShortWait } from '../../../hooks';
import { getRows } from '../../../utils';
import { RESULTS_LOADING_DELAY } from '../constants';
import { DefaultCellRenderer } from '../../../components';
import { getNoRowsMessage } from '../utils';
import { useIntlResultStatusMessages } from '../hooks';
import { RenderTableAndExportCsv } from '../../common';

export function LimitViolationResult({
    result,
    isLoadingResult,
    columnDefs,
    tableName,
    computationStatus,
    exportCsvResetKey,
    language,
    onGridReady,
}: LimitViolationResultProps) {
    const theme = useTheme();
    const intl = useIntl();
    const gridRef = useRef<AgGridReact>(null);

    const openLoaderTab = useOpenLoaderShortWait({
        isLoading: computationStatus === RunningStatus.RUNNING || isLoadingResult,
        delay: RESULTS_LOADING_DELAY,
    });

    const defaultColDef = useMemo(
        () => ({
            filter: true,
            sortable: true,
            resizable: true,
            lockPinned: true,
            suppressMovable: true,
            wrapHeaderText: true,
            autoHeaderHeight: true,
            flex: 1,
            cellRenderer: DefaultCellRenderer,
        }),
        []
    );

    const getRowStyle = useCallback(
        (params: RowClassParams) => {
            if (params?.data?.elementId) {
                return {
                    backgroundColor: theme.selectedRow.background,
                };
            }
            return undefined;
        },
        [theme.selectedRow.background]
    );

    const messages = useIntlResultStatusMessages(intl);
    const overlayNoRowsTemplate = getNoRowsMessage(messages, result, computationStatus, !isLoadingResult);
    const rowsToShow = getRows(result, computationStatus);

    return (
        <>
            <Box sx={{ height: '12px', marginTop: '12px' }}>{openLoaderTab && <LinearProgress />}</Box>
            <RenderTableAndExportCsv
                gridRef={gridRef}
                columns={columnDefs}
                defaultColDef={defaultColDef}
                tableName={tableName}
                rows={rowsToShow}
                getRowStyle={getRowStyle}
                overlayNoRowsTemplate={overlayNoRowsTemplate}
                skipColumnHeaders={false}
                exportCsvResetKey={exportCsvResetKey}
                onGridReady={onGridReady}
                language={language}
            />
        </>
    );
}
