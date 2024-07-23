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

/**
 * Return the base API prefix to the directory server
 * <br/>Note: cannot be a const because part of the prefix can be overridden at runtime
 * @param vApi the version of api to use
 */
function getPrefix(vApi: number) {
    return `${getRestBase()}/directory/v${vApi}`;
}

export async function fetchRootFolders(types: string[]) {
    console.info('Fetching Root Directories');
    const urlSearchParams = getRequestParam('elementTypes', types).toString();
    return backendFetchJson<ElementAttributes[]>(
        `${getPrefix(1)}/root-directories?${urlSearchParams}`,
        'GET'
    );
}

export async function fetchDirectoryContent(
    directoryUuid: UUID,
    types?: string[]
) {
    console.info("Fetching Folder content '%s'", directoryUuid);
    return backendFetchJson<ElementAttributes[]>(
        appendSearchParam(
            `${getPrefix(1)}/directories/${directoryUuid}/elements`,
            getRequestParam('elementTypes', types)
        ),
        'GET'
    );
}

export async function fetchDirectoryElementPath(elementUuid: UUID) {
    console.info(`Fetching element '${elementUuid}' and its parents info ...`);
    const fetchPathUrl = `${getPrefix(1)}/elements/${encodeURIComponent(
        elementUuid
    )}/path`;
    return backendFetchJson<ElementAttributes[]>(fetchPathUrl, 'GET');
}

export async function elementExists(
    directoryUuid: UUID,
    elementName: string,
    type: string
) {
    const response = await backendFetch(
        `${getPrefix(
            1
        )}/directories/${directoryUuid}/elements/${elementName}/types/${type}`,
        'HEAD'
    );
    return response.status !== 204; // HTTP 204 : No-content
}
