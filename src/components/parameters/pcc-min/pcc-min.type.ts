/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import type { UUID } from 'node:crypto';
import { FILTER_ID, FILTER_NAME, FILTERS } from '../voltage-init';

type FilterIdentifier = {
    [FILTER_ID]: UUID;
    [FILTER_NAME]: string;
};

export type PccMinParameters = {
    [FILTERS]: FilterIdentifier[];
};
