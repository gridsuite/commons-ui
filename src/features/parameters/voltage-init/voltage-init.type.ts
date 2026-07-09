/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { FilterIdentifier, FILTERS } from '../../../utils/constants/filterConstant';
import {
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
} from './constants';

export enum EquipmentsSelectionType {
    ALL_EXCEPT = 'ALL_EXCEPT',
    NONE_EXCEPT = 'NONE_EXCEPT',
}

type VoltageLimitParam = {
    [FILTERS]: FilterIdentifier[];
    [LOW_VOLTAGE_LIMIT]: number;
    [HIGH_VOLTAGE_LIMIT]: number;
};

// Dto exchanged with voltage-init server
export type VoltageInitParameters = {
    [UPDATE_BUS_VOLTAGE]: boolean;
    [REACTIVE_SLACKS_THRESHOLD]: number;
    [SHUNT_COMPENSATOR_ACTIVATION_THRESHOLD]: number;
    [VOLTAGE_LIMITS_MODIFICATION]: VoltageLimitParam[];
    [VOLTAGE_LIMITS_DEFAULT]: VoltageLimitParam[];
    [GENERATORS_SELECTION_TYPE]: EquipmentsSelectionType;
    [VARIABLE_Q_GENERATORS]: FilterIdentifier[];
    [TRANSFORMERS_SELECTION_TYPE]: EquipmentsSelectionType;
    [VARIABLE_TRANSFORMERS]: FilterIdentifier[];
    [SHUNT_COMPENSATORS_SELECTION_TYPE]: EquipmentsSelectionType;
    [VARIABLE_SHUNT_COMPENSATORS]: FilterIdentifier[];
};

// Dto exchanged with study server, with study-specific 'applyModifications' parameter
export type VoltageInitStudyParameters = {
    applyModifications: boolean;
    computationParameters: VoltageInitParameters | null;
};
