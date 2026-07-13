/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import type { UUID } from 'node:crypto';
import { useCallback, useEffect } from 'react';
import { FieldValues } from 'react-hook-form';
import {
    ComputingType,
    ElementType,
    mapDynamicSimulationParameters,
    snackWithFallback,
    VoltageLevelInfos,
} from '../../../utils';
import { UseParametersBackendReturnProps } from '../../../utils/types/parameters.type';
import { ParameterLayout } from '../common';
import { CustomFormProvider } from '../../../components/ui';
import { useTabs } from '../common/hook/use-tabs';
import { useSnackMessage } from '../../../hooks';
import { TreeViewFinderNodeProps } from '../../../components/ui/treeViewFinder';
import {
    toFormValues,
    toParamsEnriched,
    useDynamicSimulationParametersForm,
} from './use-dynamic-simulation-parameters-form';
import { TabValues } from './dynamic-simulation.type';
import { DynamicSimulationForm } from './dynamic-simulation-parameters-form';
import { fetchDynamicSimulationParameters } from '../../../services/dynamic-simulation';
import { ExpertFilter, IdentifiableAttributes } from '../../../components/composite/filter';
import useDefaultParams from './hook/use-default-params';

type DynamicSimulationInlineProps = {
    studyUuid: UUID | null;
    parametersBackend: UseParametersBackendReturnProps<ComputingType.DYNAMIC_SIMULATION>;
    setHaveDirtyFields: (isDirty: boolean) => void;
    // fetchers for curve parameters
    voltageLevelsFetcher: () => Promise<VoltageLevelInfos[]>;
    countriesFetcher: () => Promise<string[]>;
    evaluateFilterFetcher: (filter: ExpertFilter) => Promise<IdentifiableAttributes[]>;
};

export function DynamicSimulationInline({
    studyUuid,
    parametersBackend,
    setHaveDirtyFields,
    voltageLevelsFetcher,
    countriesFetcher,
    evaluateFilterFetcher,
}: Readonly<DynamicSimulationInlineProps>) {
    const { providers, params, updateParameters, resetParameters } = parametersBackend;
    const dynamicSimulationMethods = useDynamicSimulationParametersForm({
        providers,
        params,
        name: null,
        description: null,
    });
    const { snackError } = useSnackMessage();

    // since RHF does not support API like getDefaultValues =>
    // manually manage default params (in dto format) to use while merging with the form
    const { getDefaultParams, setDefaultParams } = useDefaultParams(params);

    const { formMethods } = dynamicSimulationMethods;
    const { reset, getValues, formState, handleSubmit } = formMethods;

    const useTabsReturn = useTabs({
        defaultTab: TabValues.TAB_TIME_DELAY,
        tabEnum: TabValues,
        errors: formState.errors,
    });

    const onSubmit = useCallback(
        (formData: FieldValues) => {
            // update params after convert form representation to dto representation
            updateParameters(toParamsEnriched(formData, getDefaultParams()));
        },
        [updateParameters, getDefaultParams]
    );

    const handleLoadParameter = useCallback(
        (newParams: TreeViewFinderNodeProps[]) => {
            if (newParams?.length) {
                const parametersUuid = newParams[0].id;
                fetchDynamicSimulationParameters(parametersUuid)
                    .then((_params) => {
                        reset(toFormValues(_params), {
                            keepDefaultValues: true,
                        });
                        setDefaultParams(_params);
                    })
                    .catch((error: Error) => {
                        snackWithFallback(snackError, error, { headerId: 'paramsRetrievingError' });
                    });
            }
        },
        [reset, setDefaultParams, snackError]
    );

    useEffect(() => {
        setHaveDirtyFields(formState.isDirty);
    }, [formState, setHaveDirtyFields]);

    return (
        <CustomFormProvider validationSchema={dynamicSimulationMethods.formSchema} {...formMethods}>
            <ParameterLayout
                title="DynamicSimulation"
                isLoading={!dynamicSimulationMethods.paramsLoaded}
                parameterType={ElementType.DYNAMIC_SIMULATION_PARAMETERS}
                createParameter={{
                    studyUuid,
                    parameterFormatter: (formData) =>
                        mapDynamicSimulationParameters(toParamsEnriched(formData, getDefaultParams())),
                    getParameterValues: getValues,
                }}
                selectParameterHandler={handleLoadParameter}
                resetHandler={resetParameters}
                validateHandler={handleSubmit(onSubmit, useTabsReturn.onError)}
            >
                <DynamicSimulationForm
                    dynamicSimulationMethods={dynamicSimulationMethods}
                    useTabsReturn={useTabsReturn}
                    voltageLevelsFetcher={voltageLevelsFetcher}
                    countriesFetcher={countriesFetcher}
                    evaluateFilterFetcher={evaluateFilterFetcher}
                />
            </ParameterLayout>
        </CustomFormProvider>
    );
}
