/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { backendFetchJson } from './utils';
import { DynamicSimulationModelInfos, IdName } from '../utils';
import { PREFIX_STUDY_SERVER_QUERIES } from './study';

function getDynamicMappingUrl() {
    return `${PREFIX_STUDY_SERVER_QUERIES}/v1/dynamic-mapping/`;
}

export function fetchDynamicSimulationModels(mapping: IdName): Promise<DynamicSimulationModelInfos[]> {
    console.info(`Fetching dynamic simulation models on mapping '${mapping.name}' ...`);

    const url = `${getDynamicMappingUrl()}mappings/${mapping.id}/models`;
    console.debug(url);
    return backendFetchJson(url);
}
