/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useCallback } from 'react';
import { SubmitHandler, useWatch } from 'react-hook-form';
import { CustomMuiDialog } from '../../components';
import { useSnackMessage } from '../../hooks';
import { FieldConstants, isDisabledValidationButton, snackWithFallback } from '../../utils';
import { ProcessType } from './common';
import {
    getProcessConfigBackendFromFormData,
    useProcessConfigForm,
    type ProcessConfigEditionDialogProps,
    type ProcessConfigFormValues,
} from './common';
import { ProcessConfigForm } from './form/process-config-form';

const PROCESS_CONFIG_EDIT_TITLE_IDS: Record<string, string> = {
    [ProcessType.LOADFLOW]: 'process_config/editLFProcessConfigTitle',
    [ProcessType.SECURITY_ANALYSIS]: 'process_config/editSAProcessConfigTitle',
    [ProcessType.SHORT_CIRCUIT]: 'process_config/editSCProcessConfigTitle',
};

export function ProcessConfigEditionDialog({
    open,
    onClose,
    processConfigUuid,
    processConfigName,
    description,
    directory,
    fetchProcessConfig,
    updateProcessConfig,
}: Readonly<ProcessConfigEditionDialogProps>) {
    const { formMethods, formSchema, isLoading } = useProcessConfigForm({
        mode: 'edit',
        processConfigUuid,
        processConfigName,
        description,
        fetchProcessConfig,
    });

    const {
        control,
        formState: { errors },
    } = formMethods;
    const { snackError } = useSnackMessage();

    const selectedProcessType = useWatch({ control, name: 'processType' });

    const handleSave = useCallback<SubmitHandler<ProcessConfigFormValues>>(
        async (values) => {
            try {
                await updateProcessConfig(
                    processConfigUuid,
                    values[FieldConstants.NAME] ?? '',
                    values[FieldConstants.DESCRIPTION] ?? '',
                    getProcessConfigBackendFromFormData(values)
                );
            } catch (error) {
                snackWithFallback(snackError, error, { headerId: 'processConfig/updateProcessConfigError' });
            }
        },
        [processConfigUuid, updateProcessConfig, snackError]
    );

    return (
        <CustomMuiDialog
            titleId={PROCESS_CONFIG_EDIT_TITLE_IDS[selectedProcessType] ?? 'processConfigEditTitle'}
            open={open}
            onClose={onClose}
            onSave={handleSave}
            formContext={{
                ...formMethods,
                validationSchema: formSchema,
                removeOptional: true,
            }}
            disabledSave={isLoading || isDisabledValidationButton(errors)}
            isDataFetching={isLoading}
        >
            <ProcessConfigForm
                form={formMethods}
                mode="edit"
                initialElementName={processConfigName}
                activeDirectory={directory}
            />
        </CustomMuiDialog>
    );
}
