/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import { alpha, Box, Chip, TablePagination, Theme, useTheme } from '@mui/material';
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
// eslint-disable-next-line no-restricted-imports
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
// eslint-disable-next-line no-restricted-imports
import VisibilityIcon from '@mui/icons-material/Visibility';
import { getDefaultSeverityFilter, REPORT_SEVERITY } from './report-severity';
import { QuickSearch } from './QuickSearch';
import {
    ComputingAndNetworkModificationType,
    Log,
    SelectedReportLog,
    SeverityLevel,
} from './report.type';
import { reportStyles } from './report.styles';
import { useReportFetcherContext, useReportFilterContext } from './report-viewer-context';
import {
    FilterDataTypes,
    FilterTextComparators,
    LANG_ENGLISH,
    LANG_FRENCH,
    MuiStyles,
    SxStyle,
    TableType,
} from '../../../utils';
import { AgGridLocales, CustomAGGrid, MessageLogCellRenderer } from '../customAGGrid';
import { CustomAggridComparatorFilter } from '../customAGGrid/custom-aggrid-comparator-filter';
import { makeAgGridCustomHeaderColumn } from '../customAGGrid/custom-aggrid-header-utils';
import { FilterConfig } from '../customAGGrid/custom-aggrid-types';

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

const chipStyle = (severity: string, severityFilter: string[], theme: Theme): SxStyle =>
    ({
        backgroundColor: severityFilter.includes(severity)
            ? REPORT_SEVERITY[severity as keyof typeof REPORT_SEVERITY].colorHexCode
            : ((theme as any).severityChip?.disabledColor ?? theme.palette.action.disabledBackground),
        cursor: 'pointer',
        border: `1px solid ${theme.palette.divider}`,
        '&:hover': {
            backgroundColor: alpha(REPORT_SEVERITY[severity as keyof typeof REPORT_SEVERITY].colorHexCode, 0.5),
        },
        '& .MuiChip-deleteIcon': {
            color: theme.palette.text.primary,
            fontSize: '1rem',
        },
        '& .MuiChip-deleteIcon:hover': {
            color: theme.palette.text.primary,
        },
        padding: 0.5,
    }) as const;

const styles = {
    chipContainer: (theme: any) => ({
        display: 'flex',
        flexWrap: 'wrap',
        gap: theme.spacing(1),
    }),
    toolContainer: (theme: any) => ({
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
    /** Optional extra column definitions to inject (e.g. custom header with filter). */
    extraColumnDefs?: ColDef<Log>[];
};

function LogTable({
    selectedReport,
    reportType,
    severities,
    onRowClick,
    onFiltersChanged,
    resetFilters = false,
    extraColumnDefs,
}: LogTableProps) {
    const intl = useIntl();
    const theme = useTheme<Theme>();

    // ── Context reads (replaces Redux + useReportFetcher + useLogsPagination) ──
    const { fetchLogs, fetchLogMatches } = useReportFetcherContext();
    const { filters, onFiltersUpdate, pagination, onPaginationChange } = useReportFilterContext();

    const { page, rowsPerPage } = pagination;

    // ── Local state ────────────────────────────────────────────────────────────
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

    // AGGRID_LOCALES duplicated from gridstudy-app/src/translations/not-intl/aggrid-locales.ts
    const AGGRID_LOCALES = {
        [LANG_FRENCH]: {
            noRowsToShow: 'Aucune Donnée',
        },
        [LANG_ENGLISH]: {
            noRowsToShow: 'No data',
        },
    } as const satisfies AgGridLocales;

    // ── Derived filter values ──────────────────────────────────────────────────
    // Stable array reference to avoid unnecessary re-renders
    const severityFilterRef = useRef<string[]>([]);
    const severityFilter = useMemo(() => {
        const next = getColumnFilterValue(filters, 'severity') ?? [];
        const prev = severityFilterRef.current;
        const changed = next.length !== prev.length || (next as string[]).some((v: string, i: number) => v !== prev[i]);
        if (changed) {
            severityFilterRef.current = next;
        }
        return severityFilterRef.current;
    }, [filters]);

    const messageFilter = useMemo(() => getColumnFilterValue(filters, 'message'), [filters]);

    // ── Reset filtersInitialized when reportType or severities change ──────────
    useEffect(() => {
        setFiltersInitialized(false);
    }, [reportType, severities]);

    // ── Search helpers ─────────────────────────────────────────────────────────
    const resetSearch = useCallback(() => {
        setSearchMatches([]);
        setSearchResults([]);
        setCurrentResultIndex(-1);
        setSearchTerm('');
    }, []);

    // ── Fetch logs ─────────────────────────────────────────────────────────────
    const refreshLogsOnSelectedReport = useCallback(() => {
        if (severityFilter.length === 0) {
            setRowData([]);
            return;
        }
        fetchLogs(selectedReport.id, severityFilter, messageFilter, selectedReport.type, page, rowsPerPage)?.then(
            (pagedLogs) => {
                const { content, totalElements, totalPages } = pagedLogs;
                if (totalPages - 1 < page) {
                    onPaginationChange({ page: 0, rowsPerPage });
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
        onPaginationChange,
    ]);

    // ── Initialize severity filter chips when severities arrive ───────────────
    useEffect(() => {
        if (severities && severities.length > 0) {
            const severityNotAlreadyInFilter = severities.some((severity) => !severityFilter.includes(severity));
            const needsInitialization =
                resetFilters ||
                (!filtersInitialized && severityFilter.length === 0) ||
                (!filtersInitialized && severityNotAlreadyInFilter);

            if (needsInitialization) {
                onFiltersUpdate([
                    {
                        column: 'severity',
                        dataType: 'text',
                        type: 'equals',
                        value: getDefaultSeverityFilter(severities),
                    },
                ]);
                setFiltersInitialized(true);
            }
        }
    }, [severities, resetFilters, filtersInitialized, severityFilter, onFiltersUpdate]);

    // ── Refresh logs when selection or filters change ──────────────────────────
    useEffect(() => {
        if (selectedReport.id && selectedReport.type) {
            refreshLogsOnSelectedReport();
        }
    }, [refreshLogsOnSelectedReport, selectedReport]);

    // ── Sync AG Grid filter model when filters state changes ───────────────────
    useEffect(() => {
        onFiltersChanged();
        const api = gridRef.current?.api;
        if (!api || !isGridReady) {
            return;
        }
        applyFiltersToGrid(api, filters);
    }, [filters, isGridReady, onFiltersChanged]);

    // ── Column definitions ─────────────────────────────────────────────────────
    const COLUMNS_DEFINITIONS = useMemo(
        () =>
            extraColumnDefs ?? [
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
        [extraColumnDefs, intl, theme, searchTerm, currentResultIndex, searchResults, reportType]
    );

    // ── Row interactions ───────────────────────────────────────────────────────
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

    // ── Search / highlight ────────────────────────────────────────────────────
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
                    onPaginationChange({ page: matchesPositions[0].page, rowsPerPage });
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
            onPaginationChange,
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

            onPaginationChange({ page: searchMatches[newIndex].page, rowsPerPage });
            setCurrentResultIndex(newIndex);
            highlightAndScrollToMatch(newIndex, searchResults);
        },
        [searchResults, onPaginationChange, searchMatches, rowsPerPage, highlightAndScrollToMatch, currentResultIndex]
    );

    // ── Severity chip click ───────────────────────────────────────────────────
    const handleChipClick = useCallback(
        (severity: string) => {
            const updatedFilter = severityFilter.includes(severity)
                ? severityFilter.filter((s) => s !== severity)
                : [...severityFilter, severity];

            onFiltersUpdate([
                {
                    column: 'severity',
                    dataType: 'text',
                    type: 'equals',
                    value: updatedFilter,
                },
                {
                    column: 'message',
                    dataType: 'text',
                    type: 'contains',
                    value: messageFilter,
                },
            ]);
        },
        [onFiltersUpdate, severityFilter, messageFilter]
    );

    // ── Pagination ─────────────────────────────────────────────────────────────
    const handleChangePage = useCallback(
        (_: unknown, newPage: number) => {
            onPaginationChange({ page: newPage, rowsPerPage });
            const firstMatchIndex = searchMatches.findIndex((match) => match.page === newPage);
            setCurrentResultIndex(firstMatchIndex);
        },
        [searchMatches, rowsPerPage, onPaginationChange]
    );

    const handleChangeRowsPerPage = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            onPaginationChange({ page: 0, rowsPerPage: parseInt(event.target.value, 10) });
        },
        [onPaginationChange]
    );

    // Re-run search when selected node, filters or page size change
    useEffect(() => {
        handleSearch(searchTerm);
        // We don't want to trigger on searchTerm change — that is handled by QuickSearch
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [handleSearch]);

    // ── Render ─────────────────────────────────────────────────────────────────
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
                    defaultColDef={defaultColumnDefinition}
                    overrideLocales={AGGRID_LOCALES}
                />
            </Box>
            <TablePagination
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
