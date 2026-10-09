/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useCallback } from 'react';
import { Box, LinearProgress } from '@mui/material';
import { DisplayedColumnsChangedEvent, GridReadyEvent, RowDataUpdatedEvent } from 'ag-grid-community';
import { RESULTS_LOADING_DELAY } from '../constants';
import { SCAFaultResult, SCAFeederResult, ShortCircuitAnalysisType } from './shortcircuit-analysis-result.type';
import {
    FilterEnumsType,
    ShortCircuitAnalysisResultTable,
    ShortcircuitColumnFilter,
} from './shortcircuit-analysis-result-table';
import { useOpenLoaderShortWait } from '../../../hooks';
import { RunningStatus } from '../../../utils';
import { CustomTablePagination } from '../../../components';
import { RESULT_PAGE_OPTIONS } from '../common/utils';
import { ResultsPaginationInput } from '../common/types';

export interface ShortCircuitAnalysisResultViewProps {
    analysisType: ShortCircuitAnalysisType;
    result: SCAFaultResult[] | SCAFeederResult[] | undefined;
    analysisStatus: RunningStatus;
    isFetching: boolean;
    pagination: ResultsPaginationInput;
    filterEnums: FilterEnumsType;
    columnFilters?: ShortcircuitColumnFilter[];
    onRowDataUpdated: (event: RowDataUpdatedEvent) => void;
    onDisplayedColumnsChanged: (event: DisplayedColumnsChangedEvent) => void;
    onVoltageLevelClick?: (voltageLevelId: string) => void;
    onGridReady: (params: GridReadyEvent) => void;
    customTablePaginationProps?: Record<string, unknown>;
}

export function ShortCircuitAnalysisResultView({
    analysisType,
    result,
    analysisStatus,
    isFetching,
    pagination,
    filterEnums,
    columnFilters,
    onRowDataUpdated,
    onDisplayedColumnsChanged,
    onVoltageLevelClick,
    onGridReady,
    customTablePaginationProps,
}: ShortCircuitAnalysisResultViewProps) {
    const { count, page, rowsPerPage, onPageChange, onRowsPerPageChange } = pagination;

    const handleChangePage = useCallback(
        (_: React.MouseEvent<HTMLButtonElement, MouseEvent> | null, newPage: number) => {
            onPageChange(_, newPage);
        },
        [onPageChange]
    );

    const handleChangeRowsPerPage = useCallback(
        (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            onRowsPerPageChange(event);
        },
        [onRowsPerPageChange]
    );

    const openLoader = useOpenLoaderShortWait({
        isLoading: analysisStatus === RunningStatus.RUNNING || isFetching,
        delay: RESULTS_LOADING_DELAY,
    });

    return (
        <>
            <Box sx={{ height: '4px' }}>{openLoader && <LinearProgress />}</Box>
            <ShortCircuitAnalysisResultTable
                result={result as SCAFaultResult[] | undefined}
                analysisType={analysisType}
                isFetching={isFetching}
                filterEnums={filterEnums}
                columnFilters={columnFilters}
                onDisplayedColumnsChanged={onDisplayedColumnsChanged}
                onRowDataUpdated={onRowDataUpdated}
                shortCircuitAnalysisStatus={analysisStatus}
                onGridReady={onGridReady}
                onVoltageLevelClick={onVoltageLevelClick}
            />
            <CustomTablePagination
                rowsPerPageOptions={RESULT_PAGE_OPTIONS}
                count={count}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                {...customTablePaginationProps}
            />
        </>
    );
}
