/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { TableCell } from '@mui/material';
import { FloatInput, RawReadOnlyInput, SwitchInput } from '../../inputs';
import {
    IccMaterialIColumnsDef,
    SHORT_CIRCUIT_ICC_MATERIAL_ACTIVE,
    SHORT_CIRCUIT_ICC_MATERIAL_TYPE,
} from './columns-definition';

export function ShortCircuitIccMaterialTableCell({
    formName,
    rowIndex,
    column,
    inputsDisabled,
}: Readonly<{
    formName: string;
    rowIndex: number;
    column: IccMaterialIColumnsDef;
    inputsDisabled?: boolean;
}>) {
    return (
        <TableCell align="center" sx={{ fontWeight: 'bold' }}>
            {column.dataKey === SHORT_CIRCUIT_ICC_MATERIAL_ACTIVE && (
                <SwitchInput size="small" name={`${formName}[${rowIndex}].${column.dataKey}`} />
            )}
            {column.dataKey === SHORT_CIRCUIT_ICC_MATERIAL_TYPE && (
                <RawReadOnlyInput name={`${formName}[${rowIndex}].${column.dataKey}`} />
            )}
            {column.dataKey !== SHORT_CIRCUIT_ICC_MATERIAL_TYPE &&
                column.dataKey !== SHORT_CIRCUIT_ICC_MATERIAL_ACTIVE && (
                    <FloatInput disabled={inputsDisabled} name={`${formName}[${rowIndex}].${column.dataKey}`} />
                )}
        </TableCell>
    );
}
