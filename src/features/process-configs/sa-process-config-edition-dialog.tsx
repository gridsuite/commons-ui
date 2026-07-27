/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { UUID } from 'node:crypto';
import { LinearProgress } from '@mui/material';
import { yupResolver } from '@hookform/resolvers/yup';
import {
    getSAProcessConfigBackendFromFormData,
    getSAProcessConfigFormData,
    NamedSAProcessConfigFormData,
    namedSAProcessConfigFormSchema,
    SAProcessConfigEdition,
} from './security-analysis';
import { CustomMuiDialog } from '../../components';
import { ProcessType } from './common';
import { PersistedProcessConfigBackend, ProcessConfigBackend } from './process-config.type';
import { useProcessConfigEdition } from './use-process-config-edition';

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
    const emptyFormData: NamedSAProcessConfigFormData = {
        name,
        description: description ?? '',
        modifications: [],
        loadflowParameters: [],
        securityAnalysisParameters: [],
    };

    const resolver = yupResolver<NamedSAProcessConfigFormData>(namedSAProcessConfigFormSchema);

    const { methods, handleUpdateProcessConfig, disabledSave, isLoading } = useProcessConfigEdition(
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
        <CustomMuiDialog
            titleId="process_config/editSAProcessConfigTitle"
            formContext={{
                ...methods,
                validationSchema: namedSAProcessConfigFormSchema,
                removeOptional: true,
            }}
            open={open}
            onClose={onClose}
            onSave={handleUpdateProcessConfig}
            disabledSave={disabledSave}
        >
            {!isLoading && <SAProcessConfigEdition directory={directory} processConfigName={name} />}
            {isLoading && <LinearProgress />}
        </CustomMuiDialog>
    );
}
