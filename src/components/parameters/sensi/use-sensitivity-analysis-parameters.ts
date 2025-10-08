/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { useForm, UseFormReturn } from 'react-hook-form';
import { ObjectSchema } from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Dispatch, SetStateAction, useCallback, useEffect, useMemo, useState } from 'react';
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
    getGenericRowNewParams,
    getSensiHvdcformatNewParams,
    getSensiInjectionsformatNewParams,
    getSensiInjectionsSetformatNewParams,
    getSensiNodesformatNewParams,
    getSensiPstformatNewParams,
    IRowNewParams,
    SensitivityAnalysisParametersFormSchema,
} from './utils';
import {
    ACTIVATED,
    ANGLE_FLOW_SENSITIVITY_VALUE_THRESHOLD,
    CONTAINER_ID,
    CONTAINER_NAME,
    CONTINGENCIES,
    COUNT,
    DISTRIBUTION_TYPE,
    EQUIPMENTS_IN_VOLTAGE_REGULATION,
    FLOW_FLOW_SENSITIVITY_VALUE_THRESHOLD,
    FLOW_VOLTAGE_SENSITIVITY_VALUE_THRESHOLD,
    HVDC_LINES,
    INJECTIONS,
    MONITORED_BRANCHES,
    PARAMETER_SENSI_HVDC,
    PARAMETER_SENSI_INJECTION,
    PARAMETER_SENSI_INJECTIONS_SET,
    PARAMETER_SENSI_NODES,
    PARAMETER_SENSI_PST,
    PSTS,
    SENSI_INJECTIONS_SET,
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

type SubTabsValues = 'sensitivityInjectionsSet' | 'sensitivityInjection' | 'sensitivityHVDC' | 'sensitivityPST';

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
    isMaxReached: boolean;
    launchLoader: boolean;
    initRowsCount: () => void;
    onFormChanged: (formChanged: boolean) => void;
    onChangeParams: (row: any, arrayFormName: SubTabsValues, index: number) => void;
    emptyFormData: Record<string, unknown>;
    analysisComputeComplexity: number;
    setAnalysisComputeComplexity: Dispatch<SetStateAction<number>>;
}

const numberMax = 500000;

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
    const [analysisComputeComplexity, setAnalysisComputeComplexity] = useState(0);
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

    const { reset, getValues, setValue } = formMethods;

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

    const formatFilteredParams = useCallback((row: IRowNewParams) => {
        return getGenericRowNewParams(row);
    }, []);

    const getResultCount = useCallback(() => {
        const values = getValues();
        let totalResultCount = 0;
        const tabsToCheck: SubTabsValues[] = [
            'sensitivityInjectionsSet',
            'sensitivityInjection',
            'sensitivityHVDC',
            'sensitivityPST',
        ];
        tabsToCheck.forEach((tab) => {
            const tabToCheck = values[tab] as any[];
            // TODO: not easy to fix any here since values[SubTabsValues] have each time different type which causes problems with "filter"
            // "none of those signatures are compatible with each other
            if (tabToCheck) {
                const count = tabToCheck
                    .filter((entry) => entry[ACTIVATED])
                    .filter((entry) => entry[MONITORED_BRANCHES].length > 0)
                    .filter(
                        (entry) =>
                            entry[INJECTIONS]?.length > 0 || entry[PSTS]?.length > 0 || entry[HVDC_LINES]?.length > 0
                    )
                    .map((entry) => entry[COUNT])
                    .reduce((a, b) => a + b, 0);

                totalResultCount += count;
            }
        });
        setAnalysisComputeComplexity(totalResultCount);
        const timeoutId = setTimeout(() => {
            setLaunchLoader(false);
        }, 500);
        return () => clearTimeout(timeoutId);
    }, [getValues]);

    const onFormChanged = useCallback(
        (formChanged: boolean) => {
            if (formChanged) {
                setLaunchLoader(true);
                getResultCount();
            }
        },
        [getResultCount]
    );

    const onChangeParams = useCallback(
        (row: any, arrayFormName: SubTabsValues, index: number) => {
            // TODO: not easy to fix any here since values[SubTabsValues] have each time different type which causes problems with "filter"
            // "none of those signatures are compatible with each other
            if (!currentNodeUuid || !currentRootNetworkUuid) {
                return;
            }
            setLaunchLoader(true);
            getSensitivityAnalysisFactorsCount(
                studyUuid,
                currentNodeUuid,
                currentRootNetworkUuid,
                arrayFormName === SENSI_INJECTIONS_SET,
                formatFilteredParams(row)
            )
                .then((response) => {
                    response.text().then((value: string) => {
                        setValue(
                            `${arrayFormName}.${index}.${COUNT}`,
                            !Number.isNaN(Number(value)) ? parseInt(value, 10) : 0
                        );
                        getResultCount();
                    });
                })
                .catch((error) => {
                    setLaunchLoader(false);
                    snackError({
                        messageTxt: error.message,
                        headerId: 'getSensitivityAnalysisFactorsCountError',
                    });
                });
        },
        [snackError, studyUuid, currentRootNetworkUuid, formatFilteredParams, setValue, getResultCount, currentNodeUuid]
    );

    const fromSensitivityAnalysisParamsDataToFormValues = useCallback(
        (parameters: SensitivityAnalysisParametersInfos): SensitivityAnalysisParametersFormSchema => {
            const values = {
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
                            [COUNT]: 0,
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
                            [COUNT]: 0,
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
                            [COUNT]: 0,
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
                            [COUNT]: 0,
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
                            [COUNT]: 0,
                        };
                    }) ?? [],
            };
            return values;
        },
        []
    );

    const initRowsCount = useCallback(() => {
        const handleEntries = (entries: any[] | undefined, parameter: SubTabsValues) => {
            // TODO: not easy to fix any here since values[SubTabsValues] have each time different type which causes problems with "filter"
            // "none of those signatures are compatible with each other
            if (!entries) {
                return;
            }

            const entriesWithIndices = entries.map((entry, index) => ({
                entry,
                index,
            }));
            const filteredInitEntries = entries.filter(
                (entry) =>
                    entry[ACTIVATED] &&
                    entry[MONITORED_BRANCHES].length > 0 &&
                    (entry[INJECTIONS]?.length > 0 || entry[PSTS]?.length > 0 || entry[HVDC_LINES]?.length > 0)
            );
            filteredInitEntries.forEach((entry) => {
                const originalIndex = entriesWithIndices.findIndex((obj) => obj.entry === entry);
                onChangeParams(entry, parameter, originalIndex);
            });
        };

        const values = getValues();
        handleEntries(values[PARAMETER_SENSI_INJECTIONS_SET], PARAMETER_SENSI_INJECTIONS_SET);
        handleEntries(values[PARAMETER_SENSI_INJECTION], PARAMETER_SENSI_INJECTION);
        handleEntries(values[PARAMETER_SENSI_HVDC], PARAMETER_SENSI_HVDC);
        handleEntries(values[PARAMETER_SENSI_PST], PARAMETER_SENSI_PST);
    }, [onChangeParams, getValues]);

    const onSaveInline = useCallback(
        (newParams: Record<string, any>) => {
            setIsSubmitAction(true);
            setSensitivityAnalysisParameters(studyUuid, formatNewParams(newParams))
                .then(() => {
                    const formattedParams = formatNewParams(newParams);
                    setSensitivityAnalysisParams(formattedParams);
                    updateParameters(formattedParams);
                    initRowsCount();
                })
                .catch((error) => {
                    snackError({
                        messageTxt: error.message,
                        headerId: 'updateSensitivityAnalysisParametersError',
                    });
                });
        },
        [setSensitivityAnalysisParams, snackError, studyUuid, formatNewParams, initRowsCount, updateParameters]
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
                    snackError({
                        messageTxt: error.message,
                        headerId: 'updateSensitivityAnalysisParametersError',
                    });
                });
            }
        },
        [parametersUuid, formatNewParams, snackError]
    );

    useEffect(() => {
        if (sensitivityAnalysisParams) {
            reset(fromSensitivityAnalysisParamsDataToFormValues(sensitivityAnalysisParams));
            if (!isSubmitAction) {
                initRowsCount();
            }
        }
    }, [
        fromSensitivityAnalysisParamsDataToFormValues,
        sensitivityAnalysisParams,
        initRowsCount,
        isSubmitAction,
        reset,
    ]);
    useEffect(() => {
        if (params) {
            reset(fromSensitivityAnalysisParamsDataToFormValues(params));
        }
    }, [params, reset, fromSensitivityAnalysisParamsDataToFormValues]);

    const isMaxReached = useMemo(() => analysisComputeComplexity > numberMax, [analysisComputeComplexity]);

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
        isMaxReached,
        launchLoader,
        initRowsCount,
        onFormChanged,
        onChangeParams,
        emptyFormData,
        analysisComputeComplexity,
        setAnalysisComputeComplexity,
    };
};
