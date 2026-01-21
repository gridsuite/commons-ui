/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useMemo, useState } from 'react';
import { UseFieldArrayReturn, useFormContext, useWatch } from 'react-hook-form';
import {
    Box,
    Checkbox,
    CheckboxProps,
    Grid,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tooltip,
} from '@mui/material';
import { DragIndicator as DragIndicatorIcon } from '@mui/icons-material';
import { DragDropContext, Draggable, Droppable, DroppableProvided, DropResult } from '@hello-pangea/dnd';
import { useIntl } from 'react-intl';
import { ColumnBase, DndColumn, DndColumnType, MAX_ROWS_NUMBER, SELECTED } from './dnd-table.type';
import { DndTableBottomLeftButtons } from './dnd-table-bottom-left-buttons';
import { DndTableBottomRightButtons } from './dnd-table-bottom-right-buttons';
import { DndTableAddRowsDialog } from './dnd-table-add-rows-dialog';
import {
    AutocompleteInput,
    CheckboxInput,
    DirectoryItemsInput,
    ErrorInput,
    FieldErrorAlert,
    RawReadOnlyInput,
    TableNumericalInput,
    TableTextInput,
} from '../inputs';
import { ChipItemsInput } from '../inputs/reactHookForm/chip-items-input';
import type { MuiStyles } from '../../utils/styles';

const styles = {
    columnsStyle: {
        display: 'inline-flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        margin: 1,
        textTransform: 'none',
    },
} as const satisfies MuiStyles;

interface MultiCheckboxProps extends Omit<CheckboxProps, 'checked' | 'indeterminate' | 'onChange'> {
    arrayFormName: string;
    handleClickCheck: () => void;
    handleClickUncheck: () => void;
}

function MultiCheckbox({
    arrayFormName,
    handleClickCheck,
    handleClickUncheck,
    ...props
}: Readonly<MultiCheckboxProps>) {
    const arrayToWatch: ({ selected: boolean } & Record<string, any>)[] = useWatch({
        name: arrayFormName,
    });

    const allRowSelected = useMemo(
        () => (arrayToWatch ? arrayToWatch?.every((row) => row[SELECTED]) : false),
        [arrayToWatch]
    );
    const someRowSelected = useMemo(
        () => (arrayToWatch ? arrayToWatch?.some((row) => row[SELECTED]) : false),
        [arrayToWatch]
    );

    return (
        <Checkbox
            checked={arrayToWatch?.length > 0 && allRowSelected}
            indeterminate={someRowSelected && !allRowSelected}
            onChange={(event) => {
                if (event.target.checked) {
                    handleClickCheck();
                } else {
                    handleClickUncheck();
                }
            }}
            {...props}
        />
    );
}

interface DefaultTableCellProps {
    arrayFormName: string;
    rowIndex: number;
    column: ColumnBase;
}

function DefaultTableCell({ arrayFormName, rowIndex, column, ...props }: Readonly<DefaultTableCellProps>) {
    return (
        <TableCell key={column.dataKey} sx={{ padding: 1 }}>
            <RawReadOnlyInput name={`${arrayFormName}[${rowIndex}].${column.dataKey}`} {...props} />
        </TableCell>
    );
}

interface EditableTableCellProps {
    arrayFormName: string;
    rowIndex: number;
    column: DndColumn;
    previousValue?: number;
    valueModified: boolean;
    disabled?: boolean;
}

function EditableTableCell({
    arrayFormName,
    rowIndex,
    column,
    previousValue,
    valueModified,
    ...props
}: Readonly<EditableTableCellProps>) {
    return (
        <TableCell key={column.dataKey} sx={{ padding: 0.5, maxWidth: column.maxWidth }}>
            {column.type === DndColumnType.NUMERIC && (
                <TableNumericalInput
                    {...props}
                    name={`${arrayFormName}[${rowIndex}].${column.dataKey}`}
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
                <TableTextInput
                    {...props}
                    name={`${arrayFormName}[${rowIndex}].${column.dataKey}`}
                    showErrorMsg={column.showErrorMsg}
                />
            )}
            {column.type === DndColumnType.AUTOCOMPLETE && (
                <AutocompleteInput
                    forcePopupIcon
                    freeSolo
                    name={`${arrayFormName}[${rowIndex}].${column.dataKey}`}
                    options={column.options}
                    inputTransform={(value) => value ?? ''}
                    outputTransform={(value) => value}
                    size="small"
                />
            )}
            {column.type === DndColumnType.DIRECTORY_ITEMS && (
                <DirectoryItemsInput
                    name={`${arrayFormName}[${rowIndex}].${column.dataKey}`}
                    equipmentTypes={column.equipmentTypes}
                    elementType={column.elementType}
                    titleId={column.titleId}
                    hideErrorMessage
                    label={undefined}
                />
            )}
            {column.type === DndColumnType.CHIP_ITEMS && (
                <ChipItemsInput name={`${arrayFormName}[${rowIndex}].${column.dataKey}`} hideErrorMessage />
            )}
            {column.type === DndColumnType.CUSTOM && column.component(rowIndex)}
        </TableCell>
    );
}

interface DndTableProps {
    arrayFormName: string;
    useFieldArrayOutput: UseFieldArrayReturn;
    columnsDefinition: DndColumn[];
    tableHeight?: number;
    allowedToAddRows?: () => Promise<boolean>;
    createRows?: (numberOfRows: number) => {
        [key: string]: any;
    }[];
    disabled?: boolean;
    withResetButton?: boolean;
    withAddRowsDialog?: boolean;
    previousValues?: any[];
    disableTableCell?: (rowIndex: number, column: any, arrayFormName: string, temporaryLimits?: any[]) => boolean;
    getPreviousValue?: (
        rowIndex: number,
        column: any,
        arrayFormName: string,
        temporaryLimits?: any[]
    ) => number | undefined;
    isValueModified?: (index: number, arrayFormName: string) => boolean;
    disableAddingRows?: boolean;
    showMoveArrow?: boolean;
    disableDragAndDrop?: boolean;
    handleUploadButton?: () => void;
    uploadButtonMessageId?: string;
    handleResetButton?: () => void;
    resetButtonMessageId?: string;
    maxRows?: number;
}

export function DndTable(props: Readonly<DndTableProps>) {
    const {
        arrayFormName,
        useFieldArrayOutput,
        columnsDefinition,
        tableHeight,
        allowedToAddRows = () => Promise.resolve(true),
        createRows,
        disabled = false,
        withResetButton = false,
        withAddRowsDialog = true,
        previousValues,
        disableTableCell,
        getPreviousValue,
        isValueModified,
        disableAddingRows = false,
        showMoveArrow = true,
        disableDragAndDrop = false,
        handleUploadButton = undefined,
        uploadButtonMessageId = undefined,
        handleResetButton = undefined,
        resetButtonMessageId = undefined,
        maxRows = MAX_ROWS_NUMBER,
    } = props;
    const intl = useIntl();

    const { getValues, setValue, setError, clearErrors } = useFormContext();

    const {
        fields: currentRows, // don't use it to access form data ! check doc
        move,
        swap,
        append,
        remove,
    } = useFieldArrayOutput;

    const [openAddRowsDialog, setOpenAddRowsDialog] = useState(false);

    function renderTableCell(rowId: string, rowIndex: number, column: DndColumn) {
        const CustomTableCell = column.editable ? EditableTableCell : DefaultTableCell;
        return (
            <CustomTableCell
                key={rowId + column.dataKey}
                arrayFormName={arrayFormName}
                rowIndex={rowIndex}
                column={column}
                disabled={
                    disableTableCell ? disableTableCell(rowIndex, column, arrayFormName, previousValues) : disabled
                }
                previousValue={
                    getPreviousValue ? getPreviousValue(rowIndex, column, arrayFormName, previousValues) : undefined
                }
                valueModified={isValueModified ? isValueModified(rowIndex, arrayFormName) : false}
            />
        );
    }

    const addNewRows = (numberOfRows: number) => {
        // checking if not exceeding the max allowed
        if (currentRows.length + numberOfRows > maxRows) {
            setError(arrayFormName, {
                type: 'custom',
                message: intl.formatMessage(
                    {
                        id: 'MaximumRowNumberError',
                    },
                    {
                        value: maxRows,
                    }
                ),
            });
            return;
        }
        clearErrors(arrayFormName);

        const rowsToAdd = createRows?.(numberOfRows).map((row) => {
            return { ...row, [SELECTED]: false };
        });

        // note: an id prop is automatically added in each row
        append(rowsToAdd);
    };

    const handleAddRowsButton = () => {
        allowedToAddRows().then((isAllowed) => {
            if (isAllowed) {
                if (withAddRowsDialog) {
                    setOpenAddRowsDialog(true);
                } else {
                    // directly add a single row
                    addNewRows(1);
                }
            }
        });
    };

    const handleCloseAddRowsDialog = () => {
        setOpenAddRowsDialog(false);
    };

    const deleteSelectedRows = () => {
        const currentRowsValues = getValues(arrayFormName);

        const rowsToDelete = [];
        for (let i = 0; i < currentRowsValues.length; i++) {
            if (currentRowsValues[i][SELECTED]) {
                rowsToDelete.push(i);
            }
        }

        remove(rowsToDelete);
    };

    const selectAllRows = () => {
        for (let i = 0; i < currentRows.length; i++) {
            setValue(`${arrayFormName}[${i}].${SELECTED}`, true);
        }
    };

    const unselectAllRows = () => {
        for (let i = 0; i < currentRows.length; i++) {
            setValue(`${arrayFormName}[${i}].${SELECTED}`, false);
        }
    };

    const moveUpSelectedRows = () => {
        const currentRowsValues = getValues(arrayFormName);

        if (currentRowsValues[0][SELECTED]) {
            // we can't move up more the rows, so we stop
            return;
        }

        for (let i = 1; i < currentRowsValues.length; i++) {
            if (currentRowsValues[i][SELECTED]) {
                swap(i - 1, i);
            }
        }
    };

    const moveDownSelectedRows = () => {
        const currentRowsValues = getValues(arrayFormName);
        if (currentRowsValues[currentRowsValues.length - 1][SELECTED]) {
            // we can't move down more the rows, so we stop
            return;
        }
        for (let i = currentRowsValues.length - 2; i >= 0; i--) {
            if (currentRowsValues[i][SELECTED]) {
                swap(i, i + 1);
            }
        }
    };

    const onDragEnd = (result: DropResult) => {
        // dropped outside the list
        if (!result.destination) {
            return;
        }
        move(result.source.index, result.destination.index);
    };

    function renderTableHead() {
        return (
            <TableHead>
                <TableRow>
                    {!disableDragAndDrop && (
                        <TableCell sx={{ width: '3%' }}>{/* empty cell for the drag and drop column */}</TableCell>
                    )}
                    <TableCell sx={{ width: '5%', textAlign: 'center' }}>
                        <MultiCheckbox
                            arrayFormName={arrayFormName}
                            handleClickCheck={selectAllRows}
                            handleClickUncheck={unselectAllRows}
                            disabled={disabled || currentRows.length === 0}
                        />
                    </TableCell>
                    {columnsDefinition.map((column) => (
                        <TableCell key={column.dataKey} sx={{ width: column.width, maxWidth: column.maxWidth }}>
                            <Box sx={styles.columnsStyle}>
                                {column.label}
                                {column.extra}
                            </Box>
                        </TableCell>
                    ))}
                </TableRow>
            </TableHead>
        );
    }

    function renderTableBody(providedDroppable: DroppableProvided) {
        return (
            <TableBody>
                {currentRows.map((row, index) => (
                    <Draggable
                        key={row.id}
                        draggableId={row.id.toString()}
                        index={index}
                        isDragDisabled={disableDragAndDrop}
                    >
                        {(provided) => (
                            <TableRow ref={provided.innerRef} {...provided.draggableProps}>
                                {!disableDragAndDrop && (
                                    <Tooltip
                                        title={intl.formatMessage({
                                            id: 'DragAndDrop',
                                        })}
                                        placement="right"
                                    >
                                        <TableCell
                                            sx={{ textAlign: 'center' }}
                                            {...(disabled ? {} : { ...provided.dragHandleProps })}
                                        >
                                            <DragIndicatorIcon />
                                        </TableCell>
                                    </Tooltip>
                                )}
                                <TableCell sx={{ textAlign: 'center' }}>
                                    <CheckboxInput
                                        name={`${arrayFormName}[${index}].${SELECTED}`}
                                        formProps={{ disabled }}
                                    />
                                </TableCell>
                                {columnsDefinition.map((column) => renderTableCell(row.id, index, column))}
                            </TableRow>
                        )}
                    </Draggable>
                ))}
                {providedDroppable.placeholder}
            </TableBody>
        );
    }

    return (
        <Grid item container spacing={1}>
            <Grid item container>
                <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable droppableId="tapTable" isDropDisabled={disabled}>
                        {(provided) => (
                            <TableContainer
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                                sx={{
                                    height: tableHeight,
                                    border: 'solid 1px rgba(0,0,0,0.1)',
                                }}
                            >
                                <Table stickyHeader size="small" padding="none">
                                    {renderTableHead()}
                                    {renderTableBody(provided)}
                                </Table>
                            </TableContainer>
                        )}
                    </Droppable>
                </DragDropContext>
                <ErrorInput name={arrayFormName} InputField={FieldErrorAlert} />
            </Grid>
            <Grid container item>
                {handleResetButton && handleUploadButton && resetButtonMessageId && uploadButtonMessageId ? (
                    <DndTableBottomLeftButtons
                        withResetButton={withResetButton}
                        disableUploadButton={disableAddingRows}
                        disabled={disabled}
                        handleUploadButton={handleUploadButton}
                        uploadButtonMessageId={uploadButtonMessageId}
                        handleResetButton={handleResetButton}
                        resetButtonMessageId={resetButtonMessageId}
                    />
                ) : null}
                <DndTableBottomRightButtons
                    arrayFormName={arrayFormName}
                    handleAddButton={handleAddRowsButton}
                    handleDeleteButton={deleteSelectedRows}
                    handleMoveUpButton={moveUpSelectedRows}
                    handleMoveDownButton={moveDownSelectedRows}
                    disableAddingRows={disableAddingRows}
                    showMoveArrow={showMoveArrow}
                    disabled={disabled}
                />
            </Grid>
            <DndTableAddRowsDialog
                open={openAddRowsDialog}
                handleAddButton={addNewRows}
                onClose={handleCloseAddRowsDialog}
            />
        </Grid>
    );
}
