/*
 * Copyright © 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { KILO_VOLT, MEGA_VAR } from '../../../utils/constants/unitsConstants';

export const PROVIDER = 'provider';
export const VOLTAGE_LEVEL = 'voltageLevel';

export const PARAM_SA_PROVIDER = 'provider';
export const PARAM_SA_FLOW_PROPORTIONAL_THRESHOLD = 'flowProportionalThreshold';
export const PARAM_SA_LOW_VOLTAGE_PROPORTIONAL_THRESHOLD = 'lowVoltageProportionalThreshold';
export const PARAM_SA_LOW_VOLTAGE_ABSOLUTE_THRESHOLD = 'lowVoltageAbsoluteThreshold';
export const PARAM_SA_HIGH_VOLTAGE_PROPORTIONAL_THRESHOLD = 'highVoltageProportionalThreshold';
export const PARAM_SA_HIGH_VOLTAGE_ABSOLUTE_THRESHOLD = 'highVoltageAbsoluteThreshold';

export const ReactivePowerAdornment = {
    position: 'end',
    text: MEGA_VAR,
};
export const VoltageAdornment = {
    position: 'end',
    text: KILO_VOLT,
};

export const VERSION_PARAMETER = 'version';
export const COMMON_PARAMETERS = 'commonParameters';
export const SPECIFIC_PARAMETERS = 'specificParametersPerProvider';
