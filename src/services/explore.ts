/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import type { UUID } from 'node:crypto';
import { backendFetch, backendFetchJson, getRequestParamFromList } from './utils';
import { ElementAttributes } from '../utils/types/types';
import { NewFilterType } from '../components/filter/filter.type';
import { ElementType } from '../utils';

const PREFIX_EXPLORE_SERVER_QUERIES = `${import.meta.env.VITE_API_GATEWAY}/explore`;

export function createFilter(
    newFilter: NewFilterType,
    name: string,
    description: string,
    parentDirectoryUuid: UUID | undefined | null,
    token?: string
) {
    const urlSearchParams = new URLSearchParams();
    urlSearchParams.append('name', name);
    urlSearchParams.append('description', description);
    if (parentDirectoryUuid) {
        urlSearchParams.append('parentDirectoryUuid', parentDirectoryUuid);
    }
    return backendFetch(
        `${PREFIX_EXPLORE_SERVER_QUERIES}/v1/explore/filters?${urlSearchParams.toString()}`,
        {
            method: 'post',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newFilter),
        },
        token
    );
}

export function saveFilter(filter: NewFilterType, name: string, description: string, token?: string) {
    const urlSearchParams = new URLSearchParams();
    urlSearchParams.append('name', name);
    urlSearchParams.append('description', description);
    return backendFetch(
        `${PREFIX_EXPLORE_SERVER_QUERIES}/v1/explore/filters/${filter.id}?${urlSearchParams.toString()}`,
        {
            method: 'put',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(filter),
        },
        token
    );
}

export async function fetchElementsInfos(
    ids: UUID[],
    elementTypes?: string[],
    equipmentTypes?: string[]
): Promise<ElementAttributes[]> {
    console.info('Fetching elements metadata');
    let final: ElementAttributes[] = [];
    const chunkSize = 50;
    for (let i = 0; i < ids.length; i += chunkSize) {
        const partitionIds = ids.slice(i, i + chunkSize);
        const idsParams = getRequestParamFromList(
            'ids',
            partitionIds.filter((id) => id) // filter falsy elements
        );
        const equipmentTypesParams = getRequestParamFromList('equipmentTypes', equipmentTypes);
        const elementTypesParams = getRequestParamFromList('elementTypes', elementTypes);
        const urlSearchParams = new URLSearchParams([
            ...idsParams,
            ...equipmentTypesParams,
            ...elementTypesParams,
        ]).toString();

        const url = `${PREFIX_EXPLORE_SERVER_QUERIES}/v1/explore/elements/metadata?${urlSearchParams}`;
        // eslint disable is present because of https://eslint.org/docs/latest/rules/no-await-in-loop#when-not-to-use-it
        // we use await here to avoid to do too many request to the server
        // eslint-disable-next-line no-await-in-loop
        const result = await backendFetchJson(url, {
            method: 'get',
            headers: { 'Content-Type': 'application/json' },
        });
        final = final.concat(result);
    }
    return final;
}

export function createParameter(
    newParameter: any,
    name: string,
    parameterType: ElementType,
    description: string,
    parentDirectoryUuid: UUID
) {
    const urlSearchParams = new URLSearchParams();
    urlSearchParams.append('name', name);
    urlSearchParams.append('type', parameterType);
    urlSearchParams.append('description', description);
    urlSearchParams.append('parentDirectoryUuid', parentDirectoryUuid);
    return backendFetch(`${PREFIX_EXPLORE_SERVER_QUERIES}/v1/explore/parameters?${urlSearchParams.toString()}`, {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newParameter),
    });
}

export function updateParameter(
    id: UUID,
    newParameter: any,
    name: string,
    parameterType: ElementType,
    description: string
) {
    const urlSearchParams = new URLSearchParams();
    urlSearchParams.append('name', name);
    urlSearchParams.append('type', parameterType);
    urlSearchParams.append('description', description);
    return backendFetch(`${PREFIX_EXPLORE_SERVER_QUERIES}/v1/explore/parameters/${id}?${urlSearchParams.toString()}`, {
        method: 'put',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newParameter),
    });
}
