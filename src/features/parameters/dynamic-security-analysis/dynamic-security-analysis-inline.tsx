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
import { ComputingType, ElementType } from '../../../utils';
import {
    toParamsInfos,
    useDynamicSecurityAnalysisParametersForm,
} from './use-dynamic-security-analysis-parameters-form';
import { ParameterLayout } from '../common';
import { CustomFormProvider } from '../../../components/ui';
import { DynamicSecurityAnalysisParametersForm } from './dynamic-security-analysis-parameters-form';
import { useTabs } from '../common/hook/use-tabs';
import { TabValues } from './dynamic-security-analysis.type';
import { TAB_FIELDS } from './dynamic-security-analysis.utils';

type DynamicSecurityAnalysisInlineProps = {
    studyUuid: UUID | null;
    parametersBackend: UseParametersBackendReturnProps<ComputingType.DYNAMIC_SECURITY_ANALYSIS>;
    setHaveDirtyFields: (isDirty: boolean) => void;
};

export function DynamicSecurityAnalysisInline({
    studyUuid,
    parametersBackend,
    setHaveDirtyFields,
}: Readonly<DynamicSecurityAnalysisInlineProps>) {
    const { providers, params, updateParameters, resetParameters } = parametersBackend;
    const dynamicSecurityAnalysisMethods = useDynamicSecurityAnalysisParametersForm({
        providers,
        params,
        name: null,
        description: null,
    });

    const { formMethods } = dynamicSecurityAnalysisMethods;
    const { getValues, formState, handleSubmit } = formMethods;

    const useTabsReturn = useTabs({
        defaultTab: TabValues.SCENARIO,
        tabEnum: TabValues,
        errors: formState.errors,
        tabFields: TAB_FIELDS,
    });

    const onSubmit = useCallback(
        (formData: FieldValues) => {
            // update params after convert form representation to dto representation
            updateParameters(toParamsInfos(formData));
        },
        [updateParameters]
    );

    useEffect(() => {
        setHaveDirtyFields(formState.isDirty);
    }, [formState, setHaveDirtyFields]);

    return (
        <CustomFormProvider validationSchema={dynamicSecurityAnalysisMethods.formSchema} {...formMethods}>
            <ParameterLayout
                title="DynamicSecurityAnalysis"
                isLoading={!dynamicSecurityAnalysisMethods.paramsLoaded}
                parameterType={ElementType.DYNAMIC_SECURITY_ANALYSIS_PARAMETERS}
                createParameter={{
                    studyUuid,
                    getParameterValues: getValues,
                    parameterFormatter: toParamsInfos,
                }}
                resetHandler={resetParameters}
                validateHandler={handleSubmit(onSubmit, useTabsReturn.onError)}
            >
                <DynamicSecurityAnalysisParametersForm
                    dynamicSecurityAnalysisMethods={dynamicSecurityAnalysisMethods}
                    useTabsReturn={useTabsReturn}
                />
            </ParameterLayout>
        </CustomFormProvider>
    );
}
