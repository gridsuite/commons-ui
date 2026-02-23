/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import { FieldErrors, useForm, UseFormReturn } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { SyntheticEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { ObjectSchema } from 'yup';
import type { UUID } from 'node:crypto';
import yup from '../../../utils/yupConfig';
import { DESCRIPTION, NAME } from '../../inputs';
import {
    InitialVoltage,
    PredefinedParameters,
    SHORT_CIRCUIT_IN_CALCULATION_CLUSTER_FILTERS,
    SHORT_CIRCUIT_INITIAL_VOLTAGE_PROFILE_MODE,
    SHORT_CIRCUIT_ONLY_STARTED_GENERATORS_IN_CALCULATION_CLUSTER,
    SHORT_CIRCUIT_PREDEFINED_PARAMS,
    SHORT_CIRCUIT_VOLTAGE_RANGES,
    SHORT_CIRCUIT_WITH_LOADS,
    SHORT_CIRCUIT_WITH_NEUTRAL_POSITION,
    SHORT_CIRCUIT_WITH_SHUNT_COMPENSATORS,
    SHORT_CIRCUIT_WITH_VSC_CONVERTER_STATIONS,
} from './constants';
import { updateParameter } from '../../../services';
import { useSnackMessage } from '../../../hooks';
import { ElementType, SpecificParameterInfos, UseParametersBackendReturnProps } from '../../../utils';
import { getNameElementEditorEmptyFormData, getNameElementEditorSchema } from '../common/name-element-editor';
import { ShortCircuitParametersInfos } from './short-circuit-parameters.type';
import { COMMON_PARAMETERS, ComputingType, PROVIDER, SPECIFIC_PARAMETERS, VERSION_PARAMETER } from '../common';
import {
    formatShortCircuitSpecificParameters,
    getCommonShortCircuitParametersFormSchema,
    getDefaultShortCircuitSpecificParamsValues,
    getShortCircuitSpecificParametersValues,
    getSpecificShortCircuitParametersFormSchema,
    ShortCircuitParametersTabValues,
} from './short-circuit-parameters-utils';
import { snackWithFallback } from '../../../utils/error';

export interface UseShortCircuitParametersFormReturn {
    formMethods: UseFormReturn;
    formSchema: ObjectSchema<any>;
    selectedTab: ShortCircuitParametersTabValues;
    handleTabChange: (event: SyntheticEvent, newValue: ShortCircuitParametersTabValues) => void;
    tabIndexesWithError: ShortCircuitParametersTabValues[];
    resetAll: (predefinedParameter: PredefinedParameters) => void;
    specificParametersDescriptionForProvider: SpecificParameterInfos[];
    toShortCircuitFormValues: (_params: ShortCircuitParametersInfos) => any;
    formatNewParams: (formData: Record<string, any>) => ShortCircuitParametersInfos;
    params: ShortCircuitParametersInfos | null;
    provider: string | undefined;
    paramsLoaded: boolean;
    onValidationError: (errors: FieldErrors) => void;
    onSaveInline: (formData: Record<string, any>) => void;
    onSaveDialog: (formData: Record<string, any>) => void;
}

// GridExplore versus GridStudy exclusive input params
type UseShortCircuitParametersFormProps = {
    parametersBackend: UseParametersBackendReturnProps<ComputingType.SHORT_CIRCUIT>;
    parametersUuid: UUID | null;
    name: string | null;
    description: string | null;
};

export const useShortCircuitParametersForm = ({
    parametersBackend,
    parametersUuid,
    name,
    description,
}: UseShortCircuitParametersFormProps): UseShortCircuitParametersFormReturn => {
    const [, provider, , , , params, , updateParameters, , specificParamsDescriptions] = parametersBackend;
    const [selectedTab, setSelectedTab] = useState<ShortCircuitParametersTabValues>(
        ShortCircuitParametersTabValues.GENERAL
    );
    const [tabIndexesWithError] = useState<ShortCircuitParametersTabValues[]>([]);
    const [paramsLoaded, setParamsLoaded] = useState(false);
    const { snackError } = useSnackMessage();

    const handleTabChange = useCallback((event: SyntheticEvent, newValue: ShortCircuitParametersTabValues) => {
        setSelectedTab(newValue);
    }, []);

    const specificParametersDescriptionForProvider = useMemo<SpecificParameterInfos[]>(() => {
        return provider && specificParamsDescriptions?.[provider] ? specificParamsDescriptions[provider] : [];
    }, [provider, specificParamsDescriptions]);

    const specificParametersDefaultValues = useMemo(() => {
        return {
            ...getDefaultShortCircuitSpecificParamsValues(specificParametersDescriptionForProvider, snackError),
        };
    }, [snackError, specificParametersDescriptionForProvider]);

    const formSchema = useMemo(() => {
        return yup
            .object({
                [SHORT_CIRCUIT_PREDEFINED_PARAMS]: yup
                    .mixed<PredefinedParameters>()
                    .oneOf(Object.values(PredefinedParameters))
                    .required(),
                ...getCommonShortCircuitParametersFormSchema().fields,
                ...getSpecificShortCircuitParametersFormSchema(specificParametersDescriptionForProvider).fields,
            })
            .concat(getNameElementEditorSchema(name));
    }, [name, specificParametersDescriptionForProvider]);

    const formMethods = useForm({
        defaultValues: {
            ...getNameElementEditorEmptyFormData(name, description),
            [SHORT_CIRCUIT_PREDEFINED_PARAMS]: PredefinedParameters.ICC_MAX_WITH_CEI909,
            [COMMON_PARAMETERS]: {
                ...params?.commonParameters,
            },
            [SPECIFIC_PARAMETERS]: {
                ...specificParametersDefaultValues,
            },
        },
        resolver: yupResolver(formSchema as unknown as yup.ObjectSchema<any>),
    });

    const { reset, setValue } = formMethods;

    // when ever the predefined parameter is manually changed, we need to reset all dependent parameters
    const resetAll = useCallback(
        (predefinedParameter: PredefinedParameters) => {
            const dirty = { shouldDirty: true };

            // SHORT_CIRCUIT_WITH_FEEDER_RESULT isn't reset by predefined parameters change
            setValue(`${COMMON_PARAMETERS}.${SHORT_CIRCUIT_WITH_LOADS}`, false, dirty);
            setValue(
                `${COMMON_PARAMETERS}.${SHORT_CIRCUIT_WITH_VSC_CONVERTER_STATIONS}`,
                predefinedParameter !== PredefinedParameters.ICC_MIN_WITH_NOMINAL_VOLTAGE_MAP,
                dirty
            );
            setValue(`${COMMON_PARAMETERS}.${SHORT_CIRCUIT_WITH_SHUNT_COMPENSATORS}`, false, dirty);
            setValue(`${COMMON_PARAMETERS}.${SHORT_CIRCUIT_WITH_NEUTRAL_POSITION}`, false, dirty);
            setValue(
                `${COMMON_PARAMETERS}.${SHORT_CIRCUIT_INITIAL_VOLTAGE_PROFILE_MODE}`,
                predefinedParameter === PredefinedParameters.ICC_MAX_WITH_CEI909
                    ? InitialVoltage.CEI909
                    : InitialVoltage.NOMINAL,
                dirty
            );

            setValue(SHORT_CIRCUIT_PREDEFINED_PARAMS, predefinedParameter, dirty);

            // reset only if present in specific parameters description for provider
            const onlyStartedGeneratorsInCalculationCluster = specificParametersDescriptionForProvider?.find(
                (specificParam) => specificParam.name === SHORT_CIRCUIT_ONLY_STARTED_GENERATORS_IN_CALCULATION_CLUSTER
            );
            if (onlyStartedGeneratorsInCalculationCluster) {
                setValue(
                    `${SPECIFIC_PARAMETERS}.${SHORT_CIRCUIT_ONLY_STARTED_GENERATORS_IN_CALCULATION_CLUSTER}`,
                    predefinedParameter === PredefinedParameters.ICC_MIN_WITH_NOMINAL_VOLTAGE_MAP,
                    dirty
                );
            }
            setValue(`${SPECIFIC_PARAMETERS}.${SHORT_CIRCUIT_IN_CALCULATION_CLUSTER_FILTERS}`, []);
        },
        [setValue, specificParametersDescriptionForProvider]
    );

    const formatNewParams = useCallback(
        (formData: Record<string, any>): ShortCircuitParametersInfos => {
            if (!provider) {
                return {} as ShortCircuitParametersInfos;
            }
            return {
                provider: formData[PROVIDER],
                predefinedParameters: formData[SHORT_CIRCUIT_PREDEFINED_PARAMS],
                commonParameters: {
                    [VERSION_PARAMETER]: formData[COMMON_PARAMETERS][VERSION_PARAMETER], // PowSyBl requires that "version" appears first
                    ...formData[COMMON_PARAMETERS],
                    // this should be inverted for API compatibility
                    [SHORT_CIRCUIT_WITH_NEUTRAL_POSITION]:
                        !formData[COMMON_PARAMETERS][SHORT_CIRCUIT_WITH_NEUTRAL_POSITION],
                    [SHORT_CIRCUIT_INITIAL_VOLTAGE_PROFILE_MODE]:
                        formData[COMMON_PARAMETERS][SHORT_CIRCUIT_INITIAL_VOLTAGE_PROFILE_MODE] ===
                        InitialVoltage.CEI909
                            ? InitialVoltage.CONFIGURED
                            : formData[COMMON_PARAMETERS][SHORT_CIRCUIT_INITIAL_VOLTAGE_PROFILE_MODE],
                    // we need to add voltageRanges to the parameters only when initialVoltageProfileMode is equals to CEI909
                    [SHORT_CIRCUIT_VOLTAGE_RANGES]:
                        formData[COMMON_PARAMETERS][SHORT_CIRCUIT_INITIAL_VOLTAGE_PROFILE_MODE] ===
                        InitialVoltage.CEI909
                            ? params?.cei909VoltageRanges
                            : undefined,
                },
                specificParametersPerProvider: {
                    [provider]: getShortCircuitSpecificParametersValues(formData, specificParametersDefaultValues),
                },
            };
        },
        [params?.cei909VoltageRanges, provider, specificParametersDefaultValues]
    );

    const toShortCircuitFormValues = useCallback(
        (_params: ShortCircuitParametersInfos) => {
            if (!provider || !_params) {
                return {};
            }
            const specificParamsListForCurrentProvider = _params.specificParametersPerProvider[provider];
            return {
                [PROVIDER]: _params.provider,
                [SHORT_CIRCUIT_PREDEFINED_PARAMS]: _params.predefinedParameters,
                [COMMON_PARAMETERS]: {
                    ..._params.commonParameters,
                    [SHORT_CIRCUIT_INITIAL_VOLTAGE_PROFILE_MODE]:
                        _params.commonParameters.initialVoltageProfileMode === InitialVoltage.CONFIGURED
                            ? InitialVoltage.CEI909
                            : _params.commonParameters.initialVoltageProfileMode,
                    // invert back the value for the form
                    [SHORT_CIRCUIT_WITH_NEUTRAL_POSITION]: !_params.commonParameters.withNeutralPosition,
                },
                [SPECIFIC_PARAMETERS]: {
                    ...formatShortCircuitSpecificParameters(
                        specificParametersDescriptionForProvider,
                        specificParamsListForCurrentProvider,
                        snackError
                    ),
                },
            };
        },
        [provider, snackError, specificParametersDescriptionForProvider]
    );

    const onValidationError = useCallback((_errors: FieldErrors) => {
        console.error('onValidationError: ', _errors);
    }, []);

    const onSaveInline = useCallback(
        (formData: Record<string, any>) => {
            const data = formatNewParams(formData);
            updateParameters(data);
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
                    ElementType.SHORT_CIRCUIT_PARAMETERS,
                    formData[DESCRIPTION] ?? ''
                ).catch((error) => {
                    snackWithFallback(snackError, error, { headerId: 'paramsChangingError' });
                });
            }
        },
        [formatNewParams, parametersUuid, snackError]
    );

    useEffect(() => {
        if (!params || !provider || !specificParamsDescriptions) {
            return;
        }
        reset(toShortCircuitFormValues(params));
        // Now that we have params, provider and specific parameters description we can init
        // form Schema and default values. this paramsLoaded State is used to determine
        // if form is correctly initialized and that we are able to render form inputs
        setParamsLoaded(true);
    }, [provider, params, reset, specificParamsDescriptions, toShortCircuitFormValues]);

    return {
        formMethods,
        formSchema,
        selectedTab,
        handleTabChange,
        tabIndexesWithError,
        specificParametersDescriptionForProvider,
        toShortCircuitFormValues,
        formatNewParams,
        params,
        provider,
        paramsLoaded,
        onValidationError,
        onSaveInline,
        onSaveDialog,
        resetAll,
    };
};
