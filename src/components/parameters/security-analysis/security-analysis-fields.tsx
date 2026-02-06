/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Alert, Box } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useWatch } from 'react-hook-form';
import { IColumnsDef, SensitivityTable } from '../sensi';
import { useCreateRowDataSensi } from '../../../hooks';
import * as sensiParam from '../sensi/columns-definitions';
import { CONTINGENCY_LISTS, IContingencyList, ISAParameters } from '../common';
import { ACTIVATED, CONTINGENCIES } from '../sensi/constants';
import { ID } from '../../../utils';
import { isValidSAParameterRow } from './use-security-analysis-parameters-form';

export function SecurityAnalysisFields({
    fetchContingencyCount,
}: Readonly<{
    params: ISAParameters | null;
    fetchContingencyCount: (contingencyListNames: string[] | null) => Promise<number>;
}>) {
    const intl = useIntl();
    const [simulatedContingencyCount, setSimulatedContingencyCount] = useState<number | null>(0);
    const [rowData, useFieldArrayOutput] = useCreateRowDataSensi(sensiParam.SAContingencyLists);
    const contingencyLists: IContingencyList[] = useWatch({ name: CONTINGENCY_LISTS });

    const getColumnsDefinition = useCallback(
        (saColumns: IColumnsDef[]) => {
            if (saColumns) {
                return saColumns.map((column) => ({
                    ...column,
                    label: intl.formatMessage({ id: column.label }),
                }));
            }
            return [];
        },
        [intl]
    );

    useEffect(() => {
        if (!contingencyLists || contingencyLists.length === 0) {
            setSimulatedContingencyCount(null);
            return;
        }

        fetchContingencyCount(
            contingencyLists
                .filter((list) => list[ACTIVATED])
                .flatMap((list) => list[CONTINGENCIES]?.map((contingency) => contingency[ID]))
        ).then((contingencyCount) => {
            setSimulatedContingencyCount(contingencyCount);
        });
    }, [contingencyLists, fetchContingencyCount]);

    function getSimulatedContingencyCountLabel() {
        return simulatedContingencyCount ?? '...';
    }

    return (
        <Box>
            <SensitivityTable
                arrayFormName="contingencyLists" // constant
                useFieldArrayOutput={useFieldArrayOutput}
                columnsDefinition={getColumnsDefinition(sensiParam.COLUMNS_DEFINITIONS_CONTINGENCY_LISTS)}
                tableHeight={250}
                createRows={rowData}
                onFormChanged={() => {}}
                isValidParameterRow={isValidSAParameterRow}
            />
            <Alert variant="standard" severity="info">
                <FormattedMessage
                    id="xContingenciesWillBeSimulated"
                    values={{
                        x: getSimulatedContingencyCountLabel(),
                    }}
                />
            </Alert>
        </Box>
    );
}
