/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */
import { ComputingType, ParametersEditionDialogProps } from '../common';
import { OptionalServicesStatus, useParametersBackend } from '../../../hooks';
import {
    fetchDefaultSensitivityAnalysisProvider,
    fetchSensitivityAnalysisParameters,
    fetchSensitivityAnalysisProviders,
    updateSensitivityAnalysisParameters,
} from '../../../services/sensitivity-analysis';
import { CustomMuiDialog } from '../../dialogs';
import { NameElementEditorForm } from '../common/name-element-editor';
import { ElementType } from '../../../utils';
import { useSensitivityAnalysisParametersForm } from './use-sensitivity-analysis-parameters';
import { SensitivityAnalysisParametersForm } from './sensitivity-analysis-parameters-form';

export function SensitivityAnalysisParametersDialog({
    id,
    open,
    onClose,
    titleId,
    name,
    description,
    activeDirectory,
    language,
    user,
    globalBuildStatus,
    isDeveloperMode = false,
}: Readonly<ParametersEditionDialogProps>) {
    const parametersBackend = useParametersBackend(
        user,
        id,
        ComputingType.SENSITIVITY_ANALYSIS,
        OptionalServicesStatus.Up,
        fetchSensitivityAnalysisProviders,
        null,
        fetchDefaultSensitivityAnalysisProvider,
        null,
        fetchSensitivityAnalysisParameters,
        updateSensitivityAnalysisParameters
    );

    const sensitivityAnalysisMethods = useSensitivityAnalysisParametersForm({
        studyUuid: null,
        currentNodeUuid: null,
        currentRootNetworkUuid: null,
        parametersBackend,
        parametersUuid: id,
        name,
        description,
    });
    const {
        formState: { errors, dirtyFields },
    } = sensitivityAnalysisMethods.formMethods;
    const disableSave = Object.keys(errors).length > 0 || Object.keys(dirtyFields).length === 0;

    return (
        <CustomMuiDialog
            open={open}
            onClose={onClose}
            onSave={sensitivityAnalysisMethods.onSaveDialog}
            formContext={{
                ...sensitivityAnalysisMethods.formMethods,
                validationSchema: sensitivityAnalysisMethods.formSchema,
                removeOptional: true,
                language,
            }}
            titleId={titleId}
            disabledSave={disableSave}
        >
            <SensitivityAnalysisParametersForm
                sensitivityAnalysisMethods={sensitivityAnalysisMethods}
                isDeveloperMode={isDeveloperMode}
                globalBuildStatus={globalBuildStatus}
                renderTitleFields={() => {
                    return (
                        <NameElementEditorForm
                            initialElementName={name}
                            activeDirectory={activeDirectory}
                            elementType={ElementType.SENSITIVITY_PARAMETERS}
                        />
                    );
                }}
            />
        </CustomMuiDialog>
    );
}
