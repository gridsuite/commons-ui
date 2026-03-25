/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { FieldValues, useForm } from 'react-hook-form';
import { useEffect, useMemo } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
    DynamicSecurityAnalysisParametersFetchReturn,
    DynamicSecurityAnalysisParametersInfos,
    ID,
} from '../../../utils';
import { PROVIDER } from '../common';
import { getNameElementEditorEmptyFormData, getNameElementEditorSchema } from '../common/name-element-editor';
import { NAME } from '../../inputs';
import { CONTINGENCIES_LIST_INFOS, CONTINGENCIES_START_TIME, SCENARIO_DURATION } from './constants';
import { UseComputationParametersFormReturn, useTabs } from '../common/utils';

export enum TabValues {
    SCENARIO = 'scenario',
    CONTINGENCY = 'contingency',
}

const scenarioFormSchema = yup
    .object()
    .shape({
        [SCENARIO_DURATION]: yup.number().required(),
    })
    .required();

const contingencyFormSchema = yup.object().shape({
    [CONTINGENCIES_START_TIME]: yup.number().required(),
    [CONTINGENCIES_LIST_INFOS]: yup
        .array()
        .of(
            yup.object().shape({
                [ID]: yup.string().required(),
                [NAME]: yup.string().required(),
            })
        )
        .required(),
});

export const formSchema = yup.object().shape({
    [PROVIDER]: yup.string().required(),
    [TabValues.SCENARIO]: scenarioFormSchema,
    [TabValues.CONTINGENCY]: contingencyFormSchema,
});

const scenarioEmptyFormData = {
    [SCENARIO_DURATION]: 0,
};

const contingencyEmptyFormData = {
    [CONTINGENCIES_START_TIME]: 0,
    [CONTINGENCIES_LIST_INFOS]: [],
};

export const emptyFormData = {
    [PROVIDER]: '',
    [TabValues.SCENARIO]: { ...scenarioEmptyFormData },
    [TabValues.CONTINGENCY]: { ...contingencyEmptyFormData },
};

export const toFormValues = (_params: DynamicSecurityAnalysisParametersFetchReturn): FieldValues => ({
    [PROVIDER]: _params.provider,
    [TabValues.SCENARIO]: {
        [SCENARIO_DURATION]: _params.scenarioDuration,
    },
    [TabValues.CONTINGENCY]: {
        [CONTINGENCIES_START_TIME]: _params.contingenciesStartTime,
        [CONTINGENCIES_LIST_INFOS]: _params.contingencyListInfos,
    },
});

export const toParamsInfos = (_formData: FieldValues): DynamicSecurityAnalysisParametersFetchReturn => ({
    provider: _formData[PROVIDER],
    scenarioDuration: _formData[TabValues.SCENARIO][SCENARIO_DURATION],
    contingenciesStartTime: _formData[TabValues.CONTINGENCY][CONTINGENCIES_START_TIME],
    contingencyListInfos: _formData[TabValues.CONTINGENCY][CONTINGENCIES_LIST_INFOS],
});

export type UseDynamicSecurityAnalysisParametersFormReturn = UseComputationParametersFormReturn<TabValues>;
type UseDynamicSecurityAnalysisParametersFormProps = {
    providers: Record<string, string>;
    params: DynamicSecurityAnalysisParametersInfos | null;
    // default values fields managed in grid-explore via directory server
    name: string | null;
    description: string | null;
};

export function useDynamicSecurityAnalysisParametersForm({
    providers,
    params,
    name: initialName,
    description: initialDescription,
}: Readonly<UseDynamicSecurityAnalysisParametersFormProps>): UseDynamicSecurityAnalysisParametersFormReturn {
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
            console.log('xxx Resetting form with params:', params);
            reset(toFormValues(params));
        }
    }, [params, paramsLoaded, reset]);

    /* tab-related handling */
    const { selectedTab, tabsWithError, onTabChange, onError } = useTabs({
        defaultTab: TabValues.SCENARIO,
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
