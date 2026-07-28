/*
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Dispatch, SetStateAction } from 'react';
import type { UUID } from 'node:crypto';
import { Row } from '@tanstack/react-table';
import { fetchNetworkModification, getNetworkModificationsFromComposite } from '../../services';
import {
    ComposedModificationMetadata,
    MODIFICATION_TYPES,
    NetworkModificationMetadata,
    ReferencedCompositeModifications,
    ReferenceModificationInfos,
} from '../../utils';

export const MAX_COMPOSITE_NESTING_DEPTH = 5;

export const formatToComposedModification = (
    modifications: NetworkModificationMetadata[]
): ComposedModificationMetadata[] => {
    return modifications.map((modification) => ({ ...modification, subModifications: [] }));
};

export function isCompositeModification(modification: ComposedModificationMetadata | undefined) {
    return modification?.type === MODIFICATION_TYPES.COMPOSITE_MODIFICATION.type;
}

export function isSharedModification(modification: ComposedModificationMetadata | undefined) {
    return modification?.type === MODIFICATION_TYPES.MODIFICATION_REFERENCE.type;
}

function normalizeReferenceChild(child: NetworkModificationMetadata): NetworkModificationMetadata {
    return {
        ...child,
        messageType: child.messageType ?? child.type,
        messageValues: child.messageValues ?? '{}',
    };
}

export function isTargetChildOfReference(targetRow: Row<ComposedModificationMetadata>): boolean {
    if (targetRow.original.childFromShared === true) {
        return true;
    }
    return false;
}

function extractReferenceChildren(detail: ReferenceModificationInfos): NetworkModificationMetadata[] {
    const referenceInfos = detail?.referenceInfos;
    if (!referenceInfos) {
        return [];
    }
    if (referenceInfos.type === MODIFICATION_TYPES.COMPOSITE_MODIFICATION.type) {
        return ((referenceInfos as ReferencedCompositeModifications).modificationsInfos ?? []).map(
            normalizeReferenceChild
        );
    }
    return [normalizeReferenceChild(referenceInfos)];
}

// returns the depth of the modification with the given uuid in the given mods tree
export function findDepth(mods: ComposedModificationMetadata[], uuid: UUID, currentDepth = 0): number {
    // I think that array iteration is much less readable in this case :
    // eslint-disable-next-line no-restricted-syntax
    for (const mod of mods) {
        if (mod.uuid === uuid) return currentDepth;
        if (mod.subModifications?.length) {
            const found = findDepth(mod.subModifications, uuid, currentDepth + 1);
            if (found >= 0) return found;
        }
    }
    return -1;
}

export function removeUuidsFromTree(
    mods: ComposedModificationMetadata[],
    uuidsToRemove: Set<string>
): ComposedModificationMetadata[] {
    return mods
        .filter((m) => !uuidsToRemove.has(m.uuid))
        .map((m) =>
            m.subModifications.length > 0
                ? { ...m, subModifications: removeUuidsFromTree(m.subModifications, uuidsToRemove) }
                : m
        );
}
/**
 *
 * @param modifications source where the composite modifications are looked for
 * @param composites result : all the composite modifications found
 */
export function findAllLoadedCompositeModifications(
    modifications: ComposedModificationMetadata[],
    composites: ComposedModificationMetadata[]
) {
    modifications.forEach((modification) => {
        if (isCompositeModification(modification) && modification.subModifications.length > 0) {
            composites.push(modification);
            findAllLoadedCompositeModifications(modification.subModifications, composites);
        }
    });
}

export function findModificationInTree(
    uuid: string,
    mods: ComposedModificationMetadata[]
): ComposedModificationMetadata | undefined {
    // I think that array iteration is much less readable in this case :
    // eslint-disable-next-line no-restricted-syntax
    for (const mod of mods) {
        if (mod.uuid === uuid) {
            return mod;
        }
        const found = findModificationInTree(uuid, mod.subModifications);
        if (found) {
            return found;
        }
    }
    return undefined;
}

/**
 * in the tree, replaces the sub-modifications of 'parentModUuid' with 'subModifications' and returns the result
 * @param parentModUuid
 * @param subModifications new subModifications of parentModUuid
 * @param tree all the modifications of the tree
 */
export function updateSubModificationsOfACompositeInTree(
    parentModUuid: string,
    subModifications: ComposedModificationMetadata[],
    tree: ComposedModificationMetadata[]
): ComposedModificationMetadata[] {
    return tree.map((m) => {
        if (m.uuid === parentModUuid) {
            return { ...m, subModifications };
        }
        if (m.subModifications.length > 0) {
            return {
                ...m,
                subModifications: updateSubModificationsOfACompositeInTree(
                    parentModUuid,
                    subModifications,
                    m.subModifications
                ),
            };
        }
        return m;
    });
}

/**
 * Recursively merges already-loaded subModifications from the previous tree into a freshly
 * formatted tree (where all subModifications start as []). This ensures that when `modifications`
 * changes, previously fetched children are preserved and do not need to be re-fetched.
 */
export function mergeSubModificationsIntoTree(
    nextMods: ComposedModificationMetadata[],
    prevMods: ComposedModificationMetadata[]
): ComposedModificationMetadata[] {
    return nextMods.map((nextMod) => {
        const prevMod = prevMods.find((m) => m.uuid === nextMod.uuid);
        if (!prevMod || prevMod.subModifications.length === 0) {
            return nextMod;
        }
        return {
            ...nextMod,
            subModifications: mergeSubModificationsIntoTree(
                nextMod.subModifications.length > 0 ? nextMod.subModifications : prevMod.subModifications,
                prevMod.subModifications
            ),
        };
    });
}

/**
 * Returns a new tree where the modification identified by {@code uuid} has the given
 * partial fields merged in. All other nodes are returned as-is (referentially stable).
 */
export function updateModificationFieldInTree(
    uuid: string,
    fields: Partial<ComposedModificationMetadata>,
    mods: ComposedModificationMetadata[]
): ComposedModificationMetadata[] {
    return mods.map((m) => {
        if (m.uuid === uuid) {
            return { ...m, ...fields };
        }
        if (m.subModifications.length > 0) {
            return { ...m, subModifications: updateModificationFieldInTree(uuid, fields, m.subModifications) };
        }
        return m;
    });
}

function getModificationInTree(
    modUuid: UUID,
    sourceParentUuid: UUID | null,
    mods: ComposedModificationMetadata[]
): ComposedModificationMetadata | undefined {
    if (sourceParentUuid) {
        const sourceMod = findModificationInTree(sourceParentUuid, mods);
        if (!sourceMod) {
            return undefined;
        }
        return sourceMod.subModifications.find((m) => m.uuid === modUuid);
    }
    // modUuid is at the root of the tree
    return mods.find((m) => m.uuid === modUuid);
}

/**
 * @param movingUuid moved submodification uuid
 * @param sourceParentUuid composite from which movingUuid comes from. null if movingUuid is at the root level
 * @param targetParentUuid composite where movingUuid is moved. null if movingUuid is moved to the root level
 * @param beforeUuid movingUuid is moved just before beforeUuid. If null, movingUuid is moved to the end.
 * @param mods all the network modifications of the tree
 * @return mods updated according to the moved submodification
 */
export function moveSubModificationInTree(
    movingUuid: UUID,
    sourceParentUuid: UUID | null,
    targetParentUuid: UUID | null,
    beforeUuid: UUID | null,
    mods: ComposedModificationMetadata[]
): ComposedModificationMetadata[] {
    const movedMod: ComposedModificationMetadata | undefined = getModificationInTree(
        movingUuid,
        sourceParentUuid,
        mods
    );
    if (!movedMod) {
        console.error(`Can't find the ${movingUuid} modification that should be moved`);
        return mods;
    }
    let modsWithoutTheMovedModification: ComposedModificationMetadata[];

    if (sourceParentUuid) {
        const sourceMod = findModificationInTree(sourceParentUuid, mods);
        if (!sourceMod) {
            return mods;
        }
        const newSourceSubs = sourceMod.subModifications.filter((m) => m.uuid !== movingUuid);
        modsWithoutTheMovedModification = updateSubModificationsOfACompositeInTree(
            sourceParentUuid,
            newSourceSubs,
            mods
        );
    } else {
        modsWithoutTheMovedModification = mods.filter((m) => m.uuid !== movingUuid);
    }

    if (targetParentUuid) {
        const targetMod = findModificationInTree(targetParentUuid, modsWithoutTheMovedModification);
        if (!targetMod) {
            return mods;
        }
        const newTargetSubs = [...targetMod.subModifications];
        const insertIdx = beforeUuid ? newTargetSubs.findIndex((m) => m.uuid === beforeUuid) : -1;
        newTargetSubs.splice(insertIdx === -1 ? newTargetSubs.length : insertIdx, 0, movedMod);
        return updateSubModificationsOfACompositeInTree(
            targetParentUuid,
            newTargetSubs,
            modsWithoutTheMovedModification
        );
    }

    const insertIdx = beforeUuid ? modsWithoutTheMovedModification.findIndex((m) => m.uuid === beforeUuid) : -1;
    const result = [...modsWithoutTheMovedModification];
    result.splice(insertIdx === -1 ? result.length : insertIdx, 0, movedMod);
    return result;
}

// Table row ids are now position-dependent (`${parent.id}.${uuid}`, see getRowId in
// NetworkModificationsTable) so that duplicate uuids coming from two different unfolded
// shared references don't collide. This extracts the real uuid back out of a row id.
export function resolveUuidFromRowId(rowId: string): string {
    const segments = rowId.split('.');
    return segments[segments.length - 1];
}

/**
 * Table row ids are position-dependent for nested rows (`${parentRowId}.${uuid}`, see getRowId
 * in NetworkModificationsTable). When a modification is moved to a different parent composite,
 * its row id (and its already-loaded descendants' row ids) changes, even though the underlying
 * uuid doesn't. Without remapping, TanStack treats the moved row as brand new and any per-row
 * UI state keyed by the old id (expanded, rowSelection) is silently lost.
 *
 * This renames every key equal to `oldRowIdPrefix`, or nested under it (`oldRowIdPrefix.*`), to
 * the equivalent key under `newRowIdPrefix`, preserving the associated value. Keys unrelated to
 * the moved subtree are left untouched. Returns the same reference when nothing changed.
 */
export function remapRowIdPrefix<T>(
    record: Record<string, T>,
    oldRowIdPrefix: string,
    newRowIdPrefix: string
): Record<string, T> {
    if (oldRowIdPrefix === newRowIdPrefix) {
        return record;
    }
    let changed = false;
    const next: Record<string, T> = {};
    Object.entries(record).forEach(([key, value]) => {
        if (key === oldRowIdPrefix || key.startsWith(`${oldRowIdPrefix}.`)) {
            next[newRowIdPrefix + key.slice(oldRowIdPrefix.length)] = value;
            changed = true;
        } else {
            next[key] = value;
        }
    });
    return changed ? next : record;
}

export async function fetchSubModificationsForExpandedRows(
    expandedIds: string[],
    mods: ComposedModificationMetadata[],
    setMods: Dispatch<SetStateAction<ComposedModificationMetadata[]>>,
    force = false
): Promise<void> {
    const uuidsToCheck = expandedIds.map(resolveUuidFromRowId);
    const compositeUuidsToFetch = uuidsToCheck.filter((uuid) => {
        const mod = findModificationInTree(uuid, mods);
        return isCompositeModification(mod) && (force || mod?.subModifications.length === 0);
    });

    if (compositeUuidsToFetch.length > 0) {
        const subModsByUuid = await getNetworkModificationsFromComposite(compositeUuidsToFetch);

        setMods((prev) =>
            Object.entries(subModsByUuid).reduce((tree, [uuid, subMods]) => {
                const existingMod = findModificationInTree(uuid, tree);
                // A composite nested inside a reference is itself flagged childFromShared;
                // propagate the flag to its children so they stay non-clickable as well.
                const inheritsReference = existingMod?.childFromShared === true;
                const liveModifications = formatToComposedModification(subMods.filter((m) => !m.stashed)).map((m) =>
                    inheritsReference ? { ...m, childFromShared: true } : m
                );

                // Preserve already-loaded children of any nested composites within the new sub-list.
                const mergedSubs = mergeSubModificationsIntoTree(
                    liveModifications,
                    existingMod?.subModifications ?? []
                );
                return updateSubModificationsOfACompositeInTree(uuid, mergedSubs, tree);
            }, prev)
        );
    }

    const referenceUuidsToFetch = uuidsToCheck.filter((uuid) => {
        const mod = findModificationInTree(uuid, mods);
        return isSharedModification(mod) && (force || mod?.subModifications.length === 0);
    });

    await Promise.all(
        referenceUuidsToFetch.map(async (uuid) => {
            try {
                const res = await fetchNetworkModification(uuid as UUID);
                const detail: ReferenceModificationInfos = await res.json();

                const children = extractReferenceChildren(detail).filter((m) => !m.stashed);
                const liveModifications = formatToComposedModification(children).map((m) => ({
                    ...m,
                    childFromShared: true,
                }));

                setMods((prev) => updateSubModificationsOfACompositeInTree(uuid, liveModifications, prev));
            } catch (error) {
                console.error(`Failed to load reference children for ${uuid}`, error);
            }
        })
    );
}
