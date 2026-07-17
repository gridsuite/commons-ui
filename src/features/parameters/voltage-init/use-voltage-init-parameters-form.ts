/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import { FieldErrors, useForm, UseFormReturn } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { SyntheticEvent, useCallback, useEffect, useMemo, useState } from 'react';
import type { UUID } from 'node:crypto';
import * as yup from 'yup';
import { DESCRIPTION, NAME } from '../../../components/ui';
import {
    DEFAULT_GENERAL_APPLY_MODIFICATIONS,
    DEFAULT_REACTIVE_SLACKS_THRESHOLD,
    DEFAULT_SHUNT_COMPENSATOR_ACTIVATION_THRESHOLD,
    DEFAULT_UPDATE_BUS_VOLTAGE,
    GENERAL_APPLY_MODIFICATIONS,
    GENERATORS_SELECTION_TYPE,
    HIGH_VOLTAGE_LIMIT,
    LOW_VOLTAGE_LIMIT,
    REACTIVE_SLACKS_THRESHOLD,
    SHUNT_COMPENSATOR_ACTIVATION_THRESHOLD,
    SHUNT_COMPENSATORS_SELECTION_TYPE,
    TRANSFORMERS_SELECTION_TYPE,
    UPDATE_BUS_VOLTAGE,
    VARIABLE_Q_GENERATORS,
    VARIABLE_SHUNT_COMPENSATORS,
    VARIABLE_TRANSFORMERS,
    VOLTAGE_LIMITS_DEFAULT,
    VOLTAGE_LIMITS_MODIFICATION,
    VoltageInitTabValues as TabValues,
} from './constants';
import { getVoltageInitParameters, updateParameter, updateVoltageInitParameters } from '../../../services';
import { useSnackMessage } from '../../../hooks';
import { ElementType, isBlankOrEmpty, YUP_REQUIRED } from '../../../utils';
import { getNameElementEditorEmptyFormData, getNameElementEditorSchema } from '../common/name-element-editor';
import { EquipmentsSelectionType, VoltageInitStudyParameters } from './voltage-init.type';
import {
    fromStudyVoltageInitParamsDataToFormValues,
    fromVoltageInitParametersFormToParamValues,
    fromVoltageInitParamsDataToFormValues,
} from './voltage-init-form-utils';
import { SELECTED } from '../../../components/composite/dnd-table';
import { FILTERS, ID } from '../../../utils/constants/filterConstant';
import { snackWithFallback } from '../../../utils/error';
import { useTabs } from '../common';

export interface UseVoltageInitParametersFormReturn {
    formMethods: UseFormReturn;
    formSchema: yup.ObjectSchema<any>;
    selectedTab: TabValues;
    handleTabChange: (event: SyntheticEvent, newValue: TabValues) => void;
    paramsLoading: boolean;
    onSaveInline: (formData: Record<string, any>) => void;
    onSaveDialog: (formData: Record<string, any>) => void;
    tabIndexesWithError: TabValues[];
    onValidationError: (errors: FieldErrors) => void;
}

// GridExplore versus GridStudy exclusive input params
type UseVoltageInitParametersFormProps =
    | {
          parametersUuid: UUID;
          name: string;
          description: string | null;
          studyUuid: null;
          parameters: null;
      }
    | {
          parametersUuid: null;
          name: null;
          description: null;
          studyUuid: UUID | null;
          parameters: VoltageInitStudyParameters | null;
      };

export const useVoltageInitParametersForm = ({
    parametersUuid,
    name,
    description,
    studyUuid,
    parameters,
}: UseVoltageInitParametersFormProps): UseVoltageInitParametersFormReturn => {
    const [paramsLoading, setParamsLoading] = useState<boolean>(false);
    const { snackError } = useSnackMessage();

    const formSchema = useMemo(() => {
        return yup
            .object({
                [TabValues.GENERAL]: yup.object().shape({
                    [GENERAL_APPLY_MODIFICATIONS]: yup.boolean(),
                    [UPDATE_BUS_VOLTAGE]: yup.boolean().required(),
                    [REACTIVE_SLACKS_THRESHOLD]: yup
                        .number()
                        .min(0, 'ReactiveSlacksThresholdMustBeGreaterOrEqualToZero')
                        .required(),
                    [SHUNT_COMPENSATOR_ACTIVATION_THRESHOLD]: yup
                        .number()
                        .min(0, 'ShuntCompensatorActivationThresholdMustBeGreaterOrEqualToZero')
                        .required(),
                }),
                [VOLTAGE_LIMITS_MODIFICATION]: yup.array().of(
                    yup.object().shape({
                        [SELECTED]: yup.boolean().required(),
                        [FILTERS]: yup
                            .array()
                            .of(
                                yup.object().shape({
                                    [ID]: yup.string().required(),
                                    [NAME]: yup.string().required(),
                                })
                            )
                            .min(1, YUP_REQUIRED),
                        [LOW_VOLTAGE_LIMIT]: yup.number().nullable(),
                        [HIGH_VOLTAGE_LIMIT]: yup.number().nullable(),
                    })
                ),
                [VOLTAGE_LIMITS_DEFAULT]: yup.array().of(
                    yup.object().shape({
                        [SELECTED]: yup.boolean().required(),
                        [FILTERS]: yup
                            .array()
                            .of(
                                yup.object().shape({
                                    [ID]: yup.string().required(),
                                    [NAME]: yup.string().required(),
                                })
                            )
                            .min(1, YUP_REQUIRED),
                        [LOW_VOLTAGE_LIMIT]: yup
                            .number()
                            .min(0, 'mustBeGreaterOrEqualToZero')
                            .nullable()
                            .test((value, context) => {
                                return !isBlankOrEmpty(value) || !isBlankOrEmpty(context.parent[HIGH_VOLTAGE_LIMIT]);
                            }),
                        [HIGH_VOLTAGE_LIMIT]: yup
                            .number()
                            .min(0, 'mustBeGreaterOrEqualToZero')
                            .nullable()
                            .test((value, context) => {
                                return !isBlankOrEmpty(value) || !isBlankOrEmpty(context.parent[LOW_VOLTAGE_LIMIT]);
                            }),
                    })
                ),
                [GENERATORS_SELECTION_TYPE]: yup.mixed<keyof typeof EquipmentsSelectionType>().required(),
                [VARIABLE_Q_GENERATORS]: yup.array().of(
                    yup.object().shape({
                        [ID]: yup.string().required(),
                        [NAME]: yup.string().required(),
                    })
                ),
                [TRANSFORMERS_SELECTION_TYPE]: yup.mixed<keyof typeof EquipmentsSelectionType>().required(),
                [VARIABLE_TRANSFORMERS]: yup.array().of(
                    yup.object().shape({
                        [ID]: yup.string().required(),
                        [NAME]: yup.string().required(),
                    })
                ),
                [SHUNT_COMPENSATORS_SELECTION_TYPE]: yup.mixed<keyof typeof EquipmentsSelectionType>().required(),
                [VARIABLE_SHUNT_COMPENSATORS]: yup.array().of(
                    yup.object().shape({
                        [ID]: yup.string().required(),
                        [NAME]: yup.string().required(),
                    })
                ),
            })
            .concat(getNameElementEditorSchema(name));
    }, [name]);

    const formMethods = useForm({
        defaultValues: {
            ...getNameElementEditorEmptyFormData(name, description),
            [TabValues.GENERAL]: {
                [GENERAL_APPLY_MODIFICATIONS]: DEFAULT_GENERAL_APPLY_MODIFICATIONS,
                [UPDATE_BUS_VOLTAGE]: DEFAULT_UPDATE_BUS_VOLTAGE,
                [REACTIVE_SLACKS_THRESHOLD]: DEFAULT_REACTIVE_SLACKS_THRESHOLD,
                [SHUNT_COMPENSATOR_ACTIVATION_THRESHOLD]: DEFAULT_SHUNT_COMPENSATOR_ACTIVATION_THRESHOLD,
            },
            [VOLTAGE_LIMITS_MODIFICATION]: [],
            [VOLTAGE_LIMITS_DEFAULT]: [],
            [GENERATORS_SELECTION_TYPE]: 'ALL_EXCEPT',
            [VARIABLE_Q_GENERATORS]: [],
            [TRANSFORMERS_SELECTION_TYPE]: 'NONE_EXCEPT',
            [VARIABLE_TRANSFORMERS]: [],
            [SHUNT_COMPENSATORS_SELECTION_TYPE]: 'NONE_EXCEPT',
            [VARIABLE_SHUNT_COMPENSATORS]: [],
        },
        resolver: yupResolver(formSchema as unknown as yup.ObjectSchema<any>),
    });

    const { reset } = formMethods;

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
            [TabValues.GENERAL]: [TabValues.GENERAL],
            [TabValues.VOLTAGE_LIMITS]: [VOLTAGE_LIMITS_MODIFICATION, VOLTAGE_LIMITS_DEFAULT],
            [TabValues.EQUIPMENTS_SELECTION]: [
                TRANSFORMERS_SELECTION_TYPE,
                VARIABLE_TRANSFORMERS,
                SHUNT_COMPENSATORS_SELECTION_TYPE,
                VARIABLE_SHUNT_COMPENSATORS,
                GENERATORS_SELECTION_TYPE,
                VARIABLE_Q_GENERATORS,
            ],
        },
    });

    const onSaveInline = useCallback(
        (formData: Record<string, any>) => {
            if (studyUuid) {
                updateVoltageInitParameters(studyUuid, fromVoltageInitParametersFormToParamValues(formData)).catch(
                    (error) => {
                        snackWithFallback(snackError, error, { headerId: 'updateVoltageInitParametersError' });
                    }
                );
            }
        },
        [snackError, studyUuid]
    );

    const onSaveDialog = useCallback(
        (formData: Record<string, any>) => {
            if (parametersUuid) {
                updateParameter(
                    parametersUuid,
                    fromVoltageInitParametersFormToParamValues(formData).computationParameters,
                    formData[NAME],
                    ElementType.VOLTAGE_INIT_PARAMETERS,
                    formData[DESCRIPTION] ?? ''
                ).catch((error: Error) => {
                    snackWithFallback(snackError, error, { headerId: 'updateVoltageInitParametersError' });
                });
            }
        },
        [parametersUuid, snackError]
    );

    // GridExplore init case
    useEffect(() => {
        if (parametersUuid) {
            const timer = setTimeout(() => {
                setParamsLoading(true);
            }, 700);
            getVoltageInitParameters(parametersUuid)
                .then((params) => {
                    reset(fromVoltageInitParamsDataToFormValues(params));
                })
                .catch((error: Error) => {
                    snackWithFallback(snackError, error, { headerId: 'paramsRetrievingError' });
                })
                .finally(() => {
                    clearTimeout(timer);
                    setParamsLoading(false);
                });
        }
    }, [parametersUuid, reset, snackError]);

    // GridStudy init case
    useEffect(() => {
        if (parameters) {
            reset(fromStudyVoltageInitParamsDataToFormValues(parameters));
        }
    }, [parameters, reset]);

    return {
        formMethods,
        formSchema,
        selectedTab,
        handleTabChange,
        paramsLoading,
        onSaveInline,
        onSaveDialog,
        tabIndexesWithError,
        onValidationError,
    };
};
