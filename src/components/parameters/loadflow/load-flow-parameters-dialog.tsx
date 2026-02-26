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
import { ElementType, LANG_ENGLISH } from '../../../utils';
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
    user,
    language = LANG_ENGLISH,
    isDeveloperMode = false,
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

    const loadflowMethods = useLoadFlowParametersForm(parametersBackend, isDeveloperMode, id, name, description);

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
            formContext={{
                ...loadflowMethods.formMethods,
                validationSchema: loadflowMethods.formSchema,
                removeOptional: true,
                language,
            }}
            titleId={titleId}
            disabledSave={disableSave}
        >
            <LoadFlowProvider>
                <LoadFlowParametersForm
                    loadflowMethods={loadflowMethods}
                    language={language}
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
