/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { UUID } from 'crypto';
import { EquipmentsSelectionType, VoltageInitParameters, VoltageInitStudyParameters } from './voltage-init.type';
import {
    FILTERS,
    GENERAL_APPLY_MODIFICATIONS,
    GENERATORS_SELECTION_TYPE,
    HIGH_VOLTAGE_LIMIT,
    ID,
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
    FILTER_ID,
    FILTER_NAME,
    PRIORITY,
} from './constants';
import { NAME } from '../../inputs';
import { FieldConstants } from '../../../utils';

export const fromVoltageInitParametersFormToParamValues = (
    newParams: Record<string, any>
): VoltageInitStudyParameters => {
    return {
        applyModifications:
            newParams?.[TabValues.GENERAL]?.[GENERAL_APPLY_MODIFICATIONS] ?? DEFAULT_GENERAL_APPLY_MODIFICATIONS,
        computationParameters: {
            [UPDATE_BUS_VOLTAGE]: newParams?.[TabValues.GENERAL]?.[UPDATE_BUS_VOLTAGE] ?? DEFAULT_UPDATE_BUS_VOLTAGE,
            [REACTIVE_SLACKS_THRESHOLD]:
                newParams?.[TabValues.GENERAL]?.[REACTIVE_SLACKS_THRESHOLD] ?? DEFAULT_REACTIVE_SLACKS_THRESHOLD,
            [SHUNT_COMPENSATOR_ACTIVATION_THRESHOLD]:
                newParams?.[TabValues.GENERAL]?.[SHUNT_COMPENSATOR_ACTIVATION_THRESHOLD] ??
                DEFAULT_SHUNT_COMPENSATOR_ACTIVATION_THRESHOLD,
            [VOLTAGE_LIMITS_MODIFICATION]:
                newParams.voltageLimitsModification?.map((voltageLimit: any) => {
                    return {
                        [PRIORITY]: newParams.voltageLimitsModification?.indexOf(voltageLimit),
                        [LOW_VOLTAGE_LIMIT]: voltageLimit[LOW_VOLTAGE_LIMIT] ?? 0,
                        [HIGH_VOLTAGE_LIMIT]: voltageLimit[HIGH_VOLTAGE_LIMIT] ?? 0,
                        [FILTERS]:
                            voltageLimit[FILTERS]?.map((filter: any) => {
                                return {
                                    [FILTER_ID]: filter[ID] as UUID,
                                    [FILTER_NAME]: filter[NAME],
                                };
                            }) ?? [],
                    };
                }) ?? [],
            [VOLTAGE_LIMITS_DEFAULT]:
                newParams.voltageLimitsDefault?.map((voltageLimit: any) => {
                    return {
                        [PRIORITY]: newParams.voltageLimitsDefault?.indexOf(voltageLimit),
                        [LOW_VOLTAGE_LIMIT]: voltageLimit[LOW_VOLTAGE_LIMIT] ?? 0,
                        [HIGH_VOLTAGE_LIMIT]: voltageLimit[HIGH_VOLTAGE_LIMIT] ?? 0,
                        [FILTERS]:
                            voltageLimit[FILTERS]?.map((filter: any) => {
                                return {
                                    [FILTER_ID]: filter[ID] as UUID,
                                    [FILTER_NAME]: filter[NAME],
                                };
                            }) ?? [],
                    };
                }) ?? [],
            [GENERATORS_SELECTION_TYPE]:
                (newParams[GENERATORS_SELECTION_TYPE] as EquipmentsSelectionType) ?? EquipmentsSelectionType.ALL_EXCEPT,
            [VARIABLE_Q_GENERATORS]:
                newParams[VARIABLE_Q_GENERATORS]?.map((filter: any) => {
                    return {
                        [FILTER_ID]: filter[ID] as UUID,
                        [FILTER_NAME]: filter[NAME],
                    };
                }) ?? [],
            [TRANSFORMERS_SELECTION_TYPE]:
                (newParams[TRANSFORMERS_SELECTION_TYPE] as EquipmentsSelectionType) ??
                EquipmentsSelectionType.NONE_EXCEPT,
            [VARIABLE_TRANSFORMERS]:
                newParams[VARIABLE_TRANSFORMERS]?.map((filter: any) => {
                    return {
                        [FILTER_ID]: filter[ID] as UUID,
                        [FILTER_NAME]: filter[NAME],
                    };
                }) ?? [],
            [SHUNT_COMPENSATORS_SELECTION_TYPE]:
                (newParams[SHUNT_COMPENSATORS_SELECTION_TYPE] as EquipmentsSelectionType) ??
                EquipmentsSelectionType.NONE_EXCEPT,
            [VARIABLE_SHUNT_COMPENSATORS]:
                newParams[VARIABLE_SHUNT_COMPENSATORS]?.map((filter: any) => {
                    return {
                        [FILTER_ID]: filter[ID] as UUID,
                        [FILTER_NAME]: filter[NAME],
                    };
                }) ?? [],
        },
    };
};

// init Form from voltage-init parameters
export const fromVoltageInitParamsDataToFormValues = (parameters: VoltageInitParameters): Record<string, any> => {
    return {
        [TabValues.GENERAL]: {
            [GENERAL_APPLY_MODIFICATIONS]: DEFAULT_GENERAL_APPLY_MODIFICATIONS,
            [UPDATE_BUS_VOLTAGE]: parameters[UPDATE_BUS_VOLTAGE],
            [REACTIVE_SLACKS_THRESHOLD]: parameters.reactiveSlacksThreshold,
            [SHUNT_COMPENSATOR_ACTIVATION_THRESHOLD]: parameters.shuntCompensatorActivationThreshold,
        },
        [VOLTAGE_LIMITS_MODIFICATION]:
            parameters?.voltageLimitsModification?.map((voltageLimit) => {
                return {
                    [FieldConstants.SELECTED]: false,
                    [FILTERS]: voltageLimit[FILTERS]?.map((filter) => {
                        return {
                            [ID]: filter[FILTER_ID],
                            [NAME]: filter[FILTER_NAME],
                        };
                    }),
                    [LOW_VOLTAGE_LIMIT]: voltageLimit[LOW_VOLTAGE_LIMIT],
                    [HIGH_VOLTAGE_LIMIT]: voltageLimit[HIGH_VOLTAGE_LIMIT],
                };
            }) ?? [],
        [VOLTAGE_LIMITS_DEFAULT]:
            parameters?.voltageLimitsDefault?.map((voltageLimit) => {
                return {
                    [FieldConstants.SELECTED]: false,
                    [FILTERS]: voltageLimit[FILTERS]?.map((filter) => {
                        return {
                            [ID]: filter[FILTER_ID],
                            [NAME]: filter[FILTER_NAME],
                        };
                    }),
                    [LOW_VOLTAGE_LIMIT]: voltageLimit[LOW_VOLTAGE_LIMIT],
                    [HIGH_VOLTAGE_LIMIT]: voltageLimit[HIGH_VOLTAGE_LIMIT],
                };
            }) ?? [],
        [GENERATORS_SELECTION_TYPE]: parameters?.[GENERATORS_SELECTION_TYPE] ?? EquipmentsSelectionType.ALL_EXCEPT,
        [VARIABLE_Q_GENERATORS]: parameters?.[VARIABLE_Q_GENERATORS]?.map((filter) => {
            return {
                [ID]: filter[FILTER_ID],
                [NAME]: filter[FILTER_NAME],
            };
        }),
        [TRANSFORMERS_SELECTION_TYPE]: parameters?.[TRANSFORMERS_SELECTION_TYPE] ?? EquipmentsSelectionType.NONE_EXCEPT,
        [VARIABLE_TRANSFORMERS]: parameters?.[VARIABLE_TRANSFORMERS]?.map((filter) => {
            return {
                [ID]: filter[FILTER_ID],
                [NAME]: filter[FILTER_NAME],
            };
        }),
        [SHUNT_COMPENSATORS_SELECTION_TYPE]:
            parameters?.[SHUNT_COMPENSATORS_SELECTION_TYPE] ?? EquipmentsSelectionType.NONE_EXCEPT,
        [VARIABLE_SHUNT_COMPENSATORS]: parameters?.[VARIABLE_SHUNT_COMPENSATORS]?.map((filter) => {
            return {
                [ID]: filter[FILTER_ID],
                [NAME]: filter[FILTER_NAME],
            };
        }),
    };
};

// init Form from study parameters
export const fromStudyVoltageInitParamsDataToFormValues = (
    parameters: VoltageInitStudyParameters
): Record<string, any> => {
    return {
        [TabValues.GENERAL]: {
            [GENERAL_APPLY_MODIFICATIONS]: parameters.applyModifications,
            [UPDATE_BUS_VOLTAGE]: parameters?.computationParameters?.[UPDATE_BUS_VOLTAGE] ?? DEFAULT_UPDATE_BUS_VOLTAGE,
            [REACTIVE_SLACKS_THRESHOLD]: parameters?.computationParameters?.reactiveSlacksThreshold,
            [SHUNT_COMPENSATOR_ACTIVATION_THRESHOLD]:
                parameters?.computationParameters?.shuntCompensatorActivationThreshold,
        },
        [VOLTAGE_LIMITS_MODIFICATION]:
            parameters?.computationParameters?.voltageLimitsModification?.map((voltageLimit) => {
                return {
                    [FieldConstants.SELECTED]: false,
                    [FILTERS]: voltageLimit[FILTERS]?.map((filter) => {
                        return {
                            [ID]: filter[FILTER_ID],
                            [NAME]: filter[FILTER_NAME],
                        };
                    }),
                    [LOW_VOLTAGE_LIMIT]: voltageLimit[LOW_VOLTAGE_LIMIT],
                    [HIGH_VOLTAGE_LIMIT]: voltageLimit[HIGH_VOLTAGE_LIMIT],
                };
            }) ?? [],
        [VOLTAGE_LIMITS_DEFAULT]:
            parameters?.computationParameters?.voltageLimitsDefault?.map((voltageLimit) => {
                return {
                    [FieldConstants.SELECTED]: false,
                    [FILTERS]: voltageLimit[FILTERS]?.map((filter) => {
                        return {
                            [ID]: filter[FILTER_ID],
                            [NAME]: filter[FILTER_NAME],
                        };
                    }),
                    [LOW_VOLTAGE_LIMIT]: voltageLimit[LOW_VOLTAGE_LIMIT],
                    [HIGH_VOLTAGE_LIMIT]: voltageLimit[HIGH_VOLTAGE_LIMIT],
                };
            }) ?? [],
        [GENERATORS_SELECTION_TYPE]:
            parameters?.computationParameters?.[GENERATORS_SELECTION_TYPE] ?? EquipmentsSelectionType.ALL_EXCEPT,
        [VARIABLE_Q_GENERATORS]: parameters?.computationParameters?.[VARIABLE_Q_GENERATORS]?.map((filter) => {
            return {
                [ID]: filter[FILTER_ID],
                [NAME]: filter[FILTER_NAME],
            };
        }),
        [TRANSFORMERS_SELECTION_TYPE]:
            parameters?.computationParameters?.[TRANSFORMERS_SELECTION_TYPE] ?? EquipmentsSelectionType.NONE_EXCEPT,
        [VARIABLE_TRANSFORMERS]: parameters?.computationParameters?.[VARIABLE_TRANSFORMERS]?.map((filter) => {
            return {
                [ID]: filter[FILTER_ID],
                [NAME]: filter[FILTER_NAME],
            };
        }),
        [SHUNT_COMPENSATORS_SELECTION_TYPE]:
            parameters?.computationParameters?.[SHUNT_COMPENSATORS_SELECTION_TYPE] ??
            EquipmentsSelectionType.NONE_EXCEPT,
        [VARIABLE_SHUNT_COMPENSATORS]: parameters?.computationParameters?.[VARIABLE_SHUNT_COMPENSATORS]?.map(
            (filter) => {
                return {
                    [ID]: filter[FILTER_ID],
                    [NAME]: filter[FILTER_NAME],
                };
            }
        ),
    };
};
