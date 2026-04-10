/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { fetchElementNames } from './directory';
import { SAParameters, SAParametersEnriched } from '../components/parameters/security-analysis/types';
import { mapEquipmentsContainerToIds, mapIdsToEquipmentsContainer } from '../components/parameters/common/utils';

export function mapSecurityAnalysisParameters(parameters: SAParametersEnriched): SAParameters {
    return {
        ...parameters,
        contingencyListsInfos: parameters.contingencyListsInfos?.map((clInfos) => {
            return {
                ...clInfos,
                contingencyLists: mapEquipmentsContainerToIds(clInfos.contingencyLists),
            };
        }),
    };
}

function getEquipmentsContainerIds(params: SAParameters): Set<string> {
    const allContainerIds = params.contingencyListsInfos
        ? params.contingencyListsInfos.flatMap((cli) => cli.contingencyLists ?? [])
        : [];
    return new Set(allContainerIds);
}

export function enrichSecurityAnalysisParameters(parameters: SAParameters): Promise<SAParametersEnriched> {
    const allElementIds = getEquipmentsContainerIds(parameters);

    return fetchElementNames(allElementIds).then((elementNames) => {
        return {
            ...parameters,
            contingencyListsInfos: parameters.contingencyListsInfos
                ? parameters.contingencyListsInfos.map((cli) => {
                      return {
                          ...cli,
                          contingencyLists: mapIdsToEquipmentsContainer(cli.contingencyLists, elementNames),
                      };
                  })
                : [],
        };
    });
}
