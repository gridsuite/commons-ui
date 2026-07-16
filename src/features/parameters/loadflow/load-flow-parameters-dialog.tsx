/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import { Grid2 as Grid, LinearProgress } from '@mui/material';
import { CustomMuiDialog } from '../../../components/ui/dialogs';
import { ParametersEditionDialogProps } from '../common';
import {
    fetchLoadFlowParameters,
    getLoadFlowDefaultLimitReductions,
    getLoadFlowProviders,
    getLoadFlowSpecificParametersDescription,
    setLoadFlowParameters,
} from '../../../services';
import { OptionalServicesStatus, useParametersBackend } from '../../../hooks';
import { ComputingType, ElementType, LANG_ENGLISH } from '../../../utils';
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
    userProfile,
    language = LANG_ENGLISH,
    isDeveloperMode = false,
}: Readonly<ParametersEditionDialogProps>) {
    const parametersBackend = useParametersBackend(
        userProfile,
        id,
        ComputingType.LOAD_FLOW,
        OptionalServicesStatus.Up,
        {
            backendFetchProviders: getLoadFlowProviders,
            backendFetchParameters: fetchLoadFlowParameters,
            backendUpdateParameters: setLoadFlowParameters,
            backendFetchSpecificParametersDescription: getLoadFlowSpecificParametersDescription,
            backendFetchDefaultLimitReductions: getLoadFlowDefaultLimitReductions,
        }
    );

    const loadflowMethods = useLoadFlowParametersForm(parametersBackend, isDeveloperMode, id, name, description);

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
        >
            <LoadFlowProvider>
                <Grid container sx={{ width: '100%' }}>
                    <NameElementEditorForm
                        initialElementName={name}
                        activeDirectory={activeDirectory}
                        elementType={ElementType.LOADFLOW_PARAMETERS}
                    />
                </Grid>
                {loadflowMethods.paramsLoaded ? (
                    <LoadFlowParametersForm loadflowMethods={loadflowMethods} />
                ) : (
                    <LinearProgress />
                )}
            </LoadFlowProvider>
        </CustomMuiDialog>
    );
}
