/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { Alert, CircularProgress, Grid } from '@mui/material';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useFormContext } from 'react-hook-form';
import { UUID } from 'node:crypto';
import { ACTIVATED, ID, ParameterTableField } from '../parameter-table-field';
import { COLUMNS_DEFINITIONS_CONTINGENCY_LISTS_INFOS, isValidContingencyRow } from './columns-definitions';
import { ContingencyCount, ContingencyListsInfosEnriched } from './types';
import { useSnackMessage } from '../../../../hooks';
import { CONTINGENCY_LISTS } from '../constants';
import { DEFAULT_TIMEOUT_MS, IGNORE_SIGNAL } from '../../../../services';
import { MuiStyles, snackWithFallback } from '../../../../utils';
import { DndColumn } from '../../../dnd-table';

const styles = {
    alert: { color: 'text.primary', paddingTop: 0, paddingBottom: 0 },
} satisfies MuiStyles;

export type ContingencyTableProps = {
    name: string;
    showContingencyCount: boolean;
    fetchContingencyCount?: (contingencyLists: UUID[] | null, abortSignal: AbortSignal) => Promise<ContingencyCount>;
    isBuiltCurrentNode?: boolean; // necessary if we want to show the contingency count
    contingencyCountRefreshTrigger?: number; // optional: increase this from outside to force a count refresh
};

export function ContingencyTable({
    name,
    showContingencyCount = false,
    fetchContingencyCount,
    isBuiltCurrentNode,
    contingencyCountRefreshTrigger: externalContingencyCountRefreshTrigger,
}: Readonly<ContingencyTableProps>) {
    const intl = useIntl();
    const [simulatedContingencyCount, setSimulatedContingencyCount] = useState<ContingencyCount | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const [contingencyCountRefreshTrigger, setContingencyCountRefreshTrigger] = useState(0);
    const prevTriggersRef = useRef({
        internalTrigger: contingencyCountRefreshTrigger,
        externalTrigger: externalContingencyCountRefreshTrigger,
    });

    const { snackError } = useSnackMessage();

    const { getValues } = useFormContext();

    const handleOnChange = useCallback(() => {
        setContingencyCountRefreshTrigger((prevValue) => prevValue + 1);
    }, []);

    const columnsDefinition = useMemo(() => {
        return COLUMNS_DEFINITIONS_CONTINGENCY_LISTS_INFOS.map(
            (colDef) =>
                ({
                    ...colDef,
                    label: intl.formatMessage({ id: colDef.label }),
                }) satisfies DndColumn
        );
    }, [intl]);

    useEffect(() => {
        const prevTriggers = prevTriggersRef.current;
        prevTriggersRef.current = {
            internalTrigger: contingencyCountRefreshTrigger,
            externalTrigger: externalContingencyCountRefreshTrigger,
        };

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
        if (
            hasNoContingencies ||
            (externalContingencyCountRefreshTrigger === 0 /* reset signal */ &&
                prevTriggers.internalTrigger === contingencyCountRefreshTrigger)
        ) {
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
                setSimulatedContingencyCount(contingencyCount);
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
        externalContingencyCountRefreshTrigger,
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
        if (simulatedContingencyCount?.contingencies === 0 && simulatedContingencyCount.notFoundElements === 0) {
            return (
                <Alert variant="standard" severity="error" sx={styles.alert}>
                    <FormattedMessage id="noContingency" />
                </Alert>
            );
        }
        return (
            <Alert variant="standard" icon={false} severity="info" sx={styles.alert}>
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
        <Grid container direction="column">
            <ParameterTableField
                name={name}
                columnsDefinition={columnsDefinition}
                tableHeight={270}
                onChange={handleOnChange}
                isValidRow={isValidContingencyRow}
            />
            {showContingencyCount && renderContingencyCount()}
        </Grid>
    );
}
