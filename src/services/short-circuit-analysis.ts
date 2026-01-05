/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { UUID } from 'node:crypto';
import { backendFetch, backendFetchJson } from './utils';
import { ShortCircuitParametersInfos } from '../components/parameters/short-circuit/short-circuit-parameters.type';

const PREFIX_SHORT_CIRCUIT_SERVER_QUERIES = `${import.meta.env.VITE_API_GATEWAY}/shortcircuit`;

function getShortCircuitUrl() {
    return `${PREFIX_SHORT_CIRCUIT_SERVER_QUERIES}/v1/`;
}

export function getShortCircuitSpecificParametersDescription() {
    console.info('get short circuit specific parameters description');
    const getShortCircuitSpecificParametersUrl = `${getShortCircuitUrl()}parameters/specific-parameters`;
    console.debug(getShortCircuitSpecificParametersUrl);
    return backendFetchJson(getShortCircuitSpecificParametersUrl);
}

export function fetchShortCircuitParameters(parameterUuid: string): Promise<ShortCircuitParametersInfos> {
    console.info('get short circuit analysis parameters');
    const url = `${getShortCircuitUrl()}parameters/${encodeURIComponent(parameterUuid)}`;
    return backendFetchJson(url);
}

export function updateShortCircuitParameters(parameterUuid: UUID, newParams: any) {
    console.info('set short circuit parameters');
    const setShortCircuitParametersUrl = `${getShortCircuitUrl()}parameters/${parameterUuid}`;
    console.debug(setShortCircuitParametersUrl);
    return backendFetch(setShortCircuitParametersUrl, {
        method: 'PUT',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: newParams ? JSON.stringify(newParams) : null,
    });
}
