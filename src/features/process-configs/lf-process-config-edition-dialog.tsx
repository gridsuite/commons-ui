/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { useCallback, useEffect, useState } from 'react';
import { ProcessType } from './common';

import { ElementType, FieldConstants, snackWithFallback } from '../../utils';
import { ProcessConfigEditionDialogProps } from './process-config-edition.utils';
import { NamedElementEditionDialog } from '../../components';
import {
    getEmptyLFProcessConfigFormData,
    getLFProcessConfigBackendFromFormData,
    getNamedLFProcessConfigFormData,
    getNamedLFProcessConfigFormSchema,
    LFProcessConfigEdition,
    NamedLFProcessConfigFormSchema,
} from './loadflow';
import { useSnackMessage } from '../../hooks';

export function LFProcessConfigEditionDialog({
    processConfigUuid,
    processConfigName,
    description,
    directory,
    open,
    onClose,
    fetchProcessConfig,
    updateProcessConfig,
}: Readonly<ProcessConfigEditionDialogProps<ProcessType.LOADFLOW>>) {
    const [isLoading, setIsLoading] = useState(false);
    const { snackError } = useSnackMessage();

    const formSchema = getNamedLFProcessConfigFormSchema(processConfigName);

    const formMethods = useForm({
        defaultValues: getEmptyLFProcessConfigFormData(processConfigName, description),
        resolver: yupResolver<NamedLFProcessConfigFormSchema>(formSchema),
    });

    const { reset } = formMethods;

    const fetchFormData = useCallback(async () => {
        const persitedProcessConfig = await fetchProcessConfig(processConfigUuid);
        if (persitedProcessConfig) {
            const formData = await getNamedLFProcessConfigFormData(
                persitedProcessConfig.processConfig,
                processConfigName,
                description
            );
            reset({ ...formData });
        }
    }, [fetchProcessConfig, processConfigUuid, processConfigName, description, reset]);

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
        (formData: NamedLFProcessConfigFormSchema) => {
            updateProcessConfig(
                processConfigUuid,
                formData[FieldConstants.NAME] ?? '',
                formData[FieldConstants.DESCRIPTION] ?? '',
                getLFProcessConfigBackendFromFormData(formData)
            ).catch((error) => {
                console.error(error);
                snackWithFallback(snackError, error, { headerId: 'processConfig/updateProcessConfigError' });
            });
        },
        [updateProcessConfig, processConfigUuid, snackError]
    );

    return (
        <NamedElementEditionDialog
            titleId="process_config/editLFProcessConfigTitle"
            formMethods={formMethods}
            formSchema={formSchema}
            open={open}
            onClose={onClose}
            onSave={handleUpdateProcessConfig}
            directory={directory}
            elementName={processConfigName}
            elementType={ElementType.PROCESS_CONFIG}
            isLoading={isLoading}
        >
            <LFProcessConfigEdition />
        </NamedElementEditionDialog>
    );
}
