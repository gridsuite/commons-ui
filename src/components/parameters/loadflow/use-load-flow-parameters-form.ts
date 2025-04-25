/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import { FieldErrors, useForm, UseFormReturn } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Dispatch, SetStateAction, SyntheticEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { ObjectSchema } from 'yup';
import { UUID } from 'crypto';
import {
    getCommonLoadFlowParametersFormSchema,
    getDefaultSpecificParamsValues,
    getDialogLoadFlowParametersFormSchema,
    getSpecificLoadFlowParametersFormSchema,
    mapLimitReductions,
    setLimitReductions,
    setSpecificParameters,
    TabValues,
} from './load-flow-parameters-utils';
import { LoadFlowParametersInfos, SpecificParametersPerProvider } from '../../../utils/types/loadflow.type';
import {
    ParameterType,
    SpecificParameterInfos,
    UseParametersBackendReturnProps,
} from '../../../utils/types/parameters.type';
import { ComputingType, PROVIDER } from '../common';
import {
    getLimitReductionsFormSchema,
    ILimitReductionsByVoltageLevel,
    LIMIT_REDUCTIONS_FORM,
} from '../common/limitreductions/columns-definitions';
import {
    COMMON_PARAMETERS,
    PARAM_LIMIT_REDUCTION,
    PARAM_PROVIDER_OPENLOADFLOW,
    SPECIFIC_PARAMETERS,
} from './constants';
import yup from '../../../utils/yupConfig';
import { toFormValuesLimitReductions } from '../common/limitreductions/limit-reductions-form-util';
import { DESCRIPTION_INPUT, NAME } from '../../inputs';
import { updateParameter } from '../../../services';
import { ElementType } from '../../../utils';

export interface UseLoadFlowParametersFormReturn {
    formMethods: UseFormReturn;
    formSchema: ObjectSchema<any>;
    selectedTab: TabValues;
    handleTabChange: (event: SyntheticEvent, newValue: TabValues) => void;
    tabIndexesWithError: TabValues[];
    formattedProviders: { id: string; label: string }[];
    specificParameters: SpecificParameterInfos[];
    defaultLimitReductions: ILimitReductionsByVoltageLevel[];
    toLoadFlowFormValues: (_params: LoadFlowParametersInfos) => any;
    formatNewParams: (formData: Record<string, any>) => LoadFlowParametersInfos;
    params: LoadFlowParametersInfos | null;
    currentProvider: string | undefined;
    setCurrentProvider: Dispatch<SetStateAction<string | undefined>>;
    paramsLoaded: boolean;
    onValidationError: (errors: FieldErrors) => void;
    onSaveInline: (formData: Record<string, any>) => void;
    onSaveDialog: (formData: Record<string, any>) => void;
}

// TODO EXPORTER formatNewParams
// pour la version inline du formulaire
export const useLoadFlowParametersForm = (
    parametersBackend: UseParametersBackendReturnProps<ComputingType.LOAD_FLOW>,
    enableDeveloperMode: boolean,
    parametersUuid: UUID | null,
    name: string | null,
    description: string | null
): UseLoadFlowParametersFormReturn => {
    const [providers, provider, , , params, updateParameters, , specificParamsDescriptions, defaultLimitReductions] =
        parametersBackend;
    const [currentProvider, setCurrentProvider] = useState(params?.provider);
    const [selectedTab, setSelectedTab] = useState(TabValues.GENERAL);
    const [tabIndexesWithError, setTabIndexesWithError] = useState<TabValues[]>([]);

    const handleTabChange = useCallback((event: SyntheticEvent, newValue: TabValues) => {
        setSelectedTab(newValue);
    }, []);

    const specificParametersValues = useMemo(() => {
        const specificParams = currentProvider ? specificParamsDescriptions?.[currentProvider] : undefined;
        return getDefaultSpecificParamsValues(specificParams);
    }, [currentProvider, specificParamsDescriptions]);

    const specificParameters = useMemo<SpecificParameterInfos[]>(() => {
        const specificParams = currentProvider ? specificParamsDescriptions?.[currentProvider] : undefined;
        return specificParams?.map((param: SpecificParameterInfos) => ({
            name: param.name,
            type: param.type,
            label: param.label,
            description: param.description,
            possibleValues: param.possibleValues,
            defaultValue: param.defaultValue,
        }));
    }, [currentProvider, specificParamsDescriptions]);

    const formSchema = useMemo(() => {
        return yup.object({
            ...getDialogLoadFlowParametersFormSchema(name, description),
            [PROVIDER]: yup.string().required(),
            [PARAM_LIMIT_REDUCTION]: yup.number().nullable(),
            ...getCommonLoadFlowParametersFormSchema().fields,
            ...getLimitReductionsFormSchema(
                params?.limitReductions ? params.limitReductions[0]?.temporaryLimitReductions.length : 0
            ).fields,
            ...getSpecificLoadFlowParametersFormSchema(specificParameters).fields,
        });
    }, [description, name, params?.limitReductions, specificParameters]);

    const formMethods = useForm({
        defaultValues: {
            [NAME]: name,
            [DESCRIPTION_INPUT]: description,
            [PROVIDER]: provider,
            [PARAM_LIMIT_REDUCTION]: null,
            [COMMON_PARAMETERS]: {
                ...params?.commonParameters,
            },
            [SPECIFIC_PARAMETERS]: {
                ...specificParametersValues,
            },
            [LIMIT_REDUCTIONS_FORM]: [],
        },
        resolver: yupResolver(formSchema as unknown as yup.ObjectSchema<any>),
    });

    const { watch, reset } = formMethods;
    const watchProvider = watch('provider');

    const toLimitReductions = useCallback(
        (formLimits: Record<string, any>[]) => {
            if (formLimits?.length === 0) {
                return [];
            }
            if (watchProvider === PARAM_PROVIDER_OPENLOADFLOW) {
                if (!params?.limitReductions) {
                    return defaultLimitReductions.map((vlLimits, indexVl) =>
                        mapLimitReductions(vlLimits, formLimits, indexVl)
                    );
                }
                return params?.limitReductions.map((vlLimits, indexVl) =>
                    mapLimitReductions(vlLimits, formLimits, indexVl)
                );
            }
            return [];
        },
        [defaultLimitReductions, params?.limitReductions, watchProvider]
    );

    const getSpecificParametersPerProvider = (
        formData: Record<string, any>,
        _specificParametersValues: SpecificParametersPerProvider
    ) => {
        return Object.keys(formData[SPECIFIC_PARAMETERS]).reduce(
            (acc: Record<string, any>, key: string) => {
                if (_specificParametersValues[key].toString() !== formData[SPECIFIC_PARAMETERS][key].toString()) {
                    acc[key] = formData[SPECIFIC_PARAMETERS][key].toString();
                }
                return acc;
            },
            {} as Record<string, any>
        );
    };

    const formatNewParams = useCallback(
        (formData: Record<string, any>): LoadFlowParametersInfos => {
            return {
                provider: formData[PROVIDER],
                limitReduction: formData[PARAM_LIMIT_REDUCTION],
                commonParameters: {
                    ...formData[COMMON_PARAMETERS],
                },
                specificParametersPerProvider: {
                    [formData.provider]: getSpecificParametersPerProvider(formData, specificParametersValues),
                },
                limitReductions: toLimitReductions(formData[LIMIT_REDUCTIONS_FORM]),
            };
        },
        [specificParametersValues, toLimitReductions]
    );

    // TODO REPORT CHANGES MADE TO hasOwnProperty USAGE
    const toLoadFlowFormValues = useCallback(
        (_params: LoadFlowParametersInfos) => {
            const specificParams = _params.provider ? specificParamsDescriptions?.[_params.provider] : undefined;
            const specificParamsPerProvider = _params.specificParametersPerProvider[_params.provider];

            const formatted = specificParams?.reduce((acc: Record<string, unknown>, param: SpecificParameterInfos) => {
                if (
                    specificParamsPerProvider &&
                    Object.prototype.hasOwnProperty.call(specificParamsPerProvider, param.name)
                ) {
                    if (param.type === ParameterType.BOOLEAN) {
                        acc[param.name] = specificParamsPerProvider[param.name] === 'true';
                    } else if (param.type === ParameterType.STRING_LIST) {
                        acc[param.name] =
                            specificParamsPerProvider[param.name] !== ''
                                ? specificParamsPerProvider[param.name].split(',')
                                : [];
                    } else {
                        acc[param.name] = specificParamsPerProvider[param.name];
                    }
                } else {
                    acc[param.name] = getDefaultSpecificParamsValues([param])[param.name];
                }
                return acc;
            }, {});

            return {
                [PROVIDER]: _params.provider,
                [PARAM_LIMIT_REDUCTION]: _params.limitReduction,
                [COMMON_PARAMETERS]: {
                    ..._params.commonParameters,
                },
                [SPECIFIC_PARAMETERS]: {
                    ...formatted,
                },
                ...toFormValuesLimitReductions(_params.limitReductions),
            };
        },
        [specificParamsDescriptions]
    );

    const paramsLoaded = useMemo(() => !!params && !!currentProvider, [currentProvider, params]);

    // TODO: remove this when DynaFlow will be available not only in developer mode
    const formattedProviders = useMemo(() => {
        return Object.entries(providers)
            .filter(([key]) => !key.includes('DynaFlow') || enableDeveloperMode)
            .map(([key, value]) => ({
                id: key,
                label: value,
            }));
    }, [providers, enableDeveloperMode]);

    const onValidationError = useCallback(
        (errors: FieldErrors) => {
            const tabsInError = [];
            if (errors?.[LIMIT_REDUCTIONS_FORM] && TabValues.LIMIT_REDUCTIONS !== selectedTab) {
                tabsInError.push(TabValues.LIMIT_REDUCTIONS);
            }
            if (
                (errors?.[SPECIFIC_PARAMETERS] || errors?.[COMMON_PARAMETERS] || errors?.[PROVIDER]) &&
                TabValues.GENERAL !== selectedTab
            ) {
                tabsInError.push(TabValues.GENERAL);
            }
            setTabIndexesWithError(tabsInError);
        },
        [selectedTab]
    );

    const onSaveInline = useCallback(
        (formData: Record<string, any>) => {
            setTabIndexesWithError([]);
            updateParameters(formatNewParams(formData));
        },
        [updateParameters, formatNewParams]
    );

    const onSaveDialog = useCallback(
        (formData: Record<string, any>) => {
            if (parametersUuid) {
                setTabIndexesWithError([]);
                updateParameter(
                    parametersUuid,
                    formatNewParams(formData),
                    formData[NAME],
                    ElementType.LOADFLOW_PARAMETERS,
                    formData[DESCRIPTION_INPUT] ?? ''
                );
            }
        },
        [parametersUuid, formatNewParams]
    );

    useEffect(() => {
        if (!params) {
            return;
        }
        reset(toLoadFlowFormValues(params));
    }, [paramsLoaded, params, reset, specificParamsDescriptions, toLoadFlowFormValues]);

    useEffect(() => {
        if (watchProvider !== currentProvider) {
            setCurrentProvider(watchProvider);
            setSpecificParameters(watchProvider, specificParamsDescriptions, formMethods);
            setLimitReductions(watchProvider, defaultLimitReductions, formMethods);
        }
    }, [currentProvider, defaultLimitReductions, formMethods, specificParamsDescriptions, watchProvider]);

    return {
        formMethods,
        formSchema,
        selectedTab,
        handleTabChange,
        tabIndexesWithError,
        formattedProviders,
        specificParameters,
        defaultLimitReductions,
        toLoadFlowFormValues,
        formatNewParams,
        params,
        currentProvider,
        setCurrentProvider,
        paramsLoaded,
        onValidationError,
        onSaveInline,
        onSaveDialog,
    };
};
