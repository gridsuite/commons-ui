/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { TableRow } from '@mui/material';

import { CustomVoltageLevelTableCell } from './custom-voltage-level-table-cell';
import { LimitScalingIColumnsDef } from '../limitscalings/columns-definitions';

interface TableRowComponentProps {
    formName: string;
    columnsDefinition: LimitScalingIColumnsDef[];
    index: number;
}

export function CustomVoltageLevelTableRow({ formName, columnsDefinition, index }: Readonly<TableRowComponentProps>) {
    return (
        <TableRow>
            {columnsDefinition.map((column: LimitScalingIColumnsDef) => (
                <CustomVoltageLevelTableCell
                    key={`${column.dataKey}`}
                    formName={formName}
                    rowIndex={index}
                    column={column}
                />
            ))}
        </TableRow>
    );
}
