/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { fetchElementNames } from './directory';
import { FILTERS, mapEquipmentsContainerToIds, mapIdsToEquipmentsContainer } from '../utils';
import { PccMinParameters, PccMinParametersEnriched } from '../components/parameters/pcc-min/pcc-min-form-utils';

export function mapPccMinParameters(parameters: PccMinParametersEnriched): PccMinParameters {
    return {
        ...parameters,
        [FILTERS]: mapEquipmentsContainerToIds(parameters[FILTERS]),
    };
}

export function enrichPccMinParameters(parameters: PccMinParameters): Promise<PccMinParametersEnriched> {
    const containerIds = new Set(parameters[FILTERS]);

    return fetchElementNames(containerIds).then((elementNames) => {
        return {
            ...parameters,
            [FILTERS]: mapIdsToEquipmentsContainer(parameters[FILTERS], elementNames),
        };
    });
}
