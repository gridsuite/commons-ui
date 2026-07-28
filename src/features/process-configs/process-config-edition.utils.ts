/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { UUID } from 'node:crypto';
import { ProcessType } from './common';
import {
    NamedProcessConfigFormData,
    PersistedProcessConfigBackend,
    ProcessConfigBackend,
    ProcessConfigFormData,
} from './process-config.type';
import { FieldConstants } from '../../utils';

export interface ProcessConfigEditionDialogProps<TProcessType extends ProcessType> {
    open: boolean;
    onClose: () => void;
    processConfigId: UUID;
    name: string;
    description: string | null;
    directory: UUID;
    fetchProcessConfig: (processConfigUuid: UUID) => Promise<PersistedProcessConfigBackend<TProcessType>>;
    updateProcessConfig: (
        processConfigUuid: UUID,
        name: string,
        description: string,
        processConfig: ProcessConfigBackend<TProcessType>
    ) => Promise<Response>;
}

export function getNamedProcessConfigFormData<TProcessType extends ProcessType>(
    processConfig: ProcessConfigFormData<TProcessType>,
    name: string,
    description: string | null
): NamedProcessConfigFormData<TProcessType> {
    return {
        name,
        description: description ?? undefined,
        ...processConfig,
    } as NamedProcessConfigFormData<TProcessType>;
}

export function getProcessConfigFormDataFromNamedFormData<TProcessType extends ProcessType>(
    namedFormData: NamedProcessConfigFormData<TProcessType>
): ProcessConfigFormData<TProcessType> {
    const {
        [FieldConstants.NAME]: name,
        [FieldConstants.DESCRIPTION]: description,
        ...processConfigFormData
    } = namedFormData;
    return processConfigFormData as unknown as ProcessConfigFormData<TProcessType>;
}
