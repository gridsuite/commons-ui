/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */
import { UUID } from 'node:crypto';
import { SecurityAnalysisProcessConfigBackend } from './security-analysis';
import { LoadflowProcessConfigBackend } from './loadflow';
import { ProcessType } from './common';

// Backend types
type ProcessConfigBackendByProcessType = {
    [ProcessType.SECURITY_ANALYSIS]: SecurityAnalysisProcessConfigBackend;
    [ProcessType.LOADFLOW]: LoadflowProcessConfigBackend;
};
export type ProcessConfigBackend<TProcessType extends ProcessType> = ProcessConfigBackendByProcessType[TProcessType];
export type PersistedProcessConfigBackend<TProcessType extends ProcessType> = {
    id: UUID;
    processConfig: ProcessConfigBackend<TProcessType>;
};
