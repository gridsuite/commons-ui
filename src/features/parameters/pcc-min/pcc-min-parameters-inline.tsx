/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useCallback, useEffect } from 'react';
import type { UUID } from 'node:crypto';
import { useSnackMessage } from '../../../hooks';
import { ParameterLayout } from '../common';
import { CustomFormProvider } from '../../../components/ui';
import { UsePccMinParametersForm } from './use-pcc-min-parameters-form';
import { PccMinParametersForm } from './pcc-min-parameters-form';
import { fetchPccMinParameters, updatePccMinParameters } from '../../../services/pcc-min';
import { ElementType, mapPccMinParameters, PccMinParametersEnriched, snackWithFallback } from '../../../utils';
import { TreeViewFinderNodeProps } from '../../../components/ui/treeViewFinder';
import { fromPccMinParametersFormToParamValuesEnriched, fromPccMinParamsDataToFormValues } from './pcc-min-form-utils';

export function PccMinParametersInLine({
    studyUuid,
    setHaveDirtyFields,
    pccMinParameters,
}: Readonly<{
    studyUuid: UUID | null;
    setHaveDirtyFields: (isDirty: boolean) => void;
    pccMinParameters: PccMinParametersEnriched | null;
}>) {
    const pccMinMethods = UsePccMinParametersForm({
        parametersUuid: null,
        name: null,
        description: null,
        studyUuid,
        parameters: pccMinParameters,
    });

    const { snackError } = useSnackMessage();

    const { formState, handleSubmit, reset, getValues } = pccMinMethods.formMethods;

    const resetPccMinParameters = useCallback(() => {
        updatePccMinParameters(studyUuid, null) // null means Reset
            .catch((error) => {
                snackError({
                    messageTxt: error.message,
                    headerId: 'updatePccMinParametersError',
                });
            });
    }, [studyUuid, snackError]);

    useEffect(() => {
        setHaveDirtyFields(formState.isDirty);
    }, [formState, setHaveDirtyFields]);

    const handleLoadParameters = useCallback(
        (newParams: TreeViewFinderNodeProps[]) => {
            if (newParams?.length) {
                const parametersUuid = newParams[0].id;
                fetchPccMinParameters(parametersUuid)
                    .then((params) => {
                        reset(fromPccMinParamsDataToFormValues(params), {
                            keepDefaultValues: true,
                        });
                    })
                    .catch((error: Error) => {
                        snackWithFallback(snackError, error, { headerId: 'paramsRetrievingError' });
                    });
            }
        },
        [reset, snackError]
    );

    return (
        <CustomFormProvider validationSchema={pccMinMethods.formSchema} {...pccMinMethods.formMethods} removeOptional>
            <ParameterLayout
                title="PccMin"
                isLoading={pccMinMethods.paramsLoading}
                parameterType={ElementType.PCC_MIN_PARAMETERS}
                createParameter={{
                    studyUuid,
                    getParameterValues: getValues,
                    parameterFormatter: (params: Record<string, any>) =>
                        mapPccMinParameters(fromPccMinParametersFormToParamValuesEnriched(params)),
                }}
                selectParameterHandler={handleLoadParameters}
                resetHandler={resetPccMinParameters}
                validateHandler={handleSubmit(pccMinMethods.onSaveInline)}
            >
                <PccMinParametersForm pccMinMethods={pccMinMethods} />
            </ParameterLayout>
        </CustomFormProvider>
    );
}
