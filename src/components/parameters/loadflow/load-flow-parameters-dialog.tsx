/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import { CustomMuiDialog } from '../../dialogs';
import { ComputingType, ParametersEditionDialogProps } from '../common';
import {
    fetchLoadFlowParameters,
    getDefaultLoadFlowProvider,
    getLoadFlowDefaultLimitReductions,
    getLoadFlowProviders,
    getLoadFlowSpecificParametersDescription,
    setLoadFlowParameters,
} from '../../../services';
import { OptionalServicesStatus, useParametersBackend } from '../../../hooks';
import { ElementType } from '../../../utils';
import { LoadFlowProvider } from './load-flow-parameters-provider';
import { useLoadFlowParametersForm } from './use-load-flow-parameters-form';
import { LoadFlowParametersForm } from './load-flow-parameters-form';
import { NameElementEditorForm } from '../common/name-element-editor';

export function LoadFlowParametersEditionDialog({
    id,
    open,
    onClose,
    titleId,
    name,
    description,
    activeDirectory,
    language,
    user,
    enableDeveloperMode = false,
}: Readonly<ParametersEditionDialogProps>) {
    const parametersBackend = useParametersBackend(
        user,
        id,
        ComputingType.LOAD_FLOW,
        OptionalServicesStatus.Up,
        getLoadFlowProviders,
        null,
        getDefaultLoadFlowProvider,
        null,
        fetchLoadFlowParameters,
        setLoadFlowParameters,
        getLoadFlowSpecificParametersDescription,
        getLoadFlowDefaultLimitReductions
    );

    const loadflowMethods = useLoadFlowParametersForm(parametersBackend, enableDeveloperMode, id, name, description);

    const {
        formState: { errors, dirtyFields },
    } = loadflowMethods.formMethods;
    const disableSave = Object.keys(errors).length > 0 || Object.keys(dirtyFields).length === 0;

    return (
        <CustomMuiDialog
            open={open}
            onClose={onClose}
            onSave={loadflowMethods.onSaveDialog}
            onValidationError={loadflowMethods.onValidationError}
            formSchema={loadflowMethods.formSchema}
            formMethods={loadflowMethods.formMethods}
            titleId={titleId}
            removeOptional
            language={language}
            disabledSave={disableSave}
        >
            <LoadFlowProvider>
                <LoadFlowParametersForm
                    loadflowMethods={loadflowMethods}
                    renderTitleFields={() => {
                        return (
                            <NameElementEditorForm
                                initialElementName={name}
                                activeDirectory={activeDirectory}
                                elementType={ElementType.LOADFLOW_PARAMETERS}
                            />
                        );
                    }}
                />
            </LoadFlowProvider>
        </CustomMuiDialog>
    );
}
