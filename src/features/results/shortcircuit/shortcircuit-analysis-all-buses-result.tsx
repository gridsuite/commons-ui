/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useCallback, useState } from 'react';
import { DisplayedColumnsChangedEvent, GridReadyEvent, RowDataUpdatedEvent } from 'ag-grid-community';
import {
    SCAFaultResult,
    SCAFeederResult,
    ShortCircuitAnalysisType,
    SCAPagedResults,
} from './shortcircuit-analysis-result.type';
import {
    FetchFilterEnumValuesParams,
    FetchPagedResultsParams,
    ShortCircuitAnalysisResult,
} from './shortcircuit-analysis-result';
import { ShortcircuitColumnFilter } from './shortcircuit-analysis-result-table';
import { ShortcircuitFilterConfig } from './shortcircuit-analysis-result-content';
import { RunningStatus } from '../../../utils';
import { PaginationConfig, SortConfig } from '../../../components';
import { GlobalFilters } from "../../global-filter";

export interface ShortCircuitAnalysisAllBusesResultProps {
    analysisStatus: RunningStatus;
    onGridColumnsChanged: (params: GridReadyEvent) => void;
    onRowDataUpdated: (event: RowDataUpdatedEvent) => void;
    onDisplayedColumnsChanged: (event: DisplayedColumnsChangedEvent) => void;

    // Context
    studyUuid: Parameters<typeof ShortCircuitAnalysisResult>[0]['studyUuid'];
    currentNodeUuid: Parameters<typeof ShortCircuitAnalysisResult>[0]['currentNodeUuid'];
    currentRootNetworkUuid: Parameters<typeof ShortCircuitAnalysisResult>[0]['currentRootNetworkUuid'] | null;

    // Sort / filter / pagination
    sortConfig?: SortConfig[];
    columnFilters?: ShortcircuitColumnFilter[];
    globalFilters?: GlobalFilters;
    pagination: PaginationConfig;
    onPageChange: (newPage: number) => void;
    onRowsPerPageChange: (newRowsPerPage: number) => void;

    // Fetch callbacks
    fetchPagedResults: (params: FetchPagedResultsParams) => Promise<SCAPagedResults | null>;
    fetchFilterEnumValues: (params: FetchFilterEnumValuesParams) => Promise<string[]>;

    // Optional
    mapFieldsToColumnsFilter?: (
        filters: ShortcircuitFilterConfig[],
        mapping: Record<string, string>
    ) => ShortcircuitFilterConfig[];
    onVoltageLevelClick?: (voltageLevelId: string) => void;
    onGridReady?: (params: GridReadyEvent) => void;
}

export function ShortCircuitAnalysisAllBusesResult({
    analysisStatus,
    onGridColumnsChanged,
    onRowDataUpdated,
    onDisplayedColumnsChanged,
    studyUuid,
    currentNodeUuid,
    currentRootNetworkUuid,
    sortConfig,
    columnFilters,
    globalFilters,
    pagination,
    onPageChange,
    onRowsPerPageChange,
    fetchPagedResults,
    fetchFilterEnumValues,
    mapFieldsToColumnsFilter,
    onVoltageLevelClick,
    onGridReady,
}: ShortCircuitAnalysisAllBusesResultProps) {
    const [result, setResult] = useState<SCAFaultResult[] | undefined>(undefined);

    const updateResult = useCallback((results: SCAFaultResult[] | SCAFeederResult[] | null) => {
        setResult((results as SCAFaultResult[]) ?? undefined);
    }, []);

    return (
        <ShortCircuitAnalysisResult
            analysisType={ShortCircuitAnalysisType.ALL_BUSES}
            analysisStatus={analysisStatus}
            result={result}
            updateResult={updateResult}
            customTablePaginationProps={{
                labelRowsPerPageId: 'muiTablePaginationLabelRowsPerPageAllBusesSCA',
            }}
            onGridColumnsChanged={onGridColumnsChanged}
            onRowDataUpdated={onRowDataUpdated}
            onDisplayedColumnsChanged={onDisplayedColumnsChanged}
            studyUuid={studyUuid}
            currentNodeUuid={currentNodeUuid}
            currentRootNetworkUuid={currentRootNetworkUuid}
            sortConfig={sortConfig}
            columnFilters={columnFilters}
            globalFilters={globalFilters}
            pagination={pagination}
            onPageChange={onPageChange}
            onRowsPerPageChange={onRowsPerPageChange}
            fetchPagedResults={fetchPagedResults}
            fetchFilterEnumValues={fetchFilterEnumValues}
            mapFieldsToColumnsFilter={mapFieldsToColumnsFilter}
            onVoltageLevelClick={onVoltageLevelClick}
            onGridReady={onGridReady}
        />
    );
}
