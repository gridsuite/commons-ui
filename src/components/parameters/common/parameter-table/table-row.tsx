/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { TableCell, TableRow, Tooltip, IconButton } from '@mui/material';
import { useState } from 'react';
import { useIntl } from 'react-intl';
import { Delete as DeleteIcon } from '@mui/icons-material';
import EditableTableCell from './table-cell';
import { IColumnsDef } from './types';

interface TableRowComponentProps {
    arrayFormName: string;
    columnsDefinition: IColumnsDef[];
    index: number;
    handleDeleteButton: (index: number) => void;
    disableDelete: boolean;
    handleRowChanged: (a: number) => void;
}

export function TableRowComponent({
    arrayFormName,
    columnsDefinition,
    index,
    handleDeleteButton,
    disableDelete = false,
    handleRowChanged,
}: Readonly<TableRowComponentProps>) {
    const [isHover, setIsHover] = useState(false);
    const intl = useIntl();

    function handleHover(enter: boolean) {
        return setIsHover(enter);
    }

    const handleCellChanged = () => {
        handleRowChanged(index);
    };

    return (
        <TableRow onMouseEnter={() => handleHover(true)} onMouseLeave={() => handleHover(false)}>
            {columnsDefinition.map((column: IColumnsDef) =>
                EditableTableCell(arrayFormName, index, column, handleCellChanged)
            )}
            {!disableDelete && (
                <TableCell sx={{ width: '5rem', textAlign: 'center' }}>
                    {isHover && (
                        <Tooltip
                            title={intl.formatMessage({
                                id: 'DeleteRows',
                            })}
                        >
                            <IconButton onClick={() => handleDeleteButton(index)}>
                                <DeleteIcon />
                            </IconButton>
                        </Tooltip>
                    )}
                </TableCell>
            )}
        </TableRow>
    );
}
