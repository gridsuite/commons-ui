/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { TableCell } from '@mui/material';
import { DirectoryItemsInput, FloatInput, MuiSelectInput, SwitchInput, TextInput } from '../../inputs';

function EditableTableCell(arrayFormName: string, rowIndex: number, column: any, onRowChanged: () => void) {
    return (
        <TableCell
            key={column.dataKey}
            sx={{
                width: column.width,
            }}
        >
            {column.directoryItems && (
                <DirectoryItemsInput
                    name={`${arrayFormName}[${rowIndex}].${column.dataKey}`}
                    equipmentTypes={column.equipmentTypes}
                    elementType={column.elementType}
                    titleId={column.titleId}
                    hideErrorMessage
                    label={undefined}
                    itemFilter={undefined}
                    onRowChanged={onRowChanged}
                    allowMultiSelect={column.allowMultiDirectoryItemsSelect}
                />
            )}
            {column.menuItems && (
                <MuiSelectInput
                    name={`${arrayFormName}[${rowIndex}].${column.dataKey}`}
                    options={column.equipmentTypes}
                    size="small"
                    fullWidth
                />
            )}
            {column.checkboxItems && (
                <span onChange={onRowChanged}>
                    <SwitchInput name={`${arrayFormName}[${rowIndex}].${column.dataKey}`} />
                </span>
            )}
            {column.floatItems && <FloatInput name={`${arrayFormName}[${rowIndex}].${column.dataKey}`} />}
            {column.textItems && (
                <TextInput
                    name={`${arrayFormName}[${rowIndex}].${column.dataKey}`}
                    formProps={{ disabled: !column.editable }}
                />
            )}
        </TableCell>
    );
}

export default EditableTableCell;
