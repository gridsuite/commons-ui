/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { Alert, Stack } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { FieldValues, useWatch } from 'react-hook-form';
import { UUID } from 'node:crypto';
import { useCreateRowData } from '../../../../hooks';
import { IColumnsDef, ID, ACTIVATED, ParameterTable } from '../parameter-table';
import { CONTINGENCY_LISTS, CONTINGENCY_LISTS_INFOS } from '../constants';
import { COLUMNS_DEFINITIONS_CONTINGENCY_LISTS_INFOS, ParamContingencyLists } from './columns-definitions';
import { IContingencyListsInfos } from './types';

export function ContingencyTable({
    showContingencyCount = false,
    fetchContingencyCount,
}: Readonly<{
    showContingencyCount: boolean;
    fetchContingencyCount?: (contingencyLists: UUID[] | null) => Promise<number>;
}>) {
    const intl = useIntl();
    const [simulatedContingencyCount, setSimulatedContingencyCount] = useState<number | null>(0);
    const [rowData, useFieldArrayOutput] = useCreateRowData(ParamContingencyLists);
    const contingencyListsInfos: IContingencyListsInfos[] = useWatch({ name: CONTINGENCY_LISTS_INFOS });

    const getColumnsDefinition = useCallback(
        (columns: IColumnsDef[]) => {
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

    console.log('contingencies: ', contingencyListsInfos);

    useEffect(() => {
        if (showContingencyCount) {
            if (!contingencyListsInfos || contingencyListsInfos.length === 0) {
                setSimulatedContingencyCount(null);
                return;
            }

            fetchContingencyCount?.(
                contingencyListsInfos
                    .filter((lists) => lists[ACTIVATED])
                    .flatMap((lists) => lists[CONTINGENCY_LISTS]?.map((contingencyList) => contingencyList[ID]))
            )
                .then((contingencyCount) => {
                    setSimulatedContingencyCount(contingencyCount);
                })
                .catch(() => {
                    setSimulatedContingencyCount(null);
                });
        }
    }, [contingencyListsInfos, fetchContingencyCount, showContingencyCount]);

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
            {showContingencyCount && (
                <Alert variant="standard" severity="info">
                    <FormattedMessage
                        id="xContingenciesWillBeSimulated"
                        values={{
                            x: simulatedContingencyCount ?? '...',
                        }}
                    />
                </Alert>
            )}
        </Stack>
    );
}
