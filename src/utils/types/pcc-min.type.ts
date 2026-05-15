/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import type { UUID } from 'node:crypto';
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
