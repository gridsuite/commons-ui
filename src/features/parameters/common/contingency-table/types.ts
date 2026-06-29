/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { UUID } from 'node:crypto';

export interface ContingencyCountByContingencyList {
    nbContingencies: number;
    notFoundElements: Record<string, Set<string>>;
}

export interface ContingencyCount {
    countByContingencyList: Record<UUID, ContingencyCountByContingencyList>;
}

export interface ContingencyCountEnriched {
    countByContingencyList: Record<string, ContingencyCountByContingencyList>;
}
