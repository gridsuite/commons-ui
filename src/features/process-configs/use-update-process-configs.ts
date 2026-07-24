/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */
import { useCallback, useEffect, useState } from 'react';
import { DefaultValues, Resolver, SubmitHandler, useForm, UseFormReturn } from 'react-hook-form';
import { UUID } from 'node:crypto';
import { FieldConstants } from '../../utils';
import { ProcessType } from './common';
import {
    NamedProcessConfigFormData,
    PersistedProcessConfigBackend,
    ProcessConfigBackend,
    ProcessConfigFormData,
} from './process-config.type';
import { getNamedProcessConfigFormData } from './update-process-config.utils';

export interface UseProcessConfigsReturn<TProcessType extends ProcessType> {
    methods: UseFormReturn<NamedProcessConfigFormData<TProcessType>>;
    handleUpdateProcessConfig: SubmitHandler<NamedProcessConfigFormData<TProcessType>>;
    disabledSave: boolean;
    isLoading: boolean;
}

export const useUpdateProcessConfigs = <TProcessType extends ProcessType>(
    name: string,
    description: string | null,
    processConfigUuid: UUID,
    emptyFormData: DefaultValues<NamedProcessConfigFormData<TProcessType>>,
    resolver: Resolver<NamedProcessConfigFormData<TProcessType>>,
    fetchProcessConfig: (processConfigUuid: UUID) => Promise<PersistedProcessConfigBackend<TProcessType>>,
    getProcessConfigFormData: (
        processConfig: ProcessConfigBackend<TProcessType>
    ) => Promise<ProcessConfigFormData<TProcessType>>,
    getProcessConfigBackendFromFormData: (
        formData: NamedProcessConfigFormData<TProcessType>
    ) => ProcessConfigBackend<TProcessType>,
    updateProcessConfig: (
        processConfigUuid: UUID,
        name: string,
        description: string,
        processConfig: ProcessConfigBackend<TProcessType>
    ) => Promise<void>,
    onClose: () => void
): UseProcessConfigsReturn<TProcessType> => {
    const [isLoading, setIsLoading] = useState(false);

    const methods = useForm<NamedProcessConfigFormData<TProcessType>>({
        defaultValues: emptyFormData,
        resolver,
    });

    const {
        reset,
        formState: { errors },
    } = methods;

    const fetchFormData = useCallback(async () => {
        const persitedProcessConfig = await fetchProcessConfig(processConfigUuid);
        if (persitedProcessConfig) {
            const formData = await getProcessConfigFormData(persitedProcessConfig.processConfig);
            const namedFormData = getNamedProcessConfigFormData<TProcessType>(formData, name, description);
            reset({ ...namedFormData });
        }
    }, [description, fetchProcessConfig, name, processConfigUuid, reset, getProcessConfigFormData]);

    useEffect(() => {
        setIsLoading(true);
        fetchFormData().finally(() => setIsLoading(false));
    }, [fetchFormData]);

    const handleUpdateProcessConfig = useCallback(
        (formData: NamedProcessConfigFormData<TProcessType>) => {
            updateProcessConfig(
                processConfigUuid,
                formData[FieldConstants.NAME],
                formData[FieldConstants.DESCRIPTION] ?? '',
                getProcessConfigBackendFromFormData(formData)
            ).then(() => onClose());
        },
        [updateProcessConfig, processConfigUuid, getProcessConfigBackendFromFormData, onClose]
    );

    const disabledSave = Boolean(errors.name || errors.root?.isValidating);

    return { methods, handleUpdateProcessConfig, disabledSave, isLoading };
};
