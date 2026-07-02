/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import type { UUID } from 'node:crypto';
import { backendFetch, backendFetchJson, backendFetchText, safeEncodeURIComponent } from './utils';
import { PREFIX_STUDY_QUERIES } from './loadflow';
import { ComposedModificationMetadata, NetworkModificationMetadata } from '../utils';

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

/**
 * Update only the metadata (e.g. the name) of network modifications, directly on the network-modification-server.
 * Fields left out of `metadata` are not modified.
 */
export function updateNetworkModificationsMetadata(
    modificationUuids: UUID[],
    metadata: Partial<ComposedModificationMetadata>
) {
    const urlSearchParams = new URLSearchParams();
    modificationUuids.forEach((uuid) => urlSearchParams.append('uuids', uuid));
    const url = `${getUrl()}?${urlSearchParams.toString()}`;
    console.debug(url);
    return backendFetch(url, {
        method: 'PUT',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(metadata),
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

export function moveModification(
    studyUuid: UUID | null,
    nodeUuid: UUID | undefined,
    modificationUuid: UUID,
    sourceContainerId: UUID | null,
    targetContainerId: UUID | null,
    beforeUuid: UUID | null
) {
    console.info(`move modification ${modificationUuid} in node ${nodeUuid}`);
    const params = new URLSearchParams();
    if (sourceContainerId) params.set('sourceContainerId', sourceContainerId);
    if (targetContainerId) params.set('targetContainerId', targetContainerId);
    if (beforeUuid) params.set('beforeUuid', beforeUuid);
    const url = `${getStudyUrlWithNodeUuid(studyUuid, nodeUuid)}/network-modification/${modificationUuid}?${params.toString()}`;
    console.debug(url);
    return backendFetch(url, { method: 'put' });
}

const getStudyUrlWithNodeUuidAndRootNetworkUuid = (
    studyUuid: string | null | undefined,
    nodeUuid: string | null | undefined,
    rootNetworkUuid: string | undefined | null
) =>
    `${PREFIX_STUDY_QUERIES}/v1/studies/${safeEncodeURIComponent(studyUuid)}/root-networks/${safeEncodeURIComponent(
        rootNetworkUuid
    )}/nodes/${safeEncodeURIComponent(nodeUuid)}`;

export function setModificationMetadata(
    studyUuid: UUID | null,
    nodeUuid: UUID | undefined,
    modificationUuid: UUID | undefined,
    metadata: Partial<NetworkModificationMetadata | ComposedModificationMetadata>
): Promise<Response> {
    if (!modificationUuid) {
        return Promise.reject(new Error('modificationUuid is required'));
    }
    const urlSearchParams = new URLSearchParams();
    urlSearchParams.append('uuids', String([modificationUuid]));
    const url = `${getStudyUrlWithNodeUuid(studyUuid, nodeUuid)}/network-modifications?${urlSearchParams.toString()}`;
    return backendFetch(url, {
        method: 'PUT',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(metadata),
    });
}

export function updateModificationStatusByRootNetwork(
    studyUuid: UUID,
    nodeUuid: UUID,
    rootNetworkUuid: UUID,
    modificationUuid: UUID,
    activated: boolean
) {
    const urlSearchParams = new URLSearchParams();
    urlSearchParams.append('activated', String(activated));
    urlSearchParams.append('uuids', String([modificationUuid]));
    const url = `${getStudyUrlWithNodeUuidAndRootNetworkUuid(studyUuid, nodeUuid, rootNetworkUuid)}/network-modifications?${urlSearchParams.toString()}`;
    console.debug(url);
    return backendFetch(url, { method: 'PUT' });
}
