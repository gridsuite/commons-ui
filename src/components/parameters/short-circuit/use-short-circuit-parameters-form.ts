/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import { FieldValues, useForm, UseFormReturn } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ObjectSchema } from 'yup';
import { UUID } from 'crypto';
import yup from '../../../utils/yupConfig';
import { DESCRIPTION_INPUT, NAME } from '../../inputs';
import {
    INITIAL_VOLTAGE,
    PREDEFINED_PARAMETERS,
    SHORT_CIRCUIT_INITIAL_VOLTAGE_PROFILE_MODE,
    SHORT_CIRCUIT_PREDEFINED_PARAMS,
    SHORT_CIRCUIT_WITH_FEEDER_RESULT,
    SHORT_CIRCUIT_WITH_LOADS,
    SHORT_CIRCUIT_WITH_NEUTRAL_POSITION,
    SHORT_CIRCUIT_WITH_SHUNT_COMPENSATORS,
    SHORT_CIRCUIT_WITH_VSC_CONVERTER_STATIONS,
} from './constants';
import { setStudyShortCircuitParameters, updateParameter } from '../../../services';
import { useSnackMessage } from '../../../hooks';
import { ElementType } from '../../../utils';
import { getNameElementEditorEmptyFormData, getNameElementEditorSchema } from '../common/name-element-editor';
import { ShortCircuitParametersDto, ShortCircuitParametersInfos } from './short-circuit-parameters.type';
import { fetchShortCircuitParameters } from '../../../services/short-circuit-analysis';

export interface UseShortCircuitParametersFormReturn {
    formMethods: UseFormReturn;
    formSchema: ObjectSchema<any>;
    paramsLoaded: boolean;
    onSaveInline: (formData: Record<string, any>) => void;
    onSaveDialog: (formData: Record<string, any>) => void;
    resetAll: (predefinedParameter: PREDEFINED_PARAMETERS) => void;
    getCurrentValues: () => FieldValues;
}

export const useShortCircuitParametersForm = (
    parametersUuid: UUID | null,
    studyUuid: UUID | null,
    shortCircuitParameters: ShortCircuitParametersInfos | null,
    name: string | null,
    description: string | null
): UseShortCircuitParametersFormReturn => {
    const [paramsLoaded, setParamsLoaded] = useState<boolean>(false);
    const [loadedShortCircuitParameters, setLoadedShortCircuitParameters] = useState<ShortCircuitParametersInfos>();
    const { snackError } = useSnackMessage();

    const formSchema = useMemo(() => {
        return yup
            .object()
            .shape({
                [SHORT_CIRCUIT_WITH_FEEDER_RESULT]: yup.boolean().required(),
                [SHORT_CIRCUIT_PREDEFINED_PARAMS]: yup
                    .mixed<PREDEFINED_PARAMETERS>()
                    .oneOf(Object.values(PREDEFINED_PARAMETERS))
                    .required(),
                [SHORT_CIRCUIT_WITH_LOADS]: yup.boolean().required(),
                [SHORT_CIRCUIT_WITH_VSC_CONVERTER_STATIONS]: yup.boolean().required(),
                [SHORT_CIRCUIT_WITH_SHUNT_COMPENSATORS]: yup.boolean().required(),
                [SHORT_CIRCUIT_WITH_NEUTRAL_POSITION]: yup.boolean().required(),
                [SHORT_CIRCUIT_INITIAL_VOLTAGE_PROFILE_MODE]: yup
                    .mixed<INITIAL_VOLTAGE>()
                    .oneOf(Object.values(INITIAL_VOLTAGE))
                    .required(),
            })
            .required()
            .concat(getNameElementEditorSchema(name));
    }, [name]);

    // get default values based on shortCircuitParams
    const emptyFormData = useMemo(() => {
        const shortCircuitParams = shortCircuitParameters ?? loadedShortCircuitParameters;
        const { parameters, predefinedParameters } = shortCircuitParams || {};
        console.log('DBG DBR emptyFormData useMemo', shortCircuitParams);
        return {
            ...getNameElementEditorEmptyFormData(name, description),
            [SHORT_CIRCUIT_WITH_FEEDER_RESULT]: parameters?.withFeederResult,
            [SHORT_CIRCUIT_PREDEFINED_PARAMS]: predefinedParameters,
            [SHORT_CIRCUIT_WITH_LOADS]: parameters?.withLoads,
            [SHORT_CIRCUIT_WITH_VSC_CONVERTER_STATIONS]: parameters?.withVSCConverterStations,
            [SHORT_CIRCUIT_WITH_SHUNT_COMPENSATORS]: parameters?.withShuntCompensators,
            [SHORT_CIRCUIT_WITH_NEUTRAL_POSITION]: !parameters?.withNeutralPosition,
            [SHORT_CIRCUIT_INITIAL_VOLTAGE_PROFILE_MODE]:
                parameters?.initialVoltageProfileMode === INITIAL_VOLTAGE.CONFIGURED
                    ? INITIAL_VOLTAGE.CEI909
                    : parameters?.initialVoltageProfileMode,
        };
    }, [shortCircuitParameters, loadedShortCircuitParameters]);

    const formMethods = useForm({
        defaultValues: emptyFormData,
        resolver: yupResolver(formSchema as unknown as yup.ObjectSchema<any>),
    });

    const { getValues, reset, setValue } = formMethods;

    // when ever the predefined parameter is manually changed, we need to reset all parameters
    const resetAll = useCallback(
        (predefinedParameter: PREDEFINED_PARAMETERS) => {
            const dirty = { shouldDirty: true };
            setValue(SHORT_CIRCUIT_WITH_FEEDER_RESULT, true, dirty);
            setValue(SHORT_CIRCUIT_WITH_LOADS, false, dirty);
            setValue(
                SHORT_CIRCUIT_WITH_VSC_CONVERTER_STATIONS,
                predefinedParameter !== PREDEFINED_PARAMETERS.ICC_MIN_WITH_NOMINAL_VOLTAGE_MAP,
                dirty
            );
            setValue(SHORT_CIRCUIT_WITH_SHUNT_COMPENSATORS, false, dirty);
            setValue(SHORT_CIRCUIT_WITH_NEUTRAL_POSITION, false, dirty);
            const initialVoltageProfileMode =
                predefinedParameter === PREDEFINED_PARAMETERS.ICC_MAX_WITH_CEI909
                    ? INITIAL_VOLTAGE.CEI909
                    : INITIAL_VOLTAGE.NOMINAL;

            setValue(SHORT_CIRCUIT_INITIAL_VOLTAGE_PROFILE_MODE, initialVoltageProfileMode, dirty);
            setValue(SHORT_CIRCUIT_PREDEFINED_PARAMS, predefinedParameter, dirty);
        },
        [setValue]
    );

    const prepareDataToSend = (shortCircuitParams: ShortCircuitParametersInfos | null, newParameters: FieldValues) => {
        const oldParameters = { ...shortCircuitParams?.parameters };
        const { predefinedParameters: omit, ...newParametersWithoutPredefinedParameters } = newParameters;
        let parameters = {
            ...oldParameters,
            ...newParametersWithoutPredefinedParameters,
            // we need to add voltageRanges to the parameters only when initialVoltageProfileMode is equals to CEI909
            voltageRanges: undefined,
            withNeutralPosition: !newParameters.withNeutralPosition,
        };
        if (newParameters.initialVoltageProfileMode === INITIAL_VOLTAGE.CEI909) {
            parameters = {
                ...parameters,
                voltageRanges: shortCircuitParams?.cei909VoltageRanges,
                initialVoltageProfileMode: INITIAL_VOLTAGE.CONFIGURED,
            };
        }
        return {
            predefinedParameters: newParameters.predefinedParameters,
            parameters: parameters,
        };
    };

    const getCurrentValues = useCallback(() => {
        const currentValues = getValues();
        return { ...prepareDataToSend(shortCircuitParameters, currentValues) };
    }, [shortCircuitParameters, getValues]);

    const formatShortCircuitParameters = (
        parameters: ShortCircuitParametersDto,
        predefinedParameters: PREDEFINED_PARAMETERS
    ): Object => {
        console.log('DBG DBR formatShortCircuitParameters', parameters, predefinedParameters);
        return {
            [SHORT_CIRCUIT_WITH_FEEDER_RESULT]: parameters.withFeederResult,
            [SHORT_CIRCUIT_PREDEFINED_PARAMS]: predefinedParameters,
            [SHORT_CIRCUIT_WITH_LOADS]: parameters.withLoads,
            [SHORT_CIRCUIT_WITH_VSC_CONVERTER_STATIONS]: parameters.withVSCConverterStations,
            [SHORT_CIRCUIT_WITH_SHUNT_COMPENSATORS]: parameters.withShuntCompensators,
            [SHORT_CIRCUIT_WITH_NEUTRAL_POSITION]: !parameters.withNeutralPosition,
            [SHORT_CIRCUIT_INITIAL_VOLTAGE_PROFILE_MODE]:
                parameters.initialVoltageProfileMode === INITIAL_VOLTAGE.CONFIGURED
                    ? INITIAL_VOLTAGE.CEI909
                    : parameters.initialVoltageProfileMode,
        };
    };

    const onSaveInline = useCallback(
        (formData: Record<string, any>) => {
            if (studyUuid) {
                setStudyShortCircuitParameters(studyUuid, formData).catch((error) => {
                    snackError({
                        messageTxt: error.message,
                        headerId: 'paramsChangingError',
                    });
                });
            }
        },
        [snackError, studyUuid]
    );

    const onSaveDialog = useCallback(
        (formData: Record<string, any>) => {
            if (parametersUuid) {
                updateParameter(
                    parametersUuid,
                    formData,
                    formData[NAME],
                    ElementType.SHORT_CIRCUIT_PARAMETERS,
                    formData[DESCRIPTION_INPUT] ?? ''
                ).catch((error) => {
                    snackError({
                        messageTxt: error.message,
                        headerId: 'paramsChangingError',
                    });
                });
            }
        },
        [parametersUuid, snackError]
    );

    // GridExplore init case
    useEffect(() => {
        if (parametersUuid) {
            setParamsLoaded(false);
            console.log('DBG DBR useEff EXPL');
            fetchShortCircuitParameters(parametersUuid)
                .then((params) => {
                    console.log('DBG DBR useEff EXPL fetch=', params);
                    setLoadedShortCircuitParameters(params);
                    const { parameters, predefinedParameters } = params;
                    reset(formatShortCircuitParameters(parameters, predefinedParameters));
                })
                .catch((error) => {
                    snackError({
                        messageTxt: error.message,
                        headerId: 'paramsRetrievingError',
                    });
                })
                .finally(() => setParamsLoaded(true));
        }
    }, [parametersUuid, reset, snackError]);

    // GridStudy init case
    useEffect(() => {
        if (shortCircuitParameters) {
            console.log('DBG DBR useEff STUDY params=', shortCircuitParameters);
            const { parameters, predefinedParameters } = shortCircuitParameters;
            reset(formatShortCircuitParameters(parameters, predefinedParameters));
            setParamsLoaded(true);
        }
    }, [reset, shortCircuitParameters]);

    return {
        formMethods,
        formSchema,
        paramsLoaded,
        onSaveInline,
        onSaveDialog,
        resetAll,
        getCurrentValues,
    };
};
