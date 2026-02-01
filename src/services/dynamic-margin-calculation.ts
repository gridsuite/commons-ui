/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import type { UUID } from 'node:crypto';
import { DynamicMarginCalculationParametersInfos } from '../utils/types/dynamic-margin-calculation.type';
import { backendFetch, backendFetchJson } from './utils';

const PREFIX_DYNAMIC_MARGIN_CALCULATION_SERVER_QUERIES = `${import.meta.env.VITE_API_GATEWAY}/dynamic-margin-calculation`;

function getDynamicMarginCalculationUrl() {
    return `${PREFIX_DYNAMIC_MARGIN_CALCULATION_SERVER_QUERIES}/v1/`;
}

export function fetchDynamicMarginCalculationProviders() {
    console.info('fetch dynamic margin calculation providers');
    const url = `${getDynamicMarginCalculationUrl()}providers`;
    console.debug(url);
    return backendFetchJson(url);
}

export function fetchDynamicMarginCalculationParameters(
    parameterUuid: UUID
): Promise<DynamicMarginCalculationParametersInfos> {
    console.info(`Fetching dynamic margin calculation parameters having uuid '${parameterUuid}' ...`);
    const url = `${getDynamicMarginCalculationUrl()}parameters/${encodeURIComponent(parameterUuid)}`;
    console.debug(url);
    return backendFetchJson(url);
}

export function updateDynamicMarginCalculationParameters(
    parameterUuid: UUID,
    newParams: DynamicMarginCalculationParametersInfos
): Promise<Response> {
    console.info(`Setting dynamic margin calculation parameters having uuid '${parameterUuid}' ...`);
    const url = `${getDynamicMarginCalculationUrl()}parameters/${parameterUuid}`;
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
