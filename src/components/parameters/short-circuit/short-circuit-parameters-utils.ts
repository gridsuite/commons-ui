/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import {
    InitialVoltage,
    SHORT_CIRCUIT_INITIAL_VOLTAGE_PROFILE_MODE,
    SHORT_CIRCUIT_WITH_FEEDER_RESULT,
    SHORT_CIRCUIT_WITH_LOADS,
    SHORT_CIRCUIT_WITH_NEUTRAL_POSITION,
    SHORT_CIRCUIT_WITH_SHUNT_COMPENSATORS,
    SHORT_CIRCUIT_WITH_VSC_CONVERTER_STATIONS,
} from './constants';
import yup from '../../../utils/yupConfig';
import { COMMON_PARAMETERS } from '../common';

export const getCommonShortCircuitParametersFormSchema = () => {
    return yup.object().shape({
        [COMMON_PARAMETERS]: yup.object().shape({
            [SHORT_CIRCUIT_WITH_FEEDER_RESULT]: yup.boolean().required(),
            [SHORT_CIRCUIT_WITH_LOADS]: yup.boolean().required(),
            [SHORT_CIRCUIT_WITH_VSC_CONVERTER_STATIONS]: yup.boolean().required(),
            [SHORT_CIRCUIT_WITH_SHUNT_COMPENSATORS]: yup.boolean().required(),
            [SHORT_CIRCUIT_WITH_NEUTRAL_POSITION]: yup.boolean().required(),
            [SHORT_CIRCUIT_INITIAL_VOLTAGE_PROFILE_MODE]: yup
                .mixed<InitialVoltage>()
                .oneOf(Object.values(InitialVoltage))
                .required(),
        }),
    });
};
