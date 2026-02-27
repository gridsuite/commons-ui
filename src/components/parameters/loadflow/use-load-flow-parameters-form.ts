/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import { FieldErrors, useForm, UseFormReturn } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { SyntheticEvent, useCallback, useEffect, useEffectEvent, useMemo, useRef, useState } from 'react';
import { ObjectSchema } from 'yup';
import type { UUID } from 'node:crypto';
import {
    getCommonLoadFlowParametersFormSchema,
    mapLimitReductions,
    setLimitReductions,
    TabValues,
} from './load-flow-parameters-utils';
import { LoadFlowParametersInfos } from './load-flow-parameters-type';
import {
    COMMON_PARAMETERS,
    ComputingType,
    PROVIDER,
    SPECIFIC_PARAMETERS,
    toFormValuesLimitReductions,
    VERSION_PARAMETER,
} from '../common';
import {
    getLimitReductionsFormSchema,
    ILimitReductionsByVoltageLevel,
    LIMIT_REDUCTIONS_FORM,
} from '../common/limitreductions/columns-definitions';
import { PARAM_LIMIT_REDUCTION, PARAM_PROVIDER_OPENLOADFLOW } from './constants';
import yup from '../../../utils/yupConfig';
import { DESCRIPTION, NAME } from '../../inputs';
import { updateParameter } from '../../../services';
import { ElementType, SpecificParameterInfos, UseParametersBackendReturnProps } from '../../../utils';
import { getNameElementEditorEmptyFormData, getNameElementEditorSchema } from '../common/name-element-editor';
import { useSnackMessage } from '../../../hooks';
import {
    formatSpecificParameters,
    getDefaultSpecificParamsValues,
    getSpecificParametersFormSchema,
    getAllSpecificParametersValues,
    setSpecificParameters,
} from '../common/utils';
import { snackWithFallback } from '../../../utils/error';

export interface UseLoadFlowParametersFormReturn {
    formMethods: UseFormReturn;
    formSchema: ObjectSchema<any>;
    selectedTab: TabValues;
    handleTabChange: (event: SyntheticEvent, newValue: TabValues) => void;
    tabIndexesWithError: TabValues[];
    formattedProviders: { id: string; label: string }[];
    specificParametersDescriptionForProvider: SpecificParameterInfos[];
    defaultLimitReductions: ILimitReductionsByVoltageLevel[];
    toLoadFlowFormValues: (_params: LoadFlowParametersInfos) => any;
    formatNewParams: (formData: Record<string, any>) => LoadFlowParametersInfos;
    params: LoadFlowParametersInfos | null;
    watchProvider: string | undefined;
    paramsLoaded: boolean;
    onValidationError: (errors: FieldErrors) => void;
    onSaveInline: (formData: Record<string, any>) => void;
    onSaveDialog: (formData: Record<string, any>) => void;
}

export const useLoadFlowParametersForm = (
    parametersBackend: UseParametersBackendReturnProps<ComputingType.LOAD_FLOW>,
    isDeveloperMode: boolean,
    parametersUuid: UUID | null,
    name: string | null,
    description: string | null
): UseLoadFlowParametersFormReturn => {
    const { providers, params, updateParameters, specificParamsDescription, defaultLimitReductions } =
        parametersBackend;

    const [selectedTab, setSelectedTab] = useState(TabValues.GENERAL);
    const [limitReductionNumber, setLimitReductionNumber] = useState(0);
    const [tabIndexesWithError, setTabIndexesWithError] = useState<TabValues[]>([]);
    const [specificParametersDescriptionForProvider, setSpecificParametersDescriptionForProvider] = useState<
        SpecificParameterInfos[]
    >(() => {
        return params?.provider && specificParamsDescription ? specificParamsDescription[params.provider] : [];
    });
    const { snackError } = useSnackMessage();
    const previousWatchProviderRef = useRef<string | undefined>(undefined);

    const handleTabChange = useCallback((event: SyntheticEvent, newValue: TabValues) => {
        setSelectedTab(newValue);
    }, []);

    const specificParametersDefaultValues = useMemo(() => {
        return getDefaultSpecificParamsValues(specificParametersDescriptionForProvider);
    }, [specificParametersDescriptionForProvider]);

    const formSchema = useMemo(() => {
        return yup
            .object({
                [PROVIDER]: yup.string().required(),
                [PARAM_LIMIT_REDUCTION]: yup.number().nullable(),
                ...getCommonLoadFlowParametersFormSchema().fields,
                ...getLimitReductionsFormSchema(limitReductionNumber).fields,
                ...getSpecificParametersFormSchema(specificParametersDescriptionForProvider).fields,
            })
            .concat(getNameElementEditorSchema(name));
    }, [name, limitReductionNumber, specificParametersDescriptionForProvider]);

    const formMethods = useForm({
        defaultValues: {
            ...getNameElementEditorEmptyFormData(name, description),
            [PROVIDER]: params?.provider,
            [PARAM_LIMIT_REDUCTION]: null,
            [COMMON_PARAMETERS]: {
                ...params?.commonParameters,
            },
            [SPECIFIC_PARAMETERS]: {
                ...specificParametersDefaultValues,
            },
            [LIMIT_REDUCTIONS_FORM]: [],
        },
        resolver: yupResolver(formSchema as unknown as yup.ObjectSchema<any>),
    });

    const { watch, reset } = formMethods;
    const watchProvider = watch(PROVIDER);

    useEffect(() => {
        const provider = watchProvider ?? params?.provider;
        if (!provider || !specificParamsDescription) {
            setSpecificParametersDescriptionForProvider([]);
            return;
        }
        setSpecificParametersDescriptionForProvider(specificParamsDescription[provider] ?? []);
    }, [watchProvider, params?.provider, specificParamsDescription]);

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

    const formatNewParams = useCallback(
        (formData: Record<string, any>): LoadFlowParametersInfos => {
            return {
                provider: formData[PROVIDER],
                limitReduction: formData[PARAM_LIMIT_REDUCTION],
                commonParameters: {
                    [VERSION_PARAMETER]: formData[COMMON_PARAMETERS][VERSION_PARAMETER], // PowSyBl requires that "version" appears first
                    ...formData[COMMON_PARAMETERS],
                },
                specificParametersPerProvider: specificParametersDefaultValues
                    ? {
                          [formData.provider]: getAllSpecificParametersValues(
                              formData,
                              specificParametersDefaultValues
                          ),
                      }
                    : {},

                limitReductions: toLimitReductions(formData[LIMIT_REDUCTIONS_FORM]),
            };
        },
        [specificParametersDefaultValues, toLimitReductions]
    );

    const toLoadFlowFormValues = useCallback(
        (_params: LoadFlowParametersInfos) => {
            const specificParamsListForCurrentProvider = _params.specificParametersPerProvider[_params.provider];
            const specificParametersForLoadedProvider = specificParamsDescription?.[_params.provider] ?? [];

            return {
                [PROVIDER]: _params.provider,
                [PARAM_LIMIT_REDUCTION]: _params.limitReduction,
                [COMMON_PARAMETERS]: {
                    ..._params.commonParameters,
                },
                [SPECIFIC_PARAMETERS]: {
                    ...formatSpecificParameters(
                        specificParametersForLoadedProvider,
                        specificParamsListForCurrentProvider
                    ),
                },
                ...toFormValuesLimitReductions(_params.limitReductions),
            };
        },
        [specificParamsDescription]
    );

    const paramsLoaded = useMemo(() => !!params && !!watchProvider, [watchProvider, params]);

    // TODO: remove this when DynaFlow will be available not only in developer mode
    const formattedProviders = useMemo(() => {
        return Object.entries(providers)
            .filter(([key]) => !key.includes('DynaFlow') || isDeveloperMode)
            .map(([key, value]) => ({
                id: key,
                label: value,
            }));
    }, [providers, isDeveloperMode]);

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
                    formData[DESCRIPTION] ?? ''
                ).catch((error) => {
                    snackWithFallback(snackError, error, { headerId: 'updateLoadFlowParametersError' });
                });
            }
        },
        [parametersUuid, formatNewParams, snackError]
    );

    const resetForm = useEffectEvent((_params: LoadFlowParametersInfos) => {
        reset(toLoadFlowFormValues(_params));
    });

    useEffect(() => {
        if (!params) {
            return;
        }
        resetForm(params);
    }, [paramsLoaded, params]);

    useEffect(() => {
        if (!watchProvider || watchProvider === previousWatchProviderRef.current) {
            return;
        }

        setSpecificParameters(watchProvider, specificParamsDescription, formMethods);
        setLimitReductions(watchProvider, defaultLimitReductions, formMethods);

        // When we switch to OLF: we have to update the yup schema regarding the limit reductions.
        // (formSchema has a dep on limitReductionNumber)
        if (watchProvider === PARAM_PROVIDER_OPENLOADFLOW) {
            if (previousWatchProviderRef.current) {
                // providerX -> OLF: use default value
                setLimitReductionNumber(defaultLimitReductions?.at(0)?.temporaryLimitReductions?.length ?? 0);
            } else {
                // nothing -> OLF: use editing params value
                setLimitReductionNumber(params?.limitReductions?.at(0)?.temporaryLimitReductions?.length ?? 0);
            }
        } else {
            setLimitReductionNumber(0);
        }

        previousWatchProviderRef.current = watchProvider;
    }, [defaultLimitReductions, formMethods, params?.limitReductions, specificParamsDescription, watchProvider]);

    return {
        formMethods,
        formSchema,
        selectedTab,
        handleTabChange,
        tabIndexesWithError,
        formattedProviders,
        specificParametersDescriptionForProvider,
        defaultLimitReductions,
        toLoadFlowFormValues,
        formatNewParams,
        params,
        watchProvider,
        paramsLoaded,
        onValidationError,
        onSaveInline,
        onSaveDialog,
    };
};
