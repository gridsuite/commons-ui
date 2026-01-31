/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import type { UUID } from 'node:crypto';
import {
    DynamicMarginCalculationParametersFetchReturn,
    DynamicMarginCalculationParametersInfos,
} from './dynamic-margin-calculation.type';
import { fetchContingencyAndFiltersLists } from './directory';
import { backendFetch, backendFetchJson, backendFetchText } from './utils';
import { PREFIX_STUDY_QUERIES } from './loadflow';

const PREFIX_DYNAMIC_MARGIN_CALCULATION_SERVER_QUERIES = `${import.meta.env.VITE_API_GATEWAY}/dynamic-margin-calculation`;

function getDynamicMarginCalculationUrl() {
    return `${PREFIX_DYNAMIC_MARGIN_CALCULATION_SERVER_QUERIES}/v1/`;
}

export function fetchDynamicMarginCalculationProviders() {
    console.info('fetch dynamic margin calculation providers');
    const url = `${getDynamicMarginCalculationUrl()}providers`;
    console.debug(url);
    return backendFetchJson(url);
}

export function fetchDefaultDynamicMarginCalculationProvider() {
    console.info('Fetching default dynamic margin calculation provider');
    const url = `${PREFIX_STUDY_QUERIES}/v1/dynamic-margin-calculation-default-provider`;
    console.debug(url);
    return backendFetchText(url);
}

export function enrichLoadFilterNames(
    parameters: DynamicMarginCalculationParametersInfos
): Promise<DynamicMarginCalculationParametersFetchReturn> {
    // enrich LoadsVariationInfos by LoadsVariationFetchReturn with id and name infos
    if (parameters?.loadsVariations) {
        const loadsVariations = parameters?.loadsVariations;
        const allLoadFilterUuids = loadsVariations.flatMap((loadVariation) => loadVariation.loadFilterUuids ?? []);
        return fetchContingencyAndFiltersLists(allLoadFilterUuids).then((loadFilter) => {
            // eslint-disable-next-line no-param-reassign
            delete parameters.loadsVariations;
            const loadFilterInfosMap = Object.fromEntries(
                loadFilter.map((info) => [info.elementUuid, info.elementName])
            );
            return {
                ...parameters,
                loadsVariationsInfos: loadsVariations?.map((infos) => {
                    const newLoadVariationInfos = {
                        ...infos,
                        loadFilters: infos.loadFilterUuids?.map((loadFilterUuid) => ({
                            id: loadFilterUuid,
                            name: loadFilterInfosMap[loadFilterUuid],
                        })),
                    };
                    delete newLoadVariationInfos.loadFilterUuids;
                    return newLoadVariationInfos;
                }),
            };
        });
    }

    // eslint-disable-next-line no-param-reassign
    delete parameters.loadsVariations;
    return Promise.resolve({
        ...parameters,
        loadsVariationsInfos: [],
    });
}

export function fetchDynamicMarginCalculationParameters(
    parameterUuid: UUID
): Promise<DynamicMarginCalculationParametersFetchReturn> {
    console.info(`Fetching dynamic margin calculation parameters having uuid '${parameterUuid}' ...`);
    const url = `${getDynamicMarginCalculationUrl()}parameters/${encodeURIComponent(parameterUuid)}`;
    console.debug(url);
    const parametersPromise: Promise<DynamicMarginCalculationParametersInfos> = backendFetchJson(url);
    return parametersPromise.then(enrichLoadFilterNames);
}

export function cleanLoadFilterNames(
    newParams: DynamicMarginCalculationParametersFetchReturn
): DynamicMarginCalculationParametersInfos {
    // send to back raw LoadsVariations instead of LoadsVariationsInfos
    const newParameters =
        newParams != null
            ? {
                  ...newParams,
                  loadsVariations: newParams?.loadsVariationsInfos?.map((infos) => {
                      const newLoadsVariationInfos = {
                          ...infos,
                          loadFilterUuids: infos.loadFilters?.map((loadFilterInfos) => loadFilterInfos.id),
                      };
                      delete newLoadsVariationInfos.loadFilters;
                      return newLoadsVariationInfos;
                  }),
              }
            : newParams;
    delete newParameters?.loadsVariationsInfos;
    return newParameters;
}

export function updateDynamicMarginCalculationParameters(
    parameterUuid: UUID,
    newParams: DynamicMarginCalculationParametersFetchReturn
): Promise<Response> {
    console.info(`Setting dynamic margin calculation parameters having uuid '${parameterUuid}' ...`);
    const url = `${getDynamicMarginCalculationUrl()}parameters/${parameterUuid}`;
    console.debug(url);
    const newParameters = cleanLoadFilterNames(newParams);
    return backendFetch(url, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(newParameters),
    });
}
