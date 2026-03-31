/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { backendFetchJson } from './utils';
import { DynamicSimulationModelInfos, MappingInfos } from '../utils';

const PREFIX_DYNAMIC_MAPPING_SERVER_QUERIES = `${import.meta.env.VITE_API_GATEWAY}/dynamic-mapping`;

function getDynamicMappingUrl() {
    return `${PREFIX_DYNAMIC_MAPPING_SERVER_QUERIES}/`;
}

export function getDynamicMappings(): Promise<MappingInfos[]> {
    console.info(`Fetching dynamic mappings ...`);
    const url = `${getDynamicMappingUrl()}mappings/`;
    console.debug(url);
    return backendFetchJson(url);
}

export function fetchDynamicSimulationModels(mapping: string): Promise<DynamicSimulationModelInfos[]> {
    console.info(`Fetching dynamic simulation models on mapping '${mapping}' ...`);

    const url = `${getDynamicMappingUrl()}mappings/${mapping}/models`;
    console.debug(url);
    return backendFetchJson(url);
}
