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
    LimitScalingIColumnsDef,
    LIMIT_SCALINGS_FORM,
    ILimitScalingsByVoltageLevel,
} from '../limitscalings/columns-definitions';
import { LimitScalingTableRow } from '../limitscalings/limit-scaling-table-row';
import { CustomVoltageLevelTableRow } from './custom-voltage-level-table-row';

interface LimitScalingsTableProps {
    columnsDefinition: LimitScalingIColumnsDef[];
    tableHeight?: number;
    tableMinWidth?: number;
    formName: string;
    limits?: ILimitScalingsByVoltageLevel[];
}

const stickyFirstColumnSx = {
    position: 'sticky',
    left: 0,
    backgroundColor: 'background.paper',
};

export function CustomVoltageLevelTable({
    formName,
    columnsDefinition,
    tableHeight,
    tableMinWidth,
    limits,
}: Readonly<LimitScalingsTableProps>) {
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
                sx={{
                    tableLayout: 'fixed',
                    ...(tableMinWidth ? { minWidth: tableMinWidth } : {}),
                    '& th:first-of-type': {
                        ...stickyFirstColumnSx,
                        zIndex: 3,
                        textAlign: 'center',
                    },
                    '& td:first-of-type': {
                        ...stickyFirstColumnSx,
                        zIndex: 1,
                    },
                }}
            >
                <TableHead>
                    <TableRow>
                        {columnsDefinition.map((column) => (
                            <CustomTooltip title={column.tooltip}>
                                <TableCell key={column.dataKey} sx={{ textAlign: 'center' }}>
                                    {column.label}
                                </TableCell>
                            </CustomTooltip>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row, index) =>
                        formName === LIMIT_SCALINGS_FORM && limits ? (
                            <LimitScalingTableRow
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
