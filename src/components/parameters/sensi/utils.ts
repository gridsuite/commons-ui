/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import yup from '../../../utils/yupConfig';
import {
    ACTIVATED,
    ANGLE_FLOW_SENSITIVITY_VALUE_THRESHOLD,
    CONTAINER_ID,
    CONTAINER_NAME,
    CONTINGENCIES,
    DISTRIBUTION_TYPE,
    EQUIPMENTS_IN_VOLTAGE_REGULATION, FactorsCount,
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
    SENSITIVITY_TYPE,
    SUPERVISED_VOLTAGE_LEVELS,
} from './constants';
import {DistributionType, SensitivityAnalysisParametersInfos, SensitivityType} from '../../../utils';
import {PROVIDER} from '../common';
import {getNameElementEditorSchema} from '../common/name-element-editor';
import {NAME} from '../../inputs';
import {ID} from '../../../utils/constants/filterConstant';
import {UseFormReturn} from "react-hook-form";
import {ObjectSchema} from "yup";

const getMonitoredBranchesSchema = () => {
    return {
        [MONITORED_BRANCHES]: yup
            .array()
            .of(
                yup.object().shape({
                    [ID]: yup.string().required(),
                    [NAME]: yup.string().required(),
                })
            )
            .required()
            .when([ACTIVATED], {
                is: (activated: boolean) => activated,
                then: (schema) => schema.min(1, 'FieldIsRequired'),
            }),
    };
};

const getSensitivityTypeSchema = () => {
    return {
        [SENSITIVITY_TYPE]: yup
            .mixed<SensitivityType>()
            .oneOf(Object.values(SensitivityType))
            .when([ACTIVATED], {
                is: (activated: boolean) => activated,
                then: (schema) => schema.required(),
            }),
    };
};

const getContingenciesSchema = () => {
    return {
        [CONTINGENCIES]: yup.array().of(
            yup.object().shape({
                [ID]: yup.string().required(),
                [NAME]: yup.string().required(),
            })
        ),
        [ACTIVATED]: yup.boolean().required(),
    };
};

export const getSensiHVDCsFormSchema = () => ({
    [PARAMETER_SENSI_HVDC]: yup.array().of(
        yup.object().shape({
            ...getMonitoredBranchesSchema(),
            ...getSensitivityTypeSchema(),
            [HVDC_LINES]: yup
                .array()
                .of(
                    yup.object().shape({
                        [ID]: yup.string().required(),
                        [NAME]: yup.string().required(),
                    })
                )
                .required()
                .when([ACTIVATED], {
                    is: (activated: boolean) => activated,
                    then: (schema) => schema.min(1, 'FieldIsRequired'),
                }),
            ...getContingenciesSchema(),
        })
    ),
});

export const getSensiHvdcformatNewParams = (newParams: SensitivityAnalysisParametersFormSchema) => {
    return {
        [PARAMETER_SENSI_HVDC]: newParams.sensitivityHVDC?.map((sensitivityHVDCs) => {
            return {
                [MONITORED_BRANCHES]: sensitivityHVDCs[MONITORED_BRANCHES].map((container) => {
                    return {
                        [CONTAINER_ID]: container[ID],
                        [CONTAINER_NAME]: container[NAME],
                    };
                }),
                [HVDC_LINES]: sensitivityHVDCs[HVDC_LINES].map((container) => {
                    return {
                        [CONTAINER_ID]: container[ID],
                        [CONTAINER_NAME]: container[NAME],
                    };
                }),
                [SENSITIVITY_TYPE]: sensitivityHVDCs[SENSITIVITY_TYPE],
                [CONTINGENCIES]: sensitivityHVDCs[CONTINGENCIES]?.map((container) => {
                    return {
                        [CONTAINER_ID]: container[ID],
                        [CONTAINER_NAME]: container[NAME],
                    };
                }),
                [ACTIVATED]: sensitivityHVDCs[ACTIVATED],
            };
        }),
    };
};

export const getSensiInjectionsFormSchema = () => ({
    [PARAMETER_SENSI_INJECTION]: yup.array().of(
        yup.object().shape({
            ...getMonitoredBranchesSchema(),
            [INJECTIONS]: yup
                .array()
                .of(
                    yup.object().shape({
                        [ID]: yup.string().required(),
                        [NAME]: yup.string().required(),
                    })
                )
                .required()
                .when([ACTIVATED], {
                    is: (activated: boolean) => activated,
                    then: (schema) => schema.min(1, 'FieldIsRequired'),
                }),
            ...getContingenciesSchema(),
        })
    ),
});

export const getSensiInjectionsformatNewParams = (newParams: SensitivityAnalysisParametersFormSchema) => {
    return {
        [PARAMETER_SENSI_INJECTION]: newParams.sensitivityInjection?.map((sensitivityInjections) => {
            return {
                [MONITORED_BRANCHES]: sensitivityInjections[MONITORED_BRANCHES].map((container) => {
                    return {
                        [CONTAINER_ID]: container[ID],
                        [CONTAINER_NAME]: container[NAME],
                    };
                }),
                [INJECTIONS]: sensitivityInjections[INJECTIONS].map((container) => {
                    return {
                        [CONTAINER_ID]: container[ID],
                        [CONTAINER_NAME]: container[NAME],
                    };
                }),
                [CONTINGENCIES]: sensitivityInjections[CONTINGENCIES]?.map((container) => {
                    return {
                        [CONTAINER_ID]: container[ID],
                        [CONTAINER_NAME]: container[NAME],
                    };
                }),
                [ACTIVATED]: sensitivityInjections[ACTIVATED],
            };
        }),
    };
};

export const getSensiInjectionsSetFormSchema = () => ({
    [PARAMETER_SENSI_INJECTIONS_SET]: yup.array().of(
        yup.object().shape({
            ...getMonitoredBranchesSchema(),
            [INJECTIONS]: yup
                .array()
                .of(
                    yup.object().shape({
                        [ID]: yup.string().required(),
                        [NAME]: yup.string().required(),
                    })
                )
                .required()
                .when([ACTIVATED], {
                    is: (activated: boolean) => activated,
                    then: (schema) => schema.min(1, 'FieldIsRequired'),
                }),
            [DISTRIBUTION_TYPE]: yup
                .mixed<DistributionType>()
                .oneOf(Object.values(DistributionType))
                .when([ACTIVATED], {
                    is: (activated: boolean) => activated,
                    then: (schema) => schema.required(),
                }),
            ...getContingenciesSchema(),
        })
    ),
});

export interface IRowNewParams {
    [MONITORED_BRANCHES]: Array<{
        [ID]: string;
        [NAME]: string;
    }>;
    [INJECTIONS]: Array<{
        [ID]: string;
        [NAME]: string;
    }>;
    [HVDC_LINES]: Array<{
        [ID]: string;
        [NAME]: string;
    }>;
    [PSTS]: Array<{
        [ID]: string;
        [NAME]: string;
    }>;
    [CONTINGENCIES]: Array<{
        [ID]: string;
        [NAME]: string;
    }>;
}

export const getGenericRowNewParams = (newRowParams: IRowNewParams) => {
    return {
        [MONITORED_BRANCHES]: newRowParams[MONITORED_BRANCHES].map((container) => container[ID]),
        [INJECTIONS]: newRowParams[INJECTIONS]?.map((container) => container[ID]),
        [HVDC_LINES]: newRowParams[HVDC_LINES]?.map((container) => container[ID]),
        [PSTS]: newRowParams[PSTS]?.map((container) => container[ID]),
        [CONTINGENCIES]: newRowParams[CONTINGENCIES]?.map((container) => container[ID]),
    };
};

export const getSensiInjectionsSetformatNewParams = (newParams: SensitivityAnalysisParametersFormSchema) => {
    return {
        [PARAMETER_SENSI_INJECTIONS_SET]: newParams.sensitivityInjectionsSet?.map((sensitivityInjectionSet) => {
            return {
                [MONITORED_BRANCHES]: sensitivityInjectionSet[MONITORED_BRANCHES].map((container) => {
                    return {
                        [CONTAINER_ID]: container[ID],
                        [CONTAINER_NAME]: container[NAME],
                    };
                }),
                [INJECTIONS]: sensitivityInjectionSet[INJECTIONS].map((container) => {
                    return {
                        [CONTAINER_ID]: container[ID],
                        [CONTAINER_NAME]: container[NAME],
                    };
                }),
                [DISTRIBUTION_TYPE]: sensitivityInjectionSet[DISTRIBUTION_TYPE],
                [CONTINGENCIES]: sensitivityInjectionSet[CONTINGENCIES]?.map((container) => {
                    return {
                        [CONTAINER_ID]: container[ID],
                        [CONTAINER_NAME]: container[NAME],
                    };
                }),
                [ACTIVATED]: sensitivityInjectionSet[ACTIVATED],
            };
        }),
    };
};

export const getSensiNodesFormSchema = () => ({
    [PARAMETER_SENSI_NODES]: yup.array().of(
        yup.object().shape({
            [SUPERVISED_VOLTAGE_LEVELS]: yup.array().of(
                yup.object().shape({
                    [ID]: yup.string().required(),
                    [NAME]: yup.string().required(),
                })
            ),
            [EQUIPMENTS_IN_VOLTAGE_REGULATION]: yup.array().of(
                yup.object().shape({
                    [ID]: yup.string().required(),
                    [NAME]: yup.string().required(),
                })
            ),
            ...getContingenciesSchema(),
        })
    ),
});

export const getSensiNodesformatNewParams = (newParams: SensitivityAnalysisParametersFormSchema) => {
    return {
        [PARAMETER_SENSI_NODES]: newParams.sensitivityNodes?.map((sensitivityNode) => {
            return {
                [SUPERVISED_VOLTAGE_LEVELS]: sensitivityNode[SUPERVISED_VOLTAGE_LEVELS]?.map((container) => {
                    return {
                        [CONTAINER_ID]: container[ID],
                        [CONTAINER_NAME]: container[NAME],
                    };
                }),
                [EQUIPMENTS_IN_VOLTAGE_REGULATION]: sensitivityNode[EQUIPMENTS_IN_VOLTAGE_REGULATION]?.map(
                    (container) => {
                        return {
                            [CONTAINER_ID]: container[ID],
                            [CONTAINER_NAME]: container[NAME],
                        };
                    }
                ),
                [CONTINGENCIES]: sensitivityNode[CONTINGENCIES]?.map((container) => {
                    return {
                        [CONTAINER_ID]: container[ID],
                        [CONTAINER_NAME]: container[NAME],
                    };
                }),
                [ACTIVATED]: sensitivityNode[ACTIVATED],
            };
        }),
    };
};

export const getSensiPSTsFormSchema = () => ({
    [PARAMETER_SENSI_PST]: yup.array().of(
        yup.object().shape({
            ...getMonitoredBranchesSchema(),
            ...getSensitivityTypeSchema(),
            [PSTS]: yup
                .array()
                .of(
                    yup.object().shape({
                        [ID]: yup.string().required(),
                        [NAME]: yup.string().required(),
                    })
                )
                .required()
                .when([ACTIVATED], {
                    is: (activated: boolean) => activated,
                    then: (schema) => schema.min(1, 'FieldIsRequired'),
                }),
            ...getContingenciesSchema(),
        })
    ),
});

export const getSensiPstformatNewParams = (newParams: SensitivityAnalysisParametersFormSchema) => {
    return {
        [PARAMETER_SENSI_PST]: newParams.sensitivityPST?.map((sensitivityPSTs) => {
            return {
                [MONITORED_BRANCHES]: sensitivityPSTs[MONITORED_BRANCHES].map((container) => {
                    return {
                        [CONTAINER_ID]: container[ID],
                        [CONTAINER_NAME]: container[NAME],
                    };
                }),
                [PSTS]: sensitivityPSTs[PSTS].map((container) => {
                    return {
                        [CONTAINER_ID]: container[ID],
                        [CONTAINER_NAME]: container[NAME],
                    };
                }),
                [SENSITIVITY_TYPE]: sensitivityPSTs[SENSITIVITY_TYPE],
                [CONTINGENCIES]: sensitivityPSTs[CONTINGENCIES]?.map((container) => {
                    return {
                        [CONTAINER_ID]: container[ID],
                        [CONTAINER_NAME]: container[NAME],
                    };
                }),
                [ACTIVATED]: sensitivityPSTs[ACTIVATED],
            };
        }),
    };
};

export const formSchema = yup
    .object()
    .shape({
        [PROVIDER]: yup.string().required(),
        [FLOW_FLOW_SENSITIVITY_VALUE_THRESHOLD]: yup.number().required(),
        [ANGLE_FLOW_SENSITIVITY_VALUE_THRESHOLD]: yup.number().required(),
        [FLOW_VOLTAGE_SENSITIVITY_VALUE_THRESHOLD]: yup.number().required(),
        ...getSensiInjectionsSetFormSchema(),
        ...getSensiInjectionsFormSchema(),
        ...getSensiHVDCsFormSchema(),
        ...getSensiPSTsFormSchema(),
        ...getSensiNodesFormSchema(),
    })
    .required();
export type SensitivityAnalysisParametersFormSchema = yup.InferType<typeof formSchema>;

export const getFormSchema = (name: string | null) => {
    return formSchema.concat(getNameElementEditorSchema(name));
};
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