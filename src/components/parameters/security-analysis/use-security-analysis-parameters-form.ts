/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { useForm, UseFormReturn } from 'react-hook-form';
import { ObjectSchema } from 'yup';
import { Dispatch, SetStateAction, useCallback, useEffect, useMemo, useState } from 'react';
import type { UUID } from 'node:crypto';
import { yupResolver } from '@hookform/resolvers/yup';
import { ElementType, UseParametersBackendReturnProps } from '../../../utils';
import {
    ComputingType,
    CONTINGENCY_LISTS,
    CONTINGENCY_LISTS_INFOS,
    ILimitReductionsByVoltageLevel,
    IST_FORM,
    LIMIT_DURATION_FORM,
    LIMIT_REDUCTIONS_FORM,
    PARAM_SA_FLOW_PROPORTIONAL_THRESHOLD,
    PARAM_SA_HIGH_VOLTAGE_ABSOLUTE_THRESHOLD,
    PARAM_SA_HIGH_VOLTAGE_PROPORTIONAL_THRESHOLD,
    PARAM_SA_LOW_VOLTAGE_ABSOLUTE_THRESHOLD,
    PARAM_SA_LOW_VOLTAGE_PROPORTIONAL_THRESHOLD,
    PARAM_SA_PROVIDER,
    toFormValuesLimitReductions,
} from '../common';
import { getNameElementEditorEmptyFormData } from '../common/name-element-editor';
import { updateParameter } from '../../../services';
import { useSnackMessage } from '../../../hooks';
import { snackWithFallback } from '../../../utils/error';
import { ISAParameters } from './types';
import { getSAParametersFormSchema, toFormValueSaParameters } from './columns-definitions';
import { ID, NAME, DESCRIPTION, ACTIVATED } from '../common/parameter-table';
import { IContingencyListsInfos } from '../common/contingency-table/types';

export interface UseSecurityAnalysisParametersFormReturn {
    formMethods: UseFormReturn;
    formSchema: ObjectSchema<any>;
    formattedProviders: { id: string; label: string }[];
    defaultLimitReductions: ILimitReductionsByVoltageLevel[];
    toFormValueSaParameters: (_params: ISAParameters) => any;
    formatNewParams: (formData: Record<string, any>) => ISAParameters;
    params: ISAParameters | null;
    currentProvider: string | undefined;
    setCurrentProvider: Dispatch<SetStateAction<string | undefined>>;
    paramsLoaded: boolean;
    onSaveInline: (formData: Record<string, any>) => void;
    onSaveDialog: (formData: Record<string, any>) => void;
}

export const useSecurityAnalysisParametersForm = (
    parametersBackend: UseParametersBackendReturnProps<ComputingType.SECURITY_ANALYSIS>,
    parametersUuid: UUID | null,
    name: string | null,
    description: string | null
): UseSecurityAnalysisParametersFormReturn => {
    const [providers, provider, , , , params, , updateParameters, , , defaultLimitReductions] = parametersBackend;
    const [currentProvider, setCurrentProvider] = useState(params?.provider);
    const { snackError } = useSnackMessage();

    // TODO: remove this when DynaFlow is supported
    // DynaFlow is not supported at the moment for security analysis
    const formattedProviders = useMemo(() => {
        return Object.entries(providers)
            .filter(([key]) => !key.includes('DynaFlow'))
            .map(([key, value]) => ({
                id: key,
                label: value,
            }));
    }, [providers]);

    const paramsLoaded = useMemo(() => !!params && !!currentProvider, [currentProvider, params]);

    const formSchema = useMemo(() => {
        return getSAParametersFormSchema(name, params?.limitReductions);
    }, [name, params?.limitReductions]);

    const formMethods = useForm({
        defaultValues: {
            ...getNameElementEditorEmptyFormData(name, description),
            [PARAM_SA_PROVIDER]: provider,
            [CONTINGENCY_LISTS_INFOS]: [],
            [LIMIT_REDUCTIONS_FORM]: [],
            [PARAM_SA_FLOW_PROPORTIONAL_THRESHOLD]: null,
            [PARAM_SA_LOW_VOLTAGE_PROPORTIONAL_THRESHOLD]: null,
            [PARAM_SA_LOW_VOLTAGE_ABSOLUTE_THRESHOLD]: null,
            [PARAM_SA_HIGH_VOLTAGE_PROPORTIONAL_THRESHOLD]: null,
            [PARAM_SA_HIGH_VOLTAGE_ABSOLUTE_THRESHOLD]: null,
        },
        resolver: yupResolver(formSchema),
    });

    const { reset, watch } = formMethods;
    const watchProvider = watch(PARAM_SA_PROVIDER);

    const toContingencyListsInfos = useCallback(
        (formContingencyListsInfos: Record<string, any>[]): IContingencyListsInfos[] => {
            return formContingencyListsInfos.map((contingencyListsInfos) => ({
                [CONTINGENCY_LISTS]: contingencyListsInfos[CONTINGENCY_LISTS]?.map((c: Record<string, string>) => ({
                    [ID]: c[ID],
                    [NAME]: c[NAME],
                })),
                [DESCRIPTION]: contingencyListsInfos[DESCRIPTION],
                [ACTIVATED]: contingencyListsInfos[ACTIVATED],
            }));
        },
        []
    );

    const toLimitReductions = useCallback(
        (formLimits: Record<string, any>[]) => {
            if (!params?.limitReductions) {
                return [];
            }
            return params.limitReductions.map((vlLimits: ILimitReductionsByVoltageLevel, indexVl: number) => {
                const vlLNewLimits: ILimitReductionsByVoltageLevel = {
                    ...vlLimits,
                    permanentLimitReduction: formLimits[indexVl][IST_FORM],
                };
                vlLimits.temporaryLimitReductions.forEach((temporaryLimit, index) => {
                    vlLNewLimits.temporaryLimitReductions[index] = {
                        ...temporaryLimit,
                        reduction: formLimits[indexVl][LIMIT_DURATION_FORM + index],
                    };
                });
                return vlLNewLimits;
            });
        },
        [params?.limitReductions]
    );

    const formatNewParams = useCallback(
        (formData: Record<string, any>) => {
            return {
                [PARAM_SA_PROVIDER]: formData[PARAM_SA_PROVIDER],
                [PARAM_SA_FLOW_PROPORTIONAL_THRESHOLD]: formData[PARAM_SA_FLOW_PROPORTIONAL_THRESHOLD] / 100,
                [PARAM_SA_LOW_VOLTAGE_PROPORTIONAL_THRESHOLD]:
                    formData[PARAM_SA_LOW_VOLTAGE_PROPORTIONAL_THRESHOLD] / 100,
                [PARAM_SA_LOW_VOLTAGE_ABSOLUTE_THRESHOLD]: formData[PARAM_SA_LOW_VOLTAGE_ABSOLUTE_THRESHOLD],
                [PARAM_SA_HIGH_VOLTAGE_PROPORTIONAL_THRESHOLD]:
                    formData[PARAM_SA_HIGH_VOLTAGE_PROPORTIONAL_THRESHOLD] / 100,
                [PARAM_SA_HIGH_VOLTAGE_ABSOLUTE_THRESHOLD]: formData[PARAM_SA_HIGH_VOLTAGE_ABSOLUTE_THRESHOLD],
                [CONTINGENCY_LISTS_INFOS]: toContingencyListsInfos(formData[CONTINGENCY_LISTS_INFOS]),
                limitReductions: toLimitReductions(formData[LIMIT_REDUCTIONS_FORM]),
            };
        },
        [toContingencyListsInfos, toLimitReductions]
    );

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
                    ElementType.SECURITY_ANALYSIS_PARAMETERS,
                    formData[DESCRIPTION] ?? ''
                ).catch((error) => {
                    snackWithFallback(snackError, error, { headerId: 'updateSecurityAnalysisParametersError' });
                });
            }
        },
        [parametersUuid, formatNewParams, snackError]
    );

    useEffect(() => {
        if (watchProvider !== currentProvider) {
            setCurrentProvider(watchProvider as string);
            if (watchProvider !== undefined && currentProvider !== undefined) {
                if (params !== null) {
                    params.limitReductions = defaultLimitReductions;
                }
                formMethods.setValue(
                    LIMIT_REDUCTIONS_FORM,
                    toFormValuesLimitReductions(defaultLimitReductions)[LIMIT_REDUCTIONS_FORM]
                );
            }
        }
    }, [watchProvider, currentProvider, formMethods, setCurrentProvider, defaultLimitReductions, params]);

    useEffect(() => {
        if (!params) {
            return;
        }
        reset(toFormValueSaParameters(params));
    }, [paramsLoaded, params, reset]);

    return {
        formMethods,
        formSchema,
        formattedProviders,
        defaultLimitReductions,
        toFormValueSaParameters,
        formatNewParams,
        params,
        currentProvider,
        setCurrentProvider,
        paramsLoaded,
        onSaveInline,
        onSaveDialog,
    };
};
