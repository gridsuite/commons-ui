/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { UUID } from 'node:crypto';
import { yupResolver } from '@hookform/resolvers/yup';
import {
    getSAProcessConfigBackendFromFormData,
    getSAProcessConfigFormData,
    namedSAProcessConfigFormSchema,
    SAProcessConfigEdition,
} from './security-analysis';
import { ElementEditionDialog } from '../../components';
import { ProcessType } from './common';
import { NamedProcessConfigFormData, PersistedProcessConfigBackend, ProcessConfigBackend } from './process-config.type';
import { useProcessConfigEdition } from './use-process-config-edition';
import { ElementType } from '../../utils';

interface SAProcessConfigEditionDialogProps {
    open: boolean;
    onClose: () => void;
    processConfigId: UUID;
    name: string;
    description: string | null;
    directory: UUID;
    fetchProcessConfig: (
        processConfigUuid: UUID
    ) => Promise<PersistedProcessConfigBackend<ProcessType.SECURITY_ANALYSIS>>;
    updateProcessConfig: (
        processConfigUuid: UUID,
        name: string,
        description: string,
        processConfig: ProcessConfigBackend<ProcessType.SECURITY_ANALYSIS>
    ) => Promise<void>;
}

export function SAProcessConfigEditionDialog({
    onClose,
    open,
    processConfigId,
    description,
    name,
    directory,
    fetchProcessConfig,
    updateProcessConfig,
}: Readonly<SAProcessConfigEditionDialogProps>) {
    const emptyFormData: NamedProcessConfigFormData<ProcessType.SECURITY_ANALYSIS> = {
        name,
        description: description ?? '',
        modifications: [],
        loadflowParameters: [],
        securityAnalysisParameters: [],
    };

    const resolver =
        yupResolver<NamedProcessConfigFormData<ProcessType.SECURITY_ANALYSIS>>(namedSAProcessConfigFormSchema);

    const { methods, handleUpdateProcessConfig, isLoading } = useProcessConfigEdition(
        name,
        description,
        processConfigId,
        emptyFormData,
        resolver,
        fetchProcessConfig,
        getSAProcessConfigFormData,
        getSAProcessConfigBackendFromFormData,
        updateProcessConfig,
        onClose
    );

    return (
        <ElementEditionDialog<NamedProcessConfigFormData<ProcessType.SECURITY_ANALYSIS>>
            titleId="process_config/editSAProcessConfigTitle"
            formMethods={methods}
            formSchema={namedSAProcessConfigFormSchema}
            open={open}
            onClose={onClose}
            onSave={handleUpdateProcessConfig}
            directory={directory}
            elementName={name}
            elementType={ElementType.PROCESS_CONFIG}
            isLoading={isLoading}
        >
            <SAProcessConfigEdition />
        </ElementEditionDialog>
    );
}
