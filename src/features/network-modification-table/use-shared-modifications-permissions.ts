/*
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useCallback, useEffect, useState } from 'react';
import type { UUID } from 'node:crypto';
import { hasElementPermission, PermissionType } from '../../services';
import { equalsArrayAnyOrder, NetworkModificationMetadata } from '../../utils';
import { DirectoriesNotificationType, NotificationsUrlKeys } from '../../utils/constants/notificationsProvider';
import { useNotificationsListener } from '../notifications/hooks/useNotificationsListener';
import { isReferenceModification } from './utils';

const EMPTY_UUID_SET: Set<UUID> = new Set();

/** The distinct shared modifications pointed at by the given reference modifications. */
function getReferenceIds(referenceModifications: NetworkModificationMetadata[]): UUID[] {
    return [
        ...new Set(
            referenceModifications
                .map((modification) => modification.referenceId)
                .filter((id): id is UUID => id !== undefined)
        ),
    ];
}

/**
 * @param referenceModifications the reference modifications of the current node
 * @param permissions referenceId -> whether the user has the write permission on it
 * @return the uuids of the reference modifications whose shared modification can't be written into
 */
function buildReadOnlyReferenceModificationUuids(
    referenceModifications: NetworkModificationMetadata[],
    permissions: Map<UUID, boolean>
): Set<UUID> {
    return new Set(
        referenceModifications
            .filter((modification) => !!modification.referenceId && !permissions.get(modification.referenceId))
            .map((modification) => modification.uuid)
    );
}

/**
 * State updater keeping the previous Set when the new one has the same content. The answer rarely changes
 * from one resolution to the next, and an unchanged reference spares the consumers a tree walk and a re-render.
 */
function replaceIfChanged(nextUuids: Set<UUID>) {
    return (previousUuids: Set<UUID>) =>
        equalsArrayAnyOrder([...previousUuids], [...nextUuids]) ? previousUuids : nextUuids;
}

/**
 * Resolves the write permission the current user has on the shared modifications a node points at.
 *
 * A reference modification carries the uuid of the shared modification it points at, which is also the uuid of
 * the corresponding element in the directory - so its permission is the one of the directory holding it.
 *
 * @param modifications the modifications of the current node, as returned by the server
 * @return the uuids of the reference modification **rows** the user is not allowed to write into
 */
// TODO a permission granted through a group stays cached when the user is added to / removed from that group:
// user-admin-server emits no notification on group membership changes, unlike directory-server on permissions.
// Also consider deleting this hook and using Redux instead if we start using permissions at several places.
export function useSharedModificationsPermissions(modifications: NetworkModificationMetadata[]): {
    readOnlyReferenceModificationUuids: Set<UUID>;
} {
    const [readOnlyReferenceModificationUuids, setReadOnlyReferenceModificationUuids] =
        useState<Set<UUID>>(EMPTY_UUID_SET);
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

        const referenceModifications = modifications.filter(isReferenceModification);
        const referenceIds = getReferenceIds(referenceModifications);

        const missingIds = referenceIds.filter((id) => !permissionsCache.has(id));
        if (missingIds.length === 0) {
            setReadOnlyReferenceModificationUuids(
                replaceIfChanged(
                    referenceIds.length === 0
                        ? EMPTY_UUID_SET
                        : buildReadOnlyReferenceModificationUuids(referenceModifications, permissionsCache)
                )
            );
            // no fetch needed
            return undefined;
        }

        // TODO batch endpoint
        Promise.all(missingIds.map((id) => hasElementPermission(id, PermissionType.WRITE))).then((permissions) => {
            if (aborted) {
                return;
            }
            setPermissionsCache((previousCache) => {
                const nextCache = new Map(previousCache);
                missingIds.forEach((id, index) => nextCache.set(id, permissions[index]));
                return nextCache;
            });
        });

        return () => {
            aborted = true;
        };
    }, [modifications, permissionsCache]);

    return { readOnlyReferenceModificationUuids };
}
