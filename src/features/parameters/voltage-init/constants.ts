/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

export enum VoltageInitTabValues {
    GENERAL = 'GENERAL',
    VOLTAGE_LIMITS = 'voltageLimits',
    EQUIPMENTS_SELECTION = 'equipmentSelection',
}

export const GENERAL = 'GENERAL';
export const GENERAL_APPLY_MODIFICATIONS = 'GENERAL_APPLY_MODIFICATIONS';
export const DEFAULT_GENERAL_APPLY_MODIFICATIONS = true;
export const DEFAULT_UPDATE_BUS_VOLTAGE = true;
export const DEFAULT_REACTIVE_SLACKS_THRESHOLD = 500;
export const DEFAULT_SHUNT_COMPENSATOR_ACTIVATION_THRESHOLD = 0;
export const REACTIVE_SLACKS_THRESHOLD = 'reactiveSlacksThreshold';
export const SHUNT_COMPENSATOR_ACTIVATION_THRESHOLD = 'shuntCompensatorActivationThreshold';
export const PRIORITY = 'priority';

export const SELECTION_TYPE = 'selectionType';
export const UPDATE_BUS_VOLTAGE = 'updateBusVoltage';
export const VOLTAGE_LIMITS_MODIFICATION = 'voltageLimitsModification';
export const VOLTAGE_LIMITS_DEFAULT = 'voltageLimitsDefault';
export const GENERATORS_SELECTION_TYPE = 'generatorsSelectionType';
export const VARIABLE_Q_GENERATORS = 'variableQGenerators';
export const TRANSFORMERS_SELECTION_TYPE = 'twoWindingsTransformersSelectionType';
export const VARIABLE_TRANSFORMERS = 'variableTwoWindingsTransformers';
export const VARIABLE_SHUNT_COMPENSATORS = 'variableShuntCompensators';
export const SHUNT_COMPENSATORS_SELECTION_TYPE = 'shuntCompensatorsSelectionType';
export const RATIO_TAP_CHANGER_POSITION = 'ratioTapChangerPosition';
export const RATIO_TAP_CHANGER_TARGET_V = 'ratioTapChangerTargetV';
export const LEG_SIDE = 'legSide';
export const HIGH_VOLTAGE_LIMIT = 'highVoltageLimit';
export const LOW_VOLTAGE_LIMIT = 'lowVoltageLimit';
