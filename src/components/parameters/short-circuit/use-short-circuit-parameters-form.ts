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
    InitialVoltage,
    PredefinedParameters,
    SHORT_CIRCUIT_INITIAL_VOLTAGE_PROFILE_MODE,
    SHORT_CIRCUIT_PREDEFINED_PARAMS,
    SHORT_CIRCUIT_WITH_FEEDER_RESULT,
    SHORT_CIRCUIT_WITH_LOADS,
    SHORT_CIRCUIT_WITH_NEUTRAL_POSITION,
    SHORT_CIRCUIT_WITH_SHUNT_COMPENSATORS,
    SHORT_CIRCUIT_WITH_VSC_CONVERTER_STATIONS,
} from './constants';
import { invalidateStudyShortCircuitStatus, setStudyShortCircuitParameters, updateParameter } from '../../../services';
import { useSnackMessage } from '../../../hooks';
import { ElementType } from '../../../utils';
import { getNameElementEditorEmptyFormData, getNameElementEditorSchema } from '../common/name-element-editor';
import {
    ShortCircuitParameters,
    ShortCircuitParametersDto,
    ShortCircuitParametersInfos,
} from './short-circuit-parameters.type';
import { fetchShortCircuitParameters } from '../../../services/short-circuit-analysis';

export interface UseShortCircuitParametersFormReturn {
    formMethods: UseFormReturn;
    formSchema: ObjectSchema<any>;
    paramsLoaded: boolean;
    onSaveInline: (formData: Record<string, any>) => void;
    onSaveDialog: (formData: Record<string, any>) => void;
    resetAll: (predefinedParameter: PredefinedParameters) => void;
    getCurrentValues: () => FieldValues;
}

// GridExplore versus GridStudy exclusive input params
type UseShortCircuitParametersFormProps =
    | {
          parametersUuid: UUID;
          name: string;
          description: string | null;
          studyUuid: null;
          studyShortCircuitParameters: null;
      }
    | {
          parametersUuid: null;
          name: null;
          description: null;
          studyUuid: UUID | null;
          studyShortCircuitParameters: ShortCircuitParametersInfos | null;
      };

export const useShortCircuitParametersForm = ({
    parametersUuid,
    name,
    description,
    studyUuid,
    studyShortCircuitParameters,
}: UseShortCircuitParametersFormProps): UseShortCircuitParametersFormReturn => {
    const { snackError } = useSnackMessage();
    const [paramsLoaded, setParamsLoaded] = useState<boolean>(false);
    const [shortCircuitParameters, setShortCircuitParameters] = useState<ShortCircuitParametersInfos>();

    const formSchema = useMemo(() => {
        return yup
            .object()
            .shape({
                [SHORT_CIRCUIT_WITH_FEEDER_RESULT]: yup.boolean().required(),
                [SHORT_CIRCUIT_PREDEFINED_PARAMS]: yup
                    .mixed<PredefinedParameters>()
                    .oneOf(Object.values(PredefinedParameters))
                    .required(),
                [SHORT_CIRCUIT_WITH_LOADS]: yup.boolean().required(),
                [SHORT_CIRCUIT_WITH_VSC_CONVERTER_STATIONS]: yup.boolean().required(),
                [SHORT_CIRCUIT_WITH_SHUNT_COMPENSATORS]: yup.boolean().required(),
                [SHORT_CIRCUIT_WITH_NEUTRAL_POSITION]: yup.boolean().required(),
                [SHORT_CIRCUIT_INITIAL_VOLTAGE_PROFILE_MODE]: yup
                    .mixed<InitialVoltage>()
                    .oneOf(Object.values(InitialVoltage))
                    .required(),
            })
            .required()
            .concat(getNameElementEditorSchema(name));
    }, [name]);

    const emptyFormData = useMemo(() => {
        return {
            ...getNameElementEditorEmptyFormData(name, description),
            [SHORT_CIRCUIT_WITH_FEEDER_RESULT]: false,
            [SHORT_CIRCUIT_PREDEFINED_PARAMS]: PredefinedParameters.ICC_MAX_WITH_CEI909,
            [SHORT_CIRCUIT_WITH_LOADS]: false,
            [SHORT_CIRCUIT_WITH_VSC_CONVERTER_STATIONS]: false,
            [SHORT_CIRCUIT_WITH_SHUNT_COMPENSATORS]: false,
            [SHORT_CIRCUIT_WITH_NEUTRAL_POSITION]: false,
            [SHORT_CIRCUIT_INITIAL_VOLTAGE_PROFILE_MODE]: InitialVoltage.CEI909 as
                | InitialVoltage.NOMINAL
                | InitialVoltage.CEI909
                | undefined,
        };
    }, [name, description]);

    const formMethods = useForm({
        defaultValues: emptyFormData,
        resolver: yupResolver(formSchema as unknown as yup.ObjectSchema<any>),
    });

    const { getValues, reset, setValue } = formMethods;

    // when ever the predefined parameter is manually changed, we need to reset all parameters
    const resetAll = useCallback(
        (predefinedParameter: PredefinedParameters) => {
            const dirty = { shouldDirty: true };
            setValue(SHORT_CIRCUIT_WITH_FEEDER_RESULT, true, dirty);
            setValue(SHORT_CIRCUIT_WITH_LOADS, false, dirty);
            setValue(
                SHORT_CIRCUIT_WITH_VSC_CONVERTER_STATIONS,
                predefinedParameter !== PredefinedParameters.ICC_MIN_WITH_NOMINAL_VOLTAGE_MAP,
                dirty
            );
            setValue(SHORT_CIRCUIT_WITH_SHUNT_COMPENSATORS, false, dirty);
            setValue(SHORT_CIRCUIT_WITH_NEUTRAL_POSITION, false, dirty);
            const initialVoltageProfileMode =
                predefinedParameter === PredefinedParameters.ICC_MAX_WITH_CEI909
                    ? InitialVoltage.CEI909
                    : InitialVoltage.NOMINAL;

            setValue(SHORT_CIRCUIT_INITIAL_VOLTAGE_PROFILE_MODE, initialVoltageProfileMode, dirty);
            setValue(SHORT_CIRCUIT_PREDEFINED_PARAMS, predefinedParameter, dirty);
        },
        [setValue]
    );

    const prepareDataToSend = (
        shortCircuitParams: ShortCircuitParametersInfos,
        newParameters: FieldValues
    ): ShortCircuitParameters => {
        const oldParameters = { ...shortCircuitParams.parameters };
        const {
            predefinedParameters: omit,
            [NAME]: omit2,
            [DESCRIPTION_INPUT]: omit3,
            ...newParametersWithoutPredefinedParameters
        } = newParameters;
        let parameters = {
            ...oldParameters,
            ...newParametersWithoutPredefinedParameters,
            // we need to add voltageRanges to the parameters only when initialVoltageProfileMode is equals to CEI909
            voltageRanges: undefined,
            withNeutralPosition: !newParameters.withNeutralPosition,
        };
        if (newParameters.initialVoltageProfileMode === InitialVoltage.CEI909) {
            parameters = {
                ...parameters,
                voltageRanges: shortCircuitParams.cei909VoltageRanges,
                initialVoltageProfileMode: InitialVoltage.CONFIGURED,
            };
        }
        return {
            predefinedParameters: newParameters.predefinedParameters,
            parameters,
        };
    };

    const getCurrentValues = useCallback(() => {
        if (shortCircuitParameters) {
            const currentValues = getValues();
            return { ...prepareDataToSend(shortCircuitParameters, currentValues) };
        }
        return {};
    }, [shortCircuitParameters, getValues]);

    const formatShortCircuitParameters = (
        parameters: ShortCircuitParametersDto,
        predefinedParameters: PredefinedParameters
    ): Object => {
        return {
            [SHORT_CIRCUIT_WITH_FEEDER_RESULT]: parameters.withFeederResult,
            [SHORT_CIRCUIT_PREDEFINED_PARAMS]: predefinedParameters,
            [SHORT_CIRCUIT_WITH_LOADS]: parameters.withLoads,
            [SHORT_CIRCUIT_WITH_VSC_CONVERTER_STATIONS]: parameters.withVSCConverterStations,
            [SHORT_CIRCUIT_WITH_SHUNT_COMPENSATORS]: parameters.withShuntCompensators,
            [SHORT_CIRCUIT_WITH_NEUTRAL_POSITION]: !parameters.withNeutralPosition,
            [SHORT_CIRCUIT_INITIAL_VOLTAGE_PROFILE_MODE]:
                parameters.initialVoltageProfileMode === InitialVoltage.CONFIGURED
                    ? InitialVoltage.CEI909
                    : parameters.initialVoltageProfileMode,
        };
    };

    const onSaveInline = useCallback(
        (formData: Record<string, any>) => {
            if (studyUuid && shortCircuitParameters) {
                const oldParams = shortCircuitParameters;
                setStudyShortCircuitParameters(studyUuid, {
                    ...prepareDataToSend(shortCircuitParameters, formData),
                })
                    .then(() => {
                        invalidateStudyShortCircuitStatus(studyUuid).catch((error) => {
                            snackError({
                                messageTxt: error.message,
                                headerId: 'invalidateShortCircuitStatusError',
                            });
                        });
                    })
                    .catch((error) => {
                        setShortCircuitParameters(oldParams);
                        snackError({
                            messageTxt: error.message,
                            headerId: 'paramsChangingError',
                        });
                    });
            }
        },
        [shortCircuitParameters, setShortCircuitParameters, snackError, studyUuid]
    );

    const onSaveDialog = useCallback(
        (formData: Record<string, any>) => {
            if (parametersUuid && shortCircuitParameters) {
                updateParameter(
                    parametersUuid,
                    prepareDataToSend(shortCircuitParameters, formData),
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
        [parametersUuid, shortCircuitParameters, snackError]
    );

    // GridExplore init case
    useEffect(() => {
        if (parametersUuid) {
            setParamsLoaded(false);
            fetchShortCircuitParameters(parametersUuid)
                .then((params) => {
                    setShortCircuitParameters(params);
                })
                .catch((error) => {
                    snackError({
                        messageTxt: error.message,
                        headerId: 'paramsRetrievingError',
                    });
                })
                .finally(() => setParamsLoaded(true));
        }
    }, [parametersUuid, snackError]);

    // GridStudy init/update case
    useEffect(() => {
        if (studyShortCircuitParameters) {
            setShortCircuitParameters(studyShortCircuitParameters);
            setParamsLoaded(true);
        }
    }, [studyShortCircuitParameters]);

    // common form reset
    useEffect(() => {
        if (shortCircuitParameters) {
            const { parameters, predefinedParameters } = shortCircuitParameters;
            reset(formatShortCircuitParameters(parameters, predefinedParameters));
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
