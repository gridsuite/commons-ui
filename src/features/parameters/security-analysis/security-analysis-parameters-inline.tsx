/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useCallback, useEffect, useRef } from 'react';

import type { UUID } from 'node:crypto';
import { ComputingType, ElementType, UseParametersBackendReturnProps } from '../../../utils';
import { ContingencyTableApi, ParameterLayout } from '../common';
import { CustomFormProvider } from '../../../components/ui';
import { useSnackMessage } from '../../../hooks';
import { TreeViewFinderNodeProps } from '../../../components/ui/treeViewFinder';
import { fetchSecurityAnalysisParameters } from '../../../services/security-analysis';
import { useSecurityAnalysisParametersForm } from './use-security-analysis-parameters-form';
import { SecurityAnalysisParametersForm } from './security-analysis-parameters-form';
import { snackWithFallback } from '../../../utils/error';
import { mapSecurityAnalysisParameters, SAParametersEnriched } from '../../../utils/types';
import { toFormValueSaParameters } from './columns-definitions';
import { ContingencyCount } from '../common/contingency-table/types';

export function SecurityAnalysisParametersInline({
    studyUuid,
    parametersBackend,
    fetchContingencyCount,
    isBuiltCurrentNode,
    setHaveDirtyFields,
    isDeveloperMode,
}: Readonly<{
    studyUuid: UUID | null;
    parametersBackend: UseParametersBackendReturnProps<ComputingType.SECURITY_ANALYSIS>;
    fetchContingencyCount: (contingencyListIds: UUID[] | null, abortSignal: AbortSignal) => Promise<ContingencyCount>;
    isBuiltCurrentNode: boolean;
    setHaveDirtyFields: (isDirty: boolean) => void;
    isDeveloperMode: boolean;
}>) {
    const securityAnalysisMethods = useSecurityAnalysisParametersForm(parametersBackend, null, null, null);

    const { resetParameters } = parametersBackend;

    // to force re-fetch contingency count in ContingencyTable
    const contingencyTableApiRef = useRef<ContingencyTableApi>(null);

    const { snackError } = useSnackMessage();

    const { handleSubmit, formState, reset, getValues } = securityAnalysisMethods.formMethods;

    const executeResetAction = useCallback(() => {
        resetParameters();
        contingencyTableApiRef.current?.resetSimulatedContingencyCount();
    }, [resetParameters]);

    const handleLoadParameter = useCallback(
        (newParams: TreeViewFinderNodeProps[]) => {
            if (newParams && newParams.length > 0) {
                fetchSecurityAnalysisParameters(newParams[0].id)
                    .then((parameters: SAParametersEnriched) => {
                        console.info(`loading the following security analysis parameters :  ${parameters.uuid}`);
                        reset(toFormValueSaParameters(parameters), {
                            keepDefaultValues: true,
                        });
                        contingencyTableApiRef.current?.triggerContingencyCountRefresh();
                    })
                    .catch((error) => {
                        snackWithFallback(snackError, error, { headerId: 'paramsRetrievingError' });
                    });
            }
        },
        [reset, snackError]
    );

    useEffect(() => {
        setHaveDirtyFields(formState.isDirty);
    }, [formState, setHaveDirtyFields]);

    return (
        <CustomFormProvider
            validationSchema={securityAnalysisMethods.formSchema}
            {...securityAnalysisMethods.formMethods}
        >
            <ParameterLayout
                title="SecurityAnalysis"
                isLoading={!securityAnalysisMethods.paramsFormInitialized}
                parameterType={ElementType.SECURITY_ANALYSIS_PARAMETERS}
                createParameter={{
                    studyUuid,
                    getParameterValues: getValues,
                    parameterFormatter: (newParams) =>
                        mapSecurityAnalysisParameters(securityAnalysisMethods.formatNewParams(newParams)),
                }}
                selectParameterHandler={handleLoadParameter}
                resetHandler={executeResetAction}
                validateHandler={handleSubmit(securityAnalysisMethods.onSaveInline)}
            >
                <SecurityAnalysisParametersForm
                    securityAnalysisMethods={securityAnalysisMethods}
                    showContingencyCount
                    fetchContingencyCount={fetchContingencyCount}
                    contingencyTableApiRef={contingencyTableApiRef}
                    isBuiltCurrentNode={isBuiltCurrentNode}
                    isDeveloperMode={isDeveloperMode}
                />
            </ParameterLayout>
        </CustomFormProvider>
    );
}
