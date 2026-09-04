/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import type { UUID } from 'node:crypto';
import { backendFetch, backendFetchJson, getRequestParamFromList } from './utils';
import { ElementAttributes } from '../utils/types/types';

const PREFIX_EXPLORE_SERVER_QUERIES = `${import.meta.env.VITE_API_GATEWAY}/explore`;

export function fetchRootFolders(types: string[]): Promise<ElementAttributes[]> {
    console.info('Fetching Root Directories');

    // Add params to Url
    const urlSearchParams = getRequestParamFromList('elementTypes', types).toString();
    const fetchRootFoldersUrl = `${PREFIX_EXPLORE_SERVER_QUERIES}/v1/explore/directories/root-directories?${urlSearchParams}`;
    return backendFetchJson(fetchRootFoldersUrl, {
        method: 'get',
        headers: { 'Content-Type': 'application/json' },
    });
}

export function fetchDirectoryContent(
    directoryUuid: UUID,
    types?: string[],
    recursive?: boolean
): Promise<ElementAttributes[]> {
    console.info("Fetching Folder content '%s'", directoryUuid);

    // Add params to Url
    const searchParams = getRequestParamFromList('elementTypes', types);
    if (recursive) {
        // the whole content of the directory, at any depth
        searchParams.append('recursive', 'true');
    }
    const urlSearchParams = searchParams.toString();

    const fetchDirectoryContentUrl = `${PREFIX_EXPLORE_SERVER_QUERIES}/v1/explore/directories/${directoryUuid}/elements${
        urlSearchParams ? `?${urlSearchParams}` : ''
    }`;
    return backendFetchJson(fetchDirectoryContentUrl, {
        method: 'get',
        headers: { 'Content-Type': 'application/json' },
    });
}

export function fetchDirectoryElementPath(elementUuid: UUID): Promise<ElementAttributes[]> {
    console.info(`Fetching element '${elementUuid}' and its parents info ...`);
    const fetchPathUrl = `${PREFIX_EXPLORE_SERVER_QUERIES}/v1/explore/directories/elements/${encodeURIComponent(
        elementUuid
    )}/path`;
    console.debug(fetchPathUrl);
    return backendFetchJson(fetchPathUrl, {
        method: 'get',
        headers: { 'Content-Type': 'application/json' },
    });
}

export function elementAlreadyExists(directoryUuid: UUID, elementName: string, type: string) {
    const elementNameEncoded = encodeURIComponent(elementName);
    const existsElementUrl = `${PREFIX_EXPLORE_SERVER_QUERIES}/v1/explore/directories/${directoryUuid}/elements/${elementNameEncoded}/types/${type}`;
    console.debug(existsElementUrl);
    return backendFetch(existsElementUrl, { method: 'head' }).then(
        (response) => response.status !== 204 // HTTP 204 : No-content
    );
}

export enum PermissionType {
    READ = 'READ',
    WRITE = 'WRITE',
    MANAGE = 'MANAGE',
}

/**
 * Asks which of the given elements the user has the permission on, in a single call. A directory is checked
 * on itself, any other element on its parent directory.
 *
 * @return the uuids the user has the permission on, the forbidden and the unknown ones being left out
 */
export function getAccessibleElements(elementUuids: UUID[], permission: PermissionType): Promise<UUID[]> {
    const params = new URLSearchParams({ ids: elementUuids.join(','), accessType: permission });
    const url = `${PREFIX_EXPLORE_SERVER_QUERIES}/v1/explore/elements/permission?${params.toString()}`;
    console.debug(url);
    return backendFetchJson(url);
}

export function hasElementPermission(elementUuid: UUID, permission: PermissionType): Promise<boolean> {
    return getAccessibleElements([elementUuid], permission)
        .then((accessibleUuids) => accessibleUuids.includes(elementUuid))
        .catch(() => {
            console.info(`${permission} permission denied for element or directory ${elementUuid}`);
            return false;
        });
}

export function fetchElementNames(elementUuids: Set<string>): Promise<Record<string, string>> {
    console.info('fetch directory element names');

    const params = new URLSearchParams();
    elementUuids.forEach((id) => {
        params.append('ids', id);
    });

    const url = `${PREFIX_EXPLORE_SERVER_QUERIES}/v1/explore/elements/name?${params.toString()}`;
    console.log(url);

    return backendFetchJson(url);
}
