/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { UUID } from 'node:crypto';
import { IdName } from '../../../utils';

export enum ProcessType {
    SECURITY_ANALYSIS = 'SECURITY_ANALYSIS',
    LOADFLOW = 'LOADFLOW',
}

export interface LoadflowProcessConfigBackend extends ProcessConfigBaseBackend {
    processType: ProcessType.LOADFLOW;
    loadflowParametersUuid: UUID;
}

export type LoadflowProcessConfig = Omit<
    LoadflowProcessConfigBackend,
    'loadflowParametersUuid' | 'modificationUuids'
> & {
    modifications: {
        modification: IdName[];
        enabled: boolean;
        description?: string;
    }[];
    loadflowParameters: IdName[];
};

export interface SecurityAnalysisProcessConfigBackend extends ProcessConfigBaseBackend {
    processType: ProcessType.SECURITY_ANALYSIS;
    securityAnalysisParametersUuid: UUID;
    loadflowParametersUuid: UUID;
}

// Form types
export type SecurityAnalysisProcessConfig = Omit<
    SecurityAnalysisProcessConfigBackend,
    'securityAnalysisParametersUuid' | 'loadflowParametersUuid' | 'modificationUuids'
> & {
    modifications: {
        modification: IdName[];
        enabled: boolean;
        description?: string;
    }[];
    loadflowParameters: IdName[];
    securityAnalysisParameters: IdName[];
};

// Backend types
export interface ProcessConfigBaseBackend {
    processType: ProcessType;
    modificationUuids: UUID[];
}

type ProcessConfigBackendByProcessType = {
    [ProcessType.SECURITY_ANALYSIS]: SecurityAnalysisProcessConfigBackend;
    [ProcessType.LOADFLOW]: LoadflowProcessConfigBackend;
};

export type ProcessConfigBackend<T extends keyof ProcessConfigBackendByProcessType> =
    ProcessConfigBackendByProcessType[T];

export type PersistedProcessConfigBackend<TProcessType extends ProcessType> = {
    id: UUID;
    processConfig: ProcessConfigBackend<TProcessType>;
};

type ProcessConfigByProcessType = {
    [ProcessType.SECURITY_ANALYSIS]: SecurityAnalysisProcessConfig;
    [ProcessType.LOADFLOW]: LoadflowProcessConfig;
};

export type ProcessConfig<T extends keyof ProcessConfigByProcessType> = ProcessConfigByProcessType[T];

/*
// Form schemas
type ProcessConfigFormDataByProcessType = {
    [ProcessType.SECURITY_ANALYSIS]: UpdateSAProcessConfigFormData;
    [ProcessType.LOADFLOW]: UpdateLFProcessConfigFormData;
};
export type ProcessConfigFormData<T extends keyof ProcessConfigFormDataByProcessType> =
    ProcessConfigFormDataByProcessType[T];
*/
