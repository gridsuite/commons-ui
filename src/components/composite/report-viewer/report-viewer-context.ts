/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { createContext, useContext } from 'react';
import { FilterConfig, LogsPaginationConfig, MatchPosition, PagedLogs, ReportType } from './report.type';

export interface ReportFetcherContextValue {
    fetchLogs: (
        reportId: string,
        severityList: string[],
        messageFilter: string,
        reportType: ReportType,
        page: number,
        size: number
    ) => Promise<PagedLogs> | undefined;
    fetchLogMatches: (
        reportId: string,
        severityList: string[],
        messageFilter: string,
        reportType: ReportType,
        searchTerm: string,
        pageSize: number
    ) => Promise<MatchPosition[]> | undefined;
}

export const ReportFetcherContext = createContext<ReportFetcherContextValue | null>(null);

export const useReportFetcherContext = (): ReportFetcherContextValue => {
    const ctx = useContext(ReportFetcherContext);
    if (!ctx) {
        throw new Error('useReportFetcherContext must be used inside a ReportFetcherContext.Provider');
    }
    return ctx;
};

export interface ReportFilterContextValue {
    filters: FilterConfig[] | undefined;
    onFiltersUpdate: (filters: FilterConfig[]) => void;
    pagination: LogsPaginationConfig;
    onPaginationChange: (config: LogsPaginationConfig) => void;
}

export const ReportFilterContext = createContext<ReportFilterContextValue | null>(null);

export const useReportFilterContext = (): ReportFilterContextValue => {
    const ctx = useContext(ReportFilterContext);
    if (!ctx) {
        throw new Error('useReportFilterContext must be used inside a ReportFilterContext.Provider');
    }
    return ctx;
};
