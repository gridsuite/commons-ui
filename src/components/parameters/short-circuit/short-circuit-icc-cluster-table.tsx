/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import {
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Theme,
    Tooltip,
} from '@mui/material';
import { AddCircle as AddCircleIcon } from '@mui/icons-material';
import { useFieldArray } from 'react-hook-form';
import { FormattedMessage } from 'react-intl';
import { useCallback } from 'react';
import { IccClusterIColumnsDef } from './columns-definition';
import { ShortCircuitIccClusterTableRow } from './short-circuit-icc-cluster-table-row';

interface ShortCircuitIccClusterTableProps {
    columnsDefinition: IccClusterIColumnsDef[];
    formName: string;
    createRows: () => unknown;
}

const styles = {
    tableContainer: (theme: Theme) => ({
        width: '100%',
        border: 'solid 0px rgba(0,0,0,0.1)',
        marginBottom: theme.spacing(4),
    }),
    table: {
        minWidth: '80em',
        tableLayout: 'fixed',
    },
};

export function ShortCircuitIccClusterTable({
    formName,
    columnsDefinition,
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
        <TableContainer sx={styles.tableContainer}>
            <Table stickyHeader size="small" sx={styles.table}>
                <TableHead>
                    <TableRow>
                        {columnsDefinition.map((column) => (
                            <Tooltip key={column.dataKey} title={column.tooltip}>
                                <TableCell align="center" sx={{ width: column.width }}>
                                    {column.label}
                                </TableCell>
                            </Tooltip>
                        ))}
                        <TableCell align="center" sx={{ width: '5%' }}>
                            <Tooltip title={<FormattedMessage id="AddRows" />}>
                                <span>
                                    <IconButton size="small" disabled={false} onClick={handleAddRowsButton}>
                                        <AddCircleIcon fontSize="small" />
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
