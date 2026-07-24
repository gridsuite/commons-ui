/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */
import { useCallback, useEffect, useState } from 'react';
import { SubmitHandler, UseFormReturn } from 'react-hook-form';
import { UUID } from 'node:crypto';
import { FieldConstants } from '../../../utils';
// eslint-disable-next-line import-x/no-cycle
import { getProcessConfigFormData } from './process-config.utils';
import {
    PersistedProcessConfigBackend,
    ProcessConfig,
    ProcessConfigBackend,
    ProcessConfigFormData,
    ProcessType,
} from './process-config.type';

export interface UseProcessConfigsReturn<TProcessType extends ProcessType> {
    handleUpdateProcessConfig: SubmitHandler<ProcessConfigFormData<TProcessType>>;
    disabledSave: boolean;
    isLoading: boolean;
}

export const useProcessConfigs = <TProcessType extends ProcessType>(
    name: string,
    description: string | null,
    processConfigUuid: UUID,
    methods: UseFormReturn<ProcessConfigFormData<TProcessType>>,
    fetchProcessConfig: (processConfigUuid: UUID) => Promise<PersistedProcessConfigBackend<TProcessType>>,
    toProcessConfig: (processConfig: ProcessConfigBackend<TProcessType>) => Promise<ProcessConfig<TProcessType>>,
    updateProcessConfig: (
        processConfigUuid: UUID,
        name: string,
        description: string,
        processConfig: ProcessConfigBackend<TProcessType>
    ) => Promise<void>,
    getProcessConfigBackendFromFormData: (
        formData: ProcessConfigFormData<TProcessType>
    ) => ProcessConfigBackend<TProcessType>,
    onClose: () => void
): UseProcessConfigsReturn<TProcessType> => {
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
        (processConfigFormData: ProcessConfigFormData<TProcessType>) => {
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
