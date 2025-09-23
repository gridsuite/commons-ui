/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import type { UUID } from 'node:crypto';
import { backendFetch, backendFetchJson } from './utils';
import { NetworkVisualizationParameters } from '../components/parameters/network-visualizations/network-visualizations.types';
import {
    ShortCircuitParameters,
    ShortCircuitParametersInfos,
} from '../components/parameters/short-circuit/short-circuit-parameters.type';
import { VoltageInitStudyParameters } from '../components/parameters/voltage-init/voltage-init.type';

const PREFIX_STUDY_QUERIES = `${import.meta.env.VITE_API_GATEWAY}/study`;

// eslint-disable-next-line import/prefer-default-export
export function exportFilter(studyUuid: UUID, filterUuid?: UUID, token?: string) {
    console.info('get filter export on study root node');
    return backendFetchJson(
        `${PREFIX_STUDY_QUERIES}/v1/studies/${studyUuid}/filters/${filterUuid}/elements`,
        {
            method: 'get',
            headers: { 'Content-Type': 'application/json' },
        },
        token
    );
}

export function getAvailableComponentLibraries(): Promise<string[]> {
    console.info('get available component libraries for diagrams');
    return backendFetchJson(`${PREFIX_STUDY_QUERIES}/v1/svg-component-libraries`);
}

export function getStudyNetworkVisualizationsParameters(studyUuid: UUID): Promise<NetworkVisualizationParameters> {
    console.info('get study network visualization parameters');
    return backendFetchJson(`${PREFIX_STUDY_QUERIES}/v1/studies/${studyUuid}/network-visualizations/parameters`);
}

export function setStudyNetworkVisualizationParameters(studyUuid: UUID, newParams: Record<string, any>) {
    console.info('set study network visualization parameters');
    return backendFetch(`${PREFIX_STUDY_QUERIES}/v1/studies/${studyUuid}/network-visualizations/parameters`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(newParams),
    });
}

export function getStudyShortCircuitParameters(studyUuid: UUID): Promise<ShortCircuitParametersInfos> {
    console.info('get study short-circuit parameters');
    return backendFetchJson(`${PREFIX_STUDY_QUERIES}/v1/studies/${studyUuid}/short-circuit-analysis/parameters`);
}

export function setStudyShortCircuitParameters(studyUuid: UUID, newParams: ShortCircuitParameters) {
    console.info('set study short-circuit parameters', newParams);
    return backendFetch(`${PREFIX_STUDY_QUERIES}/v1/studies/${studyUuid}/short-circuit-analysis/parameters`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: newParams ? JSON.stringify(newParams) : null,
    });
}

export function invalidateStudyShortCircuitStatus(studyUuid: UUID) {
    console.info('invalidate study short circuit status');
    return backendFetch(`${PREFIX_STUDY_QUERIES}/v1/studies/${studyUuid}/short-circuit/invalidate-status`, {
        method: 'PUT',
    });
}

export function updateVoltageInitParameters(studyUuid: UUID | null, newParams: VoltageInitStudyParameters) {
    console.info('set study voltage init parameters');
    const url = `${PREFIX_STUDY_QUERIES}/v1/studies/${studyUuid}/voltage-init/parameters`;
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
