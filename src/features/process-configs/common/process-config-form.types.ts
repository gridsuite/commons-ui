/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import type { UUID } from 'node:crypto';
import type { UseFormReturn } from 'react-hook-form';
import type { DirectoryItemSchema } from '../../../components';
import { FieldConstants } from '../../../utils';
import { ProcessType } from './process-config.type';
import type { ProcessConfigModification } from './process-config-modifications-edition.utils';
import type { PersistedProcessConfigBackend, ProcessConfigBackend } from './process-config-backend.type';
import type { ProcessConfigParameterField } from './process-config-type.definitions';

export type ProcessConfigMode = 'create' | 'edit';

export type ProcessConfigParameterRef = {
    id: string;
    name?: string;
};

type ProcessConfigParameterValues = Partial<Record<ProcessConfigParameterField, ProcessConfigParameterRef[]>>;

export type ProcessConfigFormValues = {
    processType: ProcessType | '';
    [FieldConstants.NAME]: string;
    [FieldConstants.DESCRIPTION]?: string;
    [FieldConstants.DIRECTORY]?: DirectoryItemSchema | null;
    [FieldConstants.MODIFICATIONS]: ProcessConfigModification[];
} & ProcessConfigParameterValues;

export type ProcessConfigPrefillValues = Partial<Omit<ProcessConfigFormValues, 'processType'>>;

export type FetchProcessConfigHandler = (
    processConfigUuid: string,
    elementName?: string,
    elementDescription?: string
) => Promise<ProcessConfigPrefillValues | undefined>;

export type FetchPersistedProcessConfigHandler = (
    processConfigUuid: UUID
) => Promise<PersistedProcessConfigBackend<ProcessType>>;

export type UpdateProcessConfigHandler = (
    processConfigUuid: UUID,
    name: string,
    description: string,
    processConfig: ProcessConfigBackend<ProcessType>
) => Promise<Response>;

export type ProcessConfigFormProps = {
    form: UseFormReturn<ProcessConfigFormValues>;
    mode: ProcessConfigMode;
    initialElementName?: string;
    activeDirectory?: UUID;
    onFetchProcessConfig?: FetchProcessConfigHandler;
};

export type ProcessConfigDialogCommonProps = {
    open: boolean;
    onClose: () => void;
};

export type ProcessConfigEditionDialogProps = ProcessConfigDialogCommonProps & {
    processConfigUuid: UUID;
    processConfigName: string;
    description: string | null;
    directory: UUID;
    fetchProcessConfig: FetchPersistedProcessConfigHandler;
    updateProcessConfig: UpdateProcessConfigHandler;
};
