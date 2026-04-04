/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { Alert, CircularProgress, Grid } from '@mui/material';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useWatch } from 'react-hook-form';
import { UUID } from 'node:crypto';
import { useSnackMessage } from '../../../../hooks';
import { ACTIVATED, ID } from '../parameter-table';
import { CONTINGENCY_LISTS } from '../constants';
import { COLUMNS_DEFINITIONS_CONTINGENCY_LISTS_INFOS } from './columns-definitions';
import { ContingencyCount, ContingencyListsInfos } from './types';
import { DEFAULT_TIMEOUT_MS, IGNORE_SIGNAL } from '../../../../services';
import { MuiStyles, snackWithFallback } from '../../../../utils';
import ParameterDndTableField from '../parameter-dnd-table-field';
import { getDefaultRowData } from '../../../dnd-table-v2';

const styles = {
    alert: { color: 'text.primary', paddingTop: 0, paddingBottom: 0 },
} satisfies MuiStyles;

export function ContingencyTable({
    name,
    showContingencyCount = false,
    fetchContingencyCount,
    isBuiltCurrentNode,
}: Readonly<{
    name: string;
    showContingencyCount: boolean;
    fetchContingencyCount?: (contingencyLists: UUID[] | null, abortSignal: AbortSignal) => Promise<ContingencyCount>;
    isBuiltCurrentNode?: boolean; // necessary if we want to show the contingency count
}>) {
    const intl = useIntl();
    const [simulatedContingencyCount, setSimulatedContingencyCount] = useState<ContingencyCount | null>(null);
    const contingencyListsInfos: ContingencyListsInfos[] = useWatch({ name });
    const [isLoading, setIsLoading] = useState(false);
    const { snackError } = useSnackMessage();

    const translatedColumnsDefinition = useMemo(() => {
        return COLUMNS_DEFINITIONS_CONTINGENCY_LISTS_INFOS.map((colDef) => ({
            ...colDef,
            label: intl.formatMessage({ id: colDef.label }),
        }));
    }, [intl]);

    const newDefaultRowData = useMemo(() => {
        return getDefaultRowData(COLUMNS_DEFINITIONS_CONTINGENCY_LISTS_INFOS);
    }, []);

    const createRows = useCallback(() => [newDefaultRowData], [newDefaultRowData]);

    useEffect(() => {
        if (!showContingencyCount || !isBuiltCurrentNode) {
            setIsLoading(false);
            // return a no-op cleanup function to ignore eslint consistent-return
            return () => {};
        }

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
    }, [snackError, contingencyListsInfos, fetchContingencyCount, showContingencyCount, isBuiltCurrentNode]);

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
            <ParameterDndTableField
                name={name}
                columnsDefinition={translatedColumnsDefinition}
                tableHeight={270}
                createRows={createRows}
            />
            {showContingencyCount && renderContingencyCount()}
        </Grid>
    );
}
