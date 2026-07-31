/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */
import { UUID } from 'node:crypto';
import {
    SecurityAnalysisProcessConfigBackend,
    SAProcessConfigFormSchema,
    saProcessConfigFormShape,
} from './security-analysis';
import { LFProcessConfigFormSchema, lfProcessConfigFormShape, LoadflowProcessConfigBackend } from './loadflow';
import { ProcessType } from './common';
import { NameElementEditorSchema } from '../parameters/common/name-element-editor';

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
type ProcessConfigFormShapeByProcessType = {
    [ProcessType.SECURITY_ANALYSIS]: typeof saProcessConfigFormShape;
    [ProcessType.LOADFLOW]: typeof lfProcessConfigFormShape;
};
export type ProcessConfigFormShape<TProcessType extends ProcessType> =
    ProcessConfigFormShapeByProcessType[TProcessType];

type ProcessConfigFormSchemaByProcessType = {
    [ProcessType.SECURITY_ANALYSIS]: SAProcessConfigFormSchema;
    [ProcessType.LOADFLOW]: LFProcessConfigFormSchema;
};
export type ProcessConfigFormSchema<TProcessType extends ProcessType> =
    ProcessConfigFormSchemaByProcessType[TProcessType];
export type NamedProcessConfigFormSchema<TProcessType extends ProcessType> = NameElementEditorSchema &
    ProcessConfigFormSchema<TProcessType>;
