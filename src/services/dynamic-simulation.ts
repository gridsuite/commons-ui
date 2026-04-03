/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import type { UUID } from 'node:crypto';
import { backendFetch, backendFetchJson } from './utils';
import { DynamicSimulationParametersInfos } from '../utils/types/dynamic-simulation.type';

const PREFIX_DYNAMIC_SIMULATION_SERVER_QUERIES = `${import.meta.env.VITE_API_GATEWAY}/dynamic-simulation`;

function getDynamicSimulationUrl() {
    return `${PREFIX_DYNAMIC_SIMULATION_SERVER_QUERIES}/v1/`;
}

export function fetchDynamicSimulationProviders() {
    console.info('fetch dynamic simulation providers');
    const url = `${getDynamicSimulationUrl()}providers`;
    console.debug(url);
    return backendFetchJson(url);
}

export function fetchDynamicSimulationParameters(parameterUuid: UUID): Promise<DynamicSimulationParametersInfos> {
    console.info(`Fetching dynamic simulation parameters having uuid '${parameterUuid}' ...`);
    const url = `${getDynamicSimulationUrl()}parameters/${encodeURIComponent(parameterUuid)}`;
    console.debug(url);
    return backendFetchJson(url);
}

export function updateDynamicSimulationParameters(
    parameterUuid: UUID,
    newParams: DynamicSimulationParametersInfos
): Promise<Response> {
    console.info(`Setting dynamic simulation parameters having uuid '${parameterUuid}' ...`);
    const url = `${getDynamicSimulationUrl()}parameters/${parameterUuid}`;
    console.debug(url);
    return backendFetch(url, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(newParams),
    });
}
