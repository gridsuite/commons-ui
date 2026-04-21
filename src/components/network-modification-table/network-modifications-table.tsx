/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React, { SetStateAction, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Box, Table, TableBody, TableCell, TableHead, TableRow, useTheme } from '@mui/material';
import {
    ColumnDef,
    ExpandedState,
    flexRender,
    getCoreRowModel,
    getExpandedRowModel,
    Updater,
    useReactTable,
} from '@tanstack/react-table';
import { DragDropContext, Droppable, DroppableProvided } from '@hello-pangea/dnd';
import { useVirtualizer } from '@tanstack/react-virtual';
import { UUID } from 'node:crypto';
import { NetworkModificationEditorNameHeaderProps } from './renderers';
import {
    createHeaderCellStyle,
    MODIFICATION_ROW_HEIGHT,
    networkModificationTableStyles,
} from './network-modification-table-styles';
import { AUTO_EXTENSIBLE_COLUMNS, NameHeaderProps } from './columns-definition';
import { useModificationsDragAndDrop } from './use-modifications-drag-and-drop';
import { useModificationsSelection } from './use-modifications-selection';
import {
    fetchSubModificationsForExpandedRows,
    findAllLoadedCompositeModifications,
    formatToComposedModification,
    isCompositeModification,
    mergeSubModificationsIntoTree,
} from './utils';
import { ModificationRow } from './row';
import { ComposedModificationMetadata, NetworkModificationMetadata } from '../../utils';

interface NetworkModificationsTableProps extends Omit<NetworkModificationEditorNameHeaderProps, 'modificationCount'> {
    modifications: NetworkModificationMetadata[];
    handleCellClick: (modification: NetworkModificationMetadata) => void;
    isRowDragDisabled?: boolean;
    onRowDragStart: () => void;
    onRowDragEnd: () => void;
    onRowSelected: (selectedRows: ComposedModificationMetadata[]) => void;
    createAllColumns: (
        isRowDragDisabled: boolean,
        modificationsCount: number,
        nameHeaderProps: NameHeaderProps,
        setModifications: React.Dispatch<SetStateAction<ComposedModificationMetadata[]>>
    ) => ColumnDef<ComposedModificationMetadata>[];
    highlightedModificationUuid: UUID | null;
    studyUuid: UUID | null;
    currentNodeId?: UUID;
}

export function NetworkModificationsTable({
    modifications,
    handleCellClick,
    isRowDragDisabled = false,
    onRowDragStart,
    onRowDragEnd,
    onRowSelected,
    createAllColumns,
    highlightedModificationUuid,
    studyUuid = null,
    currentNodeId = undefined,
    ...nameHeaderProps
}: Readonly<NetworkModificationsTableProps>) {
    const theme = useTheme();

    const containerRef = useRef<HTMLDivElement | null>(null);

    const [expanded, setExpanded] = useState<ExpandedState>({});

    const [composedModifications, setComposedModifications] = useState<ComposedModificationMetadata[]>(
        formatToComposedModification(modifications)
    );

    const { rowSelection, onRowSelectionChange, lastClickedIndex, emitCuratedSelection } = useModificationsSelection({
        modifications: composedModifications,
        onRowSelected,
    });

    const columns = useMemo<ColumnDef<ComposedModificationMetadata>[]>(
        () =>
            createAllColumns(
                isRowDragDisabled ?? false,
                modifications.length,
                nameHeaderProps,
                setComposedModifications
            ),
        [createAllColumns, isRowDragDisabled, modifications.length, nameHeaderProps]
    );

    useEffect(() => {
        setComposedModifications((prevMods) => {
            // Rebuild from the new modifications prop, carrying over already-fetched subModifications
            // to avoid a visual flash of empty children while re-fetches are in flight.
            const nextMods = mergeSubModificationsIntoTree(formatToComposedModification(modifications), prevMods);

            // Re-fetch for any composite that already has loaded sub-modifications, regardless of
            // whether it is currently expanded to avoid stale state
            const loadedComposite: ComposedModificationMetadata[] = [];
            findAllLoadedCompositeModifications(nextMods, loadedComposite);
            fetchSubModificationsForExpandedRows(
                loadedComposite.map((mod) => mod.uuid),
                nextMods,
                setComposedModifications,
                true
            );
            return nextMods;
        });
    }, [modifications]);

    const handleExpandRow = useCallback((updater: Updater<ExpandedState>) => {
        setExpanded((prevExpanded: ExpandedState) => {
            const nextExpanded: ExpandedState = typeof updater === 'function' ? updater(prevExpanded) : updater;

            const prevRecord = prevExpanded === true ? {} : prevExpanded;
            const nextRecord = nextExpanded === true ? {} : nextExpanded;
            const newlyExpandedIds = Object.keys(nextRecord).filter((id) => nextRecord[id] && !prevRecord[id]);

            setComposedModifications((prevMods) => {
                fetchSubModificationsForExpandedRows(newlyExpandedIds, prevMods, setComposedModifications);
                return [...prevMods];
            });

            return nextExpanded;
        });
    }, []);

    const table = useReactTable<ComposedModificationMetadata>({
        data: composedModifications,
        columns,
        state: { expanded, rowSelection },
        getCoreRowModel: getCoreRowModel(),
        getExpandedRowModel: getExpandedRowModel(),
        getSubRows: (row) => row.subModifications,
        getRowId: (row) => row.uuid,
        getRowCanExpand: (row) => isCompositeModification(row.original),
        enableRowSelection: true,
        enableSubRowSelection: true,
        enableExpanding: true,
        onExpandedChange: handleExpandRow,
        onRowSelectionChange,
        meta: { lastClickedIndex, onRowSelected },
    });

    const { rows, flatRows } = table.getRowModel();

    useEffect(() => {
        emitCuratedSelection(flatRows);
    }, [rowSelection, flatRows, emitCuratedSelection]);

    const virtualizer = useVirtualizer({
        count: rows.length,
        getScrollElement: () => containerRef.current,
        overscan: 5,
        estimateSize: () => MODIFICATION_ROW_HEIGHT,
    });
    const virtualItems = virtualizer.getVirtualItems();

    const { handleDragUpdate, handleDragEnd, renderClone } = useModificationsDragAndDrop({
        table,
        containerRef,
        composedModifications,
        setComposedModifications,
        onDragEnd: onRowDragEnd,
        studyUuid,
        currentNodeUuid: currentNodeId,
    });

    useEffect(() => {
        table.resetRowSelection();
        table.resetExpanded();
        lastClickedIndex.current = null;
    }, [lastClickedIndex, table, currentNodeId]);

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
            <Box sx={networkModificationTableStyles.tableWrapper}>
                <Droppable droppableId="modifications-table" mode="virtual" renderClone={renderClone}>
                    {(provided: DroppableProvided) => (
                        <Box ref={containerRef} sx={networkModificationTableStyles.container}>
                            <Table sx={networkModificationTableStyles.table}>
                                <TableHead sx={networkModificationTableStyles.thead}>
                                    {table.getHeaderGroups().map((headerGroup) => (
                                        <TableRow key={headerGroup.id} sx={networkModificationTableStyles.tableRow}>
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
                                    sx={{
                                        ...networkModificationTableStyles.tableBody,
                                        height: `${virtualizer.getTotalSize()}px`,
                                    }}
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
