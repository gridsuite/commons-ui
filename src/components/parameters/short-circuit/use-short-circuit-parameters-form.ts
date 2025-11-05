/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import { FieldErrors, useForm, UseFormReturn } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ObjectSchema } from 'yup';
import type { UUID } from 'node:crypto';
import yup from '../../../utils/yupConfig';
import { DESCRIPTION, NAME } from '../../inputs';
import {
    InitialVoltage,
    PredefinedParameters,
    SHORT_CIRCUIT_INITIAL_VOLTAGE_PROFILE_MODE,
    SHORT_CIRCUIT_ONLY_STARTED_GENERATORS,
    SHORT_CIRCUIT_PREDEFINED_PARAMS,
    SHORT_CIRCUIT_WITH_FEEDER_RESULT,
    SHORT_CIRCUIT_WITH_LOADS,
    SHORT_CIRCUIT_WITH_NEUTRAL_POSITION,
    SHORT_CIRCUIT_WITH_SHUNT_COMPENSATORS,
    SHORT_CIRCUIT_WITH_VSC_CONVERTER_STATIONS,
} from './constants';
import { UseParametersBackendReturnProps } from '../../../utils/types/parameters.type';
import { updateParameter } from '../../../services';
import { useSnackMessage } from '../../../hooks';
import { ElementType, ParameterType, SpecificParameterInfos, SpecificParametersPerProvider } from '../../../utils';
import { getNameElementEditorEmptyFormData, getNameElementEditorSchema } from '../common/name-element-editor';
import { ShortCircuitParametersInfos } from './short-circuit-parameters.type';
import { COMMON_PARAMETERS, ComputingType, SPECIFIC_PARAMETERS, VERSION_PARAMETER } from '../common';
import { getCommonShortCircuitParametersFormSchema } from './short-circuit-parameters-utils';
import { getDefaultSpecificParamsValues, getSpecificParametersFormSchema } from '../common/utils';

const ManagedSpecificParameters = new Set([SHORT_CIRCUIT_ONLY_STARTED_GENERATORS]);

export interface UseShortCircuitParametersFormReturn {
    formMethods: UseFormReturn;
    formSchema: ObjectSchema<any>;
    resetAll: (predefinedParameter: PredefinedParameters) => void;
    specificParameters: SpecificParameterInfos[];
    toShortCircuitFormValues: (_params: ShortCircuitParametersInfos) => any;
    formatNewParams: (formData: Record<string, any>) => ShortCircuitParametersInfos;
    params: ShortCircuitParametersInfos | null;
    currentProvider: string | undefined;
    setCurrentProvider: (provider: string) => void;
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
    const [, , , , , params, , updateParameters, , specificParamsDescriptions] = parametersBackend;
    const [currentProvider, setCurrentProvider] = useState('Courcirc');
    const { snackError } = useSnackMessage();

    const filteredSpecificParamsDescriptions = useMemo(() => {
        return specificParamsDescriptions?.[currentProvider].filter((sp: SpecificParameterInfos) =>
            ManagedSpecificParameters.has(sp.name)
        );
    }, [currentProvider, specificParamsDescriptions]);

    const defaultSpecificParametersValues = useMemo(() => {
        return getDefaultSpecificParamsValues(filteredSpecificParamsDescriptions);
    }, [filteredSpecificParamsDescriptions]);

    const specificParameters = useMemo<SpecificParameterInfos[]>(() => {
        return filteredSpecificParamsDescriptions?.map((param: SpecificParameterInfos) => ({
            name: param.name,
            type: param.type,
            label: param.label,
            description: param.description,
            possibleValues: param.possibleValues,
            defaultValue: param.defaultValue,
        }));
    }, [filteredSpecificParamsDescriptions]);

    const formSchema = useMemo(() => {
        return yup
            .object({
                [SHORT_CIRCUIT_PREDEFINED_PARAMS]: yup
                    .mixed<PredefinedParameters>()
                    .oneOf(Object.values(PredefinedParameters))
                    .required(),
                ...getCommonShortCircuitParametersFormSchema().fields,
                ...getSpecificParametersFormSchema(specificParameters).fields,
            })
            .concat(getNameElementEditorSchema(name));
    }, [name, specificParameters]);

    console.log('SBO SC params?.commonParameters', params?.commonParameters);

    const formMethods = useForm({
        defaultValues: {
            ...getNameElementEditorEmptyFormData(name, description),
            [SHORT_CIRCUIT_PREDEFINED_PARAMS]: PredefinedParameters.ICC_MAX_WITH_CEI909,
            [COMMON_PARAMETERS]: {
                ...params?.commonParameters,
            },
            [SPECIFIC_PARAMETERS]: {
                ...defaultSpecificParametersValues,
            },
        },
        resolver: yupResolver(formSchema as unknown as yup.ObjectSchema<any>),
    });

    const { reset, setValue } = formMethods;

    // when ever the predefined parameter is manually changed, we need to reset all parameters
    const resetAll = useCallback(
        (predefinedParameter: PredefinedParameters) => {
            const dirty = { shouldDirty: true };
            setValue(
                COMMON_PARAMETERS,
                {
                    ...params?.commonParameters, // for VERSION_PARAMETER and other non managed params
                    [SHORT_CIRCUIT_WITH_FEEDER_RESULT]: false,
                    [SHORT_CIRCUIT_WITH_LOADS]: false,
                    [SHORT_CIRCUIT_WITH_VSC_CONVERTER_STATIONS]:
                        predefinedParameter !== PredefinedParameters.ICC_MIN_WITH_NOMINAL_VOLTAGE_MAP,
                    [SHORT_CIRCUIT_WITH_SHUNT_COMPENSATORS]: false,
                    [SHORT_CIRCUIT_WITH_NEUTRAL_POSITION]: false,
                    [SHORT_CIRCUIT_INITIAL_VOLTAGE_PROFILE_MODE]:
                        predefinedParameter === PredefinedParameters.ICC_MAX_WITH_CEI909
                            ? InitialVoltage.CEI909
                            : InitialVoltage.NOMINAL,
                },
                dirty
            );
            setValue(SHORT_CIRCUIT_PREDEFINED_PARAMS, predefinedParameter, dirty);
            setValue(
                SPECIFIC_PARAMETERS,
                {
                    ...defaultSpecificParametersValues,
                    [SHORT_CIRCUIT_ONLY_STARTED_GENERATORS]:
                        predefinedParameter === PredefinedParameters.ICC_MIN_WITH_NOMINAL_VOLTAGE_MAP,
                },
                dirty
            );
        },
        [defaultSpecificParametersValues, params?.commonParameters, setValue]
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
        (formData: Record<string, any>): ShortCircuitParametersInfos => {
            console.log('SBO formatNewParams formData', formData);
            return {
                predefinedParameters: formData[SHORT_CIRCUIT_PREDEFINED_PARAMS],
                commonParameters: {
                    [VERSION_PARAMETER]: formData[COMMON_PARAMETERS][VERSION_PARAMETER], // PowSyBl requires that "version" appears first
                    ...formData[COMMON_PARAMETERS],
                },
                specificParametersPerProvider: {
                    Courcirc: getSpecificParametersPerProvider(formData, defaultSpecificParametersValues),
                },
            };
        },
        [defaultSpecificParametersValues]
    );

    const toShortCircuitFormValues = useCallback(
        (_params: ShortCircuitParametersInfos) => {
            const specificParams = filteredSpecificParamsDescriptions;
            const specificParamsPerProvider = _params.specificParametersPerProvider[currentProvider];

            const formatted = specificParams?.reduce((acc: Record<string, unknown>, param: SpecificParameterInfos) => {
                if (specificParamsPerProvider && Object.hasOwn(specificParamsPerProvider, param.name)) {
                    if (param.type === ParameterType.BOOLEAN) {
                        acc[param.name] = specificParamsPerProvider[param.name] === 'true';
                    } else if (param.type === ParameterType.STRING_LIST) {
                        acc[param.name] =
                            specificParamsPerProvider[param.name] === ''
                                ? []
                                : specificParamsPerProvider[param.name].split(',');
                    } else {
                        acc[param.name] = specificParamsPerProvider[param.name];
                    }
                } else {
                    acc[param.name] = getDefaultSpecificParamsValues([param])[param.name];
                }
                return acc;
            }, {});
            console.log('SBO toShortCircuitFormValues specificParams', formatted);
            return {
                [SHORT_CIRCUIT_PREDEFINED_PARAMS]: _params.predefinedParameters,
                [COMMON_PARAMETERS]: {
                    ..._params.commonParameters,
                    [SHORT_CIRCUIT_INITIAL_VOLTAGE_PROFILE_MODE]:
                        _params.commonParameters.initialVoltageProfileMode === InitialVoltage.CONFIGURED
                            ? InitialVoltage.CEI909
                            : _params.commonParameters.initialVoltageProfileMode,
                },
                [SPECIFIC_PARAMETERS]: {
                    ...formatted,
                },
            };
        },
        [currentProvider, filteredSpecificParamsDescriptions]
    );

    const paramsLoaded = useMemo(() => !!params && !!currentProvider, [currentProvider, params]);

    const onValidationError = useCallback((errors: FieldErrors) => {
        console.log('SBO onValidationError errors', errors);
    }, []);

    const onSaveInline = useCallback(
        (formData: Record<string, any>) => {
            console.log('SBO onSaveInline', formData);
            const data = formatNewParams(formData);
            console.log('SBO onSaveInline data', data);
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
                    snackError({
                        messageTxt: error.message,
                        headerId: 'paramsChangingError',
                    });
                });
            }
        },
        [formatNewParams, parametersUuid, snackError]
    );

    useEffect(() => {
        if (!params) {
            return;
        }
        reset(toShortCircuitFormValues(params));
    }, [paramsLoaded, params, reset, specificParamsDescriptions, toShortCircuitFormValues]);

    return {
        formMethods,
        formSchema,
        specificParameters,
        toShortCircuitFormValues,
        formatNewParams,
        params,
        currentProvider,
        setCurrentProvider,
        paramsLoaded,
        onValidationError,
        onSaveInline,
        onSaveDialog,
        resetAll,
    };
};
