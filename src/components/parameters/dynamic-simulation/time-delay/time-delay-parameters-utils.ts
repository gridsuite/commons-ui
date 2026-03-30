/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import yup from '../../../../utils/yupConfig';
import { TimeDelay } from './time-delay-parameters-constants';

export const timeDelayFormSchema = yup.object().shape({
    [TimeDelay.START_TIME]: yup.number().required(),
    [TimeDelay.STOP_TIME]: yup
        .number()
        .required()
        .when([TimeDelay.START_TIME], ([startTime], schema) => {
            if (startTime) {
                return schema.min(startTime, 'DynamicSimulationStopTimeMustBeGreaterThanOrEqualToStartTime');
            }
            return schema;
        }),
});

export const timeDelayEmptyFormData = {
    [TimeDelay.START_TIME]: 0,
    [TimeDelay.STOP_TIME]: 0,
};
