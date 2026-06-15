/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useCallback, useEffect, useState } from 'react';
import { UUID } from 'node:crypto';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { LinearProgress } from '@mui/material';
import { UpdateSaProcessConfig } from './update-sa-process-config';
import {
    getSAProcessConfigFormDataFromFetchedElement,
    getSAProcessConfigBackendFromFormData,
    updateSAProcessConfigFormSchema,
    UpdateSAProcessConfigFormData,
    toSAProcessConfig,
} from './update-sa-process-configs-utils';
import { PersistedProcessConfigBackend, SecurityAnalysisProcessConfigBackend } from '../process-configs.type';
import { CustomMuiDialog } from '../../../components';
import { FieldConstants } from '../../../utils';

interface UpdateSAProcessConfigDialogProps {
    open: boolean;
    onClose: () => void;
    processConfigId: UUID;
    name: string;
    description: string | null;
    directory?: UUID;
    fetchSAProcessConfig: (processConfigUuid: UUID) => Promise<PersistedProcessConfigBackend>;
    updateSAProcessConfig: (
        processConfigUuid: UUID,
        name: string,
        description: string,
        processConfig: SecurityAnalysisProcessConfigBackend
    ) => Promise<void>;
}

export function UpdateSAProcessConfigDialog({
    onClose,
    open,
    processConfigId,
    description,
    name,
    directory,
    fetchSAProcessConfig,
    updateSAProcessConfig,
}: Readonly<UpdateSAProcessConfigDialogProps>) {
    const [isLoading, setIsLoading] = useState(false);

    const emptyFormData = {
        name,
        description: description ?? '',
        modifications: [],
        loadflowParameters: [],
        securityAnalysisParameters: [],
    };

    const methods = useForm<UpdateSAProcessConfigFormData>({
        defaultValues: emptyFormData,
        resolver: yupResolver<UpdateSAProcessConfigFormData>(updateSAProcessConfigFormSchema),
    });

    const {
        reset,
        formState: { errors },
    } = methods;

    const fetchSAProcessConfigData = useCallback(async () => {
        const persistedProcessConfig = await fetchSAProcessConfig(processConfigId);
        if (persistedProcessConfig) {
            const processConfigData = await toSAProcessConfig(persistedProcessConfig);
            const formData: UpdateSAProcessConfigFormData = getSAProcessConfigFormDataFromFetchedElement(
                processConfigData,
                name,
                description
            );
            reset({ ...formData });
        }
    }, [description, fetchSAProcessConfig, name, processConfigId, reset]);

    useEffect(() => {
        setIsLoading(true);
        fetchSAProcessConfigData().finally(() => setIsLoading(false));
    }, [fetchSAProcessConfigData]);

    const handleUpdateProcessConfig = useCallback(
        (processConfigFormData: UpdateSAProcessConfigFormData) => {
            updateSAProcessConfig(
                processConfigId,
                processConfigFormData.name,
                processConfigFormData.description ?? '',
                getSAProcessConfigBackendFromFormData(processConfigFormData)
            ).then(() => onClose());
        },
        [processConfigId, onClose, updateSAProcessConfig]
    );

    const nameError = errors[FieldConstants.NAME];
    const isValidating = errors.root?.isValidating;

    console.log('error', errors);
    return (
        <CustomMuiDialog
            titleId="process_config/editSAProcessConfigTitle"
            formContext={{
                ...methods,
                validationSchema: updateSAProcessConfigFormSchema,
                removeOptional: true,
            }}
            open={open}
            onClose={onClose}
            onSave={handleUpdateProcessConfig}
            disabledSave={Boolean(nameError || isValidating)}
        >
            {!isLoading && <UpdateSaProcessConfig directory={directory} processConfigName={name} />}
            {isLoading && <LinearProgress />}
        </CustomMuiDialog>
    );
}
