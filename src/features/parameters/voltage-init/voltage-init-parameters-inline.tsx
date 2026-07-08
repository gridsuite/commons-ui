/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useCallback, useEffect } from 'react';
import type { UUID } from 'node:crypto';
import { TreeViewFinderNodeProps } from '../../../components/ui/treeViewFinder';
import { useSnackMessage } from '../../../hooks';
import { ElementType } from '../../../utils';
import { ParameterLayout } from '../common';
import { CustomFormProvider } from '../../../components/ui';
import { useVoltageInitParametersForm } from './use-voltage-init-parameters-form';
import { VoltageInitParametersForm } from './voltage-init-parameters-form';
import { VoltageInitStudyParameters } from './voltage-init.type';
import { getVoltageInitParameters, updateVoltageInitParameters } from '../../../services';
import {
    fromVoltageInitParametersFormToParamValues,
    fromVoltageInitParamsDataToFormValues,
} from './voltage-init-form-utils';
import { DEFAULT_GENERAL_APPLY_MODIFICATIONS } from './constants';
import { snackWithFallback } from '../../../utils/error';

export function VoltageInitParametersInLine({
    studyUuid,
    setHaveDirtyFields,
    voltageInitParameters,
}: Readonly<{
    studyUuid: UUID | null;
    setHaveDirtyFields: (isDirty: boolean) => void;
    voltageInitParameters: VoltageInitStudyParameters | null;
}>) {
    const voltageInitMethods = useVoltageInitParametersForm({
        parametersUuid: null,
        name: null,
        description: null,
        studyUuid,
        parameters: voltageInitParameters,
    });

    const { snackError } = useSnackMessage();

    const { formState, getValues, handleSubmit, reset } = voltageInitMethods.formMethods;

    const handleLoadParameters = useCallback(
        (newParams: TreeViewFinderNodeProps[]) => {
            if (newParams?.length) {
                const parametersUuid = newParams[0].id;
                getVoltageInitParameters(parametersUuid)
                    .then((params) => {
                        reset(fromVoltageInitParamsDataToFormValues(params), {
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

    const resetVoltageInitParameters = useCallback(() => {
        updateVoltageInitParameters(studyUuid, {
            applyModifications: DEFAULT_GENERAL_APPLY_MODIFICATIONS,
            computationParameters: null, // null means Reset
        }).catch((error) => {
            snackWithFallback(snackError, error, { headerId: 'updateVoltageInitParametersError' });
        });
    }, [studyUuid, snackError]);

    useEffect(() => {
        setHaveDirtyFields(formState.isDirty);
    }, [formState, setHaveDirtyFields]);

    return (
        <CustomFormProvider
            validationSchema={voltageInitMethods.formSchema}
            {...voltageInitMethods.formMethods}
            removeOptional
        >
            <ParameterLayout
                title="VoltageInit"
                isLoading={voltageInitMethods.paramsLoading}
                parameterType={ElementType.VOLTAGE_INIT_PARAMETERS}
                createParameter={{
                    studyUuid,
                    getParameterValues: getValues,
                    parameterFormatter: (params: Record<string, any>) =>
                        fromVoltageInitParametersFormToParamValues(params).computationParameters,
                }}
                selectParameterHandler={handleLoadParameters}
                resetHandler={resetVoltageInitParameters}
                validateHandler={handleSubmit(voltageInitMethods.onSaveInline)}
            >
                <VoltageInitParametersForm voltageInitMethods={voltageInitMethods} showActionsButtons />
            </ParameterLayout>
        </CustomFormProvider>
    );
}
