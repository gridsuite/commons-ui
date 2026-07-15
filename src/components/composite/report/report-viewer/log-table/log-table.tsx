/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import { Box, Chip, Theme, useTheme } from '@mui/material';
import { AgGridReact } from 'ag-grid-react';
import {
    GridApi as GridApiType,
    CellClassParams,
    CellClickedEvent,
    ColDef,
    ICellRendererParams,
    RowClassParams,
    RowStyle,
    GridApi,
} from 'ag-grid-community';
import { VisibilityOff as VisibilityOffIcon, Visibility as VisibilityIcon } from '@mui/icons-material';
import { getDefaultSeverityFilter, REPORT_SEVERITY } from '../../report-severity';
import { QuickSearch } from '../../QuickSearch';
import { ComputingAndNetworkModificationType, Log, SelectedReportLog, SeverityLevel } from '../../report.type';
import { reportStyles } from '../../report.styles';
import { useReportFetcherContext, useReportFilterContext } from '../context/report-viewer-context';
import { MuiStyles, SxStyle } from '../../../../../utils';
import {
    CustomAGGrid,
    FilterDataTypes,
    FilterTextComparators,
    MessageLogCellRenderer,
    TableType,
} from '../../../customAGGrid';
import { CustomAggridComparatorFilter } from '../../../customAGGrid/custom-aggrid-filters/custom-aggrid-comparator-filter';
import { makeAgGridCustomHeaderColumn } from '../../../customAGGrid/utils/custom-aggrid-header-utils';
import { FilterConfig } from '../../../customAGGrid/custom-aggrid-types';
import { AGGRID_LOCALES } from '../../../../../translations/not-intl/aggrid-locales';
import { useStableComputedArray } from '../../../../../hooks/use-stable-computed-array';
import { CustomTablePagination } from '../../../../ui';

const getColumnFilterValue = (array: FilterConfig[] | undefined, columnName: string): any =>
    array?.find((item) => item.column === columnName)?.value ?? null;

const applyFiltersToGrid = (api: GridApiType, filters: FilterConfig[] | undefined) => {
    if (!filters?.length) {
        api.setFilterModel(null);
        return;
    }
    const model: Record<string, any> = {};
    filters.forEach((f) => {
        if (Array.isArray(f.value)) {
            model[f.column] = { type: 'text', filterType: 'customInRange', filter: f.value };
        } else {
            model[f.column] = { type: f.type, filterType: f.dataType, filter: f.value };
        }
    });
    api.setFilterModel(model);
    api.onFilterChanged();
};

const chipStyle = (severity: string, severityFilter: string[], theme: Theme) =>
    ({
        backgroundColor: severityFilter.includes(severity)
            ? REPORT_SEVERITY[severity as keyof typeof REPORT_SEVERITY].colorHexCode
            : (theme.severityChip?.disabledColor ?? theme.palette.action.disabledBackground),
        cursor: 'pointer',
        border: `1px solid ${theme.palette.divider}`,
        '&:hover': {
            backgroundColor: theme.alpha(REPORT_SEVERITY[severity as keyof typeof REPORT_SEVERITY].colorHexCode, 0.5),
        },
        '& .MuiChip-deleteIcon': {
            color: theme.palette.text.primary,
            fontSize: '1rem',
        },
        '& .MuiChip-deleteIcon:hover': {
            color: theme.palette.text.primary,
        },
        padding: 0.5,
    }) as const satisfies SxStyle;

const styles = {
    chipContainer: (theme: Theme) => ({
        display: 'flex',
        flexWrap: 'wrap',
        gap: theme.spacing(1),
    }),
    toolContainer: (theme: Theme) => ({
        display: 'flex',
        flexDirection: 'column',
        gap: theme.spacing(1),
        mb: theme.spacing(2),
    }),
} as const satisfies MuiStyles;

const SEVERITY_COLUMN_FIXED_WIDTH = 115;
const PAGE_OPTIONS = [15, 30, 50, 100];

export type LogTableProps = {
    selectedReport: SelectedReportLog;
    reportType: ComputingAndNetworkModificationType;
    severities: SeverityLevel[] | undefined;
    onRowClick: (data: Log | undefined) => void;
    onFiltersChanged: () => void;
    resetFilters?: boolean;
};

function LogTable({
    selectedReport,
    reportType,
    severities,
    onRowClick,
    onFiltersChanged,
    resetFilters = false,
}: Readonly<LogTableProps>) {
    const intl = useIntl();
    const theme = useTheme<Theme>();

    const { fetchLogs, fetchLogMatches } = useReportFetcherContext();
    const { filters, updateFilters, pagination, changePagination } = useReportFilterContext();

    const { page, rowsPerPage } = pagination;

    const [selectedRowIndex, setSelectedRowIndex] = useState<number | null>(-1);
    const [rowData, setRowData] = useState<Log[] | null>(null);
    const [searchMatches, setSearchMatches] = useState<{ rowIndex: number; page: number }[]>([]);
    const [searchResults, setSearchResults] = useState<number[]>([]);
    const [currentResultIndex, setCurrentResultIndex] = useState(-1);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [isGridReady, setIsGridReady] = useState(false);
    const [filtersInitialized, setFiltersInitialized] = useState(false);
    const [count, setCount] = useState<number>(0);

    const gridRef = useRef<AgGridReact>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const pendingScrollRef = useRef<number | null>(null);

    const severityFilter = useStableComputedArray<string>(
        () => getColumnFilterValue(filters, 'severity') ?? [],
        [filters]
    );

    const messageFilter = useMemo(() => getColumnFilterValue(filters, 'message'), [filters]);

    useEffect(() => {
        setFiltersInitialized(false);
    }, [reportType, severities]);

    const resetSearch = useCallback(() => {
        setSearchMatches([]);
        setSearchResults([]);
        setCurrentResultIndex(-1);
        setSearchTerm('');
    }, []);

    const refreshLogsOnSelectedReport = useCallback(() => {
        if (severityFilter.length === 0) {
            setRowData([]);
            return;
        }
        fetchLogs(selectedReport.id, severityFilter, messageFilter, selectedReport.type, page, rowsPerPage)?.then(
            (pagedLogs) => {
                const { content, totalElements, totalPages } = pagedLogs;
                if (totalPages - 1 < page) {
                    changePagination({ page: 0, rowsPerPage });
                }
                setCount(totalElements);
                setSelectedRowIndex(-1);
                setRowData(content);
            }
        );
    }, [
        severityFilter,
        fetchLogs,
        selectedReport.id,
        selectedReport.type,
        messageFilter,
        page,
        rowsPerPage,
        changePagination,
    ]);

    useEffect(() => {
        if (severities && severities.length > 0) {
            // Reset filters will trigger initialization regardless of current filter state
            // Otherwise, only initialize if not already done and no filters present, or if not already done
            // and severity not already in current filter state
            // This is to avoid overwriting filters when user unchecks all severities manually
            const severityNotAlreadyInFilter = severities.some((severity) => !severityFilter.includes(severity));
            const needsInitialization =
                resetFilters ||
                (!filtersInitialized && severityFilter.length === 0) ||
                (!filtersInitialized && severityNotAlreadyInFilter);

            if (needsInitialization) {
                updateFilters([
                    {
                        column: 'severity',
                        dataType: FilterDataTypes.TEXT,
                        type: FilterTextComparators.EQUALS,
                        value: getDefaultSeverityFilter(severities),
                    },
                ]);
                setFiltersInitialized(true);
            }
        }
    }, [severities, resetFilters, filtersInitialized, severityFilter, updateFilters]);

    useEffect(() => {
        if (selectedReport.id && selectedReport.type) {
            refreshLogsOnSelectedReport();
        }
    }, [refreshLogsOnSelectedReport, selectedReport]);

    useEffect(() => {
        onFiltersChanged();
        const api = gridRef.current?.api;
        if (!api || !isGridReady) {
            return;
        }
        applyFiltersToGrid(api, filters);
    }, [filters, isGridReady, onFiltersChanged]);

    const COLUMNS_DEFINITIONS = useMemo(
        () => [
            makeAgGridCustomHeaderColumn({
                headerName: intl.formatMessage({ id: 'report_viewer/severity' }),
                width: SEVERITY_COLUMN_FIXED_WIDTH,
                colId: 'severity',
                field: 'severity',
                cellStyle: (params: CellClassParams<Log>) => ({
                    backgroundColor: params.data?.backgroundColor ?? theme.palette.background.default,
                    textAlign: 'center',
                }),
            }),
            makeAgGridCustomHeaderColumn({
                headerName: intl.formatMessage({ id: 'report_viewer/message' }),
                colId: 'message',
                field: 'message',
                context: {
                    filterComponent: CustomAggridComparatorFilter,
                    filterComponentParams: {
                        filterParams: {
                            type: TableType.Logs,
                            tab: reportType,
                            dataType: FilterDataTypes.TEXT,
                            comparators: [FilterTextComparators.CONTAINS],
                        },
                    },
                    forceDisplayFilterIcon: true,
                },
                flex: 1,
                cellRenderer: (param: ICellRendererParams<Log>) =>
                    MessageLogCellRenderer({
                        param,
                        highlightColor: theme.searchedText.highlightColor,
                        currentHighlightColor: theme.searchedText.currentHighlightColor,
                        searchTerm,
                        currentResultIndex,
                        searchResults,
                    }),
            }),
        ],
        [intl, theme, searchTerm, currentResultIndex, searchResults, reportType]
    );

    const handleRowClick = useCallback(
        (row: CellClickedEvent<Log>) => {
            setSelectedRowIndex(row.rowIndex);
            onRowClick(row.data);
        },
        [onRowClick]
    );

    const rowStyleFormat = useCallback(
        (row: RowClassParams<Log>): RowStyle => {
            if (row.rowIndex && row.rowIndex < 0) {
                return {};
            }
            return selectedRowIndex === row.rowIndex ? { backgroundColor: theme.palette.action.selected } : {};
        },
        [selectedRowIndex, theme.palette.action.selected]
    );

    const onGridReady = ({ api }: { api: GridApi }) => {
        api?.sizeColumnsToFit();
        setIsGridReady(true);
    };

    const defaultColumnDefinition: ColDef = {
        sortable: false,
        resizable: false,
        suppressMovable: true,
    };

    const highlightAndScrollToMatch = useCallback((index: number, matches: number[]) => {
        if (!gridRef.current || matches.length === 0) {
            return;
        }
        gridRef.current.api.ensureIndexVisible(matches[index], 'middle');
    }, []);

    const handleSearchResults = useCallback(
        (matches: number[]) => {
            setSearchResults(matches);
            setCurrentResultIndex(matches.length > 0 ? 0 : -1);
            if (matches.length > 0) {
                highlightAndScrollToMatch(0, matches);
            }
        },
        [highlightAndScrollToMatch]
    );

    const handleSearch = useCallback(
        (term: string) => {
            if (!gridRef.current || !term) {
                resetSearch();
                return;
            }
            setSearchTerm(term);
            fetchLogMatches(
                selectedReport.id,
                severityFilter,
                messageFilter,
                selectedReport.type,
                term,
                rowsPerPage
            )?.then((matchesPositions) => {
                setSearchMatches(matchesPositions);
                const matches = matchesPositions.map((m) => m.rowIndex);
                if (matches.length > 0) {
                    changePagination({ page: matchesPositions[0].page, rowsPerPage });
                }
                handleSearchResults(matches);
            });
        },
        [
            fetchLogMatches,
            handleSearchResults,
            messageFilter,
            resetSearch,
            rowsPerPage,
            selectedReport.id,
            selectedReport.type,
            changePagination,
            severityFilter,
        ]
    );

    const handleNavigate = useCallback(
        (direction: 'next' | 'previous') => {
            if (!gridRef.current || searchResults.length === 0) {
                return;
            }
            const newIndex =
                direction === 'next'
                    ? (currentResultIndex + 1) % searchResults.length
                    : (currentResultIndex - 1 + searchResults.length) % searchResults.length;

            pendingScrollRef.current = searchResults[newIndex];
            changePagination({ page: searchMatches[newIndex].page, rowsPerPage });
            setCurrentResultIndex(newIndex);
            highlightAndScrollToMatch(newIndex, searchResults);
        },
        [searchResults, changePagination, searchMatches, rowsPerPage, highlightAndScrollToMatch, currentResultIndex]
    );

    const handleRowDataUpdated = useCallback(() => {
        if (pendingScrollRef.current === null || !gridRef.current) {
            return;
        }
        const rowIndex = pendingScrollRef.current;
        pendingScrollRef.current = null;
        gridRef.current.api?.ensureIndexVisible(rowIndex, 'middle');
    }, []);

    const handleChipClick = useCallback(
        (severity: string) => {
            const updatedFilter = severityFilter.includes(severity)
                ? severityFilter.filter((s) => s !== severity)
                : [...severityFilter, severity];

            updateFilters([
                {
                    column: 'severity',
                    dataType: FilterDataTypes.TEXT,
                    type: FilterTextComparators.EQUALS,
                    value: updatedFilter,
                },
                {
                    column: 'message',
                    dataType: FilterDataTypes.TEXT,
                    type: FilterTextComparators.CONTAINS,
                    value: messageFilter,
                },
            ]);
        },
        [updateFilters, severityFilter, messageFilter]
    );

    const handleChangePage = useCallback(
        (_: unknown, newPage: number) => {
            changePagination({ page: newPage, rowsPerPage });
            const firstMatchIndex = searchMatches.findIndex((match) => match.page === newPage);
            setCurrentResultIndex(firstMatchIndex);
        },
        [searchMatches, rowsPerPage, changePagination]
    );

    const handleChangeRowsPerPage = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            changePagination({ page: 0, rowsPerPage: parseInt(event.target.value, 10) });
        },
        [changePagination]
    );

    // This effect enables to recompute the research when selected node, filters or page size change for example
    useEffect(() => {
        handleSearch(searchTerm);
        // We don't want to trigger on searchTerm change — that is handled by QuickSearch
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [handleSearch]);

    return (
        <Box sx={reportStyles.mainContainer}>
            <Box sx={styles.toolContainer}>
                <QuickSearch
                    currentResultIndex={currentResultIndex}
                    onSearch={handleSearch}
                    onNavigate={handleNavigate}
                    resultCount={searchResults.length}
                    resetSearch={resetSearch}
                    placeholder="searchPlaceholderLog"
                    inputRef={inputRef}
                />
                <Box sx={styles.chipContainer}>
                    {severities?.map((severity) => (
                        <Chip
                            key={severity}
                            label={severity}
                            deleteIcon={severityFilter.includes(severity) ? <VisibilityIcon /> : <VisibilityOffIcon />}
                            onClick={() => handleChipClick(severity)}
                            onDelete={() => handleChipClick(severity)}
                            sx={chipStyle(severity, severityFilter, theme)}
                        />
                    ))}
                </Box>
            </Box>
            <Box sx={{ flex: 1 }}>
                <CustomAGGrid
                    ref={gridRef}
                    columnDefs={COLUMNS_DEFINITIONS}
                    rowData={rowData}
                    onCellClicked={handleRowClick}
                    getRowStyle={rowStyleFormat}
                    onGridReady={onGridReady}
                    onRowDataUpdated={handleRowDataUpdated}
                    defaultColDef={defaultColumnDefinition}
                    overrideLocales={AGGRID_LOCALES}
                />
            </Box>
            <CustomTablePagination
                component="div"
                rowsPerPageOptions={PAGE_OPTIONS}
                count={count}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                showFirstButton
                showLastButton
            />
        </Box>
    );
}

export default memo(LogTable);
