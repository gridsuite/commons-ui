/* eslint-disable prettier/prettier */
/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { TableCell } from '@mui/material';
import { DirectoryItemsInput, FloatInput, SelectInput, SwitchInput } from '../../inputs';
import { IccClusterIColumnsDef, SHORT_CIRCUIT_ICC_CLUSTER_ACTIVE, SHORT_CIRCUIT_ICC_CLUSTER_FILTERS, SHORT_CIRCUIT_ICC_CLUSTER_TYPE } from './columns-definition';

export function ShortCircuitIccClusterTableCell({
    formName,
    rowIndex,
    column,
    inputsDisabled,
}: Readonly<{
    formName: string;
    rowIndex: number;
    column: IccClusterIColumnsDef;
    inputsDisabled?: boolean;
}>) {
    return (
        <TableCell sx={{ fontWeight: 'bold' }}>
            {column.dataKey === SHORT_CIRCUIT_ICC_CLUSTER_ACTIVE && (
                <SwitchInput name={`${formName}[${rowIndex}].${column.dataKey}`} />
            )}
            {column.dataKey === SHORT_CIRCUIT_ICC_CLUSTER_FILTERS && (
                // <RawReadOnlyInput name={`${formName}[${rowIndex}].${column.dataKey}`} />
                <DirectoryItemsInput
                                    name={`${formName}[${rowIndex}].${column.dataKey}`}
                                    equipmentTypes={column.equipmentTypes}
                                    elementType={column.elementType ?? ''}
                                    titleId={column.titleId}
                                    hideErrorMessage
                                    label={undefined}
                                    itemFilter={undefined}
                                    disable={inputsDisabled}
                                    // onRowChanged={handleDirectoryItemsChange}
                                />
            )}
            {column.dataKey === SHORT_CIRCUIT_ICC_CLUSTER_TYPE && (
                <SelectInput name={`${formName}[${rowIndex}].${column.dataKey}`} label={`${formName}[${rowIndex}].${column.titleId}`} options={['WIND', 'SOLAR', 'HVDC']}/>
            )}
            {column.dataKey !== SHORT_CIRCUIT_ICC_CLUSTER_ACTIVE &&
                column.dataKey !== SHORT_CIRCUIT_ICC_CLUSTER_FILTERS &&
                column.dataKey !== SHORT_CIRCUIT_ICC_CLUSTER_TYPE && (
                    <FloatInput disabled={inputsDisabled} name={`${formName}[${rowIndex}].${column.dataKey}`} />
                )}
        </TableCell>
    );
}
