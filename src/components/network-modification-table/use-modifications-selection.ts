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
 * Re-derive parent composite entries in the row-selection map so that a composite is marked
 * fully selected (entry === true) only when every one of its loaded children is fully selected.
 *
 * Tanstack selected row model doesn't automatically set indeterminate status to parent row if
 * one subrow is deselected so we perform it here
 *
 */
function normalizeCompositeSelection(
    rawSelection: RowSelectionState,
    roots: ComposedModificationMetadata[]
): RowSelectionState {
    const next: RowSelectionState = { ...rawSelection };

    function visit(node: ComposedModificationMetadata): boolean {
        const children = node.subModifications;
        if (!children || children.length === 0) {
            return next[node.uuid];
        }
        // Recurse first so nested composites are resolved bottom-up.
        const childStates = children.map(visit);
        const everyChildSelected = childStates.every(Boolean);
        if (everyChildSelected) {
            next[node.uuid] = true;
        } else {
            // Some or none of the children are selected: the composite must not be marked as fully selected.
            delete next[node.uuid];
        }
        return everyChildSelected;
    }

    roots.forEach(visit);
    return next;
}

/**
 * Walk the row tree and produce the curated selection :
 *   - A fully-selected composite is included as-is (its children are implicitly included
 *     through the composite and must NOT be duplicated individually).
 *   - An indeterminate composite is treated as unselected: the composite itself is excluded,
 *     and the recursion descends to emit its selected descendants individually.
 *   - A selected leaf is included.
 */
function collectCuratedSelection(rows: Row<ComposedModificationMetadata>[], acc: ComposedModificationMetadata[]): void {
    rows.forEach((row) => {
        if (row.getIsSelected()) {
            acc.push(row.original);
        } else if (row.getIsSomeSelected()) {
            collectCuratedSelection(row.subRows, acc);
        }
    });
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

interface UseModificationsSelectionParams {
    modifications: ComposedModificationMetadata[];
    onRowSelected: (selectedRows: ComposedModificationMetadata[]) => void;
}

interface UseModificationsSelectionResult {
    rowSelection: RowSelectionState;
    onRowSelectionChange: (updater: Updater<RowSelectionState>) => void;
    lastClickedIndex: RefObject<number | null>;
    emitCuratedSelection: (rootRows: Row<ComposedModificationMetadata>[]) => void;
}

export function useModificationsSelection({
    modifications,
    onRowSelected,
}: UseModificationsSelectionParams): UseModificationsSelectionResult {
    const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
    const lastClickedIndex = useRef<number | null>(null);

    const onRowSelectionChange = useCallback(
        (updater: Updater<RowSelectionState>) => {
            setRowSelection((prev) => {
                const raw = typeof updater === 'function' ? updater(prev) : updater;
                return normalizeCompositeSelection(raw, modifications);
            });
        },
        [modifications]
    );

    const emitCuratedSelection = useCallback(
        (rootRows: Row<ComposedModificationMetadata>[]) => {
            const curated: ComposedModificationMetadata[] = [];
            collectCuratedSelection(rootRows, curated);
            onRowSelected(curated);
        },
        [onRowSelected]
    );

    // Used to propagate selection status from composite to sub modifications if they are loaded
    // after selecting the composite.
    useEffect(() => {
        setRowSelection((prev) => propagateSelectionToLoadedDescendants(prev, modifications));
    }, [modifications]);

    return { rowSelection, onRowSelectionChange, lastClickedIndex, emitCuratedSelection };
}
