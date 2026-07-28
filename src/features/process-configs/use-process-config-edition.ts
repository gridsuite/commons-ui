/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */
import { useCallback, useEffect, useState } from 'react';
import { DefaultValues, Resolver, SubmitHandler, useForm, UseFormReturn } from 'react-hook-form';
import { UUID } from 'node:crypto';
import { FieldConstants, snackWithFallback } from '../../utils';
import { ProcessType } from './common';
import {
    NamedProcessConfigFormData,
    PersistedProcessConfigBackend,
    ProcessConfigBackend,
    ProcessConfigFormData,
} from './process-config.type';
import {
    getNamedProcessConfigFormData,
    getProcessConfigFormDataFromNamedFormData,
} from './process-config-edition.utils';
import { useSnackMessage } from '../../hooks';

export interface UseProcessConfigEditionReturn<TProcessType extends ProcessType> {
    methods: UseFormReturn<NamedProcessConfigFormData<TProcessType>>;
    handleUpdateProcessConfig: SubmitHandler<NamedProcessConfigFormData<TProcessType>>;
    isLoading: boolean;
}

export const useProcessConfigEdition = <TProcessType extends ProcessType>(
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
        formData: ProcessConfigFormData<TProcessType>
    ) => ProcessConfigBackend<TProcessType>,
    updateProcessConfig: (
        processConfigUuid: UUID,
        name: string,
        description: string,
        processConfig: ProcessConfigBackend<TProcessType>
    ) => Promise<Response>
): UseProcessConfigEditionReturn<TProcessType> => {
    const [isLoading, setIsLoading] = useState(false);
    const { snackError } = useSnackMessage();

    const methods = useForm<NamedProcessConfigFormData<TProcessType>>({
        defaultValues: emptyFormData,
        resolver,
    });

    const { reset } = methods;

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
        fetchFormData()
            .finally(() => setIsLoading(false))
            .catch((error) => {
                snackWithFallback(snackError, error, {
                    headerId: `processConfig/fetchProcessConfigError`,
                });
            });
    }, [fetchFormData, snackError]);

    const handleUpdateProcessConfig = useCallback(
        (namedFormData: NamedProcessConfigFormData<TProcessType>) => {
            const processConfigData = getProcessConfigFormDataFromNamedFormData(namedFormData);
            updateProcessConfig(
                processConfigUuid,
                namedFormData[FieldConstants.NAME],
                namedFormData[FieldConstants.DESCRIPTION] ?? '',
                getProcessConfigBackendFromFormData(processConfigData)
            ).catch((error) => {
                console.error(error);
                snackWithFallback(snackError, error, { headerId: 'processConfig/updateProcessConfigError' });
            });
        },
        [updateProcessConfig, processConfigUuid, getProcessConfigBackendFromFormData, snackError]
    );

    return { methods, handleUpdateProcessConfig, isLoading };
};
