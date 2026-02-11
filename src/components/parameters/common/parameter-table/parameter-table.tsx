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
import { useCallback, useRef } from 'react';
import { useIntl } from 'react-intl';
import { FieldValues, UseFieldArrayReturn, useFormContext } from 'react-hook-form';
import { TableRowComponent } from './table-row';
import { MAX_ROWS_NUMBER } from './constants';
import { IColumnsDef } from './type';

interface ParameterTableProps {
    arrayFormName: string;
    useFieldArrayOutput: UseFieldArrayReturn;
    columnsDefinition: IColumnsDef[];
    tableHeight: number;
    createRows: (a: number) => void;
    disableAdd?: boolean;
    disableDelete?: boolean;
    onFormChanged: () => void;
    isValidParameterRow: (fieldValue: FieldValues) => any;
}

export function ParameterTable({
    arrayFormName,
    useFieldArrayOutput,
    columnsDefinition,
    tableHeight,
    createRows,
    disableAdd,
    disableDelete = false,
    onFormChanged,
    isValidParameterRow,
}: Readonly<ParameterTableProps>) {
    const intl = useIntl();
    const { getValues } = useFormContext();
    const { fields: currentRows, append, remove } = useFieldArrayOutput;
    const validRowCountRef = useRef<number>(
        (getValues(arrayFormName) || []).filter((row: FieldValues) => isValidParameterRow(row)).length
    );

    const handleRowChanged = useCallback(
        (index: number) => {
            const currentRowValues = getValues(arrayFormName);
            const row = currentRowValues[index];

            const currentValidRowCount = currentRowValues.filter((r: FieldValues) => isValidParameterRow(r)).length;

            const previousValidRowCount = validRowCountRef.current;
            validRowCountRef.current = currentValidRowCount;

            if (currentValidRowCount !== previousValidRowCount || isValidParameterRow(row)) {
                onFormChanged();
            }
        },
        [getValues, arrayFormName, isValidParameterRow, onFormChanged]
    );

    const handleAddRowsButton = useCallback(() => {
        if (currentRows.length >= MAX_ROWS_NUMBER) {
            return;
        }
        append(createRows(1));
    }, [append, createRows, currentRows.length]);

    const handleDeleteButton = useCallback(
        (index: number) => {
            const currentRowsValues = getValues(arrayFormName);
            if (index >= 0 && index < currentRowsValues.length) {
                const wasValid = isValidParameterRow(currentRowsValues[index]);
                remove(index);
                if (wasValid) {
                    validRowCountRef.current -= 1;
                    onFormChanged();
                }
            }
        },
        [arrayFormName, getValues, isValidParameterRow, onFormChanged, remove]
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
