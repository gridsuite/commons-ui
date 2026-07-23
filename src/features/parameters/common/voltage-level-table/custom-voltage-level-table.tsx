/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { useFieldArray } from 'react-hook-form';
import { CustomTooltip } from '../../../../components/ui/tooltip/CustomTooltip';
import {
    LimitReductionIColumnsDef,
    LIMIT_REDUCTIONS_FORM,
    ILimitReductionsByVoltageLevel,
} from '../limitreductions/columns-definitions';
import { LimitReductionTableRow } from '../limitreductions/limit-reduction-table-row';
import { CustomVoltageLevelTableRow } from './custom-voltage-level-table-row';

interface LimitReductionsTableProps {
    columnsDefinition: LimitReductionIColumnsDef[];
    tableHeight?: number;
    tableMinWidth?: number;
    formName: string;
    limits?: ILimitReductionsByVoltageLevel[];
}

const stickyFirstColSx = {
    position: 'sticky',
    left: 0,
    zIndex: 3,
    backgroundColor: 'background.paper',
    textAlign: 'center',
};

export function CustomVoltageLevelTable({
    formName,
    columnsDefinition,
    tableHeight,
    tableMinWidth,
    limits,
}: Readonly<LimitReductionsTableProps>) {
    const { fields: rows } = useFieldArray({
        name: formName,
    });

    return (
        <TableContainer
            sx={{
                ...(tableHeight ? { height: tableHeight } : {}),
                width: 'inherit',
                overflowX: 'auto',
                border: 'solid 0px rgba(0,0,0,0.1)',
            }}
        >
            <Table
                stickyHeader
                size="small"
                sx={{ tableLayout: 'fixed', ...(tableMinWidth ? { minWidth: tableMinWidth } : {}) }}
            >
                <TableHead>
                    <TableRow>
                        {columnsDefinition.map((column, index) => (
                            <CustomTooltip title={column.tooltip}>
                                <TableCell
                                    key={column.dataKey}
                                    sx={index === 0 ? stickyFirstColSx : { textAlign: 'center' }}
                                >
                                    {column.label}
                                </TableCell>
                            </CustomTooltip>
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
