/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { TableRow } from '@mui/material';
import { useWatch } from 'react-hook-form';
import {
    IccMaterialIColumnsDef,
    SHORT_CIRCUIT_ICC_MATERIAL_ACTIVE,
} from './short-circuit-icc-material-table-columns-definition';
import { ShortCircuitIccMaterialTableCell } from './short-circuit-icc-material-table-cell';

interface ShortCircuitIccMaterialTableRowProps {
    formName: string;
    columnsDefinition: IccMaterialIColumnsDef[];
    index: number;
}

export function ShortCircuitIccMaterialTableRow({
    formName,
    columnsDefinition,
    index,
}: Readonly<ShortCircuitIccMaterialTableRowProps>) {
    const watchRowActive = useWatch({
        name: `${formName}[${index}].${SHORT_CIRCUIT_ICC_MATERIAL_ACTIVE}`,
    });

    return (
        <TableRow>
            {columnsDefinition.map((column: IccMaterialIColumnsDef) => (
                <ShortCircuitIccMaterialTableCell
                    key={`${column.dataKey}`}
                    formName={formName}
                    rowIndex={index}
                    column={column}
                    inputsDisabled={!watchRowActive}
                />
            ))}
        </TableRow>
    );
}
