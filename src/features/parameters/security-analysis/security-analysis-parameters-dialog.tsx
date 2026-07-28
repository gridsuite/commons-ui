/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { Grid2 as Grid, LinearProgress } from '@mui/material';
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
import { CustomMuiDialog, NameElementEditorForm } from '../../../components';
import { ComputingType, ElementType } from '../../../utils';
import { isDisabledValidationButton } from '../../../utils/form-utils';

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
        formState: { errors },
    } = securityAnalysisMethods.formMethods;

    return (
        <CustomMuiDialog
            open={open}
            onClose={onClose}
            onSave={securityAnalysisMethods.onSaveDialog}
            onValidationError={securityAnalysisMethods.onValidationError}
            formContext={{
                ...securityAnalysisMethods.formMethods,
                validationSchema: securityAnalysisMethods.formSchema,
                removeOptional: true,
                language,
            }}
            titleId={titleId}
            disabledSave={isDisabledValidationButton(errors)}
            PaperProps={{
                sx: {
                    height: '90vh', // we want the dialog height to be fixed even when switching tabs
                },
            }}
        >
            <Grid container sx={{ width: '100%' }}>
                <NameElementEditorForm
                    initialElementName={name}
                    activeDirectory={activeDirectory}
                    elementType={ElementType.SECURITY_ANALYSIS_PARAMETERS}
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
