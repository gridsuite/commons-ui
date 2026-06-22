/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { IntlShape } from 'react-intl';
import { PostSortRowsParams } from 'ag-grid-community';
import {
    Constraint,
    ConstraintsFromContingencyItem,
    ContingenciesFromConstraintItem,
    CutOffPowerFromConstraintsItem,
    LimitViolation,
    SecurityAnalysisNmkTableRow,
} from './security-analysis.type';
import { RunningStatus, RunningStatusMessage } from '../../../utils/running-status';

export function getNoRowsMessage(
    messages: RunningStatusMessage,
    rows: any[] | undefined,
    status: string,
    isDataReady?: boolean
): string | undefined {
    switch (status) {
        case RunningStatus.IDLE:
            return messages.noCalculation;
        case RunningStatus.RUNNING:
            return messages.running;
        case RunningStatus.FAILED:
            return messages.failed;
        case RunningStatus.SUCCEED:
            if (!isDataReady || !rows) {
                return messages.fetching;
            }
            if (rows?.length === 0) {
                return messages.noData ? messages.noData : messages.noLimitViolation;
            }
            return undefined;
        default:
            return messages.noCalculation;
    }
}

export const PAGE_OPTIONS = [25, 100, 500, 1000];

// MAX_INT32 sentinel value used by Powsybl
const MAX_INT32 = 2147483647;

const PERMANENT_LIMIT_NAME = 'permanent';

const translateLimitNameBackToFront = (
    limitName: string | null | undefined,
    intl: IntlShape
): string | null | undefined => {
    switch (limitName) {
        case PERMANENT_LIMIT_NAME:
            return intl.formatMessage({ id: 'PermanentLimitName' });
        default:
            return limitName;
    }
};

export const flattenNmKResultsContingencies = (
    intl: IntlShape,
    result: ConstraintsFromContingencyItem[] | null
): SecurityAnalysisNmkTableRow[] | undefined => {
    const rows: SecurityAnalysisNmkTableRow[] = [];
    if (!result) {
        return undefined;
    }

    result.forEach(({ subjectLimitViolations = [], contingency }: ConstraintsFromContingencyItem, index: number) => {
        const { contingencyId, status, elements = [] } = contingency || {};
        rows.push({
            contingencyId,
            contingencyEquipmentsIds: elements.map((element) => element.id),
            status,
            violationCount: subjectLimitViolations.length,
            elementId: index,
        });
        subjectLimitViolations.forEach((constraint: Constraint) => {
            const { limitViolation = {} as LimitViolation, subjectId } = constraint || {};
            rows.push({
                subjectId,
                locationId: limitViolation.locationId,
                limitType: limitViolation.limitType,
                limit: limitViolation.limit,
                patlLimit: limitViolation.patlLimit,
                value: limitViolation.value,
                loading: limitViolation.loading,
                patlLoading: limitViolation.patlLoading,
                limitName: translateLimitNameBackToFront(limitViolation.limitName, intl),
                nextLimitName: translateLimitNameBackToFront(limitViolation.nextLimitName, intl),
                side: limitViolation.side,
                linkedElementId: index,
                acceptableDuration:
                    limitViolation?.acceptableDuration === MAX_INT32 ? null : limitViolation?.acceptableDuration,
                upcomingAcceptableDuration:
                    limitViolation?.upcomingAcceptableDuration === MAX_INT32
                        ? null
                        : limitViolation?.upcomingAcceptableDuration,
            });
        });
    });

    return rows;
};

export const flattenNmKResultsConstraints = (
    intl: IntlShape,
    result: ContingenciesFromConstraintItem[] | null
): SecurityAnalysisNmkTableRow[] | undefined => {
    const rows: SecurityAnalysisNmkTableRow[] = [];
    if (!result) {
        return undefined;
    }

    result.forEach(({ contingencies = [], subjectId }, index) => {
        if (!rows.find((row) => row.subjectId === subjectId)) {
            rows.push({ subjectId, elementId: index });

            contingencies.forEach(({ contingency = {}, limitViolation = {} }) => {
                rows.push({
                    contingencyId: contingency.contingencyId,
                    contingencyEquipmentsIds: contingency.elements?.map((element) => element.id),
                    status: contingency.status,
                    limitType: limitViolation.limitType,
                    limitName: translateLimitNameBackToFront(limitViolation.limitName, intl),
                    nextLimitName: translateLimitNameBackToFront(limitViolation.nextLimitName, intl),
                    side: limitViolation.side,
                    acceptableDuration:
                        limitViolation?.acceptableDuration === MAX_INT32 ? null : limitViolation?.acceptableDuration,
                    upcomingAcceptableDuration:
                        limitViolation?.upcomingAcceptableDuration === MAX_INT32
                            ? null
                            : limitViolation?.upcomingAcceptableDuration,
                    limit: limitViolation.limit,
                    patlLimit: limitViolation.patlLimit,
                    value: limitViolation.value,
                    loading: limitViolation.loading,
                    patlLoading: limitViolation.patlLoading,
                    locationId: limitViolation.locationId,
                    linkedElementId: index,
                });
            });
        }
    });

    return rows;
};

export const mapNmKResultsCutOffPower = (
    result: CutOffPowerFromConstraintsItem[] | null
): SecurityAnalysisNmkTableRow[] | undefined => {
    const rows: SecurityAnalysisNmkTableRow[] = [];
    if (!result) {
        return undefined;
    }
    result.forEach(({ contingencyId, status, connectivityResult }: CutOffPowerFromConstraintsItem) => {
        rows.push({
            contingencyId,
            status,
            disconnectedLoadActivePower: connectivityResult?.disconnectedLoadActivePower,
            disconnectedGenerationActivePower: connectivityResult?.disconnectedGenerationActivePower,
        });
    });
    return rows;
};

export const handlePostSortRows =
    (isFromContingency: boolean) =>
    (params: PostSortRowsParams): void => {
        const agGridRows = params.nodes;
        const idField = isFromContingency ? 'contingencyId' : 'subjectId';
        const isContingency = !isFromContingency;

        const mappedRows = new Map<string | number, unknown[]>();

        if (isContingency) {
            mappedRows.set('contingencies', []);
        }

        agGridRows.forEach((row) => {
            if (row.data[idField] != null) {
                mappedRows.set(row.data.elementId, [row]);
            }
        });

        agGridRows.forEach((row) => {
            if (isContingency && row.data.linkedElementId == null && !row.data[idField]) {
                mappedRows.get('contingencies')!.push(row);
            } else if (row.data[idField] == null) {
                const group = mappedRows.get(row.data.linkedElementId);
                if (group) {
                    group.push(row);
                }
            }
        });

        Object.assign(agGridRows, [...mappedRows.values()].flat());
    };
