/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */
import { UUID } from 'node:crypto';
import { SecurityAnalysisProcessConfigBackend, SAProcessConfigFormData } from './security-analysis';
import { LFProcessConfigFormData, LoadflowProcessConfigBackend } from './loadflow';
import { NamedFormData, ProcessType } from './common';

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

// Form types
type ProcessConfigFormDataByProcessType = {
    [ProcessType.SECURITY_ANALYSIS]: SAProcessConfigFormData;
    [ProcessType.LOADFLOW]: LFProcessConfigFormData;
};
export type ProcessConfigFormData<TProcessType extends ProcessType> = ProcessConfigFormDataByProcessType[TProcessType];
export type NamedProcessConfigFormData<TProcessType extends ProcessType> = NamedFormData &
    ProcessConfigFormData<TProcessType>;
