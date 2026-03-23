/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React, { Dispatch, SetStateAction, useEffect, useMemo, useRef } from 'react';
import { Box, Table, TableBody, TableCell, TableHead, TableRow, useTheme } from '@mui/material';
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { DragDropContext, DragStart, Droppable, DroppableProvided, DropResult } from '@hello-pangea/dnd';
import { useVirtualizer } from '@tanstack/react-virtual';
import { UUID } from 'node:crypto';
import { NetworkModificationEditorNameHeaderProps } from './renderers';
import { AUTO_EXTENSIBLE_COLUMNS, NameHeaderProps } from './columns-definition';
import ModificationRow from './row/modification-row';
import { useModificationsDragAndDrop } from './use-modifications-drag-and-drop';
import { NetworkModificationMetadata } from '../../hooks';
import { createHeaderCellStyle, MODIFICATION_ROW_HEIGHT, networkTableStyles } from './network-table-styles';

interface NetworkModificationsTableProps extends Omit<NetworkModificationEditorNameHeaderProps, 'modificationCount'> {
    modifications: NetworkModificationMetadata[];
    setModifications: Dispatch<SetStateAction<NetworkModificationMetadata[]>>;
    handleCellClick: (modification: NetworkModificationMetadata) => void;
    isRowDragDisabled?: boolean;
    onRowDragStart: (event: DragStart) => void;
    onRowDragEnd: (event: DropResult) => void;
    onRowSelected: (selectedRows: NetworkModificationMetadata[]) => void;
    createAllColumns: (isRowDragDisabled: boolean,
                        modificationsCount: number,
                        nameHeaderProps: NameHeaderProps,
                        setModifications: React.Dispatch<SetStateAction<NetworkModificationMetadata[]>>
    ) => ColumnDef<NetworkModificationMetadata, any>[];
    highlightedModificationUuid: UUID | null;
}

export function NetworkModificationsTable({
                                              modifications,
                                              setModifications,
                                              handleCellClick,
                                              isRowDragDisabled = false,
                                              onRowDragStart,
                                              onRowDragEnd,
                                              onRowSelected,
                                              createAllColumns,
                                              highlightedModificationUuid,
                                              ...nameHeaderProps
                                          }: Readonly<NetworkModificationsTableProps>) {
    const theme = useTheme();

    const containerRef = useRef<HTMLDivElement | null>(null);
    const lastClickedIndex = useRef<number | null>(null);

    const columns = useMemo<ColumnDef<NetworkModificationMetadata>[]>(() =>
        createAllColumns(isRowDragDisabled ?? false,
            modifications.length,
            nameHeaderProps,
            setModifications)
    , [
    isRowDragDisabled,
    modifications,
    nameHeaderProps,
    setModifications,
]);

    const table = useReactTable({
        data: modifications,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getRowId: (row:any) => row.uuid,
        enableRowSelection: true,
        meta: { lastClickedIndex, onRowSelected },
    });

    const { rows } = table.getRowModel();

    const virtualizer = useVirtualizer({
        count: rows.length,
        getScrollElement: () => containerRef.current,
        overscan: 5,
        estimateSize: () => MODIFICATION_ROW_HEIGHT,
    });
    const virtualItems = virtualizer.getVirtualItems();

    const { handleDragUpdate, handleDragEnd, renderClone } = useModificationsDragAndDrop({
        rows,
        containerRef,
        onRowDragEnd,
    });

    useEffect(() => {
        table.resetRowSelection();
        lastClickedIndex.current = null;
    }, [table]);

    useEffect(() => {
        if (highlightedModificationUuid && containerRef.current) {
            const rowIndex = rows.findIndex((row) => row.original.uuid === highlightedModificationUuid);
            if (rowIndex !== -1) {
                virtualizer.scrollToIndex(rowIndex, { align: 'start', behavior: 'auto' });
            }
        }
    }, [highlightedModificationUuid, rows, virtualizer]);

    return (
        <DragDropContext onDragEnd={handleDragEnd} onDragStart={onRowDragStart} onDragUpdate={handleDragUpdate}>
            <Box sx={networkTableStyles.tableWrapper}>
                <Droppable droppableId="modifications-table" mode="virtual" renderClone={renderClone}>
                    {(provided: DroppableProvided) => (
                        <Box ref={containerRef} sx={networkTableStyles.container}>
                            <Table sx={networkTableStyles.table}>
                                <TableHead sx={networkTableStyles.thead}>
                                    {table.getHeaderGroups().map((headerGroup) => (
                                        <TableRow key={headerGroup.id} sx={networkTableStyles.tableRow}>
                                            {headerGroup.headers.map((header) => (
                                                <TableCell
                                                    key={header.id}
                                                    sx={createHeaderCellStyle(
                                                        header,
                                                        theme,
                                                        header.index === 0,
                                                        header.index === headerGroup.headers.length - 1,
                                                        AUTO_EXTENSIBLE_COLUMNS.includes(header.column.id)
                                                    )}
                                                >
                                                    {flexRender(header.column.columnDef.header, header.getContext())}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    ))}
                                </TableHead>
                                <TableBody
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                    sx={{ ...networkTableStyles.tableBody, height: `${virtualizer.getTotalSize()}px` }}
                                >
                                    {virtualItems.map((virtualRow) => {
                                        const row = rows[virtualRow.index];
                                        return (
                                            <ModificationRow
                                                key={row.id}
                                                virtualRow={virtualRow}
                                                row={row}
                                                handleCellClick={handleCellClick}
                                                isRowDragDisabled={isRowDragDisabled}
                                                highlightedModificationUuid={highlightedModificationUuid}
                                            />
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </Box>
                    )}
                </Droppable>
            </Box>
        </DragDropContext>
    );
}
