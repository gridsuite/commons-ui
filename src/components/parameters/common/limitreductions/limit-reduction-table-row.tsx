/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { TableRow } from '@mui/material';
import { LimitReductionTableCell } from './limit-reduction-table-cell';
import { LimitReductionIColumnsDef } from './columns-definitions';

interface TableRowComponentProps {
    columnsDefinition: LimitReductionIColumnsDef[];
    index: number;
}

export function LimitReductionTableRow({ columnsDefinition, index }: Readonly<TableRowComponentProps>) {
    return (
        <TableRow>
            {columnsDefinition.map((column: LimitReductionIColumnsDef) => (
                <LimitReductionTableCell key={`${column.dataKey}`} rowIndex={index} column={column} />
            ))}
        </TableRow>
    );
}
