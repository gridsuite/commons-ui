/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useFieldArray } from 'react-hook-form';
import { useMemo } from 'react';
import type { ISensiParameters } from '../components/parameters/sensi/columns-definitions';

export function useCreateRowDataSensi(sensiParam: ISensiParameters) {
    const useFieldArrayOutput = useFieldArray({
        name: sensiParam.name || '',
    });
    const newRowData = useMemo(() => {
        const rowData: { [key: string]: any } = { };
        sensiParam.columnsDef.forEach((column) => {
            rowData[column.dataKey] = column.initialValue;
        });
        return rowData;
    }, [sensiParam.columnsDef]);

    const createNewRowData = () => [newRowData];

    return [createNewRowData, useFieldArrayOutput] as const;
}
