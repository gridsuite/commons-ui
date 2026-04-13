/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import type { UUID } from 'node:crypto';
import {
    CONTINGENCY_LISTS_INFOS,
    PARAM_SA_FLOW_PROPORTIONAL_THRESHOLD,
    PARAM_SA_HIGH_VOLTAGE_ABSOLUTE_THRESHOLD,
    PARAM_SA_HIGH_VOLTAGE_PROPORTIONAL_THRESHOLD,
    PARAM_SA_LOW_VOLTAGE_ABSOLUTE_THRESHOLD,
    PARAM_SA_LOW_VOLTAGE_PROPORTIONAL_THRESHOLD,
    PARAM_SA_PROVIDER,
} from '../common/constants';
import { ContingencyListsInfos, ContingencyListsInfosEnriched, IdName } from '../common/contingency-table/types';
import { ILimitReductionsByVoltageLevel } from '../common/limitreductions/columns-definitions';
import { fetchElementNames } from '../../../services/directory';
import { ID, NAME } from '../common/parameter-table/constants';

export type SAParameters = {
    uuid?: UUID;
    [PARAM_SA_PROVIDER]: string;
    [CONTINGENCY_LISTS_INFOS]: ContingencyListsInfos[];
    limitReductions: ILimitReductionsByVoltageLevel[];
    [PARAM_SA_FLOW_PROPORTIONAL_THRESHOLD]: number;
    [PARAM_SA_LOW_VOLTAGE_PROPORTIONAL_THRESHOLD]: number;
    [PARAM_SA_LOW_VOLTAGE_ABSOLUTE_THRESHOLD]: number;
    [PARAM_SA_HIGH_VOLTAGE_PROPORTIONAL_THRESHOLD]: number;
    [PARAM_SA_HIGH_VOLTAGE_ABSOLUTE_THRESHOLD]: number;
};

export type SAParametersEnriched = Omit<SAParameters, typeof CONTINGENCY_LISTS_INFOS> & {
    [CONTINGENCY_LISTS_INFOS]: ContingencyListsInfosEnriched[];
};

export function mapSecurityAnalysisParameters(parameters: SAParametersEnriched): SAParameters {
    return {
        ...parameters,
        contingencyListsInfos: parameters.contingencyListsInfos?.map((clInfos) => {
            return {
                ...clInfos,
                contingencyLists: clInfos.contingencyLists.map((c) => c.id),
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
        const mapIdsToIdNames = (ids: UUID[] | undefined): IdName[] => {
            return ids
                ? ids.map((id) => ({
                      [ID]: id,
                      [NAME]: elementNames.get(id) ?? null,
                  }))
                : [];
        };
        return {
            ...parameters,
            contingencyListsInfos: parameters.contingencyListsInfos
                ? parameters.contingencyListsInfos.map((cli) => {
                      return {
                          ...cli,
                          contingencyLists: mapIdsToIdNames(cli.contingencyLists),
                      };
                  })
                : [],
        };
    });
}
