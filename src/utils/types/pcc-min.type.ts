/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import type { UUID } from 'node:crypto';
import { fetchElementNames } from '../../services/directory';
import { FilterIdentifier, FILTERS } from '../constants';

export type PccMinParametersEnriched = {
    [FILTERS]: FilterIdentifier[];
};
export type PccMinParameters = {
    [FILTERS]: UUID[];
};

export function mapPccMinParameters(parametersInfos: PccMinParametersEnriched): PccMinParameters {
    return {
        ...parametersInfos,
        [FILTERS]: parametersInfos.filters?.map((filter) => filter.filterId),
    };
}

function getFilterIdentifierIds(params: PccMinParameters): Set<string> {
    return new Set(params.filters);
}

export function enrichPccMinParameters(parameters: PccMinParameters): Promise<PccMinParametersEnriched> {
    const allElementIds = getFilterIdentifierIds(parameters);

    return fetchElementNames(allElementIds).then((elementNames) => {
        const mapIdsToFilterIdentifiers = (ids: UUID[] | undefined): FilterIdentifier[] => {
            return ids
                ? ids.map((id) => ({
                      filterId: id,
                      filterName: elementNames.get(id) ?? null,
                  }))
                : [];
        };
        return {
            ...parameters,
            [FILTERS]: mapIdsToFilterIdentifiers(parameters.filters),
        };
    });
}
