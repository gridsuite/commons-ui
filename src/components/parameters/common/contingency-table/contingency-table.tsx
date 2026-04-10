/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { Alert, CircularProgress, Stack } from '@mui/material';
import { useCallback, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { FieldValues, useWatch } from 'react-hook-form';
import { UUID } from 'node:crypto';
import { useAbortableFetch, useCreateRowData, useSnackMessage } from '../../../../hooks';
import { ACTIVATED, ColumnsDef, ID, ParameterTable } from '../parameter-table';
import { CONTINGENCY_LISTS, CONTINGENCY_LISTS_INFOS } from '../constants';
import { COLUMNS_DEFINITIONS_CONTINGENCY_LISTS_INFOS, ParamContingencyLists } from './columns-definitions';
import { ContingencyCount, ContingencyListsInfos } from './types';
import { DEFAULT_TIMEOUT_MS } from '../../../../services';
import { snackWithFallback } from '../../../../utils';

export function ContingencyTable({
    showContingencyCount = false,
    fetchContingencyCount,
    isBuiltCurrentNode,
}: Readonly<{
    showContingencyCount: boolean;
    fetchContingencyCount?: (contingencyLists: UUID[] | null, abortSignal: AbortSignal) => Promise<ContingencyCount>;
    isBuiltCurrentNode?: boolean; // necessary if we want to show the contingency count
}>) {
    const intl = useIntl();
    const [simulatedContingencyCount, setSimulatedContingencyCount] = useState<ContingencyCount | null>(null);
    const [rowData, useFieldArrayOutput] = useCreateRowData(ParamContingencyLists);
    const contingencyListsInfos: ContingencyListsInfos[] = useWatch({ name: CONTINGENCY_LISTS_INFOS });
    const { snackError } = useSnackMessage();

    const getColumnsDefinition = useCallback(
        (columns: ColumnsDef[]) => {
            if (columns) {
                return columns.map((column) => ({
                    ...column,
                    label: intl.formatMessage({ id: column.label }),
                }));
            }
            return [];
        },
        [intl]
    );

    const hasNoContingencies =
        !contingencyListsInfos ||
        (contingencyListsInfos.length ?? 0) === 0 ||
        contingencyListsInfos.every((c) => !c[ACTIVATED] || (c[CONTINGENCY_LISTS]?.length ?? 0) === 0);

    const { loading: isLoading } = useAbortableFetch({
        deps: [snackError, contingencyListsInfos, fetchContingencyCount, showContingencyCount, isBuiltCurrentNode],
        skipFetch: !showContingencyCount || !isBuiltCurrentNode || hasNoContingencies,
        timeoutMs: DEFAULT_TIMEOUT_MS,
        fetcher: (signal) =>
            fetchContingencyCount?.(
                contingencyListsInfos
                    .filter((l) => l[ACTIVATED])
                    .flatMap((l) => l[CONTINGENCY_LISTS]?.map((c) => c[ID])),
                signal
            ),

        onSuccess: (count) => {
            setSimulatedContingencyCount(count);
        },

        onError: (error) => {
            setSimulatedContingencyCount(null);
            snackWithFallback(snackError, error, {
                headerId: 'getSecurityAnalysisContingenciesCountError',
            });
        },

        cleanup: () => {
            setSimulatedContingencyCount(null);
        },
    });

    const renderContingencyCount = () => {
        if (!isBuiltCurrentNode) {
            return (
                <Alert variant="standard" severity="warning" sx={{ color: 'text.primary' }}>
                    <FormattedMessage id="contingencyCountImpossibleOnUnbuiltNode" />
                </Alert>
            );
        }
        if (isLoading) {
            return (
                <Alert
                    variant="standard"
                    icon={<CircularProgress size={22} />}
                    severity="info"
                    sx={{ color: 'text.primary' }}
                />
            );
        }
        if (simulatedContingencyCount?.contingencies === 0 && simulatedContingencyCount.notFoundElements === 0) {
            return (
                <Alert variant="standard" severity="error" sx={{ color: 'text.primary' }}>
                    <FormattedMessage id="noContingency" />
                </Alert>
            );
        }
        return (
            <Alert variant="standard" icon={false} severity="info" sx={{ color: 'text.primary' }}>
                <FormattedMessage
                    id="xContingenciesWillBeSimulatedAndYNotFound"
                    values={{
                        x: simulatedContingencyCount?.contingencies ?? '...',
                        y: simulatedContingencyCount?.notFoundElements ?? '...',
                    }}
                />
            </Alert>
        );
    };

    return (
        <Stack spacing={0} sx={{ width: '100%' }}>
            <ParameterTable
                arrayFormName={CONTINGENCY_LISTS_INFOS}
                useFieldArrayOutput={useFieldArrayOutput}
                columnsDefinition={getColumnsDefinition(COLUMNS_DEFINITIONS_CONTINGENCY_LISTS_INFOS)}
                tableHeight={270}
                createRows={rowData}
                onFormChanged={() => {}}
                isValidParameterRow={(row: FieldValues) => row[CONTINGENCY_LISTS]?.length > 0}
            />
            {showContingencyCount && renderContingencyCount()}
        </Stack>
    );
}
