/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { VARIATION_TYPES } from '../../../../utils';

export const IDENTIFIER_LIST = 'IDENTIFIER_LIST';

export type VariationType = keyof typeof VARIATION_TYPES;

export interface ItemFilterType {
    type?: string;
    specificMetadata?: {
        type?: string;
        filterEquipmentsAttributes?: {
            distributionKey?: number;
        }[];
    };
}

type VariationFilter = {
    id: string;
    name: string;
    specificMetadata: { type: string };
};

export interface Variations {
    variationMode: string | null;
    variationValue: number | null;
    reactiveVariationMode: string | null;
    filters: VariationFilter[];
}
