/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */
import { useCallback, useEffect, useState } from 'react';
import { FieldValues, SubmitHandler, UseFormReturn } from 'react-hook-form';
import { UUID } from 'node:crypto';
import { FieldConstants } from '../../../utils';
import { getProcessConfigFormData } from './process-config.utils';
import { PersistedProcessConfigBackend, ProcessConfig, ProcessConfigBackend, ProcessType } from './process-config.type';

export interface UseProcessConfigsReturn {
    handleUpdateProcessConfig: SubmitHandler<FieldValues>;
    disabledSave: boolean;
    isLoading: boolean;
}

export const useProcessConfigs = <TProcessType extends ProcessType>(
    name: string,
    description: string | null,
    processConfigUuid: UUID,
    methods: UseFormReturn<FieldValues>,
    fetchProcessConfig: (processConfigUuid: UUID) => Promise<PersistedProcessConfigBackend<TProcessType>>,
    toProcessConfig: (processConfig: ProcessConfigBackend<TProcessType>) => Promise<ProcessConfig<TProcessType>>,
    updateProcessConfig: (
        processConfigUuid: UUID,
        name: string,
        description: string,
        processConfig: ProcessConfigBackend<TProcessType>
    ) => Promise<void>,
    getProcessConfigBackendFromFormData: (formData: FieldValues) => ProcessConfigBackend<TProcessType>,
    onClose: () => void
): UseProcessConfigsReturn => {
    const [isLoading, setIsLoading] = useState(false);

    const {
        reset,
        formState: { errors },
    } = methods;

    const fetchProcessConfigData = useCallback(async () => {
        const persitedProcessConfig = await fetchProcessConfig(processConfigUuid);
        if (persitedProcessConfig) {
            const processConfigData = await toProcessConfig(persitedProcessConfig.processConfig);
            const formData = getProcessConfigFormData<TProcessType>(processConfigData, name, description);
            reset({ ...formData });
        }
    }, [description, fetchProcessConfig, name, processConfigUuid, reset, toProcessConfig]);

    useEffect(() => {
        setIsLoading(true);
        fetchProcessConfigData().finally(() => setIsLoading(false));
    }, [fetchProcessConfigData]);

    const handleUpdateProcessConfig = useCallback(
        (processConfigFormData: FieldValues) => {
            updateProcessConfig(
                processConfigUuid,
                processConfigFormData[FieldConstants.NAME],
                processConfigFormData[FieldConstants.DESCRIPTION] ?? '',
                getProcessConfigBackendFromFormData(processConfigFormData)
            ).then(() => onClose());
        },
        [updateProcessConfig, processConfigUuid, getProcessConfigBackendFromFormData, onClose]
    );

    const disabledSave = Boolean(errors.name || errors.root?.isValidating);

    return { handleUpdateProcessConfig, disabledSave, isLoading };
};
