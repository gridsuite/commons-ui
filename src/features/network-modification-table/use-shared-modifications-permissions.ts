/*
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useCallback, useEffect, useState } from 'react';
import type { UUID } from 'node:crypto';
import { getAccessibleElements, PermissionType } from '../../services';
import { equalsArrayAnyOrder, NetworkModificationMetadata } from '../../utils';
import { DirectoriesNotificationType, NotificationsUrlKeys } from '../../utils/constants/notificationsProvider';
import { useNotificationsListener } from '../notifications/hooks/useNotificationsListener';
import { isReferenceModification } from './utils';

const EMPTY_UUID_SET: Set<UUID> = new Set();

/** The distinct shared modifications pointed at by the given reference modifications. */
function getReferenceIds(referenceModifications: NetworkModificationMetadata[]): UUID[] {
    return [
        ...new Set(
            referenceModifications.map((modification) => modification.referenceId).filter((id) => id !== undefined)
        ),
    ];
}

/** A shared modification is read-only if it does not explicitly have the write permission. */
function buildReadOnlySharedModificationUuids(referenceIds: UUID[], permissions: Map<UUID, boolean>): Set<UUID> {
    return new Set(referenceIds.filter((id) => !permissions.get(id)));
}

/** State updater keeping the previous Set when the new one has the same content. */
function replaceIfChanged(nextUuids: Set<UUID>) {
    return (previousUuids: Set<UUID>) =>
        equalsArrayAnyOrder([...previousUuids], [...nextUuids]) ? previousUuids : nextUuids;
}

/**
 * Resolves the write permission the current user has on the shared modifications a node points at.
 *
 * A reference modification carries the uuid of the shared modification it points at (its `referenceId`), which
 * is also the uuid of the corresponding element in the directory - so its permission is the one of the
 * directory holding it.
 *
 * @param modifications a list of modifications we want to check the rights
 * @return the uuids of the **shared modifications** (not its references) the user is not allowed to write into
 */
// TODO a permission granted through a group stays cached when the user is added to / removed from that group:
// user-admin-server emits no notification on group membership changes, unlike directory-server on permissions.
// Also consider deleting this hook and using Redux instead if we start using this hook at several places.
export function useSharedModificationsPermissions(modifications: NetworkModificationMetadata[]): {
    readOnlySharedModificationUuids: Set<UUID>;
} {
    const [readOnlySharedModificationUuids, setReadOnlySharedModificationUuids] = useState<Set<UUID>>(EMPTY_UUID_SET);
    // referenceId -> has the write permission
    const [permissionsCache, setPermissionsCache] = useState<Map<UUID, boolean>>(() => new Map());

    // The directory server has no notification dedicated to permissions: any change on a directory - including
    // the ones on its permissions - is emitted under this single type. See useStudyPath.
    // Such a notification may therefore carry a permission change, which would make the cached answers wrong. It
    // doesn't tell which elements are affected - only which directory - and an element's directory is unknown
    // here, so the whole cache is dropped.
    const handleDirectoryNotification = useCallback((event: MessageEvent<string>) => {
        const eventData = JSON.parse(event.data);
        if (eventData.headers?.notificationType === DirectoriesNotificationType.UPDATE_DIRECTORY) {
            setPermissionsCache(new Map());
        }
    }, []);

    useNotificationsListener(NotificationsUrlKeys.DIRECTORY, {
        listenerCallbackMessage: handleDirectoryNotification,
    });

    useEffect(() => {
        let aborted = false;

        const referenceIds = getReferenceIds(modifications.filter(isReferenceModification));

        // Published before the fetch is even started, and refreshed by the cache update it triggers. An
        // unresolved permission counts as read-only, since buildReadOnlySharedModificationUuids keeps the
        // ids the cache doesn't answer for: locking a modification that turns out to be writable only lasts
        // the time of the call, whereas leaving it open breaches the very rule this hook enforces.
        setReadOnlySharedModificationUuids(
            replaceIfChanged(
                referenceIds.length === 0
                    ? EMPTY_UUID_SET
                    : buildReadOnlySharedModificationUuids(referenceIds, permissionsCache)
            )
        );

        const missingIds = referenceIds.filter((id) => !permissionsCache.has(id));
        if (missingIds.length === 0) {
            // no fetch needed
            return undefined;
        }

        getAccessibleElements(missingIds, PermissionType.WRITE)
            .catch((error) => {
                console.error('Failed to resolve the permissions on the shared modifications', error);
                // Denying them all is what the cache already reports while they are unresolved
                return [];
            })
            .then((accessibleIds) => {
                if (aborted) {
                    return;
                }
                const accessible = new Set(accessibleIds);
                setPermissionsCache((previousCache) => {
                    const nextCache = new Map(previousCache);
                    missingIds.forEach((id) => nextCache.set(id, accessible.has(id)));
                    return nextCache;
                });
            });

        return () => {
            aborted = true;
        };
    }, [modifications, permissionsCache]);

    return { readOnlySharedModificationUuids };
}
