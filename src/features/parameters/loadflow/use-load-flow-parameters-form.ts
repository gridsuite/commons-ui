/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import { FieldErrors, useForm, UseFormReturn } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { SyntheticEvent, useCallback, useEffect, useEffectEvent, useMemo, useRef, useState } from 'react';
import type { UUID } from 'node:crypto';
import * as yup from 'yup';
import {
    getAdvancedLoadFlowParametersFormSchema,
    getCommonLoadFlowParametersFormSchema,
    mapLimitReductions,
    setLimitReductions,
    splitCommonParameters,
    TabValues,
} from './load-flow-parameters-utils';
import { LoadFlowParametersInfos } from './load-flow-parameters-type';
import {
    ADVANCED_PARAMETERS,
    COMMON_PARAMETERS,
    PROVIDER,
    SPECIFIC_PARAMETERS,
    toFormValuesLimitReductions,
    useTabs,
    VERSION_PARAMETER,
} from '../common';
import {
    getLimitReductionsFormSchema,
    ILimitReductionsByVoltageLevel,
    LIMIT_REDUCTIONS_FORM,
} from '../common/limitreductions/columns-definitions';
import { PARAM_LIMIT_REDUCTION, PARAM_PROVIDER_OPENLOADFLOW } from './constants';
import { DESCRIPTION, NAME } from '../../../components/ui';
import { updateParameter } from '../../../services';
import { ComputingType, ElementType, SpecificParameterInfos, UseParametersBackendReturnProps } from '../../../utils';
import { getNameElementEditorEmptyFormData, getNameElementEditorSchema } from '../common/name-element-editor';
import { useSnackMessage } from '../../../hooks';
import {
    formatSpecificParameters,
    getAllSpecificParametersValues,
    getDefaultSpecificParamsValues,
    getSpecificParametersFormSchema,
    setSpecificParameters,
} from '../common/utils';
import { snackWithFallback } from '../../../utils/error';

export interface UseLoadFlowParametersFormReturn {
    formMethods: UseFormReturn;
    formSchema: yup.ObjectSchema<any>;
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
    const [limitReductionNumber, setLimitReductionNumber] = useState(0);
    const [specificParametersDescriptionForProvider, setSpecificParametersDescriptionForProvider] = useState<
        SpecificParameterInfos[]
    >(() => {
        return params?.provider && specificParamsDescription ? specificParamsDescription[params.provider] : [];
    });
    const { snackError } = useSnackMessage();

    const previousWatchProviderRef = useRef<string | undefined>(undefined);

    const specificParametersDefaultValues = useMemo(() => {
        return getDefaultSpecificParamsValues(specificParametersDescriptionForProvider);
    }, [specificParametersDescriptionForProvider]);

    const formSchema = useMemo(() => {
        return yup
            .object({
                [PROVIDER]: yup.string().required(),
                [PARAM_LIMIT_REDUCTION]: yup.number().nullable(),
                ...getCommonLoadFlowParametersFormSchema().fields,
                ...getAdvancedLoadFlowParametersFormSchema().fields,
                ...getLimitReductionsFormSchema(limitReductionNumber).fields,
                ...getSpecificParametersFormSchema(specificParametersDescriptionForProvider).fields,
            })
            .concat(getNameElementEditorSchema(name));
    }, [name, limitReductionNumber, specificParametersDescriptionForProvider]);

    const { advancedParameters, commonParameters } = useMemo(
        () => splitCommonParameters(params?.commonParameters),
        [params?.commonParameters]
    );

    const formMethods = useForm({
        defaultValues: {
            ...getNameElementEditorEmptyFormData(name, description),
            [PROVIDER]: params?.provider,
            [PARAM_LIMIT_REDUCTION]: null,
            [COMMON_PARAMETERS]: {
                ...commonParameters,
            },
            [ADVANCED_PARAMETERS]: {
                ...advancedParameters,
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
                    ...formData[ADVANCED_PARAMETERS],
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
            const { advancedParameters: advancedParams, commonParameters: commonParams } = splitCommonParameters(
                _params.commonParameters
            );

            return {
                [PROVIDER]: _params.provider,
                [PARAM_LIMIT_REDUCTION]: _params.limitReduction,
                [COMMON_PARAMETERS]: {
                    ...commonParams,
                },
                [ADVANCED_PARAMETERS]: {
                    ...advancedParams,
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

    const {
        selectedTab,
        onTabChange: handleTabChange,
        tabsWithError: tabIndexesWithError,
        onError: onValidationError,
    } = useTabs({
        defaultTab: TabValues.GENERAL,
        tabEnum: TabValues,
        errors: formMethods.formState.errors,
        tabFields: {
            [TabValues.GENERAL]: [COMMON_PARAMETERS],
            [TabValues.PROVIDER_SPECIFIC]: [SPECIFIC_PARAMETERS],
            [TabValues.ADVANCED]: [ADVANCED_PARAMETERS],
            [TabValues.LIMIT_REDUCTIONS]: [LIMIT_REDUCTIONS_FORM],
        },
    });

    const onSaveInline = useCallback(
        (formData: Record<string, any>) => {
            updateParameters(formatNewParams(formData));
        },
        [updateParameters, formatNewParams]
    );

    const onSaveDialog = useCallback(
        (formData: Record<string, any>) => {
            if (parametersUuid) {
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
        // Update ref before reset() so the watchProvider effect treats this as already handled
        // and skips applying defaults (which would overwrite the values we're about to reset to).
        previousWatchProviderRef.current = _params.provider;
        // Update description in the same batch as reset() so the old provider's fields don't
        // get one extra render with undefined values which would dirty the form.
        setSpecificParametersDescriptionForProvider(specificParamsDescription?.[_params.provider] ?? []);
        if (_params.provider === PARAM_PROVIDER_OPENLOADFLOW) {
            setLimitReductionNumber(_params.limitReductions?.at(0)?.temporaryLimitReductions?.length ?? 0);
        } else {
            setLimitReductionNumber(0);
        }
        reset(toLoadFlowFormValues(_params));
    });

    useEffect(() => {
        if (!params) {
            return;
        }
        resetForm(params);
    }, [paramsLoaded, params, specificParamsDescription]);

    useEffect(() => {
        if (!watchProvider || watchProvider === previousWatchProviderRef.current) {
            return;
        }

        // Only user-driven switches reach here: resetForm() pre-sets the ref so resets
        // triggered by loading params are caught by the early-return above.
        setSpecificParameters(watchProvider, specificParamsDescription, formMethods);
        setLimitReductions(watchProvider, defaultLimitReductions, formMethods);

        // When we switch to OLF: we have to update the yup schema regarding the limit reductions.
        // (formSchema has a dep on limitReductionNumber)
        if (watchProvider === PARAM_PROVIDER_OPENLOADFLOW) {
            // providerX -> OLF: use default value
            setLimitReductionNumber(defaultLimitReductions?.at(0)?.temporaryLimitReductions?.length ?? 0);
        } else {
            setLimitReductionNumber(0);
        }

        previousWatchProviderRef.current = watchProvider;
    }, [defaultLimitReductions, formMethods, specificParamsDescription, watchProvider]);

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
