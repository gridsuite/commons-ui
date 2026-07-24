/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { UUID } from 'node:crypto';
import { IdName } from '../../../utils';
// eslint-disable-next-line import-x/no-cycle
import { LFProcessConfigFormData, NamedLFProcessConfigFormData } from '../loadflow';
import { NamedSAProcessConfigFormData, SAProcessConfigFormData } from '../security-analysis';

export enum ProcessType {
    SECURITY_ANALYSIS = 'SECURITY_ANALYSIS',
    LOADFLOW = 'LOADFLOW',
}

// Backend types
export interface ProcessConfigBaseBackend {
    processType: ProcessType;
    modificationUuids: UUID[];
}

export interface SecurityAnalysisProcessConfigBackend extends ProcessConfigBaseBackend {
    processType: ProcessType.SECURITY_ANALYSIS;
    securityAnalysisParametersUuid: UUID;
    loadflowParametersUuid: UUID;
}

export interface LoadflowProcessConfigBackend extends ProcessConfigBaseBackend {
    processType: ProcessType.LOADFLOW;
    loadflowParametersUuid: UUID;
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

// Form types
export type SecurityAnalysisProcessConfig = Omit<
    SecurityAnalysisProcessConfigBackend,
    'processType' | 'securityAnalysisParametersUuid' | 'loadflowParametersUuid' | 'modificationUuids'
> & {
    modifications: {
        modification: IdName[];
        enabled: boolean;
        description: string | undefined;
    }[];
    loadflowParameters: IdName[];
    securityAnalysisParameters: IdName[];
};

export type LoadflowProcessConfig = Omit<
    LoadflowProcessConfigBackend,
    'processType' | 'loadflowParametersUuid' | 'modificationUuids'
> & {
    modifications: {
        modification: IdName[];
        enabled: boolean;
        description: string | undefined;
    }[];
    loadflowParameters: IdName[];
};

type ProcessConfigFormDataByProcessType = {
    [ProcessType.SECURITY_ANALYSIS]: SAProcessConfigFormData;
    [ProcessType.LOADFLOW]: LFProcessConfigFormData;
};

export type ProcessConfigFormData<T extends keyof ProcessConfigFormDataByProcessType> =
    ProcessConfigFormDataByProcessType[T];

type NamedProcessConfigFormDataByProcessType = {
    [ProcessType.SECURITY_ANALYSIS]: NamedSAProcessConfigFormData;
    [ProcessType.LOADFLOW]: NamedLFProcessConfigFormData;
};

export type NamedProcessConfigFormData<T extends keyof ProcessConfigFormDataByProcessType> =
    NamedProcessConfigFormDataByProcessType[T];

/*
export type NamedProcessConfigFormData<T extends keyof ProcessConfigFormDataByProcessType> = {
    name: string;
    description?: string;
} & ProcessConfigFormData<T>;
*/
