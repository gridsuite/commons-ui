/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { ModificationType } from '../../../utils';
import { Filter } from '../by-filter/commons/by-filter.type';

export interface GenerationDispatchDto {
    type: ModificationType;
    lossCoefficient: number;
    defaultOutageRate: number;
    generatorsWithoutOutage: Filter[] | null;
    generatorsWithFixedSupply: Filter[] | null;
    generatorsFrequencyReserve:
        | {
              generatorsFilters: Filter[];
              frequencyReserve: number;
          }[]
        | null;
    substationsGeneratorsOrdering:
        | {
              substationIds: string[];
          }[]
        | null;
}
