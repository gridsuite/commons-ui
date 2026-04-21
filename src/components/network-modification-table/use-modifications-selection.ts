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
function collectCuratedSelection(flatRows: Row<ComposedModificationMetadata>[]): ComposedModificationMetadata[] {
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

interface UseModificationsSelectionParams {
    modifications: ComposedModificationMetadata[];
    onRowSelected: (selectedRows: ComposedModificationMetadata[]) => void;
}

interface UseModificationsSelectionResult {
    rowSelection: RowSelectionState;
    onRowSelectionChange: (updater: Updater<RowSelectionState>) => void;
    lastClickedIndex: RefObject<number | null>;
    emitCuratedSelection: (flatRows: Row<ComposedModificationMetadata>[]) => void;
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
        (flatRows: Row<ComposedModificationMetadata>[]) => {
            onRowSelected(collectCuratedSelection(flatRows));
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
