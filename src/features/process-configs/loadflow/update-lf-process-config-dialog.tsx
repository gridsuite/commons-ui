/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { UUID } from 'node:crypto';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { LinearProgress } from '@mui/material';
import { CustomMuiDialog } from '../../../components';
import { UpdateLFProcessConfig } from './update-lf-process-config';
// eslint-disable-next-line import-x/no-cycle
import {
    getLFProcessConfigBackendFromFormData,
    toLFProcessConfig,
    UpdateLFProcessConfigFormData,
    updateLFProcessConfigFormSchema,
} from './update-lf-process-configs-utils';
import { PersistedProcessConfigBackend, ProcessConfigBackend, ProcessType, useProcessConfigs } from '../common';

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
    const emptyFormData: UpdateLFProcessConfigFormData = {
        name,
        description: description ?? '',
        modifications: [],
        loadflowParameters: [],
    };

    const methods = useForm<UpdateLFProcessConfigFormData>({
        defaultValues: emptyFormData,
        resolver: yupResolver<UpdateLFProcessConfigFormData>(updateLFProcessConfigFormSchema),
    });

    const { handleUpdateProcessConfig, disabledSave, isLoading } = useProcessConfigs<ProcessType.LOADFLOW>(
        name,
        description,
        processConfigId,
        methods,
        fetchProcessConfig,
        toLFProcessConfig,
        updateProcessConfig,
        getLFProcessConfigBackendFromFormData,
        onClose
    );

    return (
        <CustomMuiDialog
            titleId="process_config/editLFProcessConfigTitle"
            formContext={{
                ...methods,
                validationSchema: updateLFProcessConfigFormSchema,
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
