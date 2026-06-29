/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useCallback, useEffect } from 'react';
import type { UUID } from 'node:crypto';
import { LoadFlowProvider } from './load-flow-parameters-provider';
import { UseParametersBackendReturnProps } from '../../../utils/types/parameters.type';
import { ComputingType } from '../common/computing-type';
import { TreeViewFinderNodeProps } from '../../../components/ui/treeViewFinder';
import { useSnackMessage } from '../../../hooks';
import { ElementType, GsLang } from '../../../utils';
import { fetchLoadFlowParameters } from '../../../services/loadflow';
import { useLoadFlowParametersForm } from './use-load-flow-parameters-form';
import { LoadFlowParametersForm } from './load-flow-parameters-form';
import { snackWithFallback } from '../../../utils/error';
import { ParameterLayout } from '../common';
import { CustomFormProvider } from '../../../components/ui';

export function LoadFlowParametersInline({
    studyUuid,
    language,
    parametersBackend,
    setHaveDirtyFields,
    isDeveloperMode,
}: Readonly<{
    studyUuid: UUID | null;
    language: GsLang;
    parametersBackend: UseParametersBackendReturnProps<ComputingType.LOAD_FLOW>;
    setHaveDirtyFields: (isDirty: boolean) => void;
    isDeveloperMode: boolean;
}>) {
    const { resetParameters } = parametersBackend;
    const loadflowMethods = useLoadFlowParametersForm(parametersBackend, isDeveloperMode, null, null, null);

    const { snackError } = useSnackMessage();

    const { reset, getValues, formState, handleSubmit } = loadflowMethods.formMethods;

    const handleLoadParameter = useCallback(
        (newParams: TreeViewFinderNodeProps[]) => {
            if (newParams && newParams.length > 0) {
                fetchLoadFlowParameters(newParams[0].id)
                    .then((parameters) => {
                        console.info(`loading the following loadflow parameters : ${parameters.uuid}`);
                        reset(loadflowMethods.toLoadFlowFormValues(parameters), {
                            keepDefaultValues: true,
                        });
                    })
                    .catch((error) => {
                        snackWithFallback(snackError, error, { headerId: 'paramsRetrievingError' });
                    });
            }
        },
        [loadflowMethods, reset, snackError]
    );

    useEffect(() => {
        setHaveDirtyFields(formState.isDirty);
    }, [formState, setHaveDirtyFields]);

    return (
        <LoadFlowProvider>
            <CustomFormProvider
                validationSchema={loadflowMethods.formSchema}
                {...loadflowMethods.formMethods}
                removeOptional
                language={language}
            >
                <ParameterLayout
                    title="LoadFlow"
                    isLoading={!loadflowMethods.paramsLoaded}
                    parameterType={ElementType.LOADFLOW_PARAMETERS}
                    createParameter={{
                        studyUuid,
                        getParameterValues: () => loadflowMethods.formatNewParams(getValues()),
                        parameterFormatter: (newParams) => newParams,
                    }}
                    selectParameterHandler={handleLoadParameter}
                    resetHandler={resetParameters}
                    validateHandler={handleSubmit(loadflowMethods.onSaveInline, loadflowMethods.onValidationError)}
                >
                    <LoadFlowParametersForm loadflowMethods={loadflowMethods} />
                </ParameterLayout>
            </CustomFormProvider>
        </LoadFlowProvider>
    );
}
