/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import type { UUID } from 'node:crypto';
import { backendFetch, backendFetchJson, getRequestParamFromList } from './utils';
import { COMMON_APP_NAME, COMMON_CONFIG_PARAMS_NAMES, ElementAttributes } from '../utils';

const PREFIX_EXPLORE_SERVER_QUERIES = `${import.meta.env.VITE_API_GATEWAY}/explore`;
const PREFIX_CONFIG_QUERIES = `${import.meta.env.VITE_API_GATEWAY}/config`;

export function getAppName(appName: string, name: string) {
    return COMMON_CONFIG_PARAMS_NAMES.has(name) ? COMMON_APP_NAME : appName;
}

export function updateConfigParameter(appName: string, name: string, value: string) {
    const targetAppName = getAppName(appName, name);
    console.info(`Updating config parameter '${name}=${value}' for app '${targetAppName}'`);
    const updateParams = `${PREFIX_CONFIG_QUERIES}/v1/applications/${targetAppName}/parameters/${name}?value=${encodeURIComponent(value)}`;
    return backendFetch(updateParams, { method: 'put' });
}

export function fetchConfigParameters(appName: string) {
    console.info(`Fetching UI configuration params for app : ${appName}`);
    const fetchParams = `${PREFIX_CONFIG_QUERIES}/v1/applications/${appName}/parameters`;
    return backendFetchJson(fetchParams);
}

export function fetchConfigParameter(appName: string, name: string) {
    const targetAppName = getAppName(appName, name);
    console.info(`Fetching UI config parameter '${name}' for app '${targetAppName}'`);
    const fetchParams = `${PREFIX_CONFIG_QUERIES}/v1/applications/${targetAppName}/parameters/${name}`;
    return backendFetchJson(fetchParams);
}

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

export function fetchDirectoryContent(directoryUuid: UUID, types?: string[]): Promise<ElementAttributes[]> {
    console.info("Fetching Folder content '%s'", directoryUuid);

    // Add params to Url
    const urlSearchParams = getRequestParamFromList('elementTypes', types).toString();

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
