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
    findModificationInTree,
    isCompositeModification,
    MAX_COMPOSITE_NESTING_DEPTH,
    moveSubModificationInTree,
} from './utils';
import { CHIP_ATTR, injectForbiddenChips } from './drag-forbidden-chip';
import { moveModification } from '../../services';
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

// When entering an expanded composite from outside, the target composite is the
// composite row itself; otherwise derive it from the target row's parent as usual.
function getTargetCompositeUuid(droppingIntoExpandedComposite: boolean, targetRow: Row<ComposedModificationMetadata>) {
    if (droppingIntoExpandedComposite) {
        return targetRow.original.uuid;
    }
    return targetRow.depth > 0 ? (targetRow.getParentRow()?.original.uuid ?? null) : null;
}

function getTargetSiblings(targetCompositeUuid: UUID | null, rows: Row<ComposedModificationMetadata>[]) {
    return targetCompositeUuid
        ? rows.filter((r) => r.depth > 0 && r.getParentRow()?.original.uuid === targetCompositeUuid)
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

    const computeTargetDepth = useCallback(
        (sourceRow: Row<ComposedModificationMetadata>, targetRow: Row<ComposedModificationMetadata>) => {
            const sourceRowIndex = table.getRowModel().flatRows.findIndex((row) => {
                return row.id === sourceRow.id;
            });
            const targetRowIndex = table.getRowModel().flatRows.findIndex((row) => {
                return row.id === targetRow.id;
            });
            const isDraggingDown = sourceRowIndex < targetRowIndex;

            return isCompositeModification(targetRow.original) && targetRow.getIsExpanded() && isDraggingDown
                ? targetRow.depth + 1
                : targetRow.depth;
        },
        [table]
    );

    const isDropForbidden = useCallback(
        (sourceRow: Row<ComposedModificationMetadata>, targetRow: Row<ComposedModificationMetadata>): boolean => {
            if (isCompositeModification(sourceRow.original)) {
                const targetDepth = computeTargetDepth(sourceRow, targetRow);
                return (
                    (sourceRow.original.maxDepth ?? 0) + targetDepth > MAX_COMPOSITE_NESTING_DEPTH ||
                    !!(
                        isCompositeModification(sourceRow.original) &&
                        findModificationInTree(targetRow.original.uuid, [sourceRow.original])
                    )
                );
            }
            return false;
        },
        [computeTargetDepth]
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
            const el = containerRef.current?.querySelector<HTMLElement>(`[data-row-id="${targetRow?.original.uuid}"]`);

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

            const movingUuid = sourceRow.original.uuid;
            const sourceCompositeUuid = sourceRow.depth > 0 ? (sourceRow.getParentRow()?.original.uuid ?? null) : null;

            const isDraggingDown = destination.index > source.index;
            const droppingIntoExpandedComposite = isDraggingDown && targetRow.getIsExpanded();
            const isSubRowInvolved = sourceRow.depth > 0 || targetRow.depth > 0;

            const targetCompositeUuid: UUID | null = getTargetCompositeUuid(droppingIntoExpandedComposite, targetRow);
            const sourceContainerId = sourceRow.depth > 0 ? (sourceRow.getParentRow()?.original.uuid ?? null) : null;
            const targetContainerId = targetCompositeUuid;

            const previousModifications = [...composedModifications];

            let beforeUuid: UUID | null;
            if (droppingIntoExpandedComposite || isSubRowInvolved) {
                const targetSiblings = getTargetSiblings(targetCompositeUuid, rows);
                if (droppingIntoExpandedComposite) {
                    // Landing on an expanded composite header: enter it at first position
                    beforeUuid = targetSiblings[0]?.original.uuid ?? null;
                } else {
                    const landingIndexInSiblings = targetSiblings.findIndex(
                        (r) => r.original.uuid === targetRow.original.uuid
                    );
                    const beforeSiblingIndex = isDraggingDown ? landingIndexInSiblings + 1 : landingIndexInSiblings;
                    beforeUuid = targetSiblings[beforeSiblingIndex]?.original.uuid ?? null;
                }
                setComposedModifications((prev) =>
                    moveSubModificationInTree(movingUuid, sourceCompositeUuid, targetCompositeUuid, beforeUuid, prev)
                );
            } else {
                const oldPosition = composedModifications.findIndex((m) => m.uuid === sourceRow.original.uuid);
                const newPosition = composedModifications.findIndex((m) => m.uuid === targetRow.original.uuid);

                if (oldPosition === -1 || newPosition === -1 || oldPosition === newPosition || !currentNodeUuid) {
                    return;
                }

                const updatedModifications = [...composedModifications];
                const [movedItem] = updatedModifications.splice(oldPosition, 1);
                updatedModifications.splice(newPosition, 0, movedItem);
                beforeUuid = updatedModifications[newPosition + 1]?.uuid ?? null;
                setComposedModifications(updatedModifications);
            }

            moveModification(
                studyUuid,
                currentNodeUuid,
                movingUuid,
                sourceContainerId,
                targetContainerId,
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
