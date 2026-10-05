/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useIntl } from 'react-intl';
import { useMemo } from 'react';
import { useFieldArray } from 'react-hook-form';
import { IconButton, Tooltip } from '@mui/material';
import { Info as InfoIcon } from '@mui/icons-material';
import { DndColumn, DndColumnType, DndTable } from '../../../components';
import { ElementType, EquipmentType, FieldConstants } from '../../../utils';

interface FrequencyReservePaneProps {
    id?: string;
}

export function FrequencyReservePane({
    id = FieldConstants.GENERATORS_FREQUENCY_RESERVES,
}: Readonly<FrequencyReservePaneProps>) {
    const intl = useIntl();

    const columnsDefinition = useMemo<DndColumn[]>(() => {
        return [
            {
                label: intl
                    .formatMessage({ id: 'GeneratorFilter' })
                    .toLowerCase()
                    .replace(/^\w/, (c) => c.toUpperCase()),
                dataKey: FieldConstants.GENERATORS_FILTERS,
                initialValue: [],
                editable: true,
                type: DndColumnType.DIRECTORY_ITEMS,
                equipmentTypes: [EquipmentType.GENERATOR],
                elementType: ElementType.FILTER,
                titleId: 'FiltersListsSelection',
                dataTestId: 'GeneratorFilterInput',
            },
            {
                label: intl
                    .formatMessage({ id: 'FrequencyReserve' })
                    .toLowerCase()
                    .replace(/^\w/, (c) => c.toUpperCase()),
                dataKey: FieldConstants.FREQUENCY_RESERVE,
                initialValue: null,
                editable: true,
                type: DndColumnType.NUMERIC,
                dataTestId: 'FrequencyReserveInput',
            },
        ] satisfies DndColumn[];
    }, [intl]);

    const useFieldArrayOutputFrequencyReserve = useFieldArray({
        name: `${id}`,
    });

    const newRowData = useMemo(() => {
        const newRow: Record<string, unknown[] | null> = {};
        columnsDefinition.forEach((column) => {
            newRow[column.dataKey] = column.initialValue;
        });
        return newRow;
    }, [columnsDefinition]);
    const createFrequencyReserveRows = () => [newRowData];

    const generatorsFiltersTooltip = (
        <Tooltip
            title={intl.formatMessage({
                id: 'GeneratorsFiltersFrequencyReserveToolTip',
            })}
            placement="left"
        >
            <span>
                <IconButton disabled>
                    <InfoIcon />
                </IconButton>
            </span>
        </Tooltip>
    );

    const completedColumnsDefinition = columnsDefinition;
    completedColumnsDefinition[0] = {
        ...completedColumnsDefinition[0],
        extra: generatorsFiltersTooltip,
    };

    return (
        <DndTable
            name={`${id}`}
            useFieldArrayOutput={useFieldArrayOutputFrequencyReserve}
            createRows={createFrequencyReserveRows}
            columnsDefinition={completedColumnsDefinition}
            tableHeight={270}
            withAddRowsDialog={false}
            rowDataTestId="FrequencyReserveLine"
        />
    );
}
