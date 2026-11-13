/*
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 * SPDX-License-Identifier: MPL-2.0
 */

import { InferType, number, object } from 'yup';
import { DeepNullable, FieldConstants } from '../../../../../../utils';

export const getTapPositionMeasurementsValidationSchemaObject = () =>
    object().shape({
        [FieldConstants.RATIO_TAP_CHANGER_POSITION_MEASUREMENT]: number().nullable(),
        [FieldConstants.PHASE_TAP_CHANGER_POSITION_MEASUREMENT]: number().nullable(),
    });

type TapPositionMeasurementsFormData = InferType<ReturnType<typeof getTapPositionMeasurementsValidationSchemaObject>>;

export const tapPositionMeasurementsEmptyFormData: DeepNullable<TapPositionMeasurementsFormData> = {
    [FieldConstants.RATIO_TAP_CHANGER_POSITION_MEASUREMENT]: null,
    [FieldConstants.PHASE_TAP_CHANGER_POSITION_MEASUREMENT]: null,
};
