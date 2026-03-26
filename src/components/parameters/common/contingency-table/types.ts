/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { ACTIVATED, DESCRIPTION } from '../parameter-table/constants';
import { CONTINGENCY_LISTS } from '../constants';
import { EquipmentsContainer } from '../parameter-table/types';

export interface ContingencyListsInfos {
    [CONTINGENCY_LISTS]: EquipmentsContainer[];
    [DESCRIPTION]: string;
    [ACTIVATED]: boolean;
}

export interface ContingencyCount {
    contingencies: number;
    notFoundElements: number;
}
