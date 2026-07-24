/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { UUID } from 'node:crypto';
import { yupResolver } from '@hookform/resolvers/yup';
import { LinearProgress } from '@mui/material';
import { CustomMuiDialog } from '../../components';
import {
    getLFProcessConfigBackendFromFormData,
    getLFProcessConfigFormData,
    NamedLFProcessConfigFormData,
    namedLFProcessConfigFormSchema,
    UpdateLFProcessConfig,
} from './loadflow';
import { ProcessType } from './common';
import { PersistedProcessConfigBackend, ProcessConfigBackend } from './process-config.type';
import { useUpdateProcessConfigs } from './use-update-process-configs';

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

export function UpdateLFProcessConfigDialog({
    onClose,
    open,
    processConfigId,
    description,
    name,
    directory,
    fetchProcessConfig,
    updateProcessConfig,
}: Readonly<UpdateLFProcessConfigDialogProps>) {
    const emptyFormData: NamedLFProcessConfigFormData = {
        name,
        description: description ?? '',
        modifications: [],
        loadflowParameters: [],
    }; // moyen d'avoir un truc par défaut défini dans le columnDefinition ou équivalent ?

    const resolver = yupResolver<NamedLFProcessConfigFormData>(namedLFProcessConfigFormSchema);

    const { methods, handleUpdateProcessConfig, disabledSave, isLoading } = useUpdateProcessConfigs(
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
        <CustomMuiDialog
            titleId="process_config/editLFProcessConfigTitle"
            formContext={{
                ...methods,
                validationSchema: namedLFProcessConfigFormSchema,
                removeOptional: true,
            }}
            open={open}
            onClose={onClose}
            onSave={handleUpdateProcessConfig}
            disabledSave={disabledSave}
        >
            {!isLoading && <UpdateLFProcessConfig directory={directory} processConfigName={name} />}
            {isLoading && <LinearProgress />}
        </CustomMuiDialog>
    );
}
