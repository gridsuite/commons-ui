/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Theme, Tooltip } from '@mui/material';
import { useFieldArray } from 'react-hook-form';
import { IccMaterialIColumnsDef } from './columns-definition';
import { ShortCircuitIccMaterialTableRow } from './short-circuit-icc-material-table-row';

interface ShortCircuitIccMaterialTableProps {
    columnsDefinition: IccMaterialIColumnsDef[];
    formName: string;
}

const styles = {
    tableContainer: (theme: Theme) => ({
        width: '100%',
        border: 'solid 0px rgba(0,0,0,0.1)',
        marginBottom: theme.spacing(4),
        marginTop: theme.spacing(4),
    }),
    table: {
        minWidth: '65em',
        tableLayout: 'fixed',
    },
};

export function ShortCircuitIccMaterialTable({
    formName,
    columnsDefinition,
}: Readonly<ShortCircuitIccMaterialTableProps>) {
    const { fields: rows } = useFieldArray({
        name: formName,
    });

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
                        <TableCell align="center" sx={{ visibility: 'hidden', width: '5%' }} />
                        {/* empty cell for alignment with delete button column in cluster table */}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row, index) => (
                        <ShortCircuitIccMaterialTableRow
                            key={`${row.id}`}
                            columnsDefinition={columnsDefinition}
                            index={index}
                            formName={formName}
                        />
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
