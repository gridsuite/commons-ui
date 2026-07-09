/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { AttributeModification } from '../../../../utils';

export const APPLICABILITY = {
    EQUIPMENT: { id: 'EQUIPMENT', label: 'BothSides' },
    SIDE1: { id: 'SIDE1', label: 'Side1' },
    SIDE2: { id: 'SIDE2', label: 'Side2' },
};

export const TEMPORARY_LIMIT_MODIFICATION_TYPE = {
    MODIFY: 'MODIFY',
    MODIFY_OR_ADD: 'MODIFY_OR_ADD', // if the limit exists it is modified, if not it is created
    ADD: 'ADD',
    DELETE: 'DELETE',
    REPLACE: 'REPLACE',
} as const;

export interface LimitsProperty {
    name: string;
    value: string;
}

export interface TemporaryLimitsData {
    name: string;
    value: number | null;
    acceptableDuration: number | null;
}

export interface CurrentLimitsData {
    id: string;
    applicability: string;
    limitsProperties?: LimitsProperty[];
    permanentLimit: number;
    temporaryLimits: TemporaryLimitsData[];
}

export interface Limit {
    name: AttributeModification<string> | null;
    acceptableDuration: AttributeModification<number> | null;
    value: AttributeModification<number> | null;
}

export interface TemporaryLimit extends Limit {
    modificationType: string | null;
    selected?: boolean;
}

export interface CurrentLimits {
    id?: string;
    permanentLimit: number | null;
    temporaryLimits: TemporaryLimit[];
}
