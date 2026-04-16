/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { createPortal } from 'react-dom';
import { useCallback, useMemo, useRef, useState } from 'react';
import { UseFieldArrayReturn, useFormContext, useWatch } from 'react-hook-form';
import {
    Box,
    Checkbox,
    CheckboxProps,
    Grid,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tooltip,
} from '@mui/material';
import { DragDropContext, Draggable, DragStart, Droppable, DroppableProvided, DropResult } from '@hello-pangea/dnd';
import { useIntl } from 'react-intl';
import { AddCircle as AddCircleIcon } from '@mui/icons-material';
import { DndColumn, MAX_ROWS_NUMBER, SELECTED } from './dnd-table.type';
import { DndTableBottomLeftButtons } from './dnd-table-bottom-left-buttons';
import { DndTableBottomRightButtons } from './dnd-table-bottom-right-buttons';
import { DndTableAddRowsDialog } from './dnd-table-add-rows-dialog';
import { ErrorInput, FieldErrorAlert } from '../inputs';
import { mergeSx, MuiStyles } from '../../utils/styles';
import { DndTableRow } from './dnd-table-row';

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

export interface DndTableProps {
    name: string;
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
    disableTableCell?: (rowIndex: number, column: any, tableName: string, previousValues?: any[]) => boolean;
    getPreviousValue?: (rowIndex: number, column: any, tableName: string, previousValues?: any[]) => number | undefined;
    isValueModified?: (index: number, tableName: string) => boolean;
    disableAddingRows?: boolean;
    showMoveArrow?: boolean;
    disableDragAndDrop?: boolean;
    handleUploadButton?: () => void;
    uploadButtonMessageId?: string;
    handleResetButton?: () => void;
    resetButtonMessageId?: string;
    maxRows?: number;
    disabledDeletion?: boolean;
    multiselect?: boolean;
    onChange?: (changedRow: any) => void;
    onDelete?: (removedRows: any[]) => void;
}

export function DndTable(props: Readonly<DndTableProps>) {
    const {
        name,
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
        disabledDeletion,
        multiselect,
        onChange,
        onDelete,
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

    const addNewRows = (numberOfRows: number) => {
        // checking if not exceeding the max allowed
        if (currentRows.length + numberOfRows > maxRows) {
            setError(name, {
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
        clearErrors(name);

        const rowsToAdd = createRows?.(numberOfRows).map((row) => {
            return { ...row, [SELECTED]: false };
        });

        // note: an id prop is automatically added in each row
        if (rowsToAdd) {
            append(rowsToAdd);
        }
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
        const currentRowsValues = getValues(name);

        const rowsToDelete = [];
        for (let i = 0; i < currentRowsValues.length; i++) {
            if (currentRowsValues[i][SELECTED]) {
                rowsToDelete.push(i);
            }
        }

        const removedRows = rowsToDelete.map((index) => currentRowsValues[index]);
        remove(rowsToDelete);
        onDelete?.(removedRows);
    };

    const handleDeleteRow = useCallback(
        (index: number) => {
            const removedRow = getValues(name)[index];
            remove(index);
            onDelete?.([removedRow]);
        },
        [onDelete, getValues, name, remove]
    );

    const selectAllRows = () => {
        for (let i = 0; i < currentRows.length; i++) {
            setValue(`${name}[${i}].${SELECTED}`, true);
        }
    };

    const unselectAllRows = () => {
        for (let i = 0; i < currentRows.length; i++) {
            setValue(`${name}[${i}].${SELECTED}`, false);
        }
    };

    const moveUpSelectedRows = () => {
        const currentRowsValues = getValues(name);

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
        const currentRowsValues = getValues(name);
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

    // Stores captured cell widths for the row being dragged, so the
    // portalled row keeps the original column layout.
    const snapshotCellWidthsRef = useRef<number[]>([]);
    const cellIdxRef = useRef(0);

    const onBeforeDragStart = useCallback((start: DragStart) => {
        // take a photo on cell widths of the being dragged row
        const row = document.querySelector<HTMLTableRowElement>(`[data-rfd-draggable-id="${start.draggableId}"]`);
        if (row) {
            snapshotCellWidthsRef.current = Array.from(row.cells, (cell) => cell.offsetWidth);
        }
    }, []);

    const nextSnapshotCellWidthSx = useCallback((isDragging: boolean) => {
        const cellWidths = snapshotCellWidthsRef.current;
        const cellIdx = cellIdxRef.current;
        if (!isDragging || cellWidths[cellIdx] == null) {
            return undefined;
        }
        cellIdxRef.current += 1;
        return { width: cellWidths[cellIdx], boxSizing: 'border-box' };
    }, []);

    const onDragEnd = (result: DropResult) => {
        snapshotCellWidthsRef.current = [];
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
                    {multiselect && (
                        <TableCell sx={{ width: '5%', textAlign: 'center' }}>
                            <MultiCheckbox
                                arrayFormName={name}
                                handleClickCheck={selectAllRows}
                                handleClickUncheck={unselectAllRows}
                                disabled={disabled || currentRows.length === 0}
                            />
                        </TableCell>
                    )}
                    {columnsDefinition.map((column) => (
                        <TableCell
                            key={column.dataKey}
                            sx={mergeSx(
                                { width: column.width, maxWidth: column.maxWidth, textAlign: 'left' },
                                column.sxHeader
                            )}
                        >
                            <Box sx={styles.columnsStyle}>
                                {column.label}
                                {column.extra}
                            </Box>
                        </TableCell>
                    ))}
                    {!disableAddingRows && !multiselect && (
                        <TableCell sx={{ width: '5rem', textAlign: 'center' }}>
                            <Tooltip
                                title={intl.formatMessage({
                                    id: 'AddRows',
                                })}
                            >
                                <span>
                                    <IconButton disabled={disableAddingRows} onClick={handleAddRowsButton}>
                                        <AddCircleIcon />
                                    </IconButton>
                                </span>
                            </Tooltip>
                        </TableCell>
                    )}
                </TableRow>
            </TableHead>
        );
    }

    const handleChangeRow = useCallback(
        (index: number) => {
            onChange?.(getValues(name)[index]);
        },
        [getValues, name, onChange]
    );
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
                        {(provided, snapshot) => {
                            cellIdxRef.current = 0;
                            const tableRow = (
                                <DndTableRow
                                    provided={provided}
                                    snapshot={snapshot}
                                    rowId={row.id}
                                    tableName={name}
                                    columnsDefinition={columnsDefinition}
                                    index={index}
                                    disableDragAndDrop={disableDragAndDrop}
                                    disabled={disabled}
                                    previousValues={previousValues}
                                    disableTableCell={disableTableCell}
                                    getPreviousValue={getPreviousValue}
                                    isValueModified={isValueModified}
                                    disabledDeletion={disabledDeletion && !multiselect}
                                    onChangeRow={handleChangeRow}
                                    onDeleteRow={handleDeleteRow}
                                    multiselect={multiselect}
                                    nextSnapshotCellWidthSx={nextSnapshotCellWidthSx}
                                />
                            );
                            // Portal the dragging row to document.body to avoid CSS transform
                            // ancestors (e.g. react-rnd panels) from breaking position:fixed
                            // coordinates used by @hello-pangea/dnd during drag.
                            return snapshot.isDragging ? createPortal(tableRow, document.body) : tableRow;
                        }}
                    </Draggable>
                ))}
                {providedDroppable.placeholder}
            </TableBody>
        );
    }

    return (
        <Grid item container spacing={1}>
            <Grid item container>
                <DragDropContext onBeforeDragStart={onBeforeDragStart} onDragEnd={onDragEnd}>
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
                <ErrorInput name={name} InputField={FieldErrorAlert} />
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
                {multiselect && (
                    <DndTableBottomRightButtons
                        arrayFormName={name}
                        handleAddButton={handleAddRowsButton}
                        handleDeleteButton={deleteSelectedRows}
                        handleMoveUpButton={moveUpSelectedRows}
                        handleMoveDownButton={moveDownSelectedRows}
                        disableAddingRows={disableAddingRows}
                        showMoveArrow={showMoveArrow}
                        disabled={disabled}
                    />
                )}
            </Grid>
            <DndTableAddRowsDialog
                open={openAddRowsDialog}
                handleAddButton={addNewRows}
                onClose={handleCloseAddRowsDialog}
            />
        </Grid>
    );
}
