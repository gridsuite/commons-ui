/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { useForm, UseFormReturn } from 'react-hook-form';
import { ObjectSchema } from 'yup';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { UUID } from 'node:crypto';
import { yupResolver } from '@hookform/resolvers/yup';
import {
    ComputingType,
    ContingencyListsInfosEnriched,
    ElementType,
    UseParametersBackendReturnProps,
} from '../../../utils';
import {
    CONTINGENCY_LISTS,
    CONTINGENCY_LISTS_INFOS,
    ILimitReductionsByVoltageLevel,
    IST_FORM,
    LIMIT_DURATION_FORM,
    LIMIT_REDUCTIONS_FORM,
    PROVIDER,
    toFormValuesLimitReductions,
} from '../common';
import { getNameElementEditorEmptyFormData } from '../common/name-element-editor';
import { updateParameter } from '../../../services';
import { useSnackMessage } from '../../../hooks';
import { snackWithFallback } from '../../../utils/error';
import { mapSecurityAnalysisParameters, SAParametersEnriched } from '../../../utils/types';
import { getSAParametersFormSchema, toFormValueSaParameters } from './columns-definitions';
import { ACTIVATED, DESCRIPTION, ID, NAME } from '../common/parameter-table-field';
import {
    FLOW_PROPORTIONAL_THRESHOLD,
    HIGH_VOLTAGE_ABSOLUTE_THRESHOLD,
    HIGH_VOLTAGE_PROPORTIONAL_THRESHOLD,
    LOW_VOLTAGE_ABSOLUTE_THRESHOLD,
    LOW_VOLTAGE_PROPORTIONAL_THRESHOLD,
} from './constants';

export interface UseSecurityAnalysisParametersFormReturn {
    formMethods: UseFormReturn;
    formSchema: ObjectSchema<any>;
    formattedProviders: { id: string; label: string }[];
    defaultLimitReductions: ILimitReductionsByVoltageLevel[];
    toFormValueSaParameters: (_params: SAParametersEnriched) => any;
    formatNewParams: (formData: Record<string, any>) => SAParametersEnriched;
    params: SAParametersEnriched | null;
    watchProvider: string | undefined;
    paramsFormInitialized: boolean;
    onSaveInline: (formData: Record<string, any>) => void;
    onSaveDialog: (formData: Record<string, any>) => void;
}

export const useSecurityAnalysisParametersForm = (
    parametersBackend: UseParametersBackendReturnProps<ComputingType.SECURITY_ANALYSIS>,
    parametersUuid: UUID | null,
    name: string | null,
    description: string | null
): UseSecurityAnalysisParametersFormReturn => {
    const { providers, params, updateParameters, defaultLimitReductions } = parametersBackend;
    const previousWatchProviderRef = useRef<string | undefined>(undefined);
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

    const formSchema = useMemo(() => {
        return getSAParametersFormSchema(name, params?.limitReductions);
    }, [name, params?.limitReductions]);

    const formMethods = useForm({
        defaultValues: {
            ...getNameElementEditorEmptyFormData(name, description),
            [PROVIDER]: params?.provider,
            [CONTINGENCY_LISTS_INFOS]: [],
            [LIMIT_REDUCTIONS_FORM]: [],
            [FLOW_PROPORTIONAL_THRESHOLD]: null,
            [LOW_VOLTAGE_PROPORTIONAL_THRESHOLD]: null,
            [LOW_VOLTAGE_ABSOLUTE_THRESHOLD]: null,
            [HIGH_VOLTAGE_PROPORTIONAL_THRESHOLD]: null,
            [HIGH_VOLTAGE_ABSOLUTE_THRESHOLD]: null,
        },
        resolver: yupResolver(formSchema),
    });

    const { reset, watch } = formMethods;
    const watchProvider = watch(PROVIDER) as string | undefined;

    const paramsLoaded = useMemo(() => !!params && !!watchProvider, [watchProvider, params]);
    const [paramsFormInitialized, setParamsFormInitialized] = useState(false);

    const toContingencyListsInfos = useCallback(
        (formContingencyListsInfos: Record<string, any>[]): ContingencyListsInfosEnriched[] => {
            if (!formContingencyListsInfos) {
                return [];
            }
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
                [PROVIDER]: formData[PROVIDER],
                [FLOW_PROPORTIONAL_THRESHOLD]: formData[FLOW_PROPORTIONAL_THRESHOLD] / 100,
                [LOW_VOLTAGE_PROPORTIONAL_THRESHOLD]: formData[LOW_VOLTAGE_PROPORTIONAL_THRESHOLD] / 100,
                [LOW_VOLTAGE_ABSOLUTE_THRESHOLD]: formData[LOW_VOLTAGE_ABSOLUTE_THRESHOLD],
                [HIGH_VOLTAGE_PROPORTIONAL_THRESHOLD]: formData[HIGH_VOLTAGE_PROPORTIONAL_THRESHOLD] / 100,
                [HIGH_VOLTAGE_ABSOLUTE_THRESHOLD]: formData[HIGH_VOLTAGE_ABSOLUTE_THRESHOLD],
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
                    mapSecurityAnalysisParameters(formatNewParams(formData)),
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
        if (watchProvider !== undefined && watchProvider !== previousWatchProviderRef.current) {
            if (previousWatchProviderRef.current !== undefined) {
                if (params !== null) {
                    params.limitReductions = defaultLimitReductions;
                }
                formMethods.setValue(
                    LIMIT_REDUCTIONS_FORM,
                    toFormValuesLimitReductions(defaultLimitReductions)[LIMIT_REDUCTIONS_FORM]
                );
            }
            previousWatchProviderRef.current = watchProvider;
        }
    }, [watchProvider, formMethods, defaultLimitReductions, params]);

    useEffect(() => {
        if (!params) {
            return;
        }
        reset(toFormValueSaParameters(params));
        setParamsFormInitialized(true);
    }, [paramsLoaded, params, reset]);

    return {
        formMethods,
        formSchema,
        formattedProviders,
        defaultLimitReductions,
        toFormValueSaParameters,
        formatNewParams,
        params,
        watchProvider,
        paramsFormInitialized,
        onSaveInline,
        onSaveDialog,
    };
};
