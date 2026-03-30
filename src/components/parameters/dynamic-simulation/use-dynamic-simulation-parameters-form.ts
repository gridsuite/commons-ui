/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { useEffect, useMemo } from 'react';
import { FieldValues, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { getNameElementEditorEmptyFormData, getNameElementEditorSchema } from '../common/name-element-editor';
import { UseComputationParametersFormReturn } from '../common/utils';
import { DynamicSimulationParametersInfos, SolverInfos } from '../../../utils/types/dynamic-simulation.type';
import { TabValues } from './dynamic-simulation.type';
import yup from '../../../utils/yupConfig';
import { PROVIDER } from '../common/constants';
import { timeDelayEmptyFormData, timeDelayFormSchema } from './time-delay/time-delay-parameters-utils';
import { solverEmptyFormData, solverFormSchema } from './solver/solver-parameters-utils';
import { mappingEmptyFormData, mappingFormSchema } from './mapping/mapping-parameters-utils';
import { networkEmptyFormData, networkFormSchema } from './network/network-parameters-utils';
import { curveEmptyFormData, curveFormSchema } from './curve/curve-parameters-utils';
import { ID } from '../../../utils';
import { TimeDelay } from './time-delay';
import { Solver } from './solver';
import { MAPPING } from './mapping';
import { Curve } from './curve/curve-parameters-constants';
import { useTabs } from '../common/hook/use-tabs';

const formSchema = yup.object().shape({
    [PROVIDER]: yup.string().required(),
    [TabValues.TAB_TIME_DELAY]: timeDelayFormSchema,
    [TabValues.TAB_SOLVER]: solverFormSchema,
    [TabValues.TAB_MAPPING]: mappingFormSchema,
    [TabValues.TAB_NETWORK]: networkFormSchema,
    [TabValues.TAB_CURVE]: curveFormSchema,
});

const emptyFormData = {
    [PROVIDER]: '',
    [TabValues.TAB_TIME_DELAY]: timeDelayEmptyFormData,
    [TabValues.TAB_SOLVER]: solverEmptyFormData,
    [TabValues.TAB_MAPPING]: mappingEmptyFormData,
    [TabValues.TAB_NETWORK]: networkEmptyFormData,
    [TabValues.TAB_CURVE]: curveEmptyFormData,
};

export const toFormValues = (_params: DynamicSimulationParametersInfos): FieldValues => ({
    [ID]: _params.id, // not show in form
    [PROVIDER]: _params.provider,
    [TabValues.TAB_TIME_DELAY]: {
        [TimeDelay.START_TIME]: _params.startTime,
        [TimeDelay.STOP_TIME]: _params.stopTime,
    },
    [TabValues.TAB_SOLVER]: {
        [Solver.SOLVER]: _params.solver,
        [Solver.SOLVERS]: _params.solvers,
    },
    [TabValues.TAB_MAPPING]: {
        [MAPPING]: _params.mapping,
    },
    [TabValues.TAB_NETWORK]: {
        ..._params.network,
    },
    [TabValues.TAB_CURVE]: {
        [Curve.CURVES]: _params.curves,
    },
});

export const toParamsInfos = (
    _formData: FieldValues,
    defaultParams: DynamicSimulationParametersInfos | null
): DynamicSimulationParametersInfos => ({
    provider: _formData[PROVIDER],
    startTime: _formData[TabValues.TAB_TIME_DELAY][TimeDelay.START_TIME],
    stopTime: _formData[TabValues.TAB_TIME_DELAY][TimeDelay.STOP_TIME],
    solver: _formData[TabValues.TAB_SOLVER][Solver.SOLVER],
    // merge only the current selected solver, others are ignored
    solvers: defaultParams?.solvers?.reduce(
        (arr, curr, index) => [
            ...arr,
            _formData[TabValues.TAB_SOLVER][Solver.SOLVER] ===
            _formData[TabValues.TAB_SOLVER][Solver.SOLVERS][index].type
                ? _formData[TabValues.TAB_SOLVER][Solver.SOLVERS][index]
                : curr,
        ],
        [] as SolverInfos[]
    ),
    mapping: _formData[TabValues.TAB_MAPPING][MAPPING],
    network: _formData[TabValues.TAB_NETWORK],
    curves: _formData[TabValues.TAB_CURVE][Curve.CURVES],
});

export type UseDynamicSimulationParametersFormReturn = UseComputationParametersFormReturn<TabValues>;
type UseDynamicSimulationParametersFormProps = {
    providers: Record<string, string>;
    params: DynamicSimulationParametersInfos | null;
    // default values fields managed in grid-explore via directory server
    name: string | null;
    description: string | null;
};
export function useDynamicSimulationParametersForm({
    providers,
    params,
    name: initialName,
    description: initialDescription,
}: Readonly<UseDynamicSimulationParametersFormProps>): UseDynamicSimulationParametersFormReturn {
    const paramsLoaded = useMemo(() => !!params, [params]);

    const formattedProviders = useMemo(
        () =>
            Object.entries(providers).map(([key, value]) => ({
                id: key,
                label: value,
            })),
        [providers]
    );

    const returnFormSchema = useMemo(() => {
        return initialName === null ? formSchema : formSchema.concat(getNameElementEditorSchema(initialName));
    }, [initialName]);

    const newEmptyFormData: any = useMemo(() => {
        return {
            ...(initialName === null ? {} : getNameElementEditorEmptyFormData(initialName, initialDescription)),
            ...emptyFormData,
        };
    }, [initialName, initialDescription]);

    const returnFormMethods = useForm({
        defaultValues: newEmptyFormData,
        resolver: yupResolver(returnFormSchema),
    });

    const { reset } = returnFormMethods;

    useEffect(() => {
        if (params) {
            reset(toFormValues(params));
        }
    }, [params, paramsLoaded, reset]);

    /* tab-related handling */
    const { selectedTab, tabsWithError, onTabChange, onError } = useTabs({
        defaultTab: TabValues.TAB_TIME_DELAY,
        tabEnum: TabValues,
    });

    return {
        formMethods: returnFormMethods,
        formSchema: returnFormSchema,
        paramsLoaded,
        formattedProviders,
        /* tab-related handling */
        selectedTab,
        tabsWithError,
        onTabChange,
        onError,
    };
}
