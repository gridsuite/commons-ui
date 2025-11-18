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
    GENERAL_APPLY_MODIFICATIONS,
    GENERATORS_SELECTION_TYPE,
    HIGH_VOLTAGE_LIMIT,
    LOW_VOLTAGE_LIMIT,
    REACTIVE_SLACKS_THRESHOLD,
    SHUNT_COMPENSATOR_ACTIVATION_THRESHOLD,
    SHUNT_COMPENSATORS_SELECTION_TYPE,
    VoltageInitTabValues as TabValues,
    TRANSFORMERS_SELECTION_TYPE,
    UPDATE_BUS_VOLTAGE,
    VARIABLE_Q_GENERATORS,
    VARIABLE_SHUNT_COMPENSATORS,
    VARIABLE_TRANSFORMERS,
    VOLTAGE_LIMITS_DEFAULT,
    VOLTAGE_LIMITS_MODIFICATION,
    DEFAULT_GENERAL_APPLY_MODIFICATIONS,
    DEFAULT_UPDATE_BUS_VOLTAGE,
    DEFAULT_REACTIVE_SLACKS_THRESHOLD,
    DEFAULT_SHUNT_COMPENSATOR_ACTIVATION_THRESHOLD,
    GENERAL,
} from './constants';
import { getVoltageInitParameters, updateParameter, updateVoltageInitParameters } from '../../../services';
import { useSnackMessage } from '../../../hooks';
import { ElementType, isBlankOrEmpty } from '../../../utils';
import { getNameElementEditorEmptyFormData, getNameElementEditorSchema } from '../common/name-element-editor';
import { EquipmentsSelectionType, VoltageInitStudyParameters } from './voltage-init.type';
import {
    fromStudyVoltageInitParamsDataToFormValues,
    fromVoltageInitParametersFormToParamValues,
    fromVoltageInitParamsDataToFormValues,
} from './voltage-init-form-utils';
import { SELECTED } from '../../dnd-table';
import { FILTERS, ID } from '../../../utils/constants/filterConstant';
import { snackWithFallback } from '../../../utils/error';

export interface UseVoltageInitParametersFormReturn {
    formMethods: UseFormReturn;
    formSchema: ObjectSchema<any>;
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
    const [selectedTab, setSelectedTab] = useState(TabValues.GENERAL);
    const [paramsLoading, setParamsLoading] = useState<boolean>(false);
    const [tabIndexesWithError, setTabIndexesWithError] = useState<TabValues[]>([]);
    const { snackError } = useSnackMessage();

    const handleTabChange = useCallback((_event: SyntheticEvent, newValue: TabValues) => {
        setSelectedTab(newValue);
    }, []);

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
                            .min(1, 'FilterInputMinError'),
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
                            .min(1, 'FilterInputMinError'),
                        [LOW_VOLTAGE_LIMIT]: yup
                            .number()
                            .min(0)
                            .nullable()
                            .test((value, context) => {
                                return !isBlankOrEmpty(value) || !isBlankOrEmpty(context.parent[HIGH_VOLTAGE_LIMIT]);
                            }),
                        [HIGH_VOLTAGE_LIMIT]: yup
                            .number()
                            .min(0)
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

    const onValidationError = useCallback(
        (errors: FieldErrors) => {
            const tabsInError = [];
            if (errors?.[GENERAL] && TabValues.GENERAL !== selectedTab) {
                tabsInError.push(TabValues.GENERAL);
            }
            // TODO: this system cannot work for other tabs, because formSchema keys does not match tab values
            setTabIndexesWithError(tabsInError);
        },
        [selectedTab]
    );

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
