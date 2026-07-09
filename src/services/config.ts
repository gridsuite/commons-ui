/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { backendFetch, backendFetchJson } from './utils';
import { COMMON_APP_NAME, COMMON_CONFIG_PARAMS_NAMES } from '../utils';

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
