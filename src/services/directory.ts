/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { UUID } from 'crypto';
import {
    backendFetchJson,
    getRequestParam as getRequestParamFromList,
} from '../utils/api';
import { ElementAttributes } from '../utils/types';

const PREFIX_DIRECTORY_SERVER_QUERIES = `${
    import.meta.env.VITE_API_GATEWAY
}/directory`;

export function fetchRootFolders(types: string[]) {
    console.info('Fetching Root Directories');

    // Add params to Url
    const urlSearchParams = getRequestParamFromList(
        'elementTypes',
        types
    ).toString();
    const fetchRootFoldersUrl = `${PREFIX_DIRECTORY_SERVER_QUERIES}/v1/root-directories?${urlSearchParams}`;
    return backendFetchJson(fetchRootFoldersUrl, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    }) as Promise<ElementAttributes[]>;
}

export function fetchDirectoryContent(directoryUuid: UUID, types?: string[]) {
    console.info("Fetching Folder content '%s'", directoryUuid);

    // Add params to Url
    const urlSearchParams = getRequestParamFromList(
        'elementTypes',
        types
    ).toString();

    const fetchDirectoryContentUrl = `${PREFIX_DIRECTORY_SERVER_QUERIES}/v1/directories/${directoryUuid}/elements${
        urlSearchParams ? `?${urlSearchParams}` : ''
    }`;
    return backendFetchJson(fetchDirectoryContentUrl, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    }) as Promise<ElementAttributes[]>;
}

export function fetchDirectoryElementPath(elementUuid: UUID) {
    console.info(`Fetching element '${elementUuid}' and its parents info ...`);
    const fetchPathUrl = `${PREFIX_DIRECTORY_SERVER_QUERIES}/v1/elements/${encodeURIComponent(
        elementUuid
    )}/path`;
    console.debug(fetchPathUrl);
    return backendFetchJson(fetchPathUrl, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    }) as Promise<ElementAttributes[]>;
}
