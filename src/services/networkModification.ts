/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import type { UUID } from 'node:crypto';
import { backendFetch, backendFetchJson, backendFetchText, safeEncodeURIComponent } from './utils';
import { NetworkModificationMetadata } from '../hooks';
import { PREFIX_STUDY_QUERIES } from './loadflow';

const PREFIX_NETWORK_MODIFICATION_QUERIES = `${import.meta.env.VITE_API_GATEWAY}/network-modification`;

export const getBaseNetworkModificationUrl = () => `${PREFIX_NETWORK_MODIFICATION_QUERIES}/v1`;

export const getStudyUrlWithNodeUuid = (studyUuid: string | null | undefined, nodeUuid: string | undefined) =>
    `${PREFIX_STUDY_QUERIES}/v1/studies/${safeEncodeURIComponent(studyUuid)}/nodes/${safeEncodeURIComponent(nodeUuid)}`;

function getUrl() {
    return `${PREFIX_NETWORK_MODIFICATION_QUERIES}/v1/network-modifications`;
}

export function fetchNetworkModification(modificationUuid: UUID) {
    const modificationFetchUrl = `${getUrl()}/${safeEncodeURIComponent(modificationUuid)}`;
    console.debug(modificationFetchUrl);
    return backendFetch(modificationFetchUrl);
}

export function fetchBusBarSectionsForNewCoupler(
    voltageLevelId: string,
    busBarCount: number,
    sectionCount: number,
    switchKindList: string[]
): Promise<string[]> {
    console.info('Fetching bus bar sections ids for voltage level : ', voltageLevelId);
    const urlSearchParams = new URLSearchParams();
    urlSearchParams.append('voltageLevelId', voltageLevelId);
    urlSearchParams.append('busBarCount', String(busBarCount));
    urlSearchParams.append('sectionCount', String(sectionCount));
    switchKindList.forEach((kind) => {
        urlSearchParams.append('switchKindList', kind);
    });

    const url =
        `${PREFIX_NETWORK_MODIFICATION_QUERIES}/v1/network-modifications/busbar-sections-for-new-coupler` +
        `?${urlSearchParams.toString()}`;
    console.debug(url);
    return backendFetchJson(url);
}

export function updateModification({ modificationUuid, body }: { modificationUuid: UUID; body: string }) {
    const url = `${getUrl()}/${safeEncodeURIComponent(modificationUuid)}`;

    console.info('Updating modification', { url });

    return backendFetchText(url, {
        method: 'PUT',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body,
    });
}

export function getNetworkModificationsFromComposite(
    compositeModificationUuids: string[],
    onlyMetadata: boolean = true
): Promise<Record<UUID, NetworkModificationMetadata[]>> {
    const urlSearchParams = new URLSearchParams();
    compositeModificationUuids.forEach((uuid) => urlSearchParams.append('uuids', uuid));
    urlSearchParams.append('onlyMetadata', String(onlyMetadata));
    const url = `${getBaseNetworkModificationUrl()}/network-composite-modifications/network-modifications?${urlSearchParams.toString()}`;
    console.debug(url);
    return backendFetchJson(url);
}

/**
 * Move a composite sub-modification within or between composites, or between a composite and the group root.
 *
 * The four scenarios are encoded by the nullable sourceCompositeUuid / targetCompositeUuid:
 *  - both present  → sub-to-sub (same composite = reorder, different = cross-composite move)
 *  - source only   → extract from composite to root level
 *  - target only   → embed root-level modification into a composite
 *
 * @param studyUuid
 * @param nodeUuid
 * @param modificationUuid
 * @param sourceCompositeUuid  UUID of the composite that currently owns the modification; null if at root
 * @param targetCompositeUuid  UUID of the target composite; null to place at root level
 * @param beforeUuid           insert before this UUID in the target collection; null to append at end
 */
export function changeCompositeSubModificationOrder(
    studyUuid: UUID | null,
    nodeUuid: UUID | undefined,
    modificationUuid: UUID,
    sourceCompositeUuid: UUID | null,
    targetCompositeUuid: UUID | null,
    beforeUuid: UUID | null
) {
    console.info(`move composite sub-modification ${modificationUuid} in node ${nodeUuid}`);
    const params = new URLSearchParams();
    if (sourceCompositeUuid) params.set('sourceCompositeUuid', sourceCompositeUuid);
    if (targetCompositeUuid) params.set('targetCompositeUuid', targetCompositeUuid);
    if (beforeUuid) params.set('beforeUuid', beforeUuid);
    const paramsStr = params.toString() ? `?${params.toString()}` : ``;
    const url = `${getStudyUrlWithNodeUuid(studyUuid, nodeUuid)}/composite-sub-modification/${modificationUuid}${paramsStr}`;
    console.debug(url);
    return backendFetch(url, { method: 'put' });
}

export function changeNetworkModificationOrder(
    studyUuid: UUID | null,
    nodeUuid: UUID | undefined,
    itemUuid: UUID,
    beforeUuid: UUID | null
) {
    console.info(`reorder node ${nodeUuid} of study ${studyUuid}`);
    const beforeParam = new URLSearchParams({ beforeUuid: beforeUuid || '' }).toString();
    const url = `${getStudyUrlWithNodeUuid(studyUuid, nodeUuid)}/network-modification/${itemUuid}?${beforeParam}`;
    console.debug(url);
    return backendFetch(url, { method: 'put' });
}
