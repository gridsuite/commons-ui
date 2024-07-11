/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { UUID } from 'crypto';
import {
    appendSearchParam,
    backendFetch,
    backendFetchJson,
    getRequestParam,
    getRestBase,
} from '../utils/api';
import { ElementAttributes } from '../utils/types';

const PREFIX_DIRECTORY_SERVER_QUERIES = `${getRestBase()}/directory`;

export async function fetchRootFolders(types: string[]) {
    console.info('Fetching Root Directories');
    const urlSearchParams = getRequestParam('elementTypes', types).toString();
    return (await backendFetchJson(
        `${PREFIX_DIRECTORY_SERVER_QUERIES}/v1/root-directories?${urlSearchParams}`,
        'GET'
    )) as ElementAttributes[];
}

export async function fetchDirectoryContent(
    directoryUuid: UUID,
    types?: string[]
) {
    console.info("Fetching Folder content '%s'", directoryUuid);
    return (await backendFetchJson(
        appendSearchParam(
            `${PREFIX_DIRECTORY_SERVER_QUERIES}/v1/directories/${directoryUuid}/elements`,
            getRequestParam('elementTypes', types)
        ),
        'GET'
    )) as ElementAttributes[];
}

export async function fetchDirectoryElementPath(elementUuid: UUID) {
    console.info(`Fetching element '${elementUuid}' and its parents info ...`);
    const fetchPathUrl = `${PREFIX_DIRECTORY_SERVER_QUERIES}/v1/elements/${encodeURIComponent(
        elementUuid
    )}/path`;
    return (await backendFetchJson(fetchPathUrl, 'GET')) as ElementAttributes[];
}

export async function elementExists(
    directoryUuid: UUID,
    elementName: string,
    type: string
) {
    const response = await backendFetch(
        `${PREFIX_DIRECTORY_SERVER_QUERIES}/v1/directories/${directoryUuid}/elements/${elementName}/types/${type}`,
        'HEAD'
    );
    return response.status !== 204; // HTTP 204 : No-content
}
