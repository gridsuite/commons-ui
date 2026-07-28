/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { UUID } from 'node:crypto';
import { yupResolver } from '@hookform/resolvers/yup';
import {
    getLFProcessConfigBackendFromFormData,
    getLFProcessConfigFormData,
    namedLFProcessConfigFormSchema,
    LFProcessConfigEdition,
} from './loadflow';
import { ProcessType } from './common';
import { NamedProcessConfigFormData, PersistedProcessConfigBackend, ProcessConfigBackend } from './process-config.type';
import { useProcessConfigEdition } from './use-process-config-edition';
import { ElementEditionDialog } from '../../components';
import { ElementType } from '../../utils';

interface UpdateLFProcessConfigDialogProps {
    open: boolean;
    onClose: () => void;
    processConfigId: UUID;
    name: string;
    description: string | null;
    directory: UUID;
    fetchProcessConfig: (processConfigUuid: UUID) => Promise<PersistedProcessConfigBackend<ProcessType.LOADFLOW>>;
    updateProcessConfig: (
        processConfigUuid: UUID,
        name: string,
        description: string,
        processConfig: ProcessConfigBackend<ProcessType.LOADFLOW>
    ) => Promise<void>;
}

export function LFProcessConfigEditionDialog({
    onClose,
    open,
    processConfigId,
    description,
    name,
    directory,
    fetchProcessConfig,
    updateProcessConfig,
}: Readonly<UpdateLFProcessConfigDialogProps>) {
    const emptyFormData: NamedProcessConfigFormData<ProcessType.LOADFLOW> = {
        name,
        description: description ?? '',
        modifications: [],
        loadflowParameters: [],
    };

    const resolver = yupResolver<NamedProcessConfigFormData<ProcessType.LOADFLOW>>(namedLFProcessConfigFormSchema);

    const { methods, handleUpdateProcessConfig, isLoading } = useProcessConfigEdition(
        name,
        description,
        processConfigId,
        emptyFormData,
        resolver,
        fetchProcessConfig,
        getLFProcessConfigFormData,
        getLFProcessConfigBackendFromFormData,
        updateProcessConfig,
        onClose
    );

    return (
        <ElementEditionDialog<NamedProcessConfigFormData<ProcessType.LOADFLOW>>
            titleId="process_config/editLFProcessConfigTitle"
            formMethods={methods}
            formSchema={namedLFProcessConfigFormSchema}
            open={open}
            onClose={onClose}
            onSave={handleUpdateProcessConfig}
            directory={directory}
            elementName={name}
            elementType={ElementType.PROCESS_CONFIG}
            isLoading={isLoading}
        >
            <LFProcessConfigEdition />
        </ElementEditionDialog>
    );
}
