/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { TableCell, TableRowProps, Tooltip } from '@mui/material';
import { DragIndicator as DragIndicatorIcon } from '@mui/icons-material';
import { DraggableProvided } from '@hello-pangea/dnd';
import { useIntl } from 'react-intl';
import { CheckboxInput } from '../inputs/reactHookForm/booleans/CheckboxInput';
import { ColumnBase, DndColumn, DndColumnType, SELECTED } from './dnd-table.type';
import {
    AutocompleteInput,
    ChipItemsInput,
    DescriptionInput,
    DirectoryItemsInput,
    RawReadOnlyInput,
    SelectInput,
    SwitchInput,
    TableNumericalInput,
    TableTextInput,
} from '../inputs';
import { DeletableTableRow } from './deletable-table-row';

type DefaultTableCellProps = {
    name: string;
    rowIndex: number;
    column: ColumnBase;
};

function DefaultTableCell({ name, rowIndex, column, ...props }: Readonly<DefaultTableCellProps>) {
    return (
        <TableCell key={column.dataKey} sx={{ padding: 1 }}>
            <RawReadOnlyInput name={name} {...props} />
        </TableCell>
    );
}

type EditableTableCellProps = {
    name: string;
    rowIndex: number;
    column: DndColumn;
    previousValue?: number;
    valueModified: boolean;
    disabled?: boolean;
    onChangeCell?: (value?: any) => void;
};

function EditableTableCell({
    name,
    rowIndex,
    column,
    previousValue,
    valueModified,
    onChangeCell,
    ...props
}: Readonly<EditableTableCellProps>) {
    return (
        <TableCell key={column.dataKey} sx={{ padding: 0.5, maxWidth: column.maxWidth }}>
            {column.type === DndColumnType.NUMERIC && (
                <TableNumericalInput
                    {...props}
                    name={name}
                    previousValue={previousValue}
                    valueModified={valueModified}
                    adornment={column?.adornment}
                    isClearable={column?.clearable}
                    style={{
                        textAlign: column?.textAlign,
                    }}
                />
            )}
            {column.type === DndColumnType.TEXT && (
                <TableTextInput {...props} name={name} showErrorMsg={column.showErrorMsg} />
            )}
            {column.type === DndColumnType.AUTOCOMPLETE && (
                <AutocompleteInput
                    forcePopupIcon
                    freeSolo
                    name={name}
                    options={column.options}
                    inputTransform={(value) => value ?? ''}
                    outputTransform={(value) => value}
                    size="small"
                />
            )}
            {column.type === DndColumnType.SELECT && (
                <SelectInput options={column.options} name={name} size="small" fullWidth disableClearable />
            )}
            {column.type === DndColumnType.DIRECTORY_ITEMS && (
                <DirectoryItemsInput
                    name={name}
                    equipmentTypes={column.equipmentTypes}
                    elementType={column.elementType}
                    titleId={column.titleId}
                    hideErrorMessage
                    label={undefined}
                    // callback to propagate a chang to parent via column config
                    onChange={(value) => column.shouldHandleOnChangeCell && onChangeCell?.(value)}
                />
            )}
            {column.type === DndColumnType.CHIP_ITEMS && <ChipItemsInput name={name} hideErrorMessage />}
            {column.type === DndColumnType.SWITCH && (
                // callback to propagate a chang to parent via column config
                <span onChange={() => column.shouldHandleOnChangeCell && onChangeCell?.()}>
                    <SwitchInput name={name} />
                </span>
            )}
            {column.type === DndColumnType.DESCRIPTIONS && <DescriptionInput name={name} />}
            {column.type === DndColumnType.CUSTOM && column.component(rowIndex)}
        </TableCell>
    );
}

export type DndTableRowProps = TableRowProps & {
    rowId: string;
    tableName: string;
    columnsDefinition: DndColumn[];
    index: number;
    provided: DraggableProvided;
    disableDragAndDrop: boolean;
    disabled: boolean;
    previousValues?: any[];
    disableTableCell?: (rowIndex: number, column: any, tableName: string, previousValues?: any[]) => boolean;
    getPreviousValue?: (rowIndex: number, column: any, tableName: string, previousValues?: any[]) => number | undefined;
    isValueModified?: (index: number, tableName: string) => boolean;
    disabledDeletion?: boolean;
    onChangeRow?: (index: number) => void;
    onDeleteRow?: (index: number) => void;
    multiselect?: boolean;
};
export function DndTableRow({
    rowId,
    tableName,
    columnsDefinition,
    index,
    provided,
    disableDragAndDrop,
    disabled,
    disableTableCell,
    previousValues,
    getPreviousValue,
    isValueModified,
    disabledDeletion,
    onChangeRow,
    onDeleteRow,
    multiselect,
}: Readonly<DndTableRowProps>) {
    const intl = useIntl();

    return (
        <DeletableTableRow
            ref={provided.innerRef}
            {...provided.draggableProps}
            onClick={() => {
                onDeleteRow?.(index);
            }}
            disabledDeletion={(disabledDeletion && !onDeleteRow) || multiselect}
        >
            {!disableDragAndDrop && (
                <Tooltip
                    title={intl.formatMessage({
                        id: 'DragAndDrop',
                    })}
                    placement="right"
                >
                    <TableCell sx={{ textAlign: 'center' }} {...(disabled ? {} : { ...provided.dragHandleProps })}>
                        <DragIndicatorIcon />
                    </TableCell>
                </Tooltip>
            )}
            {multiselect && (
                <TableCell sx={{ textAlign: 'center' }}>
                    <CheckboxInput name={`${tableName}[${index}].${SELECTED}`} formProps={{ disabled }} />
                </TableCell>
            )}
            {columnsDefinition.map((column) => {
                const Cell = column.editable ? EditableTableCell : DefaultTableCell;
                return (
                    <Cell
                        key={rowId + column.dataKey}
                        name={`${tableName}[${index}].${column.dataKey}`}
                        rowIndex={index}
                        column={column}
                        disabled={
                            disableTableCell ? disableTableCell(index, column, tableName, previousValues) : disabled
                        }
                        previousValue={
                            getPreviousValue ? getPreviousValue(index, column, tableName, previousValues) : undefined
                        }
                        valueModified={isValueModified ? isValueModified(index, tableName) : false}
                        onChangeCell={() => onChangeRow?.(index)}
                    />
                );
            })}
        </DeletableTableRow>
    );
}
