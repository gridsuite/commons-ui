/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { UUID } from 'node:crypto';
import { LinearProgress } from '@mui/material';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { UpdateSAProcessConfig } from './update-sa-process-config';
// eslint-disable-next-line import-x/no-cycle
import {
    getSAProcessConfigBackendFromFormData,
    NamedSAProcessConfigFormSchema,
    NamedSAProcessConfigFormData,
    toSAProcessConfig,
} from './update-sa-process-configs-utils';
import { CustomMuiDialog } from '../../../components';
import { PersistedProcessConfigBackend, ProcessConfigBackend, ProcessType, useProcessConfigs } from '../common';

interface UpdateSAProcessConfigDialogProps {
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

export function UpdateSAProcessConfigDialog({
    onClose,
    open,
    processConfigId,
    description,
    name,
    directory,
    fetchProcessConfig,
    updateProcessConfig,
}: Readonly<UpdateSAProcessConfigDialogProps>) {
    const emptyFormData: NamedSAProcessConfigFormData = {
        name,
        description: description ?? '',
        modifications: [],
        loadflowParameters: [],
        securityAnalysisParameters: [],
    };

    const methods = useForm<NamedSAProcessConfigFormData>({
        defaultValues: emptyFormData,
        resolver: yupResolver<NamedSAProcessConfigFormData>(NamedSAProcessConfigFormSchema),
    });

    const { handleUpdateProcessConfig, disabledSave, isLoading } = useProcessConfigs<ProcessType.SECURITY_ANALYSIS>(
        name,
        description,
        processConfigId,
        methods,
        fetchProcessConfig,
        toSAProcessConfig,
        updateProcessConfig,
        getSAProcessConfigBackendFromFormData,
        onClose
    );

    return (
        <CustomMuiDialog
            titleId="process_config/editSAProcessConfigTitle"
            formContext={{
                ...methods,
                validationSchema: NamedSAProcessConfigFormSchema,
                removeOptional: true,
            }}
            open={open}
            onClose={onClose}
            onSave={handleUpdateProcessConfig}
            disabledSave={disabledSave}
        >
            {!isLoading && <UpdateSAProcessConfig directory={directory} processConfigName={name} />}
            {isLoading && <LinearProgress />}
        </CustomMuiDialog>
    );
}
