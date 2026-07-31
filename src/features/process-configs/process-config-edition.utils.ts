/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { UUID } from 'node:crypto';
import { DefaultValues } from 'react-hook-form';
import { ComponentType } from 'react';
import { ProcessType } from './common';
import {
    NamedProcessConfigFormSchema,
    PersistedProcessConfigBackend,
    ProcessConfigBackend,
    ProcessConfigFormSchema,
    ProcessConfigFormShape,
} from './process-config.type';
import {
    emptyLFProcessConfigFormData,
    getLFProcessConfigBackendFromFormData,
    getLFProcessConfigFormData,
    LFProcessConfigEdition,
    lfProcessConfigFormShape,
} from './loadflow';
import {
    emptySAProcessConfigFormData,
    getSAProcessConfigBackendFromFormData,
    getSAProcessConfigFormData,
    SAProcessConfigEdition,
    saProcessConfigFormShape,
} from './security-analysis';

export interface ProcessConfigEditionDialogHandlers<TProcessType extends ProcessType> {
    formShape: ProcessConfigFormShape<TProcessType>;
    emptyFormData: DefaultValues<ProcessConfigFormSchema<TProcessType>>;
    getFormData: (processConfig: ProcessConfigBackend<TProcessType>) => Promise<ProcessConfigFormSchema<TProcessType>>;
    getProcessConfigBackendFromFormData: (
        formData: ProcessConfigFormSchema<TProcessType>
    ) => ProcessConfigBackend<TProcessType>;
}

export interface UseProcessConfigEditionProps<
    TProcessType extends ProcessType,
> extends ProcessConfigEditionDialogHandlers<TProcessType> {
    name: string;
    description: string | null;
    processConfigUuid: UUID;
    fetchProcessConfig: (processConfigUuid: UUID) => Promise<PersistedProcessConfigBackend<TProcessType>>;
    updateProcessConfig: (
        processConfigUuid: UUID,
        name: string,
        description: string,
        processConfig: ProcessConfigBackend<TProcessType>
    ) => Promise<Response>;
}

export interface ProcessConfigEditionDialogHelpers<
    TProcessType extends ProcessType,
> extends ProcessConfigEditionDialogHandlers<TProcessType> {
    EditionComponent: ComponentType;
    dialogTitleId: string;
}

export const processConfigEditionDialogHelpers: {
    [TProcessType in ProcessType]: ProcessConfigEditionDialogHelpers<TProcessType>;
} = {
    [ProcessType.SECURITY_ANALYSIS]: {
        formShape: saProcessConfigFormShape,
        emptyFormData: emptySAProcessConfigFormData,
        getFormData: getSAProcessConfigFormData,
        getProcessConfigBackendFromFormData: getSAProcessConfigBackendFromFormData,
        EditionComponent: SAProcessConfigEdition,
        dialogTitleId: 'process_config/editSAProcessConfigTitle',
    },
    [ProcessType.LOADFLOW]: {
        formShape: lfProcessConfigFormShape,
        emptyFormData: emptyLFProcessConfigFormData,
        getFormData: getLFProcessConfigFormData,
        getProcessConfigBackendFromFormData: getLFProcessConfigBackendFromFormData,
        EditionComponent: LFProcessConfigEdition,
        dialogTitleId: 'process_config/editLFProcessConfigTitle',
    },
};

export function getNamedProcessConfigFormData<TProcessType extends ProcessType>(
    processConfig: ProcessConfigFormSchema<TProcessType>,
    name: string,
    description: string | null
): NamedProcessConfigFormSchema<TProcessType> {
    return {
        name,
        description: description ?? undefined,
        ...processConfig,
    };
}
