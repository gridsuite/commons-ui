/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import type { UUID } from 'node:crypto';
import { backendFetch, backendFetchText } from './utils';
import { SubstationCreationDto } from './network-modification-types';
import { ModificationType } from '../utils';

const PREFIX_NETWORK_MODIFICATION_QUERIES = `${import.meta.env.VITE_API_GATEWAY}/network-modification`;

function getUrl() {
    return `${PREFIX_NETWORK_MODIFICATION_QUERIES}/v1/network-modifications`;
}

export function fetchNetworkModification(modificationUuid: UUID) {
    const modificationFetchUrl = `${getUrl()}/${modificationUuid}`;
    console.debug(modificationFetchUrl);
    return backendFetch(modificationFetchUrl);
}

export function createSubstationPromise(
    { substationId, substationName, country, properties, isUpdate, modificationUuid }: SubstationCreationDto,
    baseUrl: string
) {
    const body = JSON.stringify({
        type: ModificationType.SUBSTATION_CREATION,
        equipmentId: substationId,
        equipmentName: substationName,
        country: country === '' ? null : country,
        properties,
    });
    let url = baseUrl;
    if (modificationUuid) {
        url += `/${encodeURIComponent(modificationUuid)}`;
        console.info('Updating substation creation', { url, body });
    } else {
        console.info('Creating substation creation', { url, body });
    }
    return backendFetchText(url, {
        method: isUpdate ? 'PUT' : 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body,
    });
}

export function createSubstation(dto: SubstationCreationDto) {
    return createSubstationPromise(dto, getUrl());
}
