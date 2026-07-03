/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useCallback, useEffect } from 'react';
import type { UUID } from 'node:crypto';
import { TreeViewFinderNodeProps } from '../../../components/ui/treeViewFinder';
import { useSnackMessage } from '../../../hooks';
import { ElementType, UseParametersBackendReturnProps } from '../../../utils';
import { ComputingType, ParameterLayout } from '../common';
import { CustomFormProvider } from '../../../components/ui';
import { ShortCircuitParametersInfos } from './short-circuit-parameters.type';
import { fetchShortCircuitParameters } from '../../../services/short-circuit-analysis';
import { ShortCircuitParametersForm } from './short-circuit-parameters-form';
import { useShortCircuitParametersForm } from './use-short-circuit-parameters-form';
import { snackWithFallback } from '../../../utils/error';

export function ShortCircuitParametersInLine({
    studyUuid,
    setHaveDirtyFields,
    parametersBackend,
}: Readonly<{
    studyUuid: UUID | null;
    setHaveDirtyFields: (isDirty: boolean) => void;
    parametersBackend: UseParametersBackendReturnProps<ComputingType.SHORT_CIRCUIT>;
}>) {
    const shortCircuitMethods = useShortCircuitParametersForm({
        parametersBackend,
        parametersUuid: null,
        name: null,
        description: null,
    });

    const { resetParameters } = parametersBackend;
    const { snackError } = useSnackMessage();

    const { formMethods } = shortCircuitMethods;
    const { getValues, formState, handleSubmit, reset } = formMethods;

    const handleLoadParameters = useCallback(
        (newParams: TreeViewFinderNodeProps[]) => {
            if (newParams?.length) {
                const paramUuid = newParams[0].id;
                fetchShortCircuitParameters(paramUuid)
                    .then((parameters: ShortCircuitParametersInfos) => {
                        // Replace form data with fetched data
                        reset(shortCircuitMethods.toShortCircuitFormValues(parameters), {
                            keepDefaultValues: true,
                        });
                    })
                    .catch((error) => {
                        snackWithFallback(snackError, error, { headerId: 'paramsRetrievingError' });
                    });
            }
        },
        [snackError, shortCircuitMethods, reset]
    );

    useEffect(() => {
        setHaveDirtyFields(formState.isDirty);
    }, [formState, setHaveDirtyFields]);

    return (
        <CustomFormProvider
            validationSchema={shortCircuitMethods.formSchema}
            {...shortCircuitMethods.formMethods}
            removeOptional
        >
            <ParameterLayout
                title="ShortCircuit"
                isLoading={!shortCircuitMethods.paramsLoaded}
                parameterType={ElementType.SHORT_CIRCUIT_PARAMETERS}
                createParameter={{
                    studyUuid,
                    getParameterValues: () => getValues(),
                    parameterFormatter: (params) => shortCircuitMethods.formatNewParams(params),
                }}
                selectParameterHandler={handleLoadParameters}
                resetHandler={resetParameters}
                validateHandler={handleSubmit(shortCircuitMethods.onSaveInline, shortCircuitMethods.onValidationError)}
            >
                <ShortCircuitParametersForm shortCircuitMethods={shortCircuitMethods} />
            </ParameterLayout>
        </CustomFormProvider>
    );
}
