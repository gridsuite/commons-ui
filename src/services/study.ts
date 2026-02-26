/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import type { UUID } from 'node:crypto';
import { backendFetch, backendFetchJson, safeEncodeURIComponent } from './utils';
import { NetworkVisualizationParameters } from '../components/parameters/network-visualizations/network-visualizations.types';
import { type ShortCircuitParametersInfos } from '../components/parameters/short-circuit/short-circuit-parameters.type';
import { VoltageInitStudyParameters } from '../components/parameters/voltage-init/voltage-init.type';
import { Identifiable } from '../utils';

const PREFIX_STUDY_QUERIES = `${import.meta.env.VITE_API_GATEWAY}/study`;

const getStudyUrl = (studyUuid: UUID | null) =>
    `${PREFIX_STUDY_QUERIES}/v1/studies/${safeEncodeURIComponent(studyUuid)}`;

export const getStudyUrlWithNodeUuidAndRootNetworkUuid = (
    studyUuid: string | null | undefined,
    nodeUuid: string | null | undefined,
    rootNetworkUuid: string | undefined | null
) =>
    `${PREFIX_STUDY_QUERIES}/v1/studies/${safeEncodeURIComponent(studyUuid)}/root-networks/${safeEncodeURIComponent(
        rootNetworkUuid
    )}/nodes/${safeEncodeURIComponent(nodeUuid)}`;

export function exportFilter(studyUuid: UUID, filterUuid?: UUID, token?: string) {
    console.info('get filter export on study root node');
    return backendFetchJson(
        `${getStudyUrl(studyUuid)}/filters/${filterUuid}/elements`,
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
    return backendFetchJson(`${getStudyUrl(studyUuid)}/network-visualizations/parameters`);
}

export function setStudyNetworkVisualizationParameters(studyUuid: UUID, newParams: Record<string, any>) {
    console.info('set study network visualization parameters');
    return backendFetch(`${getStudyUrl(studyUuid)}/network-visualizations/parameters`, {
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
    return backendFetchJson(`${getStudyUrl(studyUuid)}/short-circuit-analysis/parameters`);
}

export function updateVoltageInitParameters(studyUuid: UUID | null, newParams: VoltageInitStudyParameters) {
    console.info('set study voltage init parameters');
    const url = `${getStudyUrl(studyUuid)}/voltage-init/parameters`;
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

export function fetchBusesOrBusbarSectionsForVoltageLevel(
    studyUuid: UUID,
    currentNodeUuid: UUID,
    currentRootNetworkUuid: UUID,
    voltageLevelId: string
): Promise<Identifiable[]> {
    console.info(
        `Fetching buses or busbar sections of study '${studyUuid}' on root network '${currentRootNetworkUuid}' and node '${currentNodeUuid}' + ' for voltage level '${voltageLevelId}'...`
    );
    const urlSearchParams = new URLSearchParams();
    urlSearchParams.append('inUpstreamBuiltParentNode', 'true');

    const fetchBusbarSectionsUrl =
        getStudyUrlWithNodeUuidAndRootNetworkUuid(studyUuid, currentNodeUuid, currentRootNetworkUuid) +
        '/network/voltage-levels/' +
        encodeURIComponent(voltageLevelId) +
        '/buses-or-busbar-sections' +
        '?' +
        urlSearchParams.toString();

    console.debug(fetchBusbarSectionsUrl);
    return backendFetchJson(fetchBusbarSectionsUrl);
}
