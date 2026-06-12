/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { UUID } from 'node:crypto';
import { backendFetch, backendFetchJson, safeEncodeURIComponent } from './utils';
import {
    type PowerElectronicsCluster,
    ShortCircuitParametersInfos,
} from '../features/parameters/short-circuit/short-circuit-parameters.type';
import { PREFIX_STUDY_QUERIES } from './loadflow';
import { fetchElementNames } from './directory';

const PREFIX_SHORT_CIRCUIT_SERVER_QUERIES = `${import.meta.env.VITE_API_GATEWAY}/shortcircuit`;
const NODE_CLUSTER_FILTER_IDS = 'nodeClusterFilterIds';
const SHORT_CIRCUIT_POWER_ELECTRONICS_CLUSTERS = 'powerElectronicsClusters';
const ID = 'id';
const NAME = 'name';

function getShortCircuitUrl() {
    return `${PREFIX_SHORT_CIRCUIT_SERVER_QUERIES}/v1/`;
}

const getStudyUrl = (studyUuid: UUID | null) =>
    `${PREFIX_STUDY_QUERIES}/v1/studies/${safeEncodeURIComponent(studyUuid)}`;

export function getShortCircuitSpecificParametersDescription() {
    console.info('get short circuit specific parameters description');
    const getShortCircuitSpecificParametersUrl = `${getShortCircuitUrl()}parameters/specific-parameters`;
    console.debug(getShortCircuitSpecificParametersUrl);
    return backendFetchJson(getShortCircuitSpecificParametersUrl);
}

function parseNodeClusters(parameters: ShortCircuitParametersInfos): Map<string, Set<string>> {
    const filterIdsFromNodeCluster = new Map<string, Set<string>>();
    Object.entries(parameters.specificParametersPerProvider).forEach(([provider, specificParamValue]) => {
        if (Object.hasOwn(specificParamValue, NODE_CLUSTER_FILTER_IDS)) {
            const filters = JSON.parse(specificParamValue[NODE_CLUSTER_FILTER_IDS]);
            filterIdsFromNodeCluster.set(provider, filters);
        }
    });
    return filterIdsFromNodeCluster;
}

const parsePowerElectronicsMaterialsParamString = (
    parameters: ShortCircuitParametersInfos
): Map<string, (PowerElectronicsCluster & { active: boolean })[]> => {
    // Attempt to parse the string into an array of PowerElectronicsMaterial objects
    const powerElectronicsMaterialPerProvider = new Map<string, (PowerElectronicsCluster & { active: boolean })[]>();
    Object.entries(parameters.specificParametersPerProvider).forEach(([provider, specificParamValue]) => {
        if (Object.hasOwn(specificParamValue, SHORT_CIRCUIT_POWER_ELECTRONICS_CLUSTERS)) {
            const powerElectronicsMaterial = JSON.parse(specificParamValue[SHORT_CIRCUIT_POWER_ELECTRONICS_CLUSTERS]);
            powerElectronicsMaterialPerProvider.set(provider, powerElectronicsMaterial);
        }
    });
    return powerElectronicsMaterialPerProvider;
};

export function enrichShortCircuitParameters(
    parameters: ShortCircuitParametersInfos
): Promise<ShortCircuitParametersInfos> {
    const allElementIds = new Set<string>();
    const nodeClusterParameters = parseNodeClusters(parameters);
    nodeClusterParameters.forEach((nodeClusterFilter) =>
        nodeClusterFilter.forEach((filter: string) => allElementIds.add(filter))
    );
    const parsePowerElectronicsMaterialsParameters = parsePowerElectronicsMaterialsParamString(parameters);
    parsePowerElectronicsMaterialsParameters.forEach((powerElectronicsMaterialList) => {
        powerElectronicsMaterialList.forEach((powerElectronicsMaterials) =>
            powerElectronicsMaterials.filters.forEach((filter) => allElementIds.add(filter))
        );
    });

    const elementNamesPromise = allElementIds.size === 0 ? Promise.resolve(null) : fetchElementNames(allElementIds);
    const updatedParameters = { ...parameters };
    return elementNamesPromise.then((elementNames) => {
        if (parameters.specificParametersPerProvider) {
            Object.entries(parameters.specificParametersPerProvider).forEach(([provider, specificParamValue]) => {
                if (Object.hasOwn(specificParamValue, NODE_CLUSTER_FILTER_IDS)) {
                    const newNodeClusterFilterIds: any[] = [];
                    nodeClusterParameters.get(provider)?.forEach((filter) => {
                        newNodeClusterFilterIds.push({
                            [ID]: filter,
                            [NAME]: elementNames?.[filter] ?? undefined,
                        });
                    });
                    updatedParameters.specificParametersPerProvider[provider][NODE_CLUSTER_FILTER_IDS] =
                        JSON.stringify(newNodeClusterFilterIds);
                }
                if (Object.hasOwn(specificParamValue, SHORT_CIRCUIT_POWER_ELECTRONICS_CLUSTERS)) {
                    const newPowerElectronicsMaterials: any[] = [];
                    parsePowerElectronicsMaterialsParameters.get(provider)?.forEach((powerElectronicsMaterials) => {
                        const newFilters = powerElectronicsMaterials.filters.map((filter) => ({
                            [ID]: filter,
                            [NAME]: elementNames?.[filter] ?? undefined,
                        }));
                        newPowerElectronicsMaterials.push({
                            ...powerElectronicsMaterials,
                            filters: newFilters,
                        });
                    });
                    updatedParameters.specificParametersPerProvider[provider][
                        SHORT_CIRCUIT_POWER_ELECTRONICS_CLUSTERS
                    ] = JSON.stringify(newPowerElectronicsMaterials);
                }
            });
        }
        return updatedParameters;
    });
}

export function fetchShortCircuitParameters(parameterUuid: string): Promise<ShortCircuitParametersInfos> {
    console.info('get short circuit analysis parameters');
    const url = `${getShortCircuitUrl()}parameters/${encodeURIComponent(parameterUuid)}`;
    const parametersPromise: Promise<ShortCircuitParametersInfos> = backendFetchJson(url);
    return parametersPromise.then((parameters) => enrichShortCircuitParameters(parameters));
}

export function getShortCircuitParameters(studyUuid: UUID): Promise<ShortCircuitParametersInfos> {
    console.info('get short circuit parameters');
    const getScParams = `${getStudyUrl(studyUuid)}/short-circuit-analysis/parameters`;
    console.debug(getScParams);
    const parametersPromise: Promise<ShortCircuitParametersInfos> = backendFetchJson(getScParams);
    return parametersPromise.then((parameters) => enrichShortCircuitParameters(parameters));
}

export function updateShortCircuitParameters(parameterUuid: UUID, newParams: any) {
    console.info('set short circuit parameters');
    const setShortCircuitParametersUrl = `${getShortCircuitUrl()}parameters/${parameterUuid}`;
    console.debug(setShortCircuitParametersUrl);
    console.log('updateShortCircuitParameters', newParams);
    return backendFetch(setShortCircuitParametersUrl, {
        method: 'PUT',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: newParams ? JSON.stringify(newParams) : null,
    });
}
