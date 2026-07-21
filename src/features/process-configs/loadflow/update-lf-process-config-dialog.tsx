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
import { PersistedProcessConfigBackend, ProcessConfigBackend } from '../process-configs.type';
import { CustomMuiDialog } from '../../../components';
import { FieldConstants } from '../../../utils';
import { UpdateLFProcessConfig } from './update-lf-process-config';
import {
    getLFProcessConfigBackendFromFormData,
    getLFProcessConfigFormDataFromFetchedElement,
    toLFProcessConfig,
    UpdateLFProcessConfigFormData,
    updateLFProcessConfigFormSchema,
} from './update-lf-process-configs-utils';

interface UpdateLFProcessConfigDialogProps {
    open: boolean;
    onClose: () => void;
    processConfigId: UUID;
    name: string;
    description: string | null;
    directory: UUID;
    fetchProcessConfig: (processConfigUuid: UUID) => Promise<PersistedProcessConfigBackend>;
    updateProcessConfig: (
        processConfigUuid: UUID,
        name: string,
        description: string,
        processConfig: ProcessConfigBackend
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
    const [isLoading, setIsLoading] = useState(false);

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

    const {
        reset,
        formState: { errors },
    } = methods;

    const fetchLFProcessConfigData = useCallback(async () => {
        const persistedProcessConfig = await fetchProcessConfig(processConfigId);
        if (persistedProcessConfig) {
            const processConfigData = await toLFProcessConfig(persistedProcessConfig);
            const formData = getLFProcessConfigFormDataFromFetchedElement(processConfigData, name, description);
            reset({ ...formData });
        }
    }, [description, fetchProcessConfig, name, processConfigId, reset]);

    useEffect(() => {
        setIsLoading(true);
        fetchLFProcessConfigData().finally(() => setIsLoading(false));
    }, [fetchLFProcessConfigData]);

    const handleUpdateProcessConfig = useCallback(
        (processConfigFormData: UpdateLFProcessConfigFormData) => {
            updateProcessConfig(
                processConfigId,
                processConfigFormData.name,
                processConfigFormData.description ?? '',
                getLFProcessConfigBackendFromFormData(processConfigFormData)
            ).then(() => onClose());
        },
        [processConfigId, onClose, updateProcessConfig]
    );

    const nameError = errors[FieldConstants.NAME];
    const isValidating = errors.root?.isValidating;

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
            disabledSave={Boolean(nameError || isValidating)}
        >
            {!isLoading && <UpdateLFProcessConfig directory={directory} processConfigName={name} />}
            {isLoading && <LinearProgress />}
        </CustomMuiDialog>
    );
}
