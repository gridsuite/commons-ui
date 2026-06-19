/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React, { Dispatch, SetStateAction, useCallback, useEffect, useMemo, useRef, useState } from 'react';
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
    ExcludedNetworkModifications,
    RootNetworkRowInfo,
    ComposedModificationMetadata,
    NetworkModificationMetadata,
} from '../../utils';
import {
    createHeaderCellStyle,
    MODIFICATION_ROW_HEIGHT,
    networkModificationTableStyles,
} from './network-modification-table-styles';
import { AUTO_EXTENSIBLE_COLUMNS } from './columns-definition';
import { useModificationsDragAndDrop } from './use-modifications-drag-and-drop';
import { useModificationsSelection } from './use-modifications-selection';
import {
    fetchSubModificationsForExpandedRows,
    findAllLoadedCompositeModifications,
    findDepth,
    formatToComposedModification,
    isCompositeModification,
    isSharedModification,
    MAX_COMPOSITE_NESTING_DEPTH,
    mergeSubModificationsIntoTree,
    removeUuidsFromTree,
} from './utils';
import { ModificationRow } from './row';

interface NetworkModificationsTableProps extends Omit<NetworkModificationEditorNameHeaderProps, 'modificationCount'> {
    modifications: NetworkModificationMetadata[];
    handleCellClick: (modification: NetworkModificationMetadata) => void;
    isRowDragDisabled?: boolean;
    onRowDragStart: () => void;
    onRowDragEnd: () => void;
    onSelectedRowsChange: (selectedRows: ComposedModificationMetadata[], isAssemblyDepthExceeded: boolean) => void;
    columns: ColumnDef<ComposedModificationMetadata>[];
    highlightedModificationUuid: UUID | null;
    modificationUuidsToReset?: UUID[]; // those modifications are unselected and unexpanded
    modificationToEditLabel: UUID | null; // the editing of this modification is triggered
    studyUuid: UUID | null;
    currentNodeId?: UUID;
    currentRootNetworkUuid?: UUID;
    rootNetworks?: RootNetworkRowInfo[];
    modificationsToExclude?: ExcludedNetworkModifications[];
    setModificationsToExclude?: Dispatch<SetStateAction<ExcludedNetworkModifications[]>>;
    isDisabled?: boolean;
}

export function NetworkModificationsTable({
    modifications,
    handleCellClick,
    isRowDragDisabled = false,
    onRowDragStart,
    onRowDragEnd,
    onSelectedRowsChange,
    columns,
    highlightedModificationUuid,
    modificationToEditLabel,
    modificationUuidsToReset,
    studyUuid = null,
    currentNodeId = undefined,
    currentRootNetworkUuid,
    rootNetworks,
    modificationsToExclude,
    setModificationsToExclude,
    isDisabled = false,
    isImpactedByNotification,
    notificationMessageId,
    isFetchingModifications,
    pendingState,
}: Readonly<NetworkModificationsTableProps>) {
    const theme = useTheme();

    const containerRef = useRef<HTMLDivElement | null>(null);

    const [expanded, setExpanded] = useState<ExpandedState>({});

    const [composedModifications, setComposedModifications] = useState<ComposedModificationMetadata[]>(
        formatToComposedModification(modifications)
    );
    // composedModificationsRef is used to access composedModifications data from other useEffects
    // without having to add composedModifications to their dependencies (so it doesn't trigger them)
    const composedModificationsRef = useRef(composedModifications);
    useEffect(() => {
        composedModificationsRef.current = composedModifications;
    }, [composedModifications]);

    // refs are kept for the "event" props to prevent retriggering the associated useEffects
    const modificationToEditLabelRef = useRef(modificationToEditLabel);
    useEffect(() => {
        modificationToEditLabelRef.current = modificationToEditLabel;
    }, [modificationToEditLabel]);
    const highlightedModificationUuidRef = useRef(highlightedModificationUuid);
    useEffect(() => {
        highlightedModificationUuidRef.current = highlightedModificationUuid;
    }, [highlightedModificationUuid]);

    const isAssemblyDepthExceeded = useCallback((rows: ComposedModificationMetadata[]): boolean => {
        // the new assembled composite will be created where the first selected row is so :
        // depth has to be < to first selected row depth + maxDepth of any selected row
        if (rows.length === 0) return false;
        const firstSelectedRowDepth = findDepth(composedModificationsRef.current, rows[0].uuid);
        return rows.some((row) => firstSelectedRowDepth + (row.maxDepth ?? 0) >= MAX_COMPOSITE_NESTING_DEPTH);
    }, []);

    const handleRowSelected = useCallback(
        (selectedRows: ComposedModificationMetadata[]) => {
            onSelectedRowsChange(selectedRows, isAssemblyDepthExceeded(selectedRows));
        },
        [onSelectedRowsChange, isAssemblyDepthExceeded]
    );

    const { rowSelection, onRowSelectionChange, lastClickedRowId, emitSelection } = useModificationsSelection({
        modifications: composedModifications,
        onRowSelected: handleRowSelected,
    });

    useEffect(() => {
        const prevMods = composedModificationsRef.current;
        // Uuids now at the top level have an authoritative position there. Any stale
        // carried-over child with the same uuid (cut out of a composite, pasted at root)
        // must be stripped, otherwise it renders twice → duplicate row ids / React keys.
        const newTopLevelUuids = new Set(modifications.map((m) => m.uuid));

        // Carry over already-fetched children (avoids an empty flash during the re-fetch),
        // then deep-filter out any uuid that moved to the top level.
        const nextMods = mergeSubModificationsIntoTree(formatToComposedModification(modifications), prevMods).map(
            (mod) =>
                mod.subModifications.length > 0
                    ? { ...mod, subModifications: removeUuidsFromTree(mod.subModifications, newTopLevelUuids) }
                    : mod
        );
        setComposedModifications(nextMods);

        // Re-fetch authoritative children for every composite that already had loaded children,
        // correcting anything stale that was temporarily preserved above.
        // Source of truth: prevMods — nextMods children may have been filtered just above.
        const loadedComposites: ComposedModificationMetadata[] = [];
        findAllLoadedCompositeModifications(prevMods, loadedComposites);
        if (loadedComposites.length > 0) {
            fetchSubModificationsForExpandedRows(
                loadedComposites.map((m) => m.uuid),
                nextMods,
                setComposedModifications,
                true
            );
        }
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

    const tableMeta = useMemo(
        () => ({
            context: {
                studyUuid,
                currentNodeId,
                currentRootNetworkUuid,
                rootNetworks,
            },
            modifications: {
                count: modifications.length,
                toExclude: modificationsToExclude,
                setToExclude: setModificationsToExclude,
            },
            interaction: {
                lastClickedRowId,
                onRowSelected: handleRowSelected,
                isRowDragDisabled,
                modificationToEditLabel: modificationToEditLabelRef,
            },
            status: {
                isImpactedByNotification,
                notificationMessageId,
                isFetchingModifications,
                pendingState,
                isDisabled,
            },
        }),
        [
            studyUuid,
            currentNodeId,
            currentRootNetworkUuid,
            rootNetworks,
            modifications.length,
            modificationsToExclude,
            setModificationsToExclude,
            lastClickedRowId,
            handleRowSelected,
            modificationToEditLabelRef,
            isRowDragDisabled,
            isImpactedByNotification,
            notificationMessageId,
            isFetchingModifications,
            pendingState,
            isDisabled,
        ]
    );

    const table = useReactTable<ComposedModificationMetadata>({
        data: composedModifications,
        columns,
        state: { expanded, rowSelection },
        getCoreRowModel: getCoreRowModel(),
        getExpandedRowModel: getExpandedRowModel(),
        getSubRows: (row) => row.subModifications,
        getRowId: (row) => row.uuid,
        getRowCanExpand: (row) => isCompositeModification(row.original) || isSharedModification(row.original),
        enableRowSelection: true,
        enableSubRowSelection: true,
        enableExpanding: true,
        onExpandedChange: handleExpandRow,
        onRowSelectionChange,
        meta: tableMeta,
    });

    const { rows, flatRows } = table.getRowModel();

    useEffect(() => {
        emitSelection(flatRows);
    }, [rowSelection, flatRows, emitSelection]);

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

    // unselect and unexpand all network modifications from modificationUuidsToReset and their sub-modifications
    useEffect(() => {
        if (!modificationUuidsToReset?.length) {
            return;
        }
        table.resetRowSelection();
        // fetch all the descendants of the modificationUuidsToReset :
        const uuidsToReset = new Set<string>(modificationUuidsToReset);
        const collectAll = (mod: ComposedModificationMetadata) => {
            uuidsToReset.add(mod.uuid);
            mod.subModifications?.forEach(collectAll);
        };
        const collectDescendants = (mods: ComposedModificationMetadata[]) => {
            mods.forEach((mod) => {
                if (uuidsToReset.has(mod.uuid)) {
                    mod.subModifications?.forEach(collectAll);
                } else {
                    collectDescendants(mod.subModifications ?? []);
                }
            });
        };
        collectDescendants(composedModificationsRef.current);

        // unexpand all uuidsToReset
        setExpanded((prev) => {
            if (prev === true) {
                return prev;
            }
            const next = { ...prev };
            uuidsToReset.forEach((uuid) => delete next[uuid]);
            return next;
        });
    }, [modificationUuidsToReset, table]);

    useEffect(() => {
        table.resetRowSelection();
        table.resetExpanded();
        lastClickedRowId.current = null;
    }, [lastClickedRowId, table, currentNodeId]);

    useEffect(() => {
        if (highlightedModificationUuidRef.current && containerRef.current) {
            const rowIndex = rows.findIndex((row) => row.original.uuid === highlightedModificationUuidRef.current);
            if (rowIndex !== -1) {
                virtualizer.scrollToIndex(rowIndex, { align: 'center', behavior: 'auto' });
                highlightedModificationUuidRef.current = null;
            }
        }
    }, [highlightedModificationUuidRef, rows, virtualizer]);

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
