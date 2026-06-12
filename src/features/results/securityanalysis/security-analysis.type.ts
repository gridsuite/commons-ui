/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { ColDef, GridReadyEvent } from 'ag-grid-community';
import { AgGridReactProps } from 'ag-grid-react';
import { TablePaginationProps } from '@mui/material';
import { RunningStatus, RunningStatusMessage } from '../../../utils/running-status';

export enum NmkType {
    CONSTRAINTS_FROM_CONTINGENCIES = 'constraints-from-contingencies',
    CONTINGENCIES_FROM_CONSTRAINTS = 'contingencies-from-constraints',
    CUT_OFF_POWER_FROM_CONSTRAINTS = 'cut-off-power-from-constraints',
}

export interface LimitViolation {
    subjectId?: string;
    acceptableDuration?: number;
    upcomingAcceptableDuration?: number;
    limit?: number;
    patlLimit?: number;
    limitName?: string;
    nextLimitName?: string;
    limitReduction?: number;
    limitType?: string;
    loading?: number;
    patlLoading?: number;
    side?: string;
    value?: number;
    locationId?: string;
}

interface Element {
    elementType?: string;
    id?: string;
}

export interface ContingencyItem {
    status?: string;
    contingencyId?: string;
    elements?: Element[];
}

export interface Contingency {
    contingency?: ContingencyItem;
    limitViolation?: LimitViolation;
}

export interface PreContingencyResult {
    subjectId?: string;
    status: string;
    limitViolation?: LimitViolation;
}

export interface SecurityAnalysisNmkTableRow {
    subjectId?: string;
    locationId?: string;
    acceptableDuration?: number | null;
    upcomingAcceptableDuration?: number | null;
    status?: string;
    disconnectedLoadActivePower?: number;
    disconnectedGenerationActivePower?: number;
    contingencyEquipmentsIds?: (string | undefined)[];
    contingencyId?: string;
    limit?: number;
    patlLimit?: number;
    limitName?: string | null;
    nextLimitName?: string | null;
    limitType?: string;
    elementId?: number;
    linkedElementId?: number;
    loading?: number;
    patlLoading?: number;
    side?: string;
    value?: number;
    violationCount?: number;
}

export interface Constraint {
    limitViolation?: LimitViolation;
    subjectId?: string;
}

export interface ContingenciesFromConstraintItem {
    subjectId?: string;
    contingencies?: Contingency[];
}

export interface ConstraintsFromContingencyItem {
    subjectLimitViolations?: Constraint[];
    contingency?: ContingencyItem;
}

export interface CutOffPowerFromConstraintsItem {
    status?: string;
    contingencyId?: string;
    connectivityResult?: ConnectivityResult;
}

export interface ConnectivityResult {
    disconnectedLoadActivePower: number;
    disconnectedGenerationActivePower: number;
}

export type SecurityAnalysisNmkResult = {
    content?: (
        | ContingenciesFromConstraintItem[]
        | ConstraintsFromContingencyItem[]
        | CutOffPowerFromConstraintsItem[]
        | null
    )[];
    [key: string]: unknown;
};

export interface SecurityAnalysisNTableRow {
    subjectId?: string;
    locationId?: string;
    limit?: number;
    limitName?: string | null;
    limitType?: string;
    nextLimitName?: string | null;
    value?: number;
    loading?: number;
    patlLoading?: number;
    patlLimit?: number;
    acceptableDuration?: number | null;
    upcomingAcceptableDuration?: number | null;
    side?: string;
}

export interface SecurityAnalysisTableProps {
    rowData: SecurityAnalysisNTableRow[] | SecurityAnalysisNmkTableRow[] | undefined;
    columnDefs: ColDef[];
    isLoadingResult?: boolean;
    computationSubType?: string;
    overlayNoRowsTemplate?: string;
    agGridProps?: AgGridReactProps;
    onGridReady?: (params: GridReadyEvent) => void;
}

export interface SecurityAnalysisResultNmkProps {
    result?: SecurityAnalysisNmkResult;
    columnDefs: ColDef<any>[];
    isLoadingResult: boolean;
    nmkType: NmkType;
    onGridReady: (params: GridReadyEvent) => void;
    resultStatusMessages: RunningStatusMessage;
    securityAnalysisStatus: RunningStatus;
    paginationProps: TablePaginationProps;
}
