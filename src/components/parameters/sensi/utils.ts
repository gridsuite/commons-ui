/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import type { FieldValues } from 'react-hook-form';
import { array, boolean, mixed, number, object, string, type InferType } from 'yup';
import {
    ANGLE_FLOW_SENSITIVITY_VALUE_THRESHOLD,
    CONTAINER_ID,
    CONTAINER_NAME,
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
    SENSITIVITY_TYPE,
    SUPERVISED_VOLTAGE_LEVELS,
} from './constants';
import { DistributionType, SensitivityType, YUP_REQUIRED } from '../../../utils';
import { CONTINGENCIES, PROVIDER } from '../common';
import { getNameElementEditorSchema } from '../common/name-element-editor';
import { NAME } from '../../inputs';
import { ID } from '../../../utils/constants/filterConstant';
import { ACTIVATED } from '../common/parameter-table';

const getMonitoredBranchesSchema = () => {
    return {
        [MONITORED_BRANCHES]: array()
            .of(
                object().shape({
                    [ID]: string().required(),
                    [NAME]: string().required(),
                })
            )
            .required()
            .when([ACTIVATED], {
                is: (activated: boolean) => activated,
                then: (schema) => schema.min(1, YUP_REQUIRED),
            }),
    };
};

const getSensitivityTypeSchema = () => {
    return {
        [SENSITIVITY_TYPE]: mixed<SensitivityType>()
            .oneOf(Object.values(SensitivityType))
            .when([ACTIVATED], {
                is: (activated: boolean) => activated,
                then: (schema) => schema.required(),
            }),
    };
};

const getContingenciesSchema = () => {
    return {
        [CONTINGENCIES]: array().of(
            object().shape({
                [ID]: string().required(),
                [NAME]: string().required(),
            })
        ),
        [ACTIVATED]: boolean().required(),
    };
};

export const getSensiHVDCsFormSchema = () => ({
    [PARAMETER_SENSI_HVDC]: array().of(
        object().shape({
            ...getMonitoredBranchesSchema(),
            ...getSensitivityTypeSchema(),
            [HVDC_LINES]: array()
                .of(
                    object().shape({
                        [ID]: string().required(),
                        [NAME]: string().required(),
                    })
                )
                .required()
                .when([ACTIVATED], {
                    is: (activated: boolean) => activated,
                    then: (schema) => schema.min(1, YUP_REQUIRED),
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
    [PARAMETER_SENSI_INJECTION]: array().of(
        object().shape({
            ...getMonitoredBranchesSchema(),
            [INJECTIONS]: array()
                .of(
                    object().shape({
                        [ID]: string().required(),
                        [NAME]: string().required(),
                    })
                )
                .required()
                .when([ACTIVATED], {
                    is: (activated: boolean) => activated,
                    then: (schema) => schema.min(1, YUP_REQUIRED),
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
    [PARAMETER_SENSI_INJECTIONS_SET]: array().of(
        object().shape({
            ...getMonitoredBranchesSchema(),
            [INJECTIONS]: array()
                .of(
                    object().shape({
                        [ID]: string().required(),
                        [NAME]: string().required(),
                    })
                )
                .required()
                .when([ACTIVATED], {
                    is: (activated: boolean) => activated,
                    then: (schema) => schema.min(1, YUP_REQUIRED),
                }),
            [DISTRIBUTION_TYPE]: mixed<DistributionType>()
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
    [PARAMETER_SENSI_NODES]: array().of(
        object().shape({
            [SUPERVISED_VOLTAGE_LEVELS]: array().of(
                object().shape({
                    [ID]: string().required(),
                    [NAME]: string().required(),
                })
            ),
            [EQUIPMENTS_IN_VOLTAGE_REGULATION]: array().of(
                object().shape({
                    [ID]: string().required(),
                    [NAME]: string().required(),
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
    [PARAMETER_SENSI_PST]: array().of(
        object().shape({
            ...getMonitoredBranchesSchema(),
            ...getSensitivityTypeSchema(),
            [PSTS]: array()
                .of(
                    object().shape({
                        [ID]: string().required(),
                        [NAME]: string().required(),
                    })
                )
                .required()
                .when([ACTIVATED], {
                    is: (activated: boolean) => activated,
                    then: (schema) => schema.min(1, YUP_REQUIRED),
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

export const hasVariables = (row: any): boolean => {
    return (
        row[INJECTIONS]?.length > 0 ||
        row[HVDC_LINES]?.length > 0 ||
        row[PSTS]?.length > 0 ||
        row[EQUIPMENTS_IN_VOLTAGE_REGULATION]?.length > 0
    );
};

export const hasMonitoredEquipments = (row: any): boolean => {
    return row[MONITORED_BRANCHES]?.length > 0 || row[SUPERVISED_VOLTAGE_LEVELS]?.length > 0;
};

export const isActivatedSensiParameterRow = (entry: FieldValues) => {
    return entry[ACTIVATED];
};

export const isValidSensiParameterRow = (entry: FieldValues) => {
    return isActivatedSensiParameterRow(entry) && hasMonitoredEquipments(entry) && hasVariables(entry);
};

export const filterSensiParameterRows = (entries?: FieldValues[]) =>
    (entries ?? []).filter((entry) => isValidSensiParameterRow(entry));

export const formSchema = object()
    .shape({
        [PROVIDER]: string().required(),
        [FLOW_FLOW_SENSITIVITY_VALUE_THRESHOLD]: number().required(),
        [ANGLE_FLOW_SENSITIVITY_VALUE_THRESHOLD]: number().required(),
        [FLOW_VOLTAGE_SENSITIVITY_VALUE_THRESHOLD]: number().required(),
        ...getSensiInjectionsSetFormSchema(),
        ...getSensiInjectionsFormSchema(),
        ...getSensiHVDCsFormSchema(),
        ...getSensiPSTsFormSchema(),
        ...getSensiNodesFormSchema(),
    })
    .required();
export type SensitivityAnalysisParametersFormSchema = InferType<typeof formSchema>;

export const getFormSchema = (name: string | null) => {
    return formSchema.concat(getNameElementEditorSchema(name));
};
