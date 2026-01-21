/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { IconButton, TableCell, TableRow, Tooltip } from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import { useWatch } from 'react-hook-form';
import { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { IccClusterIColumnsDef, SHORT_CIRCUIT_ICC_CLUSTER_ACTIVE } from './columns-definition';
import { ShortCircuitIccClusterTableCell } from './short-circuit-icc-cluster-table-cell';

interface ShortCircuitIccClusterTableRowProps {
    formName: string;
    columnsDefinition: IccClusterIColumnsDef[];
    index: number;
    onDeleteButton: (index: number) => void;
}

export function ShortCircuitIccClusterTableRow({
    formName,
    columnsDefinition,
    index,
    onDeleteButton,
}: Readonly<ShortCircuitIccClusterTableRowProps>) {
    const [isHover, setIsHover] = useState(false);
    const watchRowActive = useWatch({
        name: `${formName}[${index}].${SHORT_CIRCUIT_ICC_CLUSTER_ACTIVE}`,
    });

    return (
        <TableRow onMouseEnter={() => setIsHover(true)} onMouseLeave={() => setIsHover(false)}>
            {columnsDefinition.map((column: IccClusterIColumnsDef) => (
                <ShortCircuitIccClusterTableCell
                    key={`${column.dataKey}`}
                    formName={formName}
                    rowIndex={index}
                    column={column}
                    inputsDisabled={!watchRowActive}
                />
            ))}
            <TableCell sx={{ width: '5rem', textAlign: 'center' }}>
                {isHover && (
                    <Tooltip title={<FormattedMessage id="DeleteRows" />}>
                        <IconButton onClick={() => onDeleteButton(index)}>
                            <DeleteIcon />
                        </IconButton>
                    </Tooltip>
                )}
            </TableCell>
        </TableRow>
    );
}
