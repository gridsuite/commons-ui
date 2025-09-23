/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import type { UUID } from 'node:crypto';
import { backendFetchJson } from './utils';
import { NetworkVisualizationParameters } from '../components/parameters/network-visualizations/network-visualizations.types';

const PREFIX_STUDY_CONFIG_SERVER_QUERIES = `${import.meta.env.VITE_API_GATEWAY}/study-config`;

function getNetworkVisualizationsParametersUrl() {
    return `${PREFIX_STUDY_CONFIG_SERVER_QUERIES}/v1/network-visualizations-params`;
}

export function getNetworkVisualizationsParameters(paramsUuid: UUID): Promise<NetworkVisualizationParameters> {
    console.info('get network visualization parameters');
    const fetchUrl = `${getNetworkVisualizationsParametersUrl()}/${paramsUuid}`;
    return backendFetchJson(fetchUrl, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
}
