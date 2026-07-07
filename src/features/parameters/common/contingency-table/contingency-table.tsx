/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { Alert, CircularProgress, Grid2 as Grid, Stack } from '@mui/material';
import { ForwardedRef, forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useFormContext } from 'react-hook-form';
import { UUID } from 'node:crypto';
import { ACTIVATED, ID, ParameterTableField } from '../parameter-table-field';
import { COLUMNS_DEFINITIONS_CONTINGENCY_LISTS_INFOS, isValidContingencyRow } from './columns-definitions';
import { ContingencyCount, ContingencyCountByContingencyListEnriched, ContingencyCountEnriched } from './types';
import { useSnackMessage } from '../../../../hooks';
import { CONTINGENCY_LISTS } from '../constants';
import { DEFAULT_TIMEOUT_MS, IGNORE_SIGNAL } from '../../../../services';
import { MuiStyles, snackWithFallback, ContingencyListsInfosEnriched } from '../../../../utils';
import { DndColumn } from '../../../../components';

const styles = {
    alert: { color: 'text.primary', paddingTop: 0, paddingBottom: 0 },
    error: { color: 'error.main', paddingTop: 0, paddingBottom: 0 },
} satisfies MuiStyles;

type SuccessCountType = {
    success: true;
    nbContingencies: number;
    notFoundElements: number;
};

type FailureCountType = {
    success: false;
    invalidContingencyErrorMessage: string;
};

type SimulatedContingencyCountType = SuccessCountType | FailureCountType;

export type ContingencyTableApi = {
    resetSimulatedContingencyCount: () => void;
    triggerContingencyCountRefresh: () => void;
};

export type ContingencyTableProps = {
    name: string;
    showContingencyCount: boolean;
    fetchContingencyCount?: (contingencyLists: UUID[] | null, abortSignal: AbortSignal) => Promise<ContingencyCount>;
    isBuiltCurrentNode?: boolean; // necessary if we want to show the contingency count
};

function ContingencyTableWithApiRef(
    { name, showContingencyCount = false, fetchContingencyCount, isBuiltCurrentNode }: Readonly<ContingencyTableProps>,
    apiRef: ForwardedRef<ContingencyTableApi>
) {
    const intl = useIntl();
    const { snackError } = useSnackMessage();
    const { getValues } = useFormContext();
    const [isLoading, setIsLoading] = useState(false);

    // states to store and control the simulated contingency count
    const [simulatedContingencyCount, setSimulatedContingencyCount] = useState<SimulatedContingencyCountType | null>(
        null
    );
    const [contingencyCountRefreshTrigger, setContingencyCountRefreshTrigger] = useState(0);

    // expose an API to trigger a refresh of the contingency count from outside the component
    useImperativeHandle(
        apiRef,
        () => ({
            resetSimulatedContingencyCount: () => {
                setSimulatedContingencyCount(null);
            },
            triggerContingencyCountRefresh: () => {
                setContingencyCountRefreshTrigger((prev) => prev + 1);
            },
        }),
        []
    );

    // callback that allows triggering a refresh of the contingency count from a child component
    const handleOnChange = useCallback(() => {
        setContingencyCountRefreshTrigger((prevValue) => prevValue + 1);
    }, []);

    useEffect(() => {
        function enrichContingencyCount(
            contingencyCount: ContingencyCount,
            contingencyListsInfos: ContingencyListsInfosEnriched[]
        ): ContingencyCountEnriched {
            const namesById: Record<string, string | undefined> = {};
            contingencyListsInfos.forEach((info) => {
                info.contingencyLists.forEach((idName) => {
                    namesById[idName.id] = idName.name;
                });
            });
            const enriched: Record<string, ContingencyCountByContingencyListEnriched> = {};
            Object.entries(contingencyCount.countByContingencyList).forEach(([uuid, countByList]) => {
                const listName = namesById[uuid];
                enriched[uuid] = { ...countByList, name: listName ?? uuid };
            });

            return {
                countByContingencyList: enriched,
            };
        }

        function analyzeContingencies(
            contingencyCount: ContingencyCountEnriched | null
        ): SimulatedContingencyCountType {
            let total = 0;
            let totalNotFound = 0;
            if (contingencyCount === null) {
                return {
                    success: true,
                    nbContingencies: 0,
                    notFoundElements: 0,
                };
            }

            // eslint-disable-next-line no-restricted-syntax
            for (const [, countByList] of Object.entries(contingencyCount.countByContingencyList)) {
                total += countByList.nbContingencies;

                if (countByList.invalidContingencyErrorMessage !== null && countByList.name !== undefined) {
                    return {
                        success: false,
                        invalidContingencyErrorMessage: `${countByList.invalidContingencyErrorMessage} in the list ${countByList.name}`,
                    };
                }
                if (countByList.notFoundElements !== null) {
                    totalNotFound += Object.entries(countByList.notFoundElements).length;
                }
            }

            return {
                success: true,
                nbContingencies: total,
                notFoundElements: totalNotFound,
            };
        }

        if (!showContingencyCount || !isBuiltCurrentNode) {
            setIsLoading(false);
            setSimulatedContingencyCount(null);
            // return a no-op cleanup function to ignore eslint consistent-return
            return () => {};
        }

        const contingencyListsInfos: ContingencyListsInfosEnriched[] = getValues(name);
        const hasNoContingencies =
            !contingencyListsInfos ||
            (contingencyListsInfos.length ?? 0) === 0 ||
            contingencyListsInfos.every(
                (contingencyList) =>
                    !contingencyList[ACTIVATED] || (contingencyList[CONTINGENCY_LISTS]?.length ?? 0) === 0
            );
        if (hasNoContingencies) {
            setIsLoading(false);
            setSimulatedContingencyCount(null);
            // return a no-op cleanup function to ignore eslint consistent-return
            return () => {};
        }

        // timeout to avoid a 'flash' of the loading state when backend responds instantly
        let loadingTimeoutId: ReturnType<typeof setTimeout>;

        const controller = new AbortController();
        // build a signal which allows us to cancel the fetch by calling controller.abort() or the timeout fires
        const abortSignal = AbortSignal.any([controller.signal, AbortSignal.timeout(DEFAULT_TIMEOUT_MS)]);
        setIsLoading(true);

        fetchContingencyCount?.(
            contingencyListsInfos
                .filter((lists) => lists[ACTIVATED])
                .flatMap((lists) => lists[CONTINGENCY_LISTS]?.map((contingencyList) => contingencyList[ID])),
            abortSignal
        )
            .then((contingencyCount) => {
                const enrichedContingencyCount: ContingencyCountEnriched = enrichContingencyCount(
                    contingencyCount,
                    contingencyListsInfos
                );
                setSimulatedContingencyCount(analyzeContingencies(enrichedContingencyCount));
                loadingTimeoutId = setTimeout(() => {
                    setIsLoading(false);
                }, 500);
            })
            .catch((error) => {
                setSimulatedContingencyCount(null);
                if (abortSignal.aborted && abortSignal.reason?.message === IGNORE_SIGNAL) {
                    return;
                }
                setIsLoading(false);
                snackWithFallback(snackError, error, { headerId: 'getSecurityAnalysisContingenciesCountError' });
            });

        return () => {
            controller?.abort(new Error(IGNORE_SIGNAL));
            clearTimeout(loadingTimeoutId);
        };
    }, [
        snackError,
        getValues,
        fetchContingencyCount,
        showContingencyCount,
        isBuiltCurrentNode,
        name,
        contingencyCountRefreshTrigger,
    ]);

    const renderContingencyCount = () => {
        if (!isBuiltCurrentNode) {
            return (
                <Alert variant="standard" severity="warning" sx={styles.alert}>
                    <FormattedMessage id="contingencyCountImpossibleOnUnbuiltNode" />
                </Alert>
            );
        }
        if (isLoading) {
            return <Alert variant="standard" icon={<CircularProgress size={22} />} severity="info" sx={styles.alert} />;
        }
        if (
            simulatedContingencyCount === null ||
            (simulatedContingencyCount.success && simulatedContingencyCount.nbContingencies === 0)
        ) {
            return (
                <Alert variant="standard" severity="error" sx={styles.alert}>
                    <FormattedMessage id="noContingency" />
                </Alert>
            );
        }

        return simulatedContingencyCount.success ? (
            <Alert variant="standard" icon={false} severity="info" sx={styles.alert}>
                <FormattedMessage
                    id="xContingenciesWillBeSimulatedAndYNotFound"
                    values={{
                        x: simulatedContingencyCount?.nbContingencies ?? '...',
                        y: simulatedContingencyCount?.notFoundElements ?? '...',
                    }}
                />
            </Alert>
        ) : (
            <Alert variant="standard" severity="error" sx={styles.error}>
                <FormattedMessage
                    id="contingenciesWillNotBeSimulated"
                    values={{
                        invalidContingencyErrorMessage: simulatedContingencyCount.invalidContingencyErrorMessage,
                    }}
                />
            </Alert>
        );
    };

    const columnsDefinition = useMemo(() => {
        return COLUMNS_DEFINITIONS_CONTINGENCY_LISTS_INFOS.map(
            (colDef) =>
                ({
                    ...colDef,
                    label: intl.formatMessage({ id: colDef.label }),
                }) satisfies DndColumn
        );
    }, [intl]);

    return (
        <Grid size={12}>
            <Stack>
                <ParameterTableField
                    name={name}
                    columnsDefinition={columnsDefinition}
                    tableHeight={270}
                    onChange={handleOnChange}
                    isValidRow={isValidContingencyRow}
                />
                {showContingencyCount && renderContingencyCount()}
            </Stack>
        </Grid>
    );
}

export const ContingencyTable = forwardRef(ContingencyTableWithApiRef);
