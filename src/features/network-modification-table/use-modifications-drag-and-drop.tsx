/*
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React, { JSX, RefObject, useCallback } from 'react';
import { Row, Table } from '@tanstack/react-table';
import { DraggableProvided, DraggableRubric, DraggableStateSnapshot, DragUpdate, DropResult } from '@hello-pangea/dnd';
import type { UUID } from 'node:crypto';
import { DragCloneRow } from './row';
import {
    DROP_FORBIDDEN_INDICATOR_BOTTOM,
    DROP_FORBIDDEN_INDICATOR_TOP,
    DROP_INDICATOR_BOTTOM,
    DROP_INDICATOR_TOP,
} from './network-modification-table-styles';
import {
    containsReferenceModification,
    findModificationInTree,
    isCompositeModification,
    isReferenceModification,
    MAX_COMPOSITE_NESTING_DEPTH,
    moveSubModificationInTree,
} from './utils';
import { CHIP_ATTR, injectForbiddenChips } from './drag-forbidden-chip';
import { ModificationContainerType, moveModification } from '../../services';
import { useSnackMessage } from '../../hooks';
import { ComposedModificationMetadata, snackWithFallback } from '../../utils';

interface UseModificationsDragAndDropParams {
    table: Table<ComposedModificationMetadata>;
    containerRef: RefObject<HTMLDivElement | null>;
    composedModifications: ComposedModificationMetadata[];
    setComposedModifications: React.Dispatch<React.SetStateAction<ComposedModificationMetadata[]>>;
    onDragEnd: () => void;
    studyUuid: UUID | null;
    currentNodeUuid?: UUID;
}

interface UseModificationsDragAndDropReturn {
    handleDragUpdate: (update: DragUpdate) => void;
    handleDragEnd: (result: DropResult) => void;
    renderClone: (
        provided: DraggableProvided,
        snapshot: DraggableStateSnapshot,
        rubric: DraggableRubric
    ) => JSX.Element;
}

const clearRowDragIndicators = (container: HTMLDivElement | null): void => {
    const rowElements = container?.querySelectorAll<HTMLElement>('[data-row-id]');

    rowElements?.forEach((rowElement) => {
        // because eslint don't want reassign but also don't want a "for" loop... :
        // eslint-disable-next-line no-param-reassign
        rowElement.style.boxShadow = '';
    });

    // Remove the chip overlay layer anchored on the scroll container
    container?.querySelectorAll<HTMLElement>(`[${CHIP_ATTR}]`).forEach((chip) => chip.remove());
};

// The target composite is resolved as BOTH a rowKey and a uuid from the same Row object, on
// purpose: `rowKey` is what tree-mutation functions (moveSubModificationInTree, sibling lookup)
// must use to stay unambiguous — including when the same uuid appears twice in the tree (a
// composite present live in one branch and also reachable through a shared reference elsewhere).
// `uuid` is what the backend moveModification call needs. Deriving both from the same Row/parent
// Row keeps them from ever drifting apart.
function resolveTargetComposite(
    droppingIntoExpandedComposite: boolean,
    targetRow: Row<ComposedModificationMetadata>
): { rowKey: UUID | null; uuid: UUID | null } {
    if (droppingIntoExpandedComposite) {
        return { rowKey: targetRow.id as UUID, uuid: targetRow.original.uuid };
    }
    if (targetRow.depth > 0) {
        const parent = targetRow.getParentRow();
        return { rowKey: (parent?.id as UUID | undefined) ?? null, uuid: parent?.original.uuid ?? null };
    }
    return { rowKey: null, uuid: null };
}

function getTargetSiblings(targetCompositeRowKey: UUID | null, rows: Row<ComposedModificationMetadata>[]) {
    return targetCompositeRowKey
        ? rows.filter((r) => r.depth > 0 && r.getParentRow()?.id === targetCompositeRowKey)
        : rows.filter((r) => r.depth === 0);
}

function getContainerShadow(forbidden: boolean, isMovingDown: boolean) {
    if (forbidden) {
        return isMovingDown ? DROP_FORBIDDEN_INDICATOR_BOTTOM : DROP_FORBIDDEN_INDICATOR_TOP;
    }
    return isMovingDown ? DROP_INDICATOR_BOTTOM : DROP_INDICATOR_TOP;
}

export const useModificationsDragAndDrop = ({
    table,
    containerRef,
    composedModifications,
    setComposedModifications,
    onDragEnd,
    studyUuid = null,
    currentNodeUuid = undefined,
}: UseModificationsDragAndDropParams): UseModificationsDragAndDropReturn => {
    const { snackError } = useSnackMessage();
    const { rows } = table.getRowModel();

    const computeIsDraggingDown = useCallback(
        (sourceRow: Row<ComposedModificationMetadata>, targetRow: Row<ComposedModificationMetadata>) => {
            const sourceRowIndex = table.getRowModel().flatRows.findIndex((row) => {
                return row.id === sourceRow.id;
            });
            const targetRowIndex = table.getRowModel().flatRows.findIndex((row) => {
                return row.id === targetRow.id;
            });
            return sourceRowIndex < targetRowIndex;
        },
        [table]
    );

    const computeTargetDepth = useCallback(
        (sourceRow: Row<ComposedModificationMetadata>, targetRow: Row<ComposedModificationMetadata>) => {
            const isDraggingDown = computeIsDraggingDown(sourceRow, targetRow);

            return isCompositeModification(targetRow.original) && targetRow.getIsExpanded() && isDraggingDown
                ? targetRow.depth + 1
                : targetRow.depth;
        },
        [computeIsDraggingDown]
    );

    const isDropForbidden = useCallback(
        (sourceRow: Row<ComposedModificationMetadata>, targetRow: Row<ComposedModificationMetadata>): boolean => {
            const sourceIsCompositeOrReference =
                isCompositeModification(sourceRow.original) || isReferenceModification(sourceRow.original);

            if (sourceIsCompositeOrReference) {
                const targetDepth = computeTargetDepth(sourceRow, targetRow);
                const exceedsNestingLimit =
                    (sourceRow.original.maxDepth ?? 0) + targetDepth > MAX_COMPOSITE_NESTING_DEPTH;
                const isSelfDrop = !!findModificationInTree(targetRow.id as UUID, [sourceRow.original]);

                // GRD-4772 (temporary): a shared modification (reference) cannot be drag-and-dropped
                // into another shared modification, nor into one of its descendants (expanded children
                // of the referenced composite).
                const isDraggingDown = computeIsDraggingDown(sourceRow, targetRow);
                const entersTargetRowItself =
                    (isCompositeModification(targetRow.original) || isReferenceModification(targetRow.original)) &&
                    targetRow.getIsExpanded() &&
                    isDraggingDown;
                const enteringParent = entersTargetRowItself ? targetRow.original : targetRow.getParentRow()?.original;
                // A reference, or a composite carrying a reference among its (loaded) descendants,
                // would end up nested under another reference — same forbidden shape either way.
                const sourceCarriesReference =
                    isReferenceModification(sourceRow.original) || containsReferenceModification(sourceRow.original);
                // A composite nested under a reference (directly or transitively) carries that
                // reference in its ancestors, same as the reference's own children — so this also
                // forbids dropping into such a composite, not just into the reference itself.
                const enteringSharedSubtree =
                    isReferenceModification(enteringParent) ||
                    !!enteringParent?.ancestorSharedModificationUuids?.length;
                const isReferenceIntoReference = sourceCarriesReference && enteringSharedSubtree;

                return exceedsNestingLimit || isSelfDrop || isReferenceIntoReference;
            }
            return false;
        },
        [computeTargetDepth, computeIsDraggingDown]
    );
    const handleDragUpdate = useCallback(
        (update: DragUpdate) => {
            clearRowDragIndicators(containerRef.current);

            const { source, destination } = update;
            if (!destination || source.index === destination.index) {
                return;
            }

            const sourceRow = rows[source.index];
            const targetRow = rows[destination.index];
            const el = containerRef.current?.querySelector<HTMLElement>(`[data-row-id="${targetRow?.id}"]`);

            if (!el) {
                return;
            }

            const forbidden = isDropForbidden(sourceRow, targetRow);
            const isMovingDown = destination.index > source.index;

            el.style.boxShadow = getContainerShadow(forbidden, isMovingDown);
            if (forbidden && containerRef.current) {
                injectForbiddenChips(containerRef.current, el, isMovingDown);
            }
        },
        [containerRef, isDropForbidden, rows]
    );

    const handleDragEnd = useCallback(
        (result: DropResult) => {
            clearRowDragIndicators(containerRef.current);
            onDragEnd();

            const { source, destination } = result;
            if (!destination || source.index === destination.index) {
                return;
            }

            const sourceRow = rows[source.index];
            const targetRow = rows[destination.index];

            if (isDropForbidden(sourceRow, targetRow)) {
                return;
            }

            const movingRowKey = sourceRow.id as UUID;
            const movingUuid = sourceRow.original.uuid;
            const sourceParent = sourceRow.depth > 0 ? sourceRow.getParentRow() : undefined;
            const sourceCompositeRowKey = (sourceParent?.id as UUID | undefined) ?? null;
            const sourceContainerId = sourceParent?.original.uuid ?? null;

            const isDraggingDown = destination.index > source.index;
            // Only composites can be entered via this "drag down onto an expanded row" gesture.
            // References are expandable too (their children are read-only, fetched from the referenced
            // object), so without the isCompositeModification guard, dropping right after an expanded
            // reference was wrongly reinterpreted as "enter it as first child" instead of "insert after
            // it as a sibling"
            const droppingIntoExpandedComposite =
                isDraggingDown && isCompositeModification(targetRow.original) && targetRow.getIsExpanded();
            const isSubRowInvolved = sourceRow.depth > 0 || targetRow.depth > 0;

            const targetComposite = resolveTargetComposite(droppingIntoExpandedComposite, targetRow);
            const targetContainerId = targetComposite.uuid;

            const previousModifications = [...composedModifications];

            let beforeUuid: UUID | null;
            if (droppingIntoExpandedComposite || isSubRowInvolved) {
                const targetSiblings = getTargetSiblings(targetComposite.rowKey, rows);
                let landingSibling: Row<ComposedModificationMetadata> | undefined;
                if (droppingIntoExpandedComposite) {
                    // Landing on an expanded composite header: enter it at first position
                    [landingSibling] = targetSiblings;
                } else {
                    const landingIndexInSiblings = targetSiblings.findIndex((r) => r.id === targetRow.id);
                    const beforeSiblingIndex = isDraggingDown ? landingIndexInSiblings + 1 : landingIndexInSiblings;
                    landingSibling = targetSiblings[beforeSiblingIndex];
                }
                const beforeRowKey: UUID | null = (landingSibling?.id as UUID | undefined) ?? null;
                beforeUuid = landingSibling?.original.uuid ?? null;

                setComposedModifications((prev) =>
                    moveSubModificationInTree(
                        movingRowKey,
                        sourceCompositeRowKey,
                        targetComposite.rowKey,
                        beforeRowKey,
                        prev
                    )
                );
            } else {
                const oldPosition = composedModifications.findIndex((m) => m.rowKey === sourceRow.id);
                const newPosition = composedModifications.findIndex((m) => m.rowKey === targetRow.id);

                if (oldPosition === -1 || newPosition === -1 || oldPosition === newPosition || !currentNodeUuid) {
                    return;
                }

                const updatedModifications = [...composedModifications];
                const [movedItem] = updatedModifications.splice(oldPosition, 1);
                updatedModifications.splice(newPosition, 0, movedItem);
                beforeUuid = updatedModifications[newPosition + 1]?.uuid ?? null;
                setComposedModifications(updatedModifications);
            }

            // Group id is filled in the study server, by convention if we send null data it will be resolved as a group operation
            moveModification(
                studyUuid,
                currentNodeUuid,
                movingUuid,
                {
                    id: sourceContainerId,
                    type: sourceContainerId ? ModificationContainerType.COMPOSITE : ModificationContainerType.GROUP,
                },
                {
                    id: targetContainerId,
                    type: targetContainerId ? ModificationContainerType.COMPOSITE : ModificationContainerType.GROUP,
                },
                beforeUuid
            ).catch((error) => {
                snackWithFallback(snackError, error, { headerId: 'errReorderModificationMsg' });
                setComposedModifications(previousModifications);
            });
        },
        [
            containerRef,
            onDragEnd,
            rows,
            isDropForbidden,
            composedModifications,
            currentNodeUuid,
            setComposedModifications,
            studyUuid,
            snackError,
        ]
    );

    const renderClone = useCallback(
        (provided: DraggableProvided, _snapshot: DraggableStateSnapshot, rubric: DraggableRubric) => (
            <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                <DragCloneRow row={rows[rubric.source.index]} />
            </div>
        ),
        [rows]
    );

    return { handleDragUpdate, handleDragEnd, renderClone };
};
