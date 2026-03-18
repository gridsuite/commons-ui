/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import type { UUID } from 'node:crypto';
import { backendFetch, backendFetchJson, backendFetchText, safeEncodeURIComponent } from './utils';

const PREFIX_NETWORK_MODIFICATION_QUERIES = `${import.meta.env.VITE_API_GATEWAY}/network-modification`;

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
