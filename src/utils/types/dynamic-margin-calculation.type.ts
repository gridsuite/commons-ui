/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import type { UUID } from 'node:crypto';

export enum CalculationType {
    GLOBAL_MARGIN = 'GLOBAL_MARGIN',
    LOCAL_MARGIN = 'LOCAL_MARGIN',
}

export enum LoadModelsRule {
    ALL_LOADS = 'ALL_LOADS',
    TARGETED_LOADS = 'TARGETED_LOADS',
}

export type IdNameInfos = { id: UUID; name?: string };

export type LoadsVariationInfos = {
    id?: UUID; // persisted id of the info to be modified
    loadFilters?: IdNameInfos[];
    variation: number;
    active: boolean;
};

export type DynamicMarginCalculationParametersInfos = {
    id?: UUID;
    provider: string;
    startTime: number;
    stopTime: number;
    marginCalculationStartTime: number;
    loadIncreaseStartTime: number;
    loadIncreaseStopTime: number;
    calculationType: CalculationType;
    accuracy: number; // integer
    loadModelsRule: LoadModelsRule;
    loadsVariations?: LoadsVariationInfos[];
};
