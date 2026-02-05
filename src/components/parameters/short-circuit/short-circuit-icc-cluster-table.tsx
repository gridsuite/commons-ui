/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip } from '@mui/material';
import { AddCircle as AddCircleIcon } from '@mui/icons-material';
import { useFieldArray } from 'react-hook-form';
import { FormattedMessage } from 'react-intl';
import { useCallback } from 'react';
import { IccClusterIColumnsDef } from './columns-definition';
import { ShortCircuitIccClusterTableRow } from './short-circuit-icc-cluster-table-row';

interface ShortCircuitIccClusterTableProps {
    columnsDefinition: IccClusterIColumnsDef[];
    tableHeight: number;
    formName: string;
    createRows: () => unknown;
}

export function ShortCircuitIccClusterTable({
    formName,
    columnsDefinition,
    tableHeight,
    createRows,
}: Readonly<ShortCircuitIccClusterTableProps>) {
    const {
        fields: rows,
        append,
        remove,
    } = useFieldArray({
        name: formName,
    });

    const handleAddRowsButton = useCallback(() => {
        append(createRows());
    }, [append, createRows]);

    const handleDeleteButton = useCallback(
        (index: number) => {
            remove(index);
        },
        [remove]
    );

    return (
        <TableContainer
            sx={{
                height: tableHeight,
                width: 'inherit',
                border: 'solid 0px rgba(0,0,0,0.1)',
            }}
        >
            <Table stickyHeader size="small" sx={{ tableLayout: 'fixed' }}>
                <TableHead>
                    <TableRow>
                        {columnsDefinition.map((column) => (
                            <Tooltip key={column.dataKey} title={column.tooltip}>
                                <TableCell
                                    sx={{
                                        textAlign: 'center',
                                    }}
                                >
                                    {column.label}
                                </TableCell>
                            </Tooltip>
                        ))}
                        <TableCell align="center">
                            <Tooltip title={<FormattedMessage id="AddRows" />}>
                                <span>
                                    <IconButton disabled={false} onClick={handleAddRowsButton}>
                                        <AddCircleIcon />
                                    </IconButton>
                                </span>
                            </Tooltip>
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row, index) => (
                        <ShortCircuitIccClusterTableRow
                            key={`${row.id}`}
                            columnsDefinition={columnsDefinition}
                            index={index}
                            formName={formName}
                            onDeleteButton={handleDeleteButton}
                        />
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
