/*
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Dispatch, SetStateAction } from 'react';
import { Row } from '@tanstack/react-table';
import type { UUID } from 'node:crypto';
import { fetchNetworkModification, getNetworkModificationsFromComposite } from '../../services';
import {
    ComposedModificationMetadata,
    MODIFICATION_TYPES,
    ModificationReferenceInfos,
    NetworkModificationActivations,
    NetworkModificationApplicabilities,
    NetworkModificationMetadata,
    ReferencedCompositeModifications,
    RootNetworkRowInfo,
} from '../../utils';

export const MAX_COMPOSITE_NESTING_DEPTH = 5;

/**
 * A modification is activated unless an entry says otherwise.
 */
export function isActivated(activations: NetworkModificationActivations, modificationUuid: UUID) {
    return activations[modificationUuid] ?? true;
}

// Indexes by uuid the global activation every modification of the tree carries, sub modifications included.
export function collectActivations(modifications: ComposedModificationMetadata[]): NetworkModificationActivations {
    return modifications.reduce(
        (activations, modification) => ({
            ...activations,
            [modification.uuid]: modification.activated,
            ...collectActivations(modification.subModifications),
        }),
        {}
    );
}

// Override server activation when pending one exists.
export function mergeActivations(
    serverActivations: NetworkModificationActivations,
    pendingActivations: NetworkModificationActivations
): NetworkModificationActivations {
    return Object.keys(pendingActivations).length === 0
        ? serverActivations
        : { ...serverActivations, ...pendingActivations };
}

/**
 * Keeps the pending activations the server has yet to report, dropping the ones the fetched modifications now
 * carry: clearing them on every refresh would flick the switch back to the old value until the change makes it
 * back. Returns the map it was given when nothing was dropped, to spare a render.
 */
export function keepStillPendingActivations(
    pendingActivations: NetworkModificationActivations,
    serverActivations: NetworkModificationActivations
): NetworkModificationActivations {
    const pendingUuids = Object.keys(pendingActivations);
    if (pendingUuids.length === 0) {
        return pendingActivations;
    }
    const stillPending = Object.entries(pendingActivations).filter(
        ([uuid, activated]) => isActivated(serverActivations, uuid as UUID) !== activated
    );
    return stillPending.length === pendingUuids.length ? pendingActivations : Object.fromEntries(stillPending);
}

/**
 * A modification is applicable on a root network unless its applicability for it is explicitly false:
 * a root network without an entry is applicable.
 */
export function isApplicableOn(
    applicabilities: NetworkModificationApplicabilities,
    modificationUuid: UUID,
    rootNetworkUuid: UUID
) {
    return applicabilities[modificationUuid]?.[rootNetworkUuid] ?? true;
}

// Convert applicability by tag to applicability by root network id.
function toApplicabilityByRootNetworkUuid(
    applicabilityByRootNetworkTag: Record<string, boolean> | undefined,
    uuidByTag: Map<string, UUID>
): Record<UUID, boolean> {
    return Object.entries(applicabilityByRootNetworkTag ?? {}).reduce((applicability, [tag, applicable]) => {
        const rootNetworkUuid = uuidByTag.get(tag);
        return rootNetworkUuid ? { ...applicability, [rootNetworkUuid]: applicable } : applicability;
    }, {});
}

function collectApplicabilitiesByUuid(
    modifications: ComposedModificationMetadata[],
    uuidByTag: Map<string, UUID>
): NetworkModificationApplicabilities {
    return modifications.reduce(
        (applicabilities, modification) => ({
            ...applicabilities,
            [modification.uuid]: toApplicabilityByRootNetworkUuid(
                modification.applicabilityByRootNetworkTag,
                uuidByTag
            ),
            ...collectApplicabilitiesByUuid(modification.subModifications, uuidByTag),
        }),
        {}
    );
}

// Indexes by uuid the applicability every modification of the tree carries, sub modifications included.
// The modifications key it by root network tag; it is resolved here to the root network uuid.
// A tag no root network claims is dropped.
export function collectApplicabilities(
    modifications: ComposedModificationMetadata[],
    rootNetworks: RootNetworkRowInfo[] = []
): NetworkModificationApplicabilities {
    const uuidByTag = new Map(rootNetworks.map((rootNetwork) => [rootNetwork.tag, rootNetwork.rootNetworkUuid]));
    return collectApplicabilitiesByUuid(modifications, uuidByTag);
}

// Override server applicability when pending one exists.
export function mergeApplicabilities(
    serverApplicabilities: NetworkModificationApplicabilities,
    pendingApplicabilities: NetworkModificationApplicabilities
): NetworkModificationApplicabilities {
    if (Object.keys(pendingApplicabilities).length === 0) {
        return serverApplicabilities;
    }
    return Object.entries(pendingApplicabilities).reduce(
        (merged, [uuid, pendingByRootNetwork]) => ({
            ...merged,
            [uuid]: { ...merged[uuid as UUID], ...pendingByRootNetwork },
        }),
        serverApplicabilities
    );
}

/**
 * Keeps the pending applicabilities the server has yet to report, the way {@link keepStillPendingActivations}
 * does for the activations.
 */
export function keepStillPendingApplicabilities(
    pendingApplicabilities: NetworkModificationApplicabilities,
    serverApplicabilities: NetworkModificationApplicabilities
): NetworkModificationApplicabilities {
    const pendingUuids = Object.keys(pendingApplicabilities);
    if (pendingUuids.length === 0) {
        return pendingApplicabilities;
    }
    let hasChanged = false;
    const stillPending: NetworkModificationApplicabilities = {};
    pendingUuids.forEach((modificationUuid) => {
        const byRootNetwork = Object.entries(pendingApplicabilities[modificationUuid as UUID]).filter(
            ([rootNetworkUuid, applicable]) =>
                isApplicableOn(serverApplicabilities, modificationUuid as UUID, rootNetworkUuid as UUID) !== applicable
        );
        hasChanged ||= byRootNetwork.length !== Object.keys(pendingApplicabilities[modificationUuid as UUID]).length;
        if (byRootNetwork.length > 0) {
            stillPending[modificationUuid as UUID] = Object.fromEntries(byRootNetwork);
        }
    });
    return hasChanged ? stillPending : pendingApplicabilities;
}

/**
 * Whether a parent composite of the row is globally deactivated.
 */
export function isDeactivatedByAncestor(
    row: Row<ComposedModificationMetadata>,
    activations: NetworkModificationActivations
) {
    return row.getParentRows().some((ancestor) => !isActivated(activations, ancestor.original.uuid));
}

/**
 * Whether the modification is deactivated, by its own activation or by that of a composite holding it, so that
 * it applies nowhere and has no per root network choice left to make.
 */
export function isDeactivatedItselfOrByAncestor(
    row: Row<ComposedModificationMetadata>,
    activations: NetworkModificationActivations
) {
    return !isActivated(activations, row.original.uuid) || isDeactivatedByAncestor(row, activations);
}

/**
 * Whether the modification effectively applies on the root network: it has to want it, and so does every
 * composite it is nested in, both globally and for that root network.
 */
export function isAppliedOn(
    row: Row<ComposedModificationMetadata>,
    activations: NetworkModificationActivations,
    applicabilities: NetworkModificationApplicabilities,
    rootNetworkUuid: UUID
) {
    return [row, ...row.getParentRows()].every(
        ({ original }) =>
            isActivated(activations, original.uuid) && isApplicableOn(applicabilities, original.uuid, rootNetworkUuid)
    );
}

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

// Remove the applicabilities
export function toMessageValues(modification: NetworkModificationMetadata) {
    const { applicabilityByRootNetworkTag, ...messageValues } = modification;
    return messageValues;
}

export function isCompositeModification(modification: ComposedModificationMetadata | undefined) {
    return modification?.type === MODIFICATION_TYPES.COMPOSITE_MODIFICATION.type;
}

// TODO GRD-5250 :  Adjust isReferenceModification condition after reference modification types update
export function isReferenceModification(modification: ComposedModificationMetadata | undefined) {
    return modification?.type === MODIFICATION_TYPES.MODIFICATION_REFERENCE.type;
}

// Only inspects already-loaded subModifications (children fetched on row expansion), so a
// reference nested under a not-yet-expanded composite won't be detected. Same limitation as the
// rest of the drag-and-drop forbidden-drop checks, which all reason over the currently loaded tree.
export function containsReferenceModification(modification: ComposedModificationMetadata | undefined): boolean {
    if (!modification) {
        return false;
    }
    return modification.subModifications.some(
        (sub) => isReferenceModification(sub) || containsReferenceModification(sub)
    );
}

function normalizeReferenceChild(child: NetworkModificationMetadata): NetworkModificationMetadata {
    return {
        ...child,
        messageType: child.messageType ?? child.type,
        messageValues: child.messageValues ?? '{}',
    };
}

function extractReferenceChildren(detail: ModificationReferenceInfos): NetworkModificationMetadata[] {
    const referenceInfos = detail?.referencedInfos;
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
 * @param modifications source where the composite and reference modifications are looked for
 * @param containers result : all the composite and reference modifications found with loaded children
 */
export function findAllLoadedContainerModifications(
    modifications: ComposedModificationMetadata[],
    containers: ComposedModificationMetadata[]
) {
    modifications.forEach((modification) => {
        if (
            (isCompositeModification(modification) || isReferenceModification(modification)) &&
            modification.subModifications.length > 0
        ) {
            containers.push(modification);
            findAllLoadedContainerModifications(modification.subModifications, containers);
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
                const detail: ModificationReferenceInfos = await res.json();

                const children = extractReferenceChildren(detail).filter((m) => !m.stashed);
                const liveModifications = formatToComposedModification(children).map((m) => ({
                    ...m,
                    childFromShared: true,
                }));

                setMods((prev) => {
                    // Preserve rowKeys and already-loaded children of nested composites on a forced re-fetch.
                    const existingMod = findModificationInTree(node.rowKey, prev);
                    const mergedSubs = mergeSubModificationsIntoTree(
                        liveModifications,
                        existingMod?.subModifications ?? []
                    );
                    return updateSubModificationsOfACompositeInTree(node.rowKey, mergedSubs, prev);
                });
            } catch (error) {
                console.error(`Failed to load reference children for ${node.uuid}`, error);
            }
        })
    );
}
