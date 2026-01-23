/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import type { UUID } from 'node:crypto';
import { backendFetch, backendFetchJson, backendFetchText, safeEncodeURIComponent } from './utils';
import { NetworkVisualizationParameters } from '../components/parameters/network-visualizations/network-visualizations.types';
import { type ShortCircuitParametersInfos } from '../components/parameters/short-circuit/short-circuit-parameters.type';
import { VoltageInitStudyParameters } from '../components/parameters/voltage-init/voltage-init.type';
import { EquipmentType, ExtendedEquipmentType, ModificationType } from '../utils';
import { SubstationCreationInfo } from './network-modification-types';

const PREFIX_STUDY_QUERIES = `${import.meta.env.VITE_API_GATEWAY}/study`;

const getStudyUrl = (studyUuid: UUID | null) =>
    `${PREFIX_STUDY_QUERIES}/v1/studies/${safeEncodeURIComponent(studyUuid)}`;

const getStudyUrlWithNodeUuid = (studyUuid: UUID | null | undefined, nodeUuid: UUID | undefined) =>
    `${PREFIX_STUDY_QUERIES}/v1/studies/${safeEncodeURIComponent(studyUuid)}/nodes/${safeEncodeURIComponent(nodeUuid)}`;

const getStudyUrlWithNodeUuidAndRootNetworkUuid = (
    studyUuid: string | null | undefined,
    nodeUuid: string | undefined,
    rootNetworkUuid: string | undefined | null
) =>
    `${PREFIX_STUDY_QUERIES}/v1/studies/${safeEncodeURIComponent(studyUuid)}/root-networks/${safeEncodeURIComponent(
        rootNetworkUuid
    )}/nodes/${safeEncodeURIComponent(nodeUuid)}`;

function getNetworkModificationUrl(studyUuid: UUID | null | undefined, nodeUuid: UUID | undefined) {
    return `${getStudyUrlWithNodeUuid(studyUuid, nodeUuid)}/network-modifications`;
}

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

export function fetchNetworkElementInfos(
    studyUuid: UUID | undefined | null,
    currentNodeUuid: UUID | undefined,
    currentRootNetworkUuid: UUID | undefined | null,
    elementType: EquipmentType | ExtendedEquipmentType,
    infoType: string,
    elementId: UUID,
    inUpstreamBuiltParentNode: boolean
) {
    console.info(
        `Fetching specific network element '${elementId}' of type '${elementType}' of study '${studyUuid}' on root network '${currentRootNetworkUuid}' and node '${currentNodeUuid}' ...`
    );
    const urlSearchParams = new URLSearchParams();
    if (inUpstreamBuiltParentNode !== undefined) {
        urlSearchParams.append('inUpstreamBuiltParentNode', String(inUpstreamBuiltParentNode));
    }
    urlSearchParams.append('elementType', elementType);
    urlSearchParams.append('infoType', infoType);

    const fetchElementsUrl = `${getStudyUrlWithNodeUuidAndRootNetworkUuid(
        studyUuid,
        currentNodeUuid,
        currentRootNetworkUuid
    )}/network/elements/${encodeURIComponent(elementId)}?${urlSearchParams.toString()}`;
    console.debug(fetchElementsUrl);

    return backendFetchJson(fetchElementsUrl);
}

export function createSubstation({
    studyId,
    nodeId,
    substationId,
    substationName,
    country,
    isUpdate = false,
    modificationUuid,
    properties,
}: SubstationCreationInfo) {
    let url = getNetworkModificationUrl(studyId, nodeId);

    const body = JSON.stringify({
        type: ModificationType.SUBSTATION_CREATION,
        equipmentId: substationId,
        equipmentName: substationName,
        country: country === '' ? null : country,
        properties,
    });

    if (modificationUuid) {
        url += `/${encodeURIComponent(modificationUuid)}`;
        console.info('Updating substation creation', { url, body });
    } else {
        console.info('Creating substation creation', { url, body });
    }

    return backendFetchText(url, {
        method: isUpdate ? 'PUT' : 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body,
    });
}
