/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { Grid, LinearProgress } from '@mui/material';
import { OptionalServicesStatus, useParametersBackend } from '../../../hooks';
import { useSecurityAnalysisParametersForm } from './use-security-analysis-parameters-form';
import { ParametersEditionDialogProps } from '../common';
import {
    fetchSecurityAnalysisParameters,
    fetchSecurityAnalysisProviders,
    getSecurityAnalysisDefaultLimitReductions,
    updateSecurityAnalysisParameters,
} from '../../../services/security-analysis';
import { SecurityAnalysisParametersForm } from './security-analysis-parameters-form';
import { NameElementEditorForm } from '../common/name-element-editor';
import { ComputingType, ElementType } from '../../../utils';
import { CustomMuiDialog } from '../../../components/ui/dialogs';

export function SecurityAnalysisParametersDialog({
    id,
    open,
    onClose,
    titleId,
    name,
    description,
    activeDirectory,
    language,
    userProfile,
}: Readonly<ParametersEditionDialogProps>) {
    const parametersBackend = useParametersBackend(
        userProfile,
        id,
        ComputingType.SECURITY_ANALYSIS,
        OptionalServicesStatus.Up,
        {
            backendFetchProviders: fetchSecurityAnalysisProviders,
            backendFetchParameters: fetchSecurityAnalysisParameters,
            backendUpdateParameters: updateSecurityAnalysisParameters,
            backendFetchDefaultLimitReductions: getSecurityAnalysisDefaultLimitReductions,
        }
    );

    const securityAnalysisMethods = useSecurityAnalysisParametersForm(parametersBackend, id, name, description);
    const {
        formState: { errors, dirtyFields },
    } = securityAnalysisMethods.formMethods;
    const disableSave = Object.keys(errors).length > 0 || Object.keys(dirtyFields).length === 0;

    return (
        <CustomMuiDialog
            open={open}
            onClose={onClose}
            onSave={securityAnalysisMethods.onSaveDialog}
            formContext={{
                ...securityAnalysisMethods.formMethods,
                validationSchema: securityAnalysisMethods.formSchema,
                removeOptional: true,
                language,
            }}
            titleId={titleId}
            disabledSave={disableSave}
            slotProps={{
                paper: {
                    sx: {
                        height: '90vh', // we want the dialog height to be fixed even when switching tabs
                    },
                },
            }}
        >
            <Grid container sx={{ width: '100%' }}>
                <NameElementEditorForm
                    initialElementName={name}
                    activeDirectory={activeDirectory}
                    elementType={ElementType.LOADFLOW_PARAMETERS}
                />
            </Grid>
            {securityAnalysisMethods.paramsFormInitialized ? (
                <SecurityAnalysisParametersForm
                    securityAnalysisMethods={securityAnalysisMethods}
                    showContingencyCount={false}
                />
            ) : (
                <LinearProgress />
            )}
        </CustomMuiDialog>
    );
}
