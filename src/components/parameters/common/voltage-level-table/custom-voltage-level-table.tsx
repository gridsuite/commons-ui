/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip } from '@mui/material';
import { useFieldArray } from 'react-hook-form';
import {
    LimitReductionIColumnsDef,
    LIMIT_REDUCTIONS_FORM,
    ILimitReductionsByVoltageLevel,
} from '../limitreductions/columns-definitions';
import { LimitReductionTableRow } from '../limitreductions/limit-reduction-table-row';
import { CustomVoltageLevelTableRow } from './custom-voltage-level-table-row';

interface LimitReductionsTableProps {
    columnsDefinition: LimitReductionIColumnsDef[];
    tableHeight: number;
    formName: string;
    limits?: ILimitReductionsByVoltageLevel[];
}

export function CustomVoltageLevelTable({
    formName,
    columnsDefinition,
    tableHeight,
    limits,
}: Readonly<LimitReductionsTableProps>) {
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
                            <Tooltip title={column.tooltip}>
                                <TableCell
                                    key={column.dataKey}
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
                    {rows.map((row, index) =>
                        formName === LIMIT_REDUCTIONS_FORM && limits ? (
                            <LimitReductionTableRow
                                key={`${row.id}`}
                                columnsDefinition={columnsDefinition}
                                index={index}
                                limits={limits}
                            />
                        ) : (
                            <CustomVoltageLevelTableRow
                                key={`${row.id}`}
                                columnsDefinition={columnsDefinition}
                                index={index}
                                formName={formName}
                            />
                        )
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
