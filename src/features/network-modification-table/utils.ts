/*
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Dispatch, SetStateAction } from 'react';
import type { UUID } from 'node:crypto';
import { getNetworkModificationsFromComposite } from '../../services';
import { ComposedModificationMetadata, MODIFICATION_TYPES, NetworkModificationMetadata } from '../../utils';

export const MAX_COMPOSITE_NESTING_DEPTH = 5;

export const formatToComposedModification = (
    modifications: NetworkModificationMetadata[]
): ComposedModificationMetadata[] => {
    return modifications.map((modification) => ({ ...modification, subModifications: [] }));
};

export function isCompositeModification(modification: NetworkModificationMetadata | undefined) {
    return modification?.type === MODIFICATION_TYPES.COMPOSITE_MODIFICATION.type;
}

export function isSharedModification(modification: NetworkModificationMetadata | undefined) {
    return modification?.type === MODIFICATION_TYPES.MODIFICATION_REFERENCE.type;
}

/**
 * Tells whether a modification can't be edited because of the permissions on a shared modification: either it
 * is a shared modification the user can't write into, or it sits inside one.
 */
export function isModificationEditLocked(
    uuid: UUID,
    readOnlySharedModificationUuids: Set<UUID> | undefined,
    lockedNestedModificationUuids: Set<UUID> | undefined
): boolean {
    return !!readOnlySharedModificationUuids?.has(uuid) || !!lockedNestedModificationUuids?.has(uuid);
}

/**
 * Collects the uuids of everything nested inside the given shared modifications, at any depth.
 *
 * Those are the modifications the user isn't allowed to touch when he has no write permission on the shared
 * modification holding them. The shared modifications themselves are deliberately left out: acting on one as
 * a whole (moving it, deleting it, assembling it into a composite) stays allowed.
 *
 * @param readOnlySharedModificationUuids uuids of the shared modifications the user can't write into
 * @param mods all the modifications of the tree
 */
export function collectLockedNestedModificationUuids(
    readOnlySharedModificationUuids: Set<UUID>,
    mods: ComposedModificationMetadata[]
): Set<UUID> {
    const locked = new Set<UUID>();

    const collectAll = (mod: ComposedModificationMetadata) => {
        locked.add(mod.uuid);
        mod.subModifications?.forEach(collectAll);
    };
    const visit = (currentMods: ComposedModificationMetadata[], insideReadOnlyShared: boolean) => {
        currentMods.forEach((mod) => {
            if (insideReadOnlyShared) {
                collectAll(mod);
            } else {
                visit(mod.subModifications ?? [], readOnlySharedModificationUuids.has(mod.uuid));
            }
        });
    };
    visit(mods, false);

    return locked;
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

export function fetchSubModificationsForExpandedRows(
    expandedIds: string[],
    mods: ComposedModificationMetadata[],
    setMods: Dispatch<SetStateAction<ComposedModificationMetadata[]>>,
    force = false
): void {
    const uuidsToFetch = expandedIds.filter((id) => {
        const mod = findModificationInTree(id, mods);
        return isCompositeModification(mod) && (force || mod?.subModifications.length === 0);
    });

    if (uuidsToFetch.length === 0) {
        return;
    }

    getNetworkModificationsFromComposite(uuidsToFetch).then((subModsByUuid) => {
        setMods((prev) =>
            Object.entries(subModsByUuid).reduce((tree, [uuid, subMods]) => {
                const liveModifications = formatToComposedModification(subMods.filter((m) => !m.stashed));
                // Preserve already-loaded children of any nested composites within the new sub-list
                const existingMod = findModificationInTree(uuid, tree);
                const mergedSubs = mergeSubModificationsIntoTree(
                    liveModifications,
                    existingMod?.subModifications ?? []
                );
                return updateSubModificationsOfACompositeInTree(uuid, mergedSubs, tree);
            }, prev)
        );
    });
}
