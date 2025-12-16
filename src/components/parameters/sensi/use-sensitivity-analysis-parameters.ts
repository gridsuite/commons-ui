/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { useForm, UseFormReturn } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { type ObjectSchema } from 'yup';
import { useCallback, useEffect, useMemo, useState } from 'react';
import type { UUID } from 'node:crypto';
import { ComputingType, PROVIDER } from '../common';
import {
    ElementType,
    FieldConstants,
    SensitivityAnalysisParametersInfos,
    UseParametersBackendReturnProps,
} from '../../../utils';
import {
    getFormSchema,
    getSensiHvdcformatNewParams,
    getSensiInjectionsformatNewParams,
    getSensiInjectionsSetformatNewParams,
    getSensiNodesformatNewParams,
    getSensiPstformatNewParams,
    SensitivityAnalysisParametersFormSchema,
} from './utils';
import {
    ACTIVATED,
    ANGLE_FLOW_SENSITIVITY_VALUE_THRESHOLD,
    CONTAINER_ID,
    CONTAINER_NAME,
    CONTINGENCIES,
    DISTRIBUTION_TYPE,
    EQUIPMENTS_IN_VOLTAGE_REGULATION,
    FactorsCount,
    FLOW_FLOW_SENSITIVITY_VALUE_THRESHOLD,
    FLOW_VOLTAGE_SENSITIVITY_VALUE_THRESHOLD,
    HVDC_LINES,
    INJECTIONS,
    MAX_RESULTS_COUNT,
    MAX_VARIABLES_COUNT,
    MONITORED_BRANCHES,
    PARAMETER_SENSI_HVDC,
    PARAMETER_SENSI_INJECTION,
    PARAMETER_SENSI_INJECTIONS_SET,
    PARAMETER_SENSI_NODES,
    PARAMETER_SENSI_PST,
    PSTS,
    SENSITIVITY_TYPE,
    SUPERVISED_VOLTAGE_LEVELS,
} from './constants';
import {
    getSensitivityAnalysisFactorsCount,
    setSensitivityAnalysisParameters,
} from '../../../services/sensitivity-analysis';
import { updateParameter } from '../../../services';
import { useSnackMessage } from '../../../hooks';
import { getNameElementEditorEmptyFormData } from '../common/name-element-editor';
import { snackWithFallback } from '../../../utils/error';

export interface UseSensitivityAnalysisParametersReturn {
    formMethods: UseFormReturn<any>;
    formSchema: ObjectSchema<any>;
    formattedProviders: { id: string; label: string }[];
    fromSensitivityAnalysisParamsDataToFormValues: (parameters: SensitivityAnalysisParametersInfos) => any;
    formatNewParams: (formData: Record<string, any>) => SensitivityAnalysisParametersInfos;
    params: SensitivityAnalysisParametersInfos | null;
    paramsLoaded: boolean;
    isStudyLinked: boolean;
    onSaveInline: (formData: Record<string, any>) => void;
    onSaveDialog: (formData: Record<string, any>) => void;
    isMaxResultsReached: boolean;
    isMaxVariablesReached: boolean;
    launchLoader: boolean;
    onFormChanged: (formChanged: boolean) => void;
    emptyFormData: Record<string, unknown>;
    factorsCount: FactorsCount;
    resetFactorsCount: () => void;
}

type UseSensitivityAnalysisParametersFormProps =
    | {
          name: string;
          description: string | null;
          studyUuid: null;
          currentNodeUuid: null;
          currentRootNetworkUuid: null;
          parametersBackend: UseParametersBackendReturnProps<ComputingType.SENSITIVITY_ANALYSIS>;
          parametersUuid: UUID;
      }
    | {
          name: null;
          description: null;
          studyUuid: UUID | null;
          currentNodeUuid: UUID | null;
          currentRootNetworkUuid: UUID | null;
          parametersBackend: UseParametersBackendReturnProps<ComputingType.SENSITIVITY_ANALYSIS>;
          parametersUuid: null;
      };

export const useSensitivityAnalysisParametersForm = ({
    studyUuid,
    currentNodeUuid,
    currentRootNetworkUuid,
    parametersBackend,
    parametersUuid,
    name,
    description,
}: UseSensitivityAnalysisParametersFormProps): UseSensitivityAnalysisParametersReturn => {
    const [providers, , , , , params, , updateParameters] = parametersBackend;
    const [sensitivityAnalysisParams, setSensitivityAnalysisParams] = useState(params);
    const { snackError } = useSnackMessage();
    const [factorsCount, setFactorsCount] = useState<FactorsCount>({ resultCount: 0, variableCount: 0 });
    const [launchLoader, setLaunchLoader] = useState(false);
    const [isSubmitAction, setIsSubmitAction] = useState(false);

    const emptyFormData = useMemo(() => {
        return {
            ...getNameElementEditorEmptyFormData(name, description),
            [PROVIDER]: '',
            [FLOW_FLOW_SENSITIVITY_VALUE_THRESHOLD]: 0,
            [ANGLE_FLOW_SENSITIVITY_VALUE_THRESHOLD]: 0,
            [FLOW_VOLTAGE_SENSITIVITY_VALUE_THRESHOLD]: 0,
            [PARAMETER_SENSI_INJECTIONS_SET]: [],
            [PARAMETER_SENSI_INJECTION]: [],
            [PARAMETER_SENSI_HVDC]: [],
            [PARAMETER_SENSI_PST]: [],
            [PARAMETER_SENSI_NODES]: [],
        };
    }, [description, name]);

    const isStudyLinked = useMemo(() => {
        return studyUuid !== null && currentNodeUuid !== null && currentRootNetworkUuid !== null;
    }, [currentNodeUuid, currentRootNetworkUuid, studyUuid]);

    const formSchema = useMemo(() => {
        return getFormSchema(name);
    }, [name]);

    const formMethods = useForm({
        defaultValues: emptyFormData,
        resolver: yupResolver(formSchema),
    });

    const { reset, getValues } = formMethods;

    const formattedProviders = Object.keys(providers).map((key) => ({
        id: key,
        label: providers[key],
    }));

    const formatNewParams = useCallback((newParams: Record<string, any>) => {
        return {
            [PROVIDER]: newParams[PROVIDER],
            [FLOW_FLOW_SENSITIVITY_VALUE_THRESHOLD]: newParams[FLOW_FLOW_SENSITIVITY_VALUE_THRESHOLD],
            [ANGLE_FLOW_SENSITIVITY_VALUE_THRESHOLD]: newParams[ANGLE_FLOW_SENSITIVITY_VALUE_THRESHOLD],
            [FLOW_VOLTAGE_SENSITIVITY_VALUE_THRESHOLD]: newParams[FLOW_VOLTAGE_SENSITIVITY_VALUE_THRESHOLD],
            ...getSensiInjectionsSetformatNewParams(newParams as SensitivityAnalysisParametersFormSchema),
            ...getSensiInjectionsformatNewParams(newParams as SensitivityAnalysisParametersFormSchema),
            ...getSensiHvdcformatNewParams(newParams as SensitivityAnalysisParametersFormSchema),
            ...getSensiPstformatNewParams(newParams as SensitivityAnalysisParametersFormSchema),
            ...getSensiNodesformatNewParams(newParams as SensitivityAnalysisParametersFormSchema),
        };
    }, []);

    const resetFactorsCount = useCallback(() => {
        setLaunchLoader(false);
        setFactorsCount({ resultCount: 0, variableCount: 0 });
    }, []);

    const getFactorsCount = useCallback(() => {
        if (!currentNodeUuid || !currentRootNetworkUuid) {
            return;
        }

        const formValues = getValues();

        const filterEntries = (entries: any[] | undefined) => {
            if (!entries) return [];
            return entries
                .filter((entry) => entry[ACTIVATED])
                .filter(
                    (entry) => entry[MONITORED_BRANCHES]?.length > 0 || entry[SUPERVISED_VOLTAGE_LEVELS]?.length > 0
                )
                .filter(
                    (entry) =>
                        entry[INJECTIONS]?.length > 0 ||
                        entry[PSTS]?.length > 0 ||
                        entry[HVDC_LINES]?.length > 0 ||
                        entry[EQUIPMENTS_IN_VOLTAGE_REGULATION]?.length > 0
                );
        };

        const filteredInjectionsSet = filterEntries(formValues[PARAMETER_SENSI_INJECTIONS_SET]);
        const filteredInjection = filterEntries(formValues[PARAMETER_SENSI_INJECTION]);
        const filteredHvdc = filterEntries(formValues[PARAMETER_SENSI_HVDC]);
        const filteredPst = filterEntries(formValues[PARAMETER_SENSI_PST]);
        const filteredNodes = filterEntries(formValues[PARAMETER_SENSI_NODES]);

        const hasAnyEntries =
            filteredInjectionsSet.length > 0 ||
            filteredInjection.length > 0 ||
            filteredHvdc.length > 0 ||
            filteredPst.length > 0 ||
            filteredNodes.length > 0;

        if (!hasAnyEntries) {
            resetFactorsCount();
            return;
        }

        const filteredFormValues = {
            ...formValues,
            [PARAMETER_SENSI_INJECTIONS_SET]: filteredInjectionsSet,
            [PARAMETER_SENSI_INJECTION]: filteredInjection,
            [PARAMETER_SENSI_HVDC]: filteredHvdc,
            [PARAMETER_SENSI_PST]: filteredPst,
            [PARAMETER_SENSI_NODES]: filteredNodes,
        };

        setLaunchLoader(true);
        getSensitivityAnalysisFactorsCount(
            studyUuid,
            currentNodeUuid,
            currentRootNetworkUuid,
            formatNewParams(filteredFormValues)
        )
            .then((response) => {
                response.text().then((value: string) => {
                    const parsed = JSON.parse(value);
                    setFactorsCount({
                        resultCount: !Number.isNaN(Number(parsed.resultCount)) ? parseInt(parsed.resultCount, 10) : 0,
                        variableCount: !Number.isNaN(Number(parsed.variableCount))
                            ? parseInt(parsed.variableCount, 10)
                            : 0,
                    });
                    const timeoutId = setTimeout(() => {
                        setLaunchLoader(false);
                    }, 500);
                    return () => clearTimeout(timeoutId);
                });
            })
            .catch((error) => {
                setLaunchLoader(false);
                snackWithFallback(snackError, error, { headerId: 'getSensitivityAnalysisFactorsCountError' });
            });
    }, [snackError, studyUuid, currentRootNetworkUuid, formatNewParams, currentNodeUuid, getValues, resetFactorsCount]);

    const onFormChanged = useCallback(() => {
        getFactorsCount();
    }, [getFactorsCount]);

    const fromSensitivityAnalysisParamsDataToFormValues = useCallback(
        (parameters: SensitivityAnalysisParametersInfos): SensitivityAnalysisParametersFormSchema => {
            return {
                [PROVIDER]: parameters[PROVIDER],
                [FLOW_FLOW_SENSITIVITY_VALUE_THRESHOLD]: parameters.flowFlowSensitivityValueThreshold,
                [ANGLE_FLOW_SENSITIVITY_VALUE_THRESHOLD]: parameters.angleFlowSensitivityValueThreshold,
                [FLOW_VOLTAGE_SENSITIVITY_VALUE_THRESHOLD]: parameters.flowVoltageSensitivityValueThreshold,
                [PARAMETER_SENSI_INJECTIONS_SET]:
                    parameters.sensitivityInjectionsSet?.map((sensiInjectionsSet) => {
                        return {
                            [MONITORED_BRANCHES]:
                                sensiInjectionsSet[MONITORED_BRANCHES]?.map((sensiInjection) => {
                                    return {
                                        [FieldConstants.ID]: sensiInjection[CONTAINER_ID],
                                        [FieldConstants.NAME]: sensiInjection[CONTAINER_NAME],
                                    };
                                }) ?? [],
                            [INJECTIONS]:
                                sensiInjectionsSet[INJECTIONS]?.map((sensiInjection) => {
                                    return {
                                        [FieldConstants.ID]: sensiInjection[CONTAINER_ID],
                                        [FieldConstants.NAME]: sensiInjection[CONTAINER_NAME],
                                    };
                                }) ?? [],
                            [DISTRIBUTION_TYPE]: sensiInjectionsSet[DISTRIBUTION_TYPE],
                            [CONTINGENCIES]:
                                sensiInjectionsSet[CONTINGENCIES]?.map((sensiInjection) => {
                                    return {
                                        [FieldConstants.ID]: sensiInjection[CONTAINER_ID],
                                        [FieldConstants.NAME]: sensiInjection[CONTAINER_NAME],
                                    };
                                }) ?? [],
                            [ACTIVATED]: sensiInjectionsSet[ACTIVATED] ?? false,
                        };
                    }) ?? [],

                [PARAMETER_SENSI_INJECTION]:
                    parameters.sensitivityInjection?.map((sensiInjections) => {
                        return {
                            [MONITORED_BRANCHES]:
                                sensiInjections[MONITORED_BRANCHES]?.map((sensiInjection) => {
                                    return {
                                        [FieldConstants.ID]: sensiInjection[CONTAINER_ID],
                                        [FieldConstants.NAME]: sensiInjection[CONTAINER_NAME],
                                    };
                                }) ?? [],
                            [INJECTIONS]:
                                sensiInjections[INJECTIONS]?.map((sensiInjection) => {
                                    return {
                                        [FieldConstants.ID]: sensiInjection[CONTAINER_ID],
                                        [FieldConstants.NAME]: sensiInjection[CONTAINER_NAME],
                                    };
                                }) ?? [],
                            [CONTINGENCIES]:
                                sensiInjections[CONTINGENCIES]?.map((sensiInjection) => {
                                    return {
                                        [FieldConstants.ID]: sensiInjection[CONTAINER_ID],
                                        [FieldConstants.NAME]: sensiInjection[CONTAINER_NAME],
                                    };
                                }) ?? [],
                            [ACTIVATED]: sensiInjections[ACTIVATED] ?? false,
                        };
                    }) ?? [],
                [PARAMETER_SENSI_HVDC]:
                    parameters.sensitivityHVDC?.map((sensiInjectionsSet) => {
                        return {
                            [MONITORED_BRANCHES]:
                                sensiInjectionsSet[MONITORED_BRANCHES]?.map((sensiInjection) => {
                                    return {
                                        [FieldConstants.ID]: sensiInjection[CONTAINER_ID],
                                        [FieldConstants.NAME]: sensiInjection[CONTAINER_NAME],
                                    };
                                }) ?? [],
                            [HVDC_LINES]:
                                sensiInjectionsSet[HVDC_LINES]?.map((sensiInjection) => {
                                    return {
                                        [FieldConstants.ID]: sensiInjection[CONTAINER_ID],
                                        [FieldConstants.NAME]: sensiInjection[CONTAINER_NAME],
                                    };
                                }) ?? [],
                            [SENSITIVITY_TYPE]: sensiInjectionsSet[SENSITIVITY_TYPE],
                            [CONTINGENCIES]:
                                sensiInjectionsSet[CONTINGENCIES]?.map((sensiInjection) => {
                                    return {
                                        [FieldConstants.ID]: sensiInjection[CONTAINER_ID],
                                        [FieldConstants.NAME]: sensiInjection[CONTAINER_NAME],
                                    };
                                }) ?? [],
                            [ACTIVATED]: sensiInjectionsSet[ACTIVATED] ?? false,
                        };
                    }) ?? [],
                [PARAMETER_SENSI_PST]:
                    parameters.sensitivityPST?.map((sensiInjectionsSet) => {
                        return {
                            [MONITORED_BRANCHES]:
                                sensiInjectionsSet[MONITORED_BRANCHES]?.map((sensiInjection) => {
                                    return {
                                        [FieldConstants.ID]: sensiInjection[CONTAINER_ID],
                                        [FieldConstants.NAME]: sensiInjection[CONTAINER_NAME],
                                    };
                                }) ?? [],
                            [PSTS]:
                                sensiInjectionsSet[PSTS]?.map((sensiInjection) => {
                                    return {
                                        [FieldConstants.ID]: sensiInjection[CONTAINER_ID],
                                        [FieldConstants.NAME]: sensiInjection[CONTAINER_NAME],
                                    };
                                }) ?? [],
                            [SENSITIVITY_TYPE]: sensiInjectionsSet[SENSITIVITY_TYPE],
                            [CONTINGENCIES]:
                                sensiInjectionsSet[CONTINGENCIES]?.map((sensiInjection) => {
                                    return {
                                        [FieldConstants.ID]: sensiInjection[CONTAINER_ID],
                                        [FieldConstants.NAME]: sensiInjection[CONTAINER_NAME],
                                    };
                                }) ?? [],
                            [ACTIVATED]: sensiInjectionsSet[ACTIVATED] ?? false,
                        };
                    }) ?? [],
                [PARAMETER_SENSI_NODES]:
                    parameters.sensitivityNodes?.map((sensiInjectionsSet) => {
                        return {
                            [SUPERVISED_VOLTAGE_LEVELS]:
                                sensiInjectionsSet[SUPERVISED_VOLTAGE_LEVELS]?.map((sensiInjection) => {
                                    return {
                                        [FieldConstants.ID]: sensiInjection[CONTAINER_ID],
                                        [FieldConstants.NAME]: sensiInjection[CONTAINER_NAME],
                                    };
                                }) ?? [],
                            [EQUIPMENTS_IN_VOLTAGE_REGULATION]:
                                sensiInjectionsSet[EQUIPMENTS_IN_VOLTAGE_REGULATION]?.map((sensiInjection) => {
                                    return {
                                        [FieldConstants.ID]: sensiInjection[CONTAINER_ID],
                                        [FieldConstants.NAME]: sensiInjection[CONTAINER_NAME],
                                    };
                                }) ?? [],
                            [CONTINGENCIES]:
                                sensiInjectionsSet[CONTINGENCIES]?.map((sensiInjection) => {
                                    return {
                                        [FieldConstants.ID]: sensiInjection[CONTAINER_ID],
                                        [FieldConstants.NAME]: sensiInjection[CONTAINER_NAME],
                                    };
                                }) ?? [],
                            [ACTIVATED]: sensiInjectionsSet[ACTIVATED] ?? false,
                        };
                    }) ?? [],
            };
        },
        []
    );

    const onSaveInline = useCallback(
        (newParams: Record<string, any>) => {
            setIsSubmitAction(true);
            setSensitivityAnalysisParameters(studyUuid, formatNewParams(newParams))
                .then(() => {
                    const formattedParams = formatNewParams(newParams);
                    setSensitivityAnalysisParams(formattedParams);
                    updateParameters(formattedParams);
                })
                .catch((error) => {
                    snackWithFallback(snackError, error, { headerId: 'updateSensitivityAnalysisParametersError' });
                });
        },
        [setSensitivityAnalysisParams, snackError, studyUuid, formatNewParams, updateParameters]
    );

    const onSaveDialog = useCallback(
        (formData: Record<string, any>) => {
            if (parametersUuid) {
                updateParameter(
                    parametersUuid,
                    formatNewParams(formData),
                    formData[FieldConstants.NAME],
                    ElementType.SENSITIVITY_PARAMETERS,
                    formData[FieldConstants.DESCRIPTION] ?? ''
                ).catch((error) => {
                    snackWithFallback(snackError, error, { headerId: 'updateSensitivityAnalysisParametersError' });
                });
            }
        },
        [parametersUuid, formatNewParams, snackError]
    );

    useEffect(() => {
        if (sensitivityAnalysisParams) {
            reset(fromSensitivityAnalysisParamsDataToFormValues(sensitivityAnalysisParams));
            if (!isSubmitAction) {
                getFactorsCount();
            }
        }
    }, [
        fromSensitivityAnalysisParamsDataToFormValues,
        sensitivityAnalysisParams,
        isSubmitAction,
        reset,
        getFactorsCount,
    ]);
    useEffect(() => {
        if (params) {
            reset(fromSensitivityAnalysisParamsDataToFormValues(params));
        }
    }, [params, reset, fromSensitivityAnalysisParamsDataToFormValues]);

    const isMaxResultsReached = useMemo(() => factorsCount.resultCount > MAX_RESULTS_COUNT, [factorsCount]);

    const isMaxVariablesReached = useMemo(() => factorsCount.variableCount > MAX_VARIABLES_COUNT, [factorsCount]);

    const paramsLoaded = useMemo(() => !!params, [params]);

    return {
        formMethods,
        formSchema,
        formattedProviders,
        fromSensitivityAnalysisParamsDataToFormValues,
        formatNewParams,
        params,
        paramsLoaded,
        isStudyLinked,
        onSaveInline,
        onSaveDialog,
        isMaxResultsReached,
        isMaxVariablesReached,
        launchLoader,
        onFormChanged,
        emptyFormData,
        factorsCount,
        resetFactorsCount,
    };
};
