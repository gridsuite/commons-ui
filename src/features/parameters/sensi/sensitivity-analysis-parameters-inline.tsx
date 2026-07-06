/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useCallback, useEffect } from 'react';
import type { UUID } from 'node:crypto';
import {
    ComputingType,
    ElementType,
    mapSensitivityAnalysisParameters,
    SensitivityAnalysisParametersInfosEnriched,
    UseParametersBackendReturnProps,
} from '../../../utils';
import { ParameterLayout } from '../common';
import { CustomFormProvider } from '../../../components/ui';
import { useSnackMessage } from '../../../hooks';
import {
    fetchSensitivityAnalysisParameters,
    setSensitivityAnalysisParameters,
} from '../../../services/sensitivity-analysis';
import { TreeViewFinderNodeProps } from '../../../components/ui/treeViewFinder';
import { useSensitivityAnalysisParametersForm } from './use-sensitivity-analysis-parameters';
import { SensitivityAnalysisParametersForm } from './sensitivity-analysis-parameters-form';
import { snackWithFallback } from '../../../utils/error';
import { BuildStatus } from '../../node/constant';

interface SensitivityAnalysisParametersProps {
    studyUuid: UUID | null;
    currentNodeUuid: UUID | null;
    currentRootNetworkUuid: UUID | null;
    parametersBackend: UseParametersBackendReturnProps<ComputingType.SENSITIVITY_ANALYSIS>;
    setHaveDirtyFields: (isDirty: boolean) => void;
    globalBuildStatus?: BuildStatus;
    isRootNode: boolean;
    isDeveloperMode: boolean;
}

export function SensitivityAnalysisParametersInline({
    studyUuid,
    currentNodeUuid,
    currentRootNetworkUuid,
    parametersBackend,
    setHaveDirtyFields,
    globalBuildStatus,
    isRootNode,
    isDeveloperMode,
}: Readonly<SensitivityAnalysisParametersProps>) {
    const { snackError } = useSnackMessage();

    const sensitivityAnalysisMethods = useSensitivityAnalysisParametersForm({
        studyUuid,
        currentNodeUuid,
        currentRootNetworkUuid,
        parametersBackend,
        name: null,
        description: null,
        parametersUuid: null,
        globalBuildStatus,
        isRootNode,
    });

    const { reset, formState, getValues, handleSubmit } = sensitivityAnalysisMethods.formMethods;

    const handleSensibilityParameter = useCallback(
        (newParams: TreeViewFinderNodeProps[]) => {
            if (newParams && newParams.length > 0) {
                fetchSensitivityAnalysisParameters(newParams[0].id)
                    .then((parameters: SensitivityAnalysisParametersInfosEnriched) => {
                        console.info(`loading the following sensi parameters : ${parameters.uuid}`);
                        reset(sensitivityAnalysisMethods.fromSensitivityAnalysisParamsDataToFormValues(parameters), {
                            keepDefaultValues: true,
                        });
                        sensitivityAnalysisMethods.onFormChanged();
                    })
                    .catch((error) => {
                        snackWithFallback(snackError, error, { headerId: 'paramsRetrievingError' });
                    });
            }
        },
        [reset, sensitivityAnalysisMethods, snackError]
    );

    const resetSensitivityAnalysisParameters = useCallback(() => {
        setSensitivityAnalysisParameters(studyUuid, null).catch((error) => {
            snackWithFallback(snackError, error, { headerId: 'paramsChangingError' });
        });
    }, [studyUuid, snackError]);

    const clear = useCallback(() => {
        reset(sensitivityAnalysisMethods.emptyFormData);
        resetSensitivityAnalysisParameters();
        sensitivityAnalysisMethods.resetFactorsCount();
    }, [reset, sensitivityAnalysisMethods, resetSensitivityAnalysisParameters]);

    useEffect(() => {
        setHaveDirtyFields(formState.isDirty);
    }, [formState, setHaveDirtyFields]);

    return (
        <CustomFormProvider
            validationSchema={sensitivityAnalysisMethods.formSchema}
            {...sensitivityAnalysisMethods.formMethods}
        >
            <ParameterLayout
                title="SensitivityAnalysis"
                isLoading={!sensitivityAnalysisMethods.paramsFormInitialized}
                parameterType={ElementType.SENSITIVITY_PARAMETERS}
                createParameter={{
                    studyUuid,
                    getParameterValues: getValues,
                    parameterFormatter: (newParams) =>
                        mapSensitivityAnalysisParameters(sensitivityAnalysisMethods.formatNewParams(newParams)),
                }}
                selectParameterHandler={handleSensibilityParameter}
                resetHandler={clear}
                validateHandler={handleSubmit(sensitivityAnalysisMethods.onSaveInline)}
                validateDisabled={
                    sensitivityAnalysisMethods.isLoading ||
                    sensitivityAnalysisMethods.isMaxResultsReached ||
                    sensitivityAnalysisMethods.isMaxVariablesReached
                }
            >
                <SensitivityAnalysisParametersForm
                    sensitivityAnalysisMethods={sensitivityAnalysisMethods}
                    isDeveloperMode={isDeveloperMode}
                    isRootNode={isRootNode}
                    globalBuildStatus={globalBuildStatus}
                />
            </ParameterLayout>
        </CustomFormProvider>
    );
}
