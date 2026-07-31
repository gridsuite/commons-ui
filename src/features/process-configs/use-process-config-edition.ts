/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */
import * as yup from 'yup';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { SubmitHandler, useForm, UseFormReturn } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { FieldConstants, snackWithFallback } from '../../utils';
import { ProcessType } from './common';
import { NamedProcessConfigFormSchema } from './process-config.type';
import { getNamedProcessConfigFormData, UseProcessConfigEditionProps } from './process-config-edition.utils';
import { useSnackMessage } from '../../hooks';
import { getNameElementEditorEmptyFormData, getNameElementEditorShape } from '../../components';

export interface UseProcessConfigEditionReturn<TProcessType extends ProcessType> {
    formMethods: UseFormReturn<NamedProcessConfigFormSchema<TProcessType>>;
    formSchema: yup.ObjectSchema<NamedProcessConfigFormSchema<TProcessType>>;
    handleUpdateProcessConfig: SubmitHandler<NamedProcessConfigFormSchema<TProcessType>>;
    isLoading: boolean;
}

export const useProcessConfigEdition = <TProcessType extends ProcessType>({
    name,
    description,
    processConfigUuid,
    formShape,
    emptyFormData,
    fetchProcessConfig,
    getFormData,
    getProcessConfigBackendFromFormData,
    updateProcessConfig,
}: Readonly<UseProcessConfigEditionProps<TProcessType>>): UseProcessConfigEditionReturn<TProcessType> => {
    const [isLoading, setIsLoading] = useState(false);
    const { snackError } = useSnackMessage();

    const formSchema = useMemo(() => {
        return yup.object().shape({ ...formShape, ...getNameElementEditorShape(name) }) as yup.ObjectSchema<
            NamedProcessConfigFormSchema<TProcessType>
        >;
    }, [name, formShape]);

    const formMethods = useForm<NamedProcessConfigFormSchema<TProcessType>>({
        defaultValues: { ...getNameElementEditorEmptyFormData(name, description), ...emptyFormData },
        resolver: yupResolver(formSchema as yup.ObjectSchema<any>),
    });

    const { reset } = formMethods;

    const fetchFormData = useCallback(async () => {
        const persitedProcessConfig = await fetchProcessConfig(processConfigUuid);
        if (persitedProcessConfig) {
            const formData = await getFormData(persitedProcessConfig.processConfig);
            const namedFormData = getNamedProcessConfigFormData<TProcessType>(formData, name, description);
            reset({ ...namedFormData });
        }
    }, [description, fetchProcessConfig, name, processConfigUuid, reset, getFormData]);

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
        (formData: NamedProcessConfigFormSchema<TProcessType>) => {
            updateProcessConfig(
                processConfigUuid,
                formData[FieldConstants.NAME] ?? '',
                formData[FieldConstants.DESCRIPTION] ?? '',
                getProcessConfigBackendFromFormData(formData)
            ).catch((error) => {
                console.error(error);
                snackWithFallback(snackError, error, { headerId: 'processConfig/updateProcessConfigError' });
            });
        },
        [updateProcessConfig, processConfigUuid, getProcessConfigBackendFromFormData, snackError]
    );

    return { formMethods, formSchema, handleUpdateProcessConfig, isLoading };
};
