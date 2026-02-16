/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { UUID } from 'node:crypto';
import { ACTIVATED, DESCRIPTION, ID, NAME } from '../parameter-table/constants';
import { CONTINGENCY_LISTS } from '../constants';

export interface IContingencyList {
    [ID]: UUID;
    [NAME]: string;
}
export interface IContingencyListsInfos {
    [CONTINGENCY_LISTS]: IContingencyList[];
    [DESCRIPTION]: string;
    [ACTIVATED]: boolean;
}
