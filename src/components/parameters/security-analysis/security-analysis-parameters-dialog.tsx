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
    enableDeveloperMode = false,
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
            formSchema={securityAnalysisMethods.formSchema}
            formMethods={securityAnalysisMethods.formMethods}
            titleId={titleId}
            removeOptional
            language={language}
            disabledSave={disableSave}
        >
            <SecurityAnalysisParametersForm
                securityAnalysisMethods={securityAnalysisMethods}
                enableDeveloperMode={enableDeveloperMode}
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
