/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { UUID } from 'node:crypto';
import { ProcessConfigBaseBackend, ProcessType } from '../common';

export interface LoadflowProcessConfigBackend extends ProcessConfigBaseBackend {
    processType: ProcessType.LOADFLOW;
    loadflowParametersUuid: UUID;
}
