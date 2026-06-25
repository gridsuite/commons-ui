/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useState, MouseEvent, useCallback } from 'react';
import { useFieldArray } from 'react-hook-form';
import { Box, Grid, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { AddCircle as AddCircleIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { MuiStyles } from '../../../../utils';
import {
    ColumnNumeric,
    ColumnText,
    DndColumnType,
    ErrorInput,
    FieldErrorAlert,
    SELECTED,
    TableNumericalInput,
    TableTextInput,
} from '../../../../components';
import { TemporaryLimitsData } from './limits.types';

const styles = {
    columnsStyle: {
        display: 'inline-flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        margin: 1,
        textTransform: 'none',
    },
} as const satisfies MuiStyles;

interface CustomTableCellProps {
    name: string;
    column: ColumnText | ColumnNumeric;
    disabled: boolean;
    previousValue: number | undefined;
    valueModified: boolean;
}

function EditableTableCell({ name, column, previousValue, valueModified, ...props }: Readonly<CustomTableCellProps>) {
    return (
        <TableCell sx={{ padding: 0.5, maxWidth: column.maxWidth, verticalAlign: 'top' }}>
            {column.type === DndColumnType.NUMERIC ? (
                <TableNumericalInput
                    name={name}
                    previousValue={previousValue}
                    valueModified={valueModified}
                    hideErrorMessage={column.hideErrorMessage}
                    {...props}
                />
            ) : (
                <TableTextInput name={name} hideErrorMessage={column.hideErrorMessage} {...props} />
            )}
        </TableCell>
    );
}

interface TemporaryLimitsTableProps {
    arrayFormName: string;
    columnsDefinition: (ColumnText | ColumnNumeric)[];
    createRow: () => any[];
    disabled?: boolean;
    previousValues: TemporaryLimitsData[];
    getPreviousValue: (
        rowIndex: number,
        column: ColumnText | ColumnNumeric,
        arrayFormName: string,
        temporaryLimits: TemporaryLimitsData[]
    ) => number | undefined;
    isValueModified: (rowIndex: number, arrayFormName: string) => boolean;
    disableAddingRows?: boolean;
}

export function TemporaryLimitsTable({
    arrayFormName,
    columnsDefinition,
    createRow,
    disabled = false,
    previousValues,
    getPreviousValue,
    isValueModified,
    disableAddingRows = false,
}: Readonly<TemporaryLimitsTableProps>) {
    const { fields, append, remove } = useFieldArray({ name: arrayFormName });
    const [hoveredRowIndex, setHoveredRowIndex] = useState(-1);

    const handleMouseEnter = useCallback((event: MouseEvent<HTMLTableRowElement>) => {
        const { index } = event.currentTarget.dataset;
        if (index !== undefined) {
            setHoveredRowIndex(Number(index));
        }
    }, []);

    const handleMouseLeave = useCallback(() => {
        setHoveredRowIndex(-1);
    }, []);

    const handleRemove = useCallback(
        (event: MouseEvent<HTMLButtonElement>) => {
            const { index } = event.currentTarget.dataset;
            if (index !== undefined) {
                remove(Number(index));
            }
        },
        [remove]
    );

    function renderTableCell(rowId: string, rowIndex: number, column: ColumnText | ColumnNumeric) {
        const name = `${arrayFormName}[${rowIndex}].${column.dataKey}`;
        return (
            <EditableTableCell
                key={rowId + column.dataKey}
                name={name}
                column={column}
                disabled={disabled}
                previousValue={
                    getPreviousValue ? getPreviousValue(rowIndex, column, arrayFormName, previousValues) : undefined
                }
                valueModified={isValueModified ? isValueModified(rowIndex, arrayFormName) : false}
            />
        );
    }

    const handleAddRowButton = useCallback(() => {
        const rowsToAdd = createRow().map((row) => {
            return { ...row, [SELECTED]: false };
        });

        append(rowsToAdd);
    }, [append, createRow]);

    function renderTableHead() {
        return (
            <TableHead>
                <TableRow>
                    {columnsDefinition.map((column) => (
                        <TableCell key={column.dataKey} sx={{ width: column.width, maxWidth: column.maxWidth }}>
                            <Box sx={styles.columnsStyle}>{column.label}</Box>
                        </TableCell>
                    ))}
                    <TableCell>
                        <IconButton
                            color="primary"
                            onClick={handleAddRowButton}
                            disabled={disabled || disableAddingRows}
                        >
                            <AddCircleIcon />
                        </IconButton>
                    </TableCell>
                </TableRow>
            </TableHead>
        );
    }

    const renderTableRow = (rowId: string, index: number) => (
        <TableRow key={rowId} data-index={index} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
            {columnsDefinition.map((column) => renderTableCell(rowId, index, column))}
            <TableCell key={`${rowId}delete`}>
                <IconButton data-index={index} color="primary" disabled={disabled} onClick={handleRemove}>
                    <DeleteIcon visibility={index === hoveredRowIndex ? 'visible' : 'hidden'} />
                </IconButton>
            </TableCell>
        </TableRow>
    );

    function renderTableBody() {
        return (
            <TableBody>
                {fields.map((value: Record<'id', string>, index: number) => renderTableRow(value.id, index))}
            </TableBody>
        );
    }

    return (
        <Grid item container spacing={1}>
            <Grid item container>
                <TableContainer>
                    <Table stickyHeader size="small" padding="none">
                        {renderTableHead()}
                        {renderTableBody()}
                    </Table>
                </TableContainer>
                <ErrorInput name={arrayFormName} InputField={FieldErrorAlert} />
            </Grid>
        </Grid>
    );
}
