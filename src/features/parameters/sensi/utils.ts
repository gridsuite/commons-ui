/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { UUID } from 'node:crypto';
import { FieldValues } from 'react-hook-form';
import * as yup from 'yup';
import {
    ANGLE_FLOW_SENSITIVITY_VALUE_THRESHOLD,
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
import { NAME } from '../../../components/ui';
import { ID } from '../../../utils/constants/filterConstant';
import { ACTIVATED } from '../common/parameter-table-field';

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
                then: (schema) => schema.min(1, YUP_REQUIRED),
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
                [MONITORED_BRANCHES]: sensitivityHVDCs[MONITORED_BRANCHES].map((elem) => {
                    return {
                        id: elem[ID] as UUID,
                        name: elem[NAME],
                    };
                }),
                [HVDC_LINES]: sensitivityHVDCs[HVDC_LINES].map((elem) => {
                    return {
                        id: elem[ID] as UUID,
                        name: elem[NAME],
                    };
                }),
                [SENSITIVITY_TYPE]: sensitivityHVDCs[SENSITIVITY_TYPE],
                [CONTINGENCIES]: sensitivityHVDCs[CONTINGENCIES]?.map((elem) => {
                    return {
                        id: elem[ID] as UUID,
                        name: elem[NAME],
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
                [MONITORED_BRANCHES]: sensitivityInjections[MONITORED_BRANCHES].map((elem) => {
                    return {
                        id: elem[ID] as UUID,
                        name: elem[NAME],
                    };
                }),
                [INJECTIONS]: sensitivityInjections[INJECTIONS].map((elem) => {
                    return {
                        id: elem[ID] as UUID,
                        name: elem[NAME],
                    };
                }),
                [CONTINGENCIES]: sensitivityInjections[CONTINGENCIES]?.map((elem) => {
                    return {
                        id: elem[ID] as UUID,
                        name: elem[NAME],
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
                    then: (schema) => schema.min(1, YUP_REQUIRED),
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

export const getSensiInjectionsSetformatNewParams = (newParams: SensitivityAnalysisParametersFormSchema) => {
    return {
        [PARAMETER_SENSI_INJECTIONS_SET]: newParams.sensitivityInjectionsSet?.map((sensitivityInjectionSet) => {
            return {
                [MONITORED_BRANCHES]: sensitivityInjectionSet[MONITORED_BRANCHES].map((elem) => {
                    return {
                        id: elem[ID] as UUID,
                        name: elem[NAME],
                    };
                }),
                [INJECTIONS]: sensitivityInjectionSet[INJECTIONS].map((elem) => {
                    return {
                        id: elem[ID] as UUID,
                        name: elem[NAME],
                    };
                }),
                [DISTRIBUTION_TYPE]: sensitivityInjectionSet[DISTRIBUTION_TYPE],
                [CONTINGENCIES]: sensitivityInjectionSet[CONTINGENCIES]?.map((elem) => {
                    return {
                        id: elem[ID] as UUID,
                        name: elem[NAME],
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
            [SUPERVISED_VOLTAGE_LEVELS]: yup
                .array()
                .of(
                    yup.object().shape({
                        [ID]: yup.string().required(),
                        [NAME]: yup.string().required(),
                    })
                )
                .when([ACTIVATED], {
                    is: (activated: boolean) => activated,
                    then: (schema) => schema.min(1, YUP_REQUIRED),
                }),
            [EQUIPMENTS_IN_VOLTAGE_REGULATION]: yup
                .array()
                .of(
                    yup.object().shape({
                        [ID]: yup.string().required(),
                        [NAME]: yup.string().required(),
                    })
                )
                .when([ACTIVATED], {
                    is: (activated: boolean) => activated,
                    then: (schema) => schema.min(1, YUP_REQUIRED),
                }),
            ...getContingenciesSchema(),
        })
    ),
});

export const getSensiNodesformatNewParams = (newParams: SensitivityAnalysisParametersFormSchema) => {
    return {
        [PARAMETER_SENSI_NODES]: newParams.sensitivityNodes?.map((sensitivityNode) => {
            return {
                [SUPERVISED_VOLTAGE_LEVELS]: sensitivityNode[SUPERVISED_VOLTAGE_LEVELS]?.map((elem) => {
                    return {
                        id: elem[ID] as UUID,
                        name: elem[NAME],
                    };
                }),
                [EQUIPMENTS_IN_VOLTAGE_REGULATION]: sensitivityNode[EQUIPMENTS_IN_VOLTAGE_REGULATION]?.map((elem) => {
                    return {
                        id: elem[ID] as UUID,
                        name: elem[NAME],
                    };
                }),
                [CONTINGENCIES]: sensitivityNode[CONTINGENCIES]?.map((elem) => {
                    return {
                        id: elem[ID] as UUID,
                        name: elem[NAME],
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
                [MONITORED_BRANCHES]: sensitivityPSTs[MONITORED_BRANCHES].map((elem) => {
                    return {
                        id: elem[ID] as UUID,
                        name: elem[NAME],
                    };
                }),
                [PSTS]: sensitivityPSTs[PSTS].map((elem) => {
                    return {
                        id: elem[ID] as UUID,
                        name: elem[NAME],
                    };
                }),
                [SENSITIVITY_TYPE]: sensitivityPSTs[SENSITIVITY_TYPE],
                [CONTINGENCIES]: sensitivityPSTs[CONTINGENCIES]?.map((elem) => {
                    return {
                        id: elem[ID] as UUID,
                        name: elem[NAME],
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

export const hasMonitoredEquipments = (row: FieldValues): boolean => {
    return row[MONITORED_BRANCHES]?.length > 0 || row[SUPERVISED_VOLTAGE_LEVELS]?.length > 0;
};

export const isActivatedSensiParameterRow = (row: FieldValues) => {
    return row[ACTIVATED];
};

export const isValidSensiParameterRow = (row: FieldValues) => {
    return isActivatedSensiParameterRow(row) && hasMonitoredEquipments(row) && hasVariables(row);
};

export const filterSensiParameterRows = (rows?: FieldValues[]) =>
    (rows ?? []).filter((row) => isValidSensiParameterRow(row));

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
