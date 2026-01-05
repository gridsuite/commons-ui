/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip } from '@mui/material';
import { useFieldArray } from 'react-hook-form';
import { IccMaterialIColumnsDef } from './short-circuit-icc-material-table-columns-definition';
import { ShortCircuitIccMaterialTableRow } from './short-circuit-icc-material-table-row';

interface ShortCircuitIccMaterialTableProps {
    columnsDefinition: IccMaterialIColumnsDef[];
    tableHeight: number;
    formName: string;
}

export function ShortCircuitIccMaterialTable({
    formName,
    columnsDefinition,
    tableHeight,
}: Readonly<ShortCircuitIccMaterialTableProps>) {
    const { fields: rows } = useFieldArray({
        name: formName,
    });

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
