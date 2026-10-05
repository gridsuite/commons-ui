/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useIntl } from 'react-intl';
import { useMemo } from 'react';
import { useFieldArray } from 'react-hook-form';
import { FieldConstants } from '../../../utils';
import { DndColumn, DndColumnType, DndTable } from '../../../components';
import { SubstationsAutocomplete } from './substationsAutocomplete';

interface SubstationsGeneratorsOrderingPaneProps {
    substations: string[];
}

export function SubstationsGeneratorsOrderingPane({ substations }: Readonly<SubstationsGeneratorsOrderingPaneProps>) {
    const intl = useIntl();
    const id = FieldConstants.SUBSTATIONS_GENERATORS_ORDERING;

    const columnsDefinition = useMemo<DndColumn[]>(() => {
        return [
            {
                label: intl
                    .formatMessage({ id: 'Substations' })
                    .toLowerCase()
                    .replace(/^\w/, (c) => c.toUpperCase()),
                dataKey: FieldConstants.SUBSTATION_IDS,
                initialValue: [] as unknown[],
                editable: true,
                type: DndColumnType.CUSTOM,
                component: (rowIndex: number) =>
                    SubstationsAutocomplete({
                        name: `${id}[${rowIndex}].${FieldConstants.SUBSTATION_IDS}`,
                        substations,
                    }),
            },
        ] satisfies DndColumn[];
    }, [intl, substations, id]);

    const useFieldArraySubstationsGeneratorsOrdering = useFieldArray({
        name: `${id}`,
    });

    const newRowData = useMemo(() => {
        const newRow: Record<string, unknown[] | null> = {};
        columnsDefinition.forEach((column) => {
            newRow[column.dataKey] = column.initialValue;
        });
        return newRow;
    }, [columnsDefinition]);
    const createSubstationsGeneratorsOrderingRows = () => [newRowData];

    return (
        <DndTable
            name={`${id}`}
            useFieldArrayOutput={useFieldArraySubstationsGeneratorsOrdering}
            createRows={createSubstationsGeneratorsOrderingRows}
            columnsDefinition={columnsDefinition}
            tableHeight={270}
            withAddRowsDialog={false}
            rowDataTestId="SubstationsHierarchyLine"
        />
    );
}
