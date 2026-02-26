/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { OptionalServicesStatus, useParametersBackend } from '../../../hooks';
import { useSecurityAnalysisParametersForm } from './use-security-analysis-parameters-form';
import { ComputingType, ParametersEditionDialogProps } from '../common';
import {
    fetchDefaultSecurityAnalysisProvider,
    fetchSecurityAnalysisParameters,
    fetchSecurityAnalysisProviders,
    getSecurityAnalysisDefaultLimitReductions,
    updateSecurityAnalysisParameters,
} from '../../../services/security-analysis';
import { SecurityAnalysisParametersForm } from './security-analysis-parameters-form';
import { NameElementEditorForm } from '../common/name-element-editor';
import { ElementType } from '../../../utils';
import { CustomMuiDialog } from '../../dialogs';

export function SecurityAnalysisParametersDialog({
    id,
    open,
    onClose,
    titleId,
    name,
    description,
    activeDirectory,
    language,
    user,
    isDeveloperMode = false,
}: Readonly<ParametersEditionDialogProps>) {
    const parametersBackend = useParametersBackend(
        user,
        id,
        ComputingType.SECURITY_ANALYSIS,
        OptionalServicesStatus.Up,
        fetchSecurityAnalysisProviders,
        null,
        fetchDefaultSecurityAnalysisProvider,
        null,
        fetchSecurityAnalysisParameters,
        updateSecurityAnalysisParameters,
        undefined,
        getSecurityAnalysisDefaultLimitReductions
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
            PaperProps={{
                sx: {
                    height: '90vh', // we want the dialog height to be fixed even when switching tabs
                },
            }}
        >
            <SecurityAnalysisParametersForm
                securityAnalysisMethods={securityAnalysisMethods}
                showContingencyCount={false}
                isDeveloperMode={isDeveloperMode}
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
        </CustomMuiDialog>
    );
}
