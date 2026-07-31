/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { UUID } from 'node:crypto';
import { LinearProgress } from '@mui/material';
import { ProcessType } from './common';
import { PersistedProcessConfigBackend, ProcessConfigBackend } from './process-config.type';
import { useProcessConfigEdition } from './use-process-config-edition';
import { CustomMuiDialog } from '../../components';
import { ElementType, isDisabledValidationButton } from '../../utils';
import { processConfigEditionDialogHelpers, ProcessConfigEditionDialogHelpers } from './process-config-edition.utils';
import { NameElementEditorForm } from '../parameters/common/name-element-editor';

export interface ProcessConfigEditionDialogProps<TProcessType extends ProcessType> {
    processType: TProcessType;
    processConfigUuid: UUID;
    name: string;
    description: string | null;
    directory: UUID;
    open: boolean;
    onClose: () => void;
    fetchProcessConfig: (processConfigUuid: UUID) => Promise<PersistedProcessConfigBackend<TProcessType>>;
    updateProcessConfig: (
        processConfigUuid: UUID,
        name: string,
        description: string,
        processConfig: ProcessConfigBackend<TProcessType>
    ) => Promise<Response>;
}

export function ProcessConfigEditionDialog<TProcessType extends ProcessType>({
    processType,
    processConfigUuid,
    name,
    description,
    directory,
    open,
    onClose,
    fetchProcessConfig,
    updateProcessConfig,
}: Readonly<ProcessConfigEditionDialogProps<TProcessType>>) {
    const {
        formShape,
        emptyFormData,
        getFormData,
        getProcessConfigBackendFromFormData,
        EditionComponent,
        dialogTitleId,
    }: ProcessConfigEditionDialogHelpers<TProcessType> = processConfigEditionDialogHelpers[processType];

    const { formMethods, formSchema, handleUpdateProcessConfig, isLoading } = useProcessConfigEdition({
        name,
        description,
        processConfigUuid,
        formShape,
        emptyFormData,
        fetchProcessConfig,
        getFormData,
        getProcessConfigBackendFromFormData,
        updateProcessConfig,
    });

    const {
        formState: { errors },
    } = formMethods;
    const disabledSave = isLoading || isDisabledValidationButton(errors);

    return (
        <CustomMuiDialog
            titleId={dialogTitleId}
            formContext={{
                ...formMethods,
                validationSchema: formSchema,
                removeOptional: true,
            }}
            open={open}
            onClose={onClose}
            onSave={handleUpdateProcessConfig}
            disabledSave={disabledSave}
        >
            <NameElementEditorForm
                activeDirectory={directory}
                elementType={ElementType.PROCESS_CONFIG}
                initialElementName={name}
            />
            {isLoading ? <LinearProgress /> : <EditionComponent />}
        </CustomMuiDialog>
    );
}
