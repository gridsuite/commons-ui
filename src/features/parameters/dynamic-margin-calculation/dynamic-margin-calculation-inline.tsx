/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import type { UUID } from 'node:crypto';
import { useCallback, useEffect } from 'react';
import { FieldValues } from 'react-hook-form';
import { UseParametersBackendReturnProps } from '../../../utils/types/parameters.type';
import { ComputingType } from '../common/computing-type';
import { ElementType, snackWithFallback } from '../../../utils';
import { DynamicMarginCalculationForm } from './dynamic-margin-calculation-form';
import {
    toFormValues,
    toParamsInfos,
    useDynamicMarginCalculationParametersForm,
} from './use-dynamic-margin-calculation-parameters-form';
import { ParameterLayout } from '../common';
import { CustomFormProvider } from '../../../components/ui';
import { TreeViewFinderNodeProps } from '../../../components/ui/treeViewFinder';
import { fetchDynamicMarginCalculationParameters } from '../../../services/dynamic-margin-calculation';
import { useSnackMessage } from '../../../hooks';
import { useTabs } from '../common/hook/use-tabs';
import { TabValues } from './dynamic-margin-calculation.type';

type DynamicMarginCalculationInlineProps = {
    studyUuid: UUID | null;
    parametersBackend: UseParametersBackendReturnProps<ComputingType.DYNAMIC_MARGIN_CALCULATION>;
    setHaveDirtyFields: (isDirty: boolean) => void;
};

export function DynamicMarginCalculationInline({
    studyUuid,
    parametersBackend,
    setHaveDirtyFields,
}: Readonly<DynamicMarginCalculationInlineProps>) {
    const { providers, params, updateParameters, resetParameters } = parametersBackend;

    const dynamicMarginCalculationMethods = useDynamicMarginCalculationParametersForm({
        providers,
        params,
        name: null,
        description: null,
    });

    const { snackError } = useSnackMessage();

    const { formMethods } = dynamicMarginCalculationMethods;
    const { reset, getValues, formState, handleSubmit } = formMethods;

    const useTabsReturn = useTabs({
        defaultTab: Object.values(TabValues)[0],
        tabEnum: TabValues,
        errors: formState.errors,
    });

    const onSubmit = useCallback(
        (formData: FieldValues) => {
            // update params after convert form representation to dto representation
            updateParameters(toParamsInfos(formData));
        },
        [updateParameters]
    );

    const handleLoadParameter = useCallback(
        (newParams: TreeViewFinderNodeProps[]) => {
            if (newParams?.length) {
                const parametersUuid = newParams[0].id;
                fetchDynamicMarginCalculationParameters(parametersUuid)
                    .then((_params) => {
                        reset(toFormValues(_params), {
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

    useEffect(() => {
        setHaveDirtyFields(formState.isDirty);
    }, [formState, setHaveDirtyFields]);

    return (
        <CustomFormProvider validationSchema={dynamicMarginCalculationMethods.formSchema} {...formMethods}>
            <ParameterLayout
                title="DynamicMarginCalculation"
                isLoading={!dynamicMarginCalculationMethods.paramsLoaded}
                parameterType={ElementType.DYNAMIC_MARGIN_CALCULATION_PARAMETERS}
                createParameter={{
                    studyUuid,
                    parameterFormatter: toParamsInfos,
                    getParameterValues: getValues,
                }}
                selectParameterHandler={handleLoadParameter}
                resetHandler={resetParameters}
                validateHandler={handleSubmit(onSubmit, useTabsReturn.onError)}
            >
                <DynamicMarginCalculationForm
                    dynamicMarginCalculationMethods={dynamicMarginCalculationMethods}
                    useTabsReturn={useTabsReturn}
                />
            </ParameterLayout>
        </CustomFormProvider>
    );
}
