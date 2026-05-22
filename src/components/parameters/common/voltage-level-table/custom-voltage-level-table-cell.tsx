/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { TableCell } from '@mui/material';
import { LimitReductionIColumnsDef } from '../limitreductions/columns-definitions';
import { VOLTAGE_LEVEL } from '../constants';
import { FloatInput, RawReadOnlyInput } from '../../../inputs';

export function CustomVoltageLevelTableCell({
    formName,
    rowIndex,
    column,
}: Readonly<{
    formName: string;
    rowIndex: number;
    column: LimitReductionIColumnsDef;
}>) {
    return (
        <TableCell sx={{ fontWeight: 'bold' }}>
            {column.dataKey === VOLTAGE_LEVEL ? (
                <RawReadOnlyInput name={`${formName}[${rowIndex}].${column.dataKey}`} />
            ) : (
                <FloatInput name={`${formName}[${rowIndex}].${column.dataKey}`} />
            )}
        </TableCell>
    );
}
