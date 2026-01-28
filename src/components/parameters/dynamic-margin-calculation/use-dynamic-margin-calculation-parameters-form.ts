/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { FieldErrors, useForm, UseFormReturn } from 'react-hook-form';
import { ObjectSchema } from 'yup';
import { SyntheticEvent, useCallback, useEffect, useEffectEvent, useMemo, useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import yup from '../../../utils/yupConfig';
import {
    DynamicMarginCalculationParametersFetchReturn,
    DynamicMarginCalculationParametersInfos,
} from '../../../services/dynamic-margin-calculation.type';
import { emptyFormData as timeDelayEmptyFormData, formSchema as timeDelayFormSchema } from './time-delay-parameters';
import {
    emptyFormData as loadsVariationsEmptyFormData,
    formSchema as loadsVariationsFormSchema,
} from './loads-variations-parameters';
import { isObjectEmpty } from '../../../utils';
import { PROVIDER } from '../common';
import { getNameElementEditorEmptyFormData, getNameElementEditorSchema } from '../common/name-element-editor';
import {
    ACCURACY,
    CALCULATION_TYPE,
    LOAD_INCREASE_START_TIME,
    LOAD_INCREASE_STOP_TIME,
    LOAD_MODELS_RULE,
    LOADS_VARIATIONS,
    MARGIN_CALCULATION_START_TIME,
    START_TIME,
    STOP_TIME,
} from './constants';
import { TabValues } from './dynamic-margin-calculation.type';

const formSchema = yup.object().shape({
    [PROVIDER]: yup.string().required(),
    [TabValues.TAB_TIME_DELAY]: timeDelayFormSchema,
    [TabValues.TAB_LOADS_VARIATIONS]: loadsVariationsFormSchema,
});

const emptyFormData = {
    [PROVIDER]: '',
    [TabValues.TAB_TIME_DELAY]: timeDelayEmptyFormData,
    [TabValues.TAB_LOADS_VARIATIONS]: loadsVariationsEmptyFormData,
};

export const toFormValues = (_params: DynamicMarginCalculationParametersFetchReturn): Record<string, any> => ({
    [PROVIDER]: _params.provider,
    [TabValues.TAB_TIME_DELAY]: {
        [START_TIME]: _params.startTime,
        [STOP_TIME]: _params.stopTime,
    },
    [TabValues.TAB_LOADS_VARIATIONS]: {
        [MARGIN_CALCULATION_START_TIME]: _params.marginCalculationStartTime,
        [LOAD_INCREASE_START_TIME]: _params.loadIncreaseStartTime,
        [LOAD_INCREASE_STOP_TIME]: _params.loadIncreaseStopTime,
        [CALCULATION_TYPE]: _params.calculationType,
        [ACCURACY]: _params.accuracy,
        [LOAD_MODELS_RULE]: _params.loadModelsRule,
        [LOADS_VARIATIONS]: _params.loadsVariationsInfos,
    },
});

export const toParamsInfos = (_formData: Record<string, any>): DynamicMarginCalculationParametersFetchReturn => ({
    provider: _formData[PROVIDER],
    startTime: _formData[TabValues.TAB_TIME_DELAY][START_TIME],
    stopTime: _formData[TabValues.TAB_TIME_DELAY][STOP_TIME],
    marginCalculationStartTime: _formData[TabValues.TAB_LOADS_VARIATIONS][MARGIN_CALCULATION_START_TIME],
    loadIncreaseStartTime: _formData[TabValues.TAB_LOADS_VARIATIONS][LOAD_INCREASE_START_TIME],
    loadIncreaseStopTime: _formData[TabValues.TAB_LOADS_VARIATIONS][LOAD_INCREASE_STOP_TIME],
    calculationType: _formData[TabValues.TAB_LOADS_VARIATIONS][CALCULATION_TYPE],
    accuracy: _formData[TabValues.TAB_LOADS_VARIATIONS][ACCURACY],
    loadModelsRule: _formData[TabValues.TAB_LOADS_VARIATIONS][LOAD_MODELS_RULE],
});

export type UseTabsReturn<TTabValue extends string> = {
    selectedTab: TTabValue;
    tabsWithError: TTabValue[];
    onTabChange: (event: SyntheticEvent, newValue: TTabValue) => void;
    onError: (errors: FieldErrors) => void;
};

type UseTabsProps<TTabValue extends string> = {
    defaultTab: TTabValue;
    tabEnum: Record<string, TTabValue>;
};

function useTabs<TTabValue extends string>({
    defaultTab,
    tabEnum,
}: Readonly<UseTabsProps<TTabValue>>): UseTabsReturn<TTabValue> {
    const [tabValue, setTabValue] = useState<TTabValue>(defaultTab);
    const [tabValuesWithError, setTabValuesWithError] = useState<TTabValue[]>([]);
    const handleTabChange = useCallback((event: SyntheticEvent<Element, Event>, newValue: TTabValue) => {
        setTabValue(newValue);
    }, []);

    const onError = useCallback(
        (errors: FieldErrors) => {
            if (!errors || isObjectEmpty(errors)) {
                return;
            }

            const tabsInError: TTabValue[] = [];
            // do not show error when being in the current tab
            Object.values(tabEnum).forEach((tab) => {
                if (errors?.[tab] && tab !== tabValue) {
                    tabsInError.push(tab);
                }
            });

            if (tabsInError.includes(tabValue)) {
                // error in current tab => do not change tab systematically but remove current tab in error list
                setTabValuesWithError(tabsInError.filter((errorTab) => errorTab !== tabValue));
            } else if (tabsInError.length > 0) {
                // switch to the first tab in the list then remove the tab in the error list
                setTabValue(tabsInError[0]);
                setTabValuesWithError(tabsInError.filter((errorTab, index, arr) => errorTab !== arr[0]));
            }
        },
        [tabValue, tabEnum]
    );

    return {
        selectedTab: tabValue,
        tabsWithError: tabValuesWithError,
        onTabChange: handleTabChange,
        onError,
    };
}

export type UseComputationParametersFormReturn<TTabValue extends string> = UseTabsReturn<TTabValue> & {
    formMethods: UseFormReturn;
    formSchema: ObjectSchema<any>;
    paramsLoaded: boolean;
    formattedProviders: { id: string; label: string }[];
};

export type UseDynamicMarginCalculationParametersFormReturn = UseComputationParametersFormReturn<TabValues> & {};
export type UseParametersFormProps = {
    providers: Record<string, string>;
    params: Record<string, any> | null;
    // default values fields managed in grid-explore via directory server
    name: string | null;
    description: string | null;
};
export type UseDynamicMarginCalculationParametersFormProps = UseParametersFormProps;

export function useDynamicMarginCalculationParametersForm({
    providers,
    params,
    name: initialName,
    description: initialDescription,
}: Readonly<UseDynamicMarginCalculationParametersFormProps>): UseDynamicMarginCalculationParametersFormReturn {
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
        return initialName !== null ? formSchema.concat(getNameElementEditorSchema(initialName)) : formSchema;
    }, [initialName]);

    const newEmptyFormData: any = useMemo(() => {
        return {
            ...(initialName !== null ? getNameElementEditorEmptyFormData(initialName, initialDescription) : {}),
            ...emptyFormData,
        };
    }, [initialName, initialDescription]);

    const returnFormMethods = useForm({
        defaultValues: newEmptyFormData,
        resolver: yupResolver(returnFormSchema),
    });

    const { reset } = returnFormMethods;

    const resetForm = useEffectEvent((_params: DynamicMarginCalculationParametersInfos) => {
        reset(toFormValues(_params));
    });

    useEffect(() => {
        if (params) {
            resetForm(params);
        }
    }, [params, paramsLoaded]);

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
