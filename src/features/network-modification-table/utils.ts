/*
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Dispatch, SetStateAction } from 'react';
import type { UUID } from 'node:crypto';
import { fetchNetworkModification, getNetworkModificationsFromComposite } from '../../services';
import {
    ComposedModificationMetadata,
    MODIFICATION_TYPES,
    NetworkModificationMetadata,
    ReferencedCompositeModifications,
    ReferenceModificationInfos,
} from '../../utils';

export const MAX_COMPOSITE_NESTING_DEPTH = 5;

// Every ComposedModificationMetadata carries a `rowKey`: a random id generated once when the node
// is created, decorrelated from the business `uuid`. It is the ONLY identity used to locate a
// specific node's *position* in the tree
export const formatToComposedModification = (
    modifications: NetworkModificationMetadata[]
): ComposedModificationMetadata[] => {
    return modifications.map((modification) => ({
        ...modification,
        subModifications: [],
        rowKey: crypto.randomUUID(),
    }));
};

export function isCompositeModification(modification: NetworkModificationMetadata | undefined) {
    return modification?.type === MODIFICATION_TYPES.COMPOSITE_MODIFICATION.type;
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
 * Collects the uuids of everything nested inside the given shared modifications.
 * The shared modifications themselves are deliberately left out.
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

// TODO GRD-5250 :  Adjust isReferenceModification condition after reference modification types update
export function isReferenceModification(modification: NetworkModificationMetadata | undefined) {
    return modification?.type === MODIFICATION_TYPES.MODIFICATION_REFERENCE.type;
}

function normalizeReferenceChild(child: NetworkModificationMetadata): NetworkModificationMetadata {
    return {
        ...child,
        messageType: child.messageType ?? child.type,
        messageValues: child.messageValues ?? '{}',
    };
}

export function isTargetChildOfReference(targetRow: { original: ComposedModificationMetadata }): boolean {
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
    rowKey: UUID,
    mods: ComposedModificationMetadata[]
): ComposedModificationMetadata | undefined {
    // I think that array iteration is much less readable in this case :
    // eslint-disable-next-line no-restricted-syntax
    for (const mod of mods) {
        if (mod.rowKey === rowKey) {
            return mod;
        }
        const found = findModificationInTree(rowKey, mod.subModifications);
        if (found) {
            return found;
        }
    }
    return undefined;
}

/**
 * in the tree, replaces the sub-modifications of 'parentRowKey' with 'subModifications' and returns the result
 * @param parentRowKey
 * @param subModifications new subModifications of parentRowKey
 * @param tree all the modifications of the tree
 */
export function updateSubModificationsOfACompositeInTree(
    parentRowKey: UUID,
    subModifications: ComposedModificationMetadata[],
    tree: ComposedModificationMetadata[]
): ComposedModificationMetadata[] {
    return tree.map((m) => {
        if (m.rowKey === parentRowKey) {
            return { ...m, subModifications };
        }
        if (m.subModifications.length > 0) {
            return {
                ...m,
                subModifications: updateSubModificationsOfACompositeInTree(
                    parentRowKey,
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
        if (!prevMod) {
            return nextMod;
        }
        const carriedOverSubModifications =
            nextMod.subModifications.length > 0 ? nextMod.subModifications : prevMod.subModifications;
        return {
            ...nextMod,
            rowKey: prevMod.rowKey,
            subModifications:
                prevMod.subModifications.length === 0
                    ? nextMod.subModifications
                    : mergeSubModificationsIntoTree(carriedOverSubModifications, prevMod.subModifications),
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
    modRowKey: UUID,
    sourceParentRowKey: UUID | null,
    mods: ComposedModificationMetadata[]
): ComposedModificationMetadata | undefined {
    if (sourceParentRowKey) {
        const sourceMod = findModificationInTree(sourceParentRowKey, mods);
        if (!sourceMod) {
            return undefined;
        }
        return sourceMod.subModifications.find((m) => m.rowKey === modRowKey);
    }
    // modRowKey is at the root of the tree
    return mods.find((m) => m.rowKey === modRowKey);
}

/**
 * @param movingRowKey moved submodification's internal row key
 * @param sourceParentRowKey composite from which movingRowKey comes from. null if movingRowKey is at the root level
 * @param targetParentRowKey composite where movingRowKey is moved. null if movingRowKey is moved to the root level
 * @param beforeRowKey movingRowKey is moved just before beforeRowKey. If null, movingRowKey is moved to the end.
 * @param mods all the network modifications of the tree
 * @return mods updated according to the moved submodification
 */
export function moveSubModificationInTree(
    movingRowKey: UUID,
    sourceParentRowKey: UUID | null,
    targetParentRowKey: UUID | null,
    beforeRowKey: UUID | null,
    mods: ComposedModificationMetadata[]
): ComposedModificationMetadata[] {
    const movedMod: ComposedModificationMetadata | undefined = getModificationInTree(
        movingRowKey,
        sourceParentRowKey,
        mods
    );
    if (!movedMod) {
        console.error(`Can't find the ${movingRowKey} modification that should be moved`);
        return mods;
    }
    let modsWithoutTheMovedModification: ComposedModificationMetadata[];

    if (sourceParentRowKey) {
        const sourceMod = findModificationInTree(sourceParentRowKey, mods);
        if (!sourceMod) {
            return mods;
        }
        const newSourceSubs = sourceMod.subModifications.filter((m) => m.rowKey !== movingRowKey);
        modsWithoutTheMovedModification = updateSubModificationsOfACompositeInTree(
            sourceParentRowKey,
            newSourceSubs,
            mods
        );
    } else {
        modsWithoutTheMovedModification = mods.filter((m) => m.rowKey !== movingRowKey);
    }

    if (targetParentRowKey) {
        const targetMod = findModificationInTree(targetParentRowKey, modsWithoutTheMovedModification);
        if (!targetMod) {
            return mods;
        }
        const newTargetSubs = [...targetMod.subModifications];
        const insertIdx = beforeRowKey ? newTargetSubs.findIndex((m) => m.rowKey === beforeRowKey) : -1;
        newTargetSubs.splice(insertIdx === -1 ? newTargetSubs.length : insertIdx, 0, movedMod);
        return updateSubModificationsOfACompositeInTree(
            targetParentRowKey,
            newTargetSubs,
            modsWithoutTheMovedModification
        );
    }

    const insertIdx = beforeRowKey ? modsWithoutTheMovedModification.findIndex((m) => m.rowKey === beforeRowKey) : -1;
    const result = [...modsWithoutTheMovedModification];
    result.splice(insertIdx === -1 ? result.length : insertIdx, 0, movedMod);
    return result;
}

/**
 * @param expandedRowKeys rowKeys of the rows that were just expanded — this is exactly what
 * ExpandedState is keyed by now, since getRowId returns row.rowKey, so no translation is needed
 * at the call site (unlike the previous resolveUuidFromRowId path-parsing scheme, now removed).
 */
export async function fetchSubModificationsForExpandedRows(
    expandedRowKeys: UUID[],
    mods: ComposedModificationMetadata[],
    setMods: Dispatch<SetStateAction<ComposedModificationMetadata[]>>,
    force = false
): Promise<void> {
    const expandedNodes = expandedRowKeys
        .map((rowKey) => findModificationInTree(rowKey as UUID, mods))
        .filter((mod): mod is ComposedModificationMetadata => !!mod);

    const compositeNodesToFetch = expandedNodes.filter(
        (mod) => isCompositeModification(mod) && (force || mod.subModifications.length === 0)
    );

    if (compositeNodesToFetch.length > 0) {
        // Two different tree positions (rowKeys) can point at the same composite uuid — e.g. the
        // same shared composite unfolded through two different references at once. Dedupe the
        // network call by uuid, but apply the result to every node position independently below,
        // so each occurrence gets its own freshly-generated child rowKeys and none collide.
        const uniqueUuidsToFetch = [...new Set(compositeNodesToFetch.map((m) => m.uuid))];
        const subModsByUuid = await getNetworkModificationsFromComposite(uniqueUuidsToFetch);

        setMods((prev) =>
            compositeNodesToFetch.reduce((tree, node) => {
                const subMods = subModsByUuid[node.uuid];
                if (!subMods) {
                    return tree;
                }
                const existingMod = findModificationInTree(node.rowKey, tree);
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
                return updateSubModificationsOfACompositeInTree(node.rowKey, mergedSubs, tree);
            }, prev)
        );
    }

    const referenceNodesToFetch = expandedNodes.filter(
        (mod) => isReferenceModification(mod) && (force || mod.subModifications.length === 0)
    );

    await Promise.all(
        referenceNodesToFetch.map(async (node) => {
            try {
                const res = await fetchNetworkModification(node.uuid as UUID);
                const detail: ReferenceModificationInfos = await res.json();

                const children = extractReferenceChildren(detail).filter((m) => !m.stashed);
                const liveModifications = formatToComposedModification(children).map((m) => ({
                    ...m,
                    childFromShared: true,
                }));

                setMods((prev) => updateSubModificationsOfACompositeInTree(node.rowKey, liveModifications, prev));
            } catch (error) {
                console.error(`Failed to load reference children for ${node.uuid}`, error);
            }
        })
    );
}
