/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import {
    Box,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tooltip,
    IconButton,
} from '@mui/material';
import { AddCircle as AddCircleIcon } from '@mui/icons-material';
import { useCallback } from 'react';
import { useIntl } from 'react-intl';
import { UseFieldArrayReturn, useFormContext } from 'react-hook-form';
import { TableRowComponent } from './table-row';
import { IColumnsDef } from './columns-definitions';
import {
    ACTIVATED,
    EQUIPMENTS_IN_VOLTAGE_REGULATION,
    HVDC_LINES,
    INJECTIONS,
    MONITORED_BRANCHES,
    PSTS,
    SUPERVISED_VOLTAGE_LEVELS,
} from './constants';
import { MAX_ROWS_NUMBER } from '../../dnd-table';

interface SensitivityTableProps {
    arrayFormName: string;
    useFieldArrayOutput: UseFieldArrayReturn;
    columnsDefinition: IColumnsDef[];
    tableHeight: number;
    createRows: (a: number) => void;
    disableAdd?: boolean;
    disableDelete?: boolean;
    onFormChanged: (a: boolean) => void;
}

export function SensitivityTable({
    arrayFormName,
    useFieldArrayOutput,
    columnsDefinition,
    tableHeight,
    createRows,
    disableAdd,
    disableDelete = false,
    onFormChanged,
}: Readonly<SensitivityTableProps>) {
    const intl = useIntl();
    const { getValues } = useFormContext();
    const { fields: currentRows, append, remove } = useFieldArrayOutput;

    const handleAddRowsButton = useCallback(() => {
        if (currentRows.length >= MAX_ROWS_NUMBER) {
            return;
        }
        append(createRows(1));
    }, [append, createRows, currentRows.length]);

    const handleRowChanged = useCallback(
        (providedArrayFormName: string, index: number, source: string) => {
            const row = getValues(providedArrayFormName)[index];
            const hasMonitoredEquipments =
                row[MONITORED_BRANCHES]?.length > 0 || row[SUPERVISED_VOLTAGE_LEVELS]?.length > 0;
            const hasVariables =
                row[INJECTIONS]?.length > 0 ||
                row[HVDC_LINES]?.length > 0 ||
                row[PSTS]?.length > 0 ||
                row[EQUIPMENTS_IN_VOLTAGE_REGULATION]?.length > 0;

            if (hasMonitoredEquipments && hasVariables && (source === 'switch' || row[ACTIVATED])) {
                onFormChanged(true);
            }
        },
        [onFormChanged, getValues]
    );

    const handleDeleteButton = useCallback(
        (index: number) => {
            const currentRowsValues = getValues(arrayFormName);
            if (index >= 0 && index < currentRowsValues.length) {
                remove(index);
                if (currentRowsValues[index][ACTIVATED]) {
                    onFormChanged(true);
                }
            }
        },
        [arrayFormName, getValues, onFormChanged, remove]
    );

    return (
        <TableContainer
            sx={{
                height: tableHeight,
                border: 'solid 0px rgba(0,0,0,0.1)',
            }}
        >
            <Table stickyHeader size="small" sx={{ tableLayout: 'fixed' }}>
                <TableHead>
                    <TableRow>
                        {columnsDefinition.map((column: IColumnsDef) => (
                            <TableCell key={column.dataKey} sx={{ width: column.width, textAlign: 'center' }}>
                                <Box>{column.label}</Box>
                            </TableCell>
                        ))}
                        <TableCell sx={{ width: '5rem', textAlign: 'center' }}>
                            <Tooltip
                                title={intl.formatMessage({
                                    id: 'AddRows',
                                })}
                            >
                                <span>
                                    <IconButton disabled={disableAdd} onClick={handleAddRowsButton}>
                                        <AddCircleIcon />
                                    </IconButton>
                                </span>
                            </Tooltip>
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {currentRows.map((row: Record<'id', string>, index: number) => (
                        <TableRowComponent
                            key={row.id}
                            arrayFormName={arrayFormName}
                            columnsDefinition={columnsDefinition}
                            index={index}
                            handleDeleteButton={handleDeleteButton}
                            disableDelete={disableDelete}
                            handleRowChanged={handleRowChanged}
                        />
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
