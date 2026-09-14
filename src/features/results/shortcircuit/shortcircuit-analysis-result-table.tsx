/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useCallback, useMemo } from 'react';
import { useIntl } from 'react-intl';
import { Box, Button, useTheme } from '@mui/material';
import {
    DisplayedColumnsChangedEvent,
    GridReadyEvent,
    ICellRendererParams,
    RowClassParams,
    RowDataUpdatedEvent,
    ValueFormatterParams,
    ValueGetterParams,
} from 'ag-grid-community';
import { SCAFaultResult, SCAFeederResult, ShortCircuitAnalysisType } from './shortcircuit-analysis-result.type';
import {
    CustomAGGrid,
    DefaultCellRenderer,
    makeAgGridCustomHeaderColumn,
    OverflowableText,
    CustomAggridComparatorFilter,
    CustomAggridAutocompleteFilter,
    FilterDataTypes,
    SortParams,
    TableType,
    FilterTextComparators,
    FilterNumberComparators,
    ColumnContext,
} from '../../../components';
import { mappingTabs } from './shortcircuit-analysis-result-content';
import { getRows, MuiStyles, RunningStatus, unitToKiloUnit } from '../../../utils';
import { getNoRowsMessage } from '../utils';
import { AGGRID_LOCALES } from '../../../translations/not-intl/aggrid-locales';
import { useIntlResultStatusMessages } from '../hooks';
import { createMultiEnumFilterParams } from '../common/utils';

export const SHORTCIRCUIT_ANALYSIS_RESULT_SORT_STORE = 'shortcircuitAnalysisResult';

export type FilterEnumsType = Record<string, string[] | null>;

export const textFilterParams = {
    dataType: FilterDataTypes.TEXT,
    comparators: [FilterTextComparators.STARTS_WITH, FilterTextComparators.CONTAINS],
};

export const numericFilterParams = {
    dataType: FilterDataTypes.NUMBER,
    comparators: [
        FilterNumberComparators.EQUALS,
        FilterNumberComparators.NOT_EQUAL,
        FilterNumberComparators.LESS_THAN_OR_EQUAL,
        FilterNumberComparators.GREATER_THAN_OR_EQUAL,
    ],
};

export type TableFilterParams = {
    type: TableType;
    tab: string;
};

export type ShortcircuitColumnFilter = {
    column: string;
    [key: string]: unknown;
};

export const resultsStyles = {
    sldLink: {
        color: 'node.background',
        maxWidth: '100%',
    },
} as const satisfies MuiStyles;

export interface ShortCircuitAnalysisResultTableProps {
    result: SCAFaultResult[] | undefined;
    analysisType: ShortCircuitAnalysisType;
    isFetching: boolean;
    filterEnums: FilterEnumsType;
    onRowDataUpdated: (event: RowDataUpdatedEvent) => void;
    onDisplayedColumnsChanged: (event: DisplayedColumnsChangedEvent) => void;
    shortCircuitAnalysisStatus: RunningStatus;
    columnFilters?: ShortcircuitColumnFilter[];
    onGridReady: (params: GridReadyEvent) => void;
    onVoltageLevelClick?: (voltageLevelId: string) => void;
}

type ShortCircuitAnalysisAGGridResult =
    | ShortCircuitAnalysisResultsFaultHeader
    | ShortCircuitAnalysisResultsLimitViolation
    | ShortCircuitAnalysisResultsFeederResult;

interface ShortCircuitAnalysisResultsFaultHeader {
    faultId: string;
    elementId: string;
    voltageLevel: string;
    faultType: string;
    shortCircuitPower: number;
    current: number;
    limitType?: string | null;
    limitMin?: number | null;
    limitMax?: number | null;
    deltaCurrentIpMax?: number | null;
    deltaCurrentIpMin?: number | null;
}

interface ShortCircuitAnalysisResultsLimitViolation {
    current: number;
    limitType?: string | null;
    limitMin?: number | null;
    limitMax?: number | null;
}

interface ShortCircuitAnalysisResultsFeederResult {
    connectableId: string;
    current: number;
    linkedElementId: string;
    side?: string;
}

export function ShortCircuitAnalysisResultTable({
    result,
    analysisType,
    isFetching,
    filterEnums,
    onRowDataUpdated,
    onDisplayedColumnsChanged,
    shortCircuitAnalysisStatus,
    columnFilters,
    onGridReady,
    onVoltageLevelClick,
}: ShortCircuitAnalysisResultTableProps) {
    const intl = useIntl();
    const theme = useTheme();

    const voltageLevelIdRenderer = useCallback(
        (props: ICellRendererParams) => {
            const { value } = props || {};
            const onClick = () => {
                onVoltageLevelClick?.(value);
            };
            if (value) {
                return (
                    <Button sx={resultsStyles.sldLink} onClick={onClick}>
                        <OverflowableText text={value} />
                    </Button>
                );
            }
            return null;
        },
        [onVoltageLevelClick]
    );

    const getEnumLabel = useCallback(
        (value: string) =>
            value
                ? intl.formatMessage({
                      id: value,
                      defaultMessage: value,
                  })
                : '',
        [intl]
    );

    const columns = useMemo(() => {
        const isAllBusesAnalysisType = analysisType === ShortCircuitAnalysisType.ALL_BUSES;

        const onlyIfIsAllBuses = <T,>(data: T, defaultData: T | undefined = {} as T) =>
            isAllBusesAnalysisType ? data : defaultData;

        const onlyIfIsOneBus = <T,>(data: T, defaultData: T | undefined = {} as T) =>
            !isAllBusesAnalysisType ? data : defaultData;

        const sortParams: SortParams = {
            table: SHORTCIRCUIT_ANALYSIS_RESULT_SORT_STORE,
            tab: mappingTabs(analysisType),
        };

        const filterParams: TableFilterParams = {
            type: TableType.ShortcircuitAnalysis,
            tab: mappingTabs(analysisType),
        };

        const inputFilterParams = (
            field: string,
            filterDefinition: Pick<
                Required<ColumnContext>['filterComponentParams']['filterParams'],
                'dataType' | 'comparators'
            >
        ) => {
            return {
                filterComponent: CustomAggridComparatorFilter,
                filterComponentParams: {
                    filterParams: {
                        ...filterDefinition,
                        ...filterParams,
                    },
                },
            };
        };

        const autocompleteFilterParams = (colId: string) => {
            return {
                filterComponent: CustomAggridAutocompleteFilter,
                filterComponentParams: {
                    filterParams: {
                        dataType: FilterDataTypes.TEXT,
                        ...filterParams,
                    },
                    options: filterEnums[colId] ?? [],
                    getOptionLabel: getEnumLabel,
                },
            };
        };

        return [
            {
                ...makeAgGridCustomHeaderColumn({
                    headerName: intl.formatMessage({ id: 'IDNode' }),
                    colId: 'elementId',
                    field: 'elementId',
                    context: {
                        ...onlyIfIsAllBuses({ sortParams, ...inputFilterParams('elementId', textFilterParams) }),
                    },
                }),
                minWidth: 180,
            },
            makeAgGridCustomHeaderColumn({
                headerName: intl.formatMessage({ id: 'busVoltageLevel' }),
                colId: 'voltageLevel',
                field: 'voltageLevel',
                cellRenderer: voltageLevelIdRenderer,
                context: {
                    ...onlyIfIsAllBuses({ sortParams, ...inputFilterParams('voltageLevel', textFilterParams) }),
                },
            }),
            makeAgGridCustomHeaderColumn({
                headerName: intl.formatMessage({ id: 'Type' }),
                colId: 'faultType',
                field: 'faultType',
                filterParams: createMultiEnumFilterParams,
                context: {
                    ...onlyIfIsAllBuses({ sortParams, ...autocompleteFilterParams('faultType') }),
                },
                valueGetter: (value: ValueGetterParams) => value.data.faultType,
                valueFormatter: (params: ValueFormatterParams) => getEnumLabel(params.value),
            }),
            makeAgGridCustomHeaderColumn({
                headerName: intl.formatMessage({ id: 'Feeders' }),
                colId: 'connectableId',
                field: 'connectableId',
                context: {
                    sortParams: onlyIfIsAllBuses({ ...sortParams, isChildren: true }, sortParams),
                    ...inputFilterParams('connectableId', textFilterParams),
                },
            }),
            makeAgGridCustomHeaderColumn({
                headerName: intl.formatMessage({ id: 'IscKA' }),
                colId: 'current',
                field: 'current',
                context: {
                    numeric: true,
                    fractionDigits: 2,
                    sortParams,
                    ...inputFilterParams('current', numericFilterParams),
                },
                valueGetter: (params: ValueGetterParams) => unitToKiloUnit(params.data?.current),
            }),
            makeAgGridCustomHeaderColumn({
                headerName: intl.formatMessage({ id: 'Side' }),
                colId: 'side',
                field: 'side',
                hide: isAllBusesAnalysisType,
                filterParams: createMultiEnumFilterParams,
                context: {
                    ...onlyIfIsOneBus({ sortParams, ...autocompleteFilterParams('side') }),
                },
                valueGetter: (value: ValueGetterParams) => value.data.side,
                valueFormatter: (params: ValueFormatterParams) => getEnumLabel(params.value),
            }),
            {
                ...makeAgGridCustomHeaderColumn({
                    headerName: intl.formatMessage({ id: 'LimitType' }),
                    colId: 'limitType',
                    field: 'limitType',
                    filterParams: createMultiEnumFilterParams,
                    context: {
                        ...onlyIfIsAllBuses({ sortParams, ...autocompleteFilterParams('limitType') }),
                    },
                    valueGetter: (value: ValueGetterParams) => value.data.limitType,
                    valueFormatter: (params: ValueFormatterParams) => getEnumLabel(params.value),
                }),
                minWidth: 150,
            },
            makeAgGridCustomHeaderColumn({
                headerName: intl.formatMessage({ id: 'IscMinKA' }),
                colId: 'limitMin',
                field: 'limitMin',
                context: {
                    numeric: true,
                    fractionDigits: 2,
                    ...onlyIfIsAllBuses({ sortParams, ...inputFilterParams('limitMin', numericFilterParams) }),
                },
                valueGetter: (params: ValueGetterParams) => unitToKiloUnit(params.data?.limitMin),
            }),
            makeAgGridCustomHeaderColumn({
                headerName: intl.formatMessage({ id: 'IscMaxKA' }),
                colId: 'limitMax',
                field: 'limitMax',
                context: {
                    numeric: true,
                    fractionDigits: 2,
                    ...onlyIfIsAllBuses({ sortParams, ...inputFilterParams('limitMax', numericFilterParams) }),
                },
                valueGetter: (params: ValueGetterParams) => unitToKiloUnit(params.data?.limitMax),
            }),
            makeAgGridCustomHeaderColumn({
                headerName: intl.formatMessage({ id: 'PscMVA' }),
                colId: 'shortCircuitPower',
                field: 'shortCircuitPower',
                context: {
                    numeric: true,
                    fractionDigits: 2,
                    ...onlyIfIsAllBuses({ sortParams, ...inputFilterParams('shortCircuitPower', numericFilterParams) }),
                },
            }),
            {
                ...makeAgGridCustomHeaderColumn({
                    headerName: intl.formatMessage({ id: 'deltaCurrentIpMin' }),
                    colId: 'deltaCurrentIpMin',
                    field: 'deltaCurrentIpMin',
                    context: {
                        numeric: true,
                        fractionDigits: 2,
                        ...onlyIfIsAllBuses({
                            sortParams,
                            ...inputFilterParams('deltaCurrentIpMin', numericFilterParams),
                        }),
                    },
                    valueGetter: (params: ValueGetterParams) => unitToKiloUnit(params.data?.deltaCurrentIpMin),
                }),
                minWidth: 180,
            },
            {
                ...makeAgGridCustomHeaderColumn({
                    headerName: intl.formatMessage({ id: 'deltaCurrentIpMax' }),
                    colId: 'deltaCurrentIpMax',
                    field: 'deltaCurrentIpMax',
                    context: {
                        numeric: true,
                        fractionDigits: 2,
                        ...onlyIfIsAllBuses({
                            sortParams,
                            ...inputFilterParams('deltaCurrentIpMax', numericFilterParams),
                        }),
                    },
                    valueGetter: (params: ValueGetterParams) => unitToKiloUnit(params.data?.deltaCurrentIpMax),
                }),
                minWidth: 180,
            },
            {
                field: 'linkedElementId',
                hide: true,
            },
        ];
    }, [analysisType, intl, voltageLevelIdRenderer, filterEnums, getEnumLabel]);

    const messages = useIntlResultStatusMessages(intl, true, (columnFilters?.length ?? 0) > 0);

    const getRowStyle = useCallback(
        (params: RowClassParams) => {
            if (!params?.data?.linkedElementId) {
                return {
                    backgroundColor: theme.selectedRow.background,
                };
            }
            return undefined;
        },
        [theme.selectedRow.background]
    );

    const defaultColDef = useMemo(
        () => ({
            suppressMovable: true,
            resizable: true,
            flex: 1,
            cellRenderer: DefaultCellRenderer,
        }),
        []
    );

    const handleRowDataUpdated = useCallback(
        (event: RowDataUpdatedEvent) => {
            if (event?.api) {
                onRowDataUpdated(event);
            }
        },
        [onRowDataUpdated]
    );

    const getCurrent = useCallback(
        (x: SCAFaultResult | SCAFeederResult) => {
            let current = Number.NaN;
            if (analysisType === ShortCircuitAnalysisType.ALL_BUSES) {
                current = x.current;
            } else if (analysisType === ShortCircuitAnalysisType.ONE_BUS) {
                current = x.positiveMagnitude;
            }
            return current;
        },
        [analysisType]
    );

    const flattenResult = useCallback(
        (shortCircuitAnalysisResult: SCAFaultResult[]) => {
            const rows: ShortCircuitAnalysisAGGridResult[] = [];

            shortCircuitAnalysisResult?.forEach((faultResult: SCAFaultResult) => {
                const { fault } = faultResult;
                const limitViolations = faultResult.limitViolations ?? [];
                let firstLimitViolation;
                if (limitViolations.length > 0) {
                    const lv = limitViolations[0];
                    firstLimitViolation = {
                        limitType: lv.limitType,
                    };
                }

                const current = getCurrent(faultResult);
                const { deltaCurrentIpMax } = faultResult.shortCircuitLimits;
                const { deltaCurrentIpMin } = faultResult.shortCircuitLimits;

                rows.push({
                    faultId: fault.id,
                    elementId: fault.elementId,
                    voltageLevel: fault.voltageLevelId,
                    faultType: fault.faultType,
                    shortCircuitPower: faultResult.shortCircuitPower,
                    limitMin: faultResult.shortCircuitLimits.ipMin,
                    limitMax: faultResult.shortCircuitLimits.ipMax,
                    deltaCurrentIpMax,
                    deltaCurrentIpMin,
                    current,
                    connectableId: '',
                    ...firstLimitViolation,
                });
                limitViolations.slice(1).forEach((lv) => {
                    rows.push({
                        limitType: lv.limitType,
                        limitMin: lv.limitType === 'LOW_SHORT_CIRCUIT_CURRENT' ? lv.limit : null,
                        limitMax: lv.limitType === 'HIGH_SHORT_CIRCUIT_CURRENT' ? lv.limit : null,
                        current: lv.value,
                        elementId: '',
                        voltageLevel: '',
                        faultType: '',
                        connectableId: '',
                    });
                });
                const feederResults = faultResult.feederResults ?? [];
                feederResults.forEach((feederResult) => {
                    const feederCurrent = getCurrent(feederResult);
                    const side = analysisType === ShortCircuitAnalysisType.ONE_BUS ? feederResult.side : undefined;

                    rows.push({
                        connectableId: feederResult.connectableId,
                        linkedElementId: fault.id,
                        current: feederCurrent,
                        elementId: '',
                        voltageLevel: '',
                        faultType: '',
                        limitType: '',
                        side,
                    });
                });
            });
            return rows;
        },
        [getCurrent, analysisType]
    );

    const rows = useMemo(() => {
        if (result) {
            return flattenResult(result);
        }
        return undefined;
    }, [flattenResult, result]);

    const message = getNoRowsMessage(messages, rows, shortCircuitAnalysisStatus, !isFetching);
    const rowsToShow = getRows(rows, shortCircuitAnalysisStatus);

    return (
        <Box sx={{ flexGrow: 1 }}>
            <CustomAGGrid
                rowData={rowsToShow}
                defaultColDef={defaultColDef}
                onGridReady={onGridReady}
                getRowStyle={getRowStyle}
                columnDefs={columns}
                overlayNoRowsTemplate={message}
                onRowDataUpdated={handleRowDataUpdated}
                onDisplayedColumnsChanged={onDisplayedColumnsChanged}
                overrideLocales={AGGRID_LOCALES}
                onModelUpdated={({ api }) => {
                    if (api.getDisplayedRowCount()) {
                        api.hideOverlay();
                    } else {
                        api.showNoRowsOverlay();
                    }
                }}
            />
        </Box>
    );
}
