/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { UUID } from 'node:crypto';
import { useCallback, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { Box, LinearProgress } from '@mui/material';
import { DisplayedColumnsChangedEvent, GridReadyEvent, RowDataUpdatedEvent } from 'ag-grid-community';
import { RESULTS_LOADING_DELAY } from '../constants';
import {
    convertFilterValues,
    FROM_COLUMN_TO_FIELD,
    FROM_COLUMN_TO_FIELD_ONE_BUS,
    ShortcircuitFilterConfig,
} from './shortcircuit-analysis-result-content';
import {
    SCAFaultResult,
    SCAFeederResult,
    SCAPagedResults,
    ShortCircuitAnalysisType,
} from './shortcircuit-analysis-result.type';
import {
    FilterEnumsType,
    ShortCircuitAnalysisResultTable,
    ShortcircuitColumnFilter,
} from './shortcircuit-analysis-result-table';
import { useOpenLoaderShortWait, useSnackMessage } from '../../../hooks';
import { ComputingType, RunningStatus, snackWithFallback } from '../../../utils';
import { CustomTablePagination, PaginationConfig, SortConfig } from '../../../components';
import { PAGE_OPTIONS } from '../common/utils';
import { GlobalFilters } from '../common/global-filter.type';

export type FetchPagedResultsParams = {
    studyUuid: UUID | null;
    currentNodeUuid: UUID | undefined;
    currentRootNetworkUuid: UUID;
    type: ShortCircuitAnalysisType;
    selector: {
        page: number;
        size: number;
        filter: ShortcircuitFilterConfig[] | null;
        sort: SortConfig[] | null | undefined;
    };
    globalFilters?: GlobalFilters;
};

export type FetchFilterEnumValuesParams = {
    studyUuid: UUID;
    currentNodeUuid: UUID;
    currentRootNetworkUuid: UUID;
    computingType: ComputingType;
    filterType: string;
};

export interface IShortCircuitAnalysisGlobalResultProps {
    analysisType: ShortCircuitAnalysisType;
    analysisStatus: RunningStatus;
    result: SCAFaultResult[] | undefined;
    updateResult: (result: SCAFaultResult[] | SCAFeederResult[] | null) => void;
    customTablePaginationProps?: any;
    onGridColumnsChanged: (params: GridReadyEvent) => void;
    onRowDataUpdated: (event: RowDataUpdatedEvent) => void;
    onDisplayedColumnsChanged: (event: DisplayedColumnsChangedEvent) => void;

    // Context passed from outside (replacing Redux)
    studyUuid: UUID | null;
    currentNodeUuid: UUID | null | undefined;
    currentRootNetworkUuid: UUID | null | undefined;

    // Sort and filter configs passed from outside (replacing Redux)
    sortConfig?: SortConfig[];
    columnFilters?: ShortcircuitColumnFilter[];
    globalFilters?: GlobalFilters;
    pagination: PaginationConfig;
    onPageChange: (newPage: number) => void;
    onRowsPerPageChange: (newRowsPerPage: number) => void;

    // Fetch callbacks (no fetch inside the component)
    fetchPagedResults: (params: FetchPagedResultsParams) => Promise<SCAPagedResults | null>;
    fetchFilterEnumValues: (params: FetchFilterEnumValuesParams) => Promise<string[]>;

    // Optional: map field name to column filter
    mapFieldsToColumnsFilter?: (
        filters: ShortcircuitFilterConfig[],
        mapping: Record<string, string>
    ) => ShortcircuitFilterConfig[];

    // Optional: callback for voltage level click
    onVoltageLevelClick?: (voltageLevelId: string) => void;
    // Optional: callback for initial column filters on grid ready
    onGridReady?: (params: GridReadyEvent) => void;
}

export function ShortCircuitAnalysisResult({
    analysisType,
    analysisStatus,
    result,
    updateResult,
    customTablePaginationProps,
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
}: IShortCircuitAnalysisGlobalResultProps) {
    const intl = useIntl();
    const { snackError } = useSnackMessage();

    const [count, setCount] = useState<number>(0);
    const [isFetching, setIsFetching] = useState<boolean>(false);
    const [filterEnums, setFilterEnums] = useState<FilterEnumsType>({});

    const isOneBusShortCircuitAnalysisType = analysisType === ShortCircuitAnalysisType.ONE_BUS;

    const fromFrontColumnToBackKeys = isOneBusShortCircuitAnalysisType
        ? FROM_COLUMN_TO_FIELD_ONE_BUS
        : FROM_COLUMN_TO_FIELD;

    const { page, rowsPerPage } = pagination;

    const handleChangePage = useCallback(
        (_: any, newPage: number) => {
            onPageChange(newPage);
        },
        [onPageChange]
    );

    const handleChangeRowsPerPage = useCallback(
        (event: any) => {
            const newRowsPerPage = parseInt(event.target.value, 10);
            onRowsPerPageChange(newRowsPerPage);
        },
        [onRowsPerPageChange]
    );

    // Effects
    useEffect(() => {
        if (analysisStatus !== RunningStatus.SUCCEED) {
            return;
        }
        if (!currentNodeUuid || !currentRootNetworkUuid) {
            return;
        }
        let active = true;
        setIsFetching(true);
        updateResult(null);

        const backSortConfig = sortConfig?.map((sort) => ({
            ...sort,
            colId: fromFrontColumnToBackKeys[sort.colId],
        }));

        const updatedFilters = columnFilters ? convertFilterValues(columnFilters as ShortcircuitFilterConfig[]) : null;

        const selector = {
            page,
            size: rowsPerPage as number,
            filter:
                updatedFilters && mapFieldsToColumnsFilter
                    ? mapFieldsToColumnsFilter(updatedFilters, fromFrontColumnToBackKeys)
                    : updatedFilters,
            sort: backSortConfig,
        };

        fetchPagedResults({
            studyUuid,
            currentNodeUuid,
            currentRootNetworkUuid,
            type: analysisType,
            selector,
            globalFilters,
        })
            .then((pagedResult: SCAPagedResults | null) => {
                if (active) {
                    const { content = [], totalElements = 0 } = (pagedResult as any) || {};
                    updateResult(content);
                    setCount(totalElements);
                }
            })
            .catch((error) => snackWithFallback(snackError, error, { headerId: 'ShortCircuitAnalysisResultsError' }))
            .finally(() => {
                if (active) {
                    setIsFetching(false);
                }
            });

        // eslint-disable-next-line consistent-return
        return () => {
            active = false;
        };
    }, [
        page,
        rowsPerPage,
        snackError,
        analysisType,
        analysisStatus,
        updateResult,
        studyUuid,
        currentNodeUuid,
        currentRootNetworkUuid,
        intl,
        columnFilters,
        sortConfig,
        fromFrontColumnToBackKeys,
        globalFilters,
        fetchPagedResults,
        mapFieldsToColumnsFilter,
    ]);

    useEffect(() => {
        if (analysisStatus !== RunningStatus.SUCCEED || !studyUuid || !currentNodeUuid || !currentRootNetworkUuid) {
            return;
        }

        const allBusesFilterTypes = ['fault-types', 'limit-violation-types'];
        const oneBusFilterTypes = ['branch-sides'];
        const currentComputingType = isOneBusShortCircuitAnalysisType
            ? ComputingType.SHORT_CIRCUIT_ONE_BUS
            : ComputingType.SHORT_CIRCUIT;

        const filterTypes = isOneBusShortCircuitAnalysisType ? oneBusFilterTypes : allBusesFilterTypes;

        const promises = filterTypes.map((filterType) =>
            fetchFilterEnumValues({
                studyUuid,
                currentNodeUuid,
                currentRootNetworkUuid,
                computingType: currentComputingType,
                filterType,
            })
        );

        Promise.all(promises)
            .then((results) => {
                if (isOneBusShortCircuitAnalysisType) {
                    const [branchSidesResult] = results;
                    setFilterEnums({
                        side: branchSidesResult,
                    });
                } else {
                    const [faultTypesResult, limitViolationTypesResult] = results;
                    setFilterEnums({
                        limitType: limitViolationTypesResult,
                        faultType: faultTypesResult,
                    });
                }
            })
            .catch((error) => snackWithFallback(snackError, error, { headerId: 'ShortCircuitAnalysisResultsError' }));
    }, [
        analysisStatus,
        intl,
        snackError,
        isOneBusShortCircuitAnalysisType,
        studyUuid,
        currentNodeUuid,
        currentRootNetworkUuid,
        fetchFilterEnumValues,
    ]);

    const openLoader = useOpenLoaderShortWait({
        isLoading: analysisStatus === RunningStatus.RUNNING || isFetching,
        delay: RESULTS_LOADING_DELAY,
    });

    return (
        <>
            <Box sx={{ height: '4px' }}>{openLoader && <LinearProgress />}</Box>
            <ShortCircuitAnalysisResultTable
                result={result}
                analysisType={analysisType}
                isFetching={isFetching}
                filterEnums={filterEnums}
                onDisplayedColumnsChanged={onDisplayedColumnsChanged}
                onRowDataUpdated={onRowDataUpdated}
                shortCircuitAnalysisStatus={analysisStatus}
                columnFilters={columnFilters}
                onGridReady={onGridReady ?? onGridColumnsChanged}
                onVoltageLevelClick={onVoltageLevelClick}
            />
            <CustomTablePagination
                rowsPerPageOptions={PAGE_OPTIONS}
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
