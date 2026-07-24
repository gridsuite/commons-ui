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
import { NotificationsUrlKeys } from '../../utils/constants/notificationsProvider';
import { useNotificationsListener } from '../notifications/hooks/useNotificationsListener';
import { isSharedModification } from './utils';

const EMPTY_UUID_SET: Set<UUID> = new Set();

// The directory server has no notification dedicated to permissions: any change on a directory - including
// the ones on its permissions - is emitted under this single type.
// See useStudyPath
// TODO mutualize this with enum
const UPDATE_DIRECTORY_NOTIFICATION_TYPE = 'UPDATE_DIRECTORY';

/** The distinct elements referenced by the given shared modifications. */
function getReferenceIds(sharedModifications: NetworkModificationMetadata[]): UUID[] {
    return [
        ...new Set(
            sharedModifications
                .map((modification) => modification.referenceId)
                .filter((id): id is UUID => id !== undefined)
        ),
    ];
}

/**
 * @param sharedModifications the shared modifications of the current node
 * @param permissions referenceId -> whether the user has the write permission on it
 * @return the uuids of the shared modifications whose referenced element can't be written into
 */
function buildReadOnlySharedModificationUuids(
    sharedModifications: NetworkModificationMetadata[],
    permissions: Map<UUID, boolean>
): Set<UUID> {
    return new Set(
        sharedModifications
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
 * Resolves the write permission the current user has on the shared modifications of a node.
 *
 * A shared modification carries the uuid of the composite it references, which is also the uuid of the
 * corresponding element in the directory - so its permission is the one of the directory holding that element.
 *
 * @param modifications the modifications of the current node, as returned by the server
 * @return the uuids of the shared modification **rows** the user is not allowed to write into
 */
// TODO a permission granted through a group stays cached when the user is added to / removed from that group:
// user-admin-server emits no notification on group membership changes, unlike directory-server on permissions.
// Also consider deleting this hook on using Redux instead if we start using permissions at several places.
export function useSharedModificationsPermissions(modifications: NetworkModificationMetadata[]): {
    readOnlySharedModificationUuids: Set<UUID>;
} {
    const [readOnlySharedModificationUuids, setReadOnlySharedModificationUuids] = useState<Set<UUID>>(EMPTY_UUID_SET);
    // referenceId -> has the write permission
    const [permissionsCache, setPermissionsCache] = useState<Map<UUID, boolean>>(() => new Map());

    // A directory notification may carry a permission change, which would make the cached answers wrong. It
    // doesn't tell which elements are affected - only which directory - and an element's directory is unknown
    // here, so the whole cache is dropped.
    const handleDirectoryNotification = useCallback((event: MessageEvent<string>) => {
        const eventData = JSON.parse(event.data);
        if (eventData.headers?.notificationType === UPDATE_DIRECTORY_NOTIFICATION_TYPE) {
            setPermissionsCache(new Map());
        }
    }, []);

    useNotificationsListener(NotificationsUrlKeys.DIRECTORY, {
        listenerCallbackMessage: handleDirectoryNotification,
    });

    useEffect(() => {
        let aborted = false;

        const sharedModifications = modifications.filter(isSharedModification);
        const referenceIds = getReferenceIds(sharedModifications);

        const missingIds = referenceIds.filter((id) => !permissionsCache.has(id));
        if (missingIds.length === 0) {
            setReadOnlySharedModificationUuids(
                replaceIfChanged(
                    referenceIds.length === 0
                        ? EMPTY_UUID_SET
                        : buildReadOnlySharedModificationUuids(sharedModifications, permissionsCache)
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

    return { readOnlySharedModificationUuids };
}
