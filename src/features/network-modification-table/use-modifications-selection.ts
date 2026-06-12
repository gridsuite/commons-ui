/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { RefObject, useCallback, useEffect, useRef, useState } from 'react';
import { Row, RowSelectionState, Updater } from '@tanstack/react-table';
import { ComposedModificationMetadata } from '../../utils';

/**
 * Ensures all subrows of a composite are selected if the composite also is, otherwise deselected the composite
 */
function normalizeCompositeSelection(
    rawSelection: RowSelectionState,
    roots: ComposedModificationMetadata[]
): RowSelectionState {
    const next: RowSelectionState = { ...rawSelection };

    const visit = (node: ComposedModificationMetadata): boolean => {
        const children = node.subModifications;
        if (!children || children.length === 0) {
            return next[node.uuid];
        }
        // Recurse first so nested composites are resolved bottom-up.
        const everyChildSelected = children.map((child) => visit(child)).every(Boolean);
        if (everyChildSelected) {
            next[node.uuid] = true;
        } else {
            // Some or none of the children are selected: the composite must not be marked as fully selected.
            delete next[node.uuid];
        }
        return everyChildSelected;
    };

    roots.forEach((root) => visit(root));
    return next;
}

/**
 * Walk through modifications list and include in the selection:
 *   - A fully-selected composite is included as-is and its descendants are skipped (its children
 *     are implicitly included through the composite and must NOT be duplicated individually).
 *   - An indeterminate composite is treated as unselected: the composite itself is excluded,
 *     but its descendants are still examined so selected leaves below are emitted individually.
 *   - A selected subrow is included if the parent composite isn't.
 */
function collectSelection(flatRows: Row<ComposedModificationMetadata>[]): ComposedModificationMetadata[] {
    const acc: ComposedModificationMetadata[] = [];
    // When we emit a fully-selected composite, we skip every subsequent row whose depth is
    // greater than its depth - those are its descendants in pre-order. -1 = not skipping.
    let skipBelowDepth = -1;

    flatRows.forEach((row) => {
        if (skipBelowDepth >= 0 && row.depth > skipBelowDepth) {
            return;
        }
        skipBelowDepth = -1;
        if (row.getIsSelected()) {
            acc.push(row.original);
            skipBelowDepth = row.depth;
        }
    });
    return acc;
}

function propagateSelectionToLoadedDescendants(
    selection: RowSelectionState,
    roots: ComposedModificationMetadata[]
): RowSelectionState {
    let next: RowSelectionState = selection;
    let mutated = false;

    const visit = (node: ComposedModificationMetadata, ancestorSelected: boolean) => {
        const effectiveSelected = ancestorSelected || next[node.uuid];
        if (effectiveSelected && !next[node.uuid]) {
            if (!mutated) {
                next = { ...selection };
                mutated = true;
            }
            next[node.uuid] = true;
        }
        node.subModifications?.forEach((child) => visit(child, effectiveSelected));
    };

    roots.forEach((root) => visit(root, false));
    return mutated ? next : selection;
}

/**
 * Collects every uuid present anywhere in the tree (root + all nested levels).
 */
function collectAllUuids(mods: ComposedModificationMetadata[]): Set<string> {
    const uuids = new Set<string>();
    const visit = (nodes: ComposedModificationMetadata[]) =>
        nodes.forEach((m) => {
            uuids.add(m.uuid);
            visit(m.subModifications);
        });
    visit(mods);
    return uuids;
}

/**
 * Removes selection entries whose uuid is no longer present anywhere in the tree.
 * This keeps the selection in sync after a move (cut/paste), delete, or restore
 * operation that changes which modifications exist in the current node.
 * Returns the same reference when nothing changed to avoid unnecessary re-renders.
 */
function pruneStaleSelection(selection: RowSelectionState, allUuids: Set<string>): RowSelectionState {
    const pruned = Object.fromEntries(Object.entries(selection).filter(([uuid]) => allUuids.has(uuid)));
    return Object.keys(pruned).length === Object.keys(selection).length ? selection : pruned;
}

interface UseModificationsSelectionParams {
    modifications: ComposedModificationMetadata[];
    onRowSelected: (selectedRows: ComposedModificationMetadata[]) => void;
}

interface UseModificationsSelectionResult {
    rowSelection: RowSelectionState;
    onRowSelectionChange: (updater: Updater<RowSelectionState>) => void;
    lastClickedRowId: RefObject<string | null>;
    emitSelection: (flatRows: Row<ComposedModificationMetadata>[]) => void;
}

export function useModificationsSelection({
    modifications,
    onRowSelected,
}: UseModificationsSelectionParams): UseModificationsSelectionResult {
    const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
    const lastClickedRowId = useRef<string | null>(null);

    const onRowSelectionChange = useCallback(
        (updater: Updater<RowSelectionState>) => {
            setRowSelection((prev) => {
                const raw = typeof updater === 'function' ? updater(prev) : updater;
                return normalizeCompositeSelection(raw, modifications);
            });
        },
        [modifications]
    );

    const emitSelection = useCallback(
        (flatRows: Row<ComposedModificationMetadata>[]) => {
            onRowSelected(collectSelection(flatRows));
        },
        [onRowSelected]
    );

    // Runs whenever the composed modifications tree changes (e.g. after a server refetch
    // triggered by a move, delete, paste, or restore).
    //
    // Two things happen in order:
    //   1. Propagate selection down to any newly-loaded descendants of already-selected composites.
    //   2. Prune uuids that are no longer present anywhere in the tree (e.g. B2 was cut out of
    //      composite B and pasted at root level — B2 now lives at root, the old child entry is
    //      gone and must be removed so the parent component receives an accurate selection list).
    useEffect(() => {
        setRowSelection((prev) => {
            const propagated = propagateSelectionToLoadedDescendants(prev, modifications);
            const allUuids = collectAllUuids(modifications);
            return pruneStaleSelection(propagated, allUuids);
        });
    }, [modifications]);

    return { rowSelection, onRowSelectionChange, lastClickedRowId, emitSelection };
}
