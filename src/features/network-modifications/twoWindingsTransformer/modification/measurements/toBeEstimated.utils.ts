/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { InferType, object, boolean } from 'yup';
import { DeepNullable, FieldConstants } from '../../../../../utils';

export const getToBeEstimatedValidationSchemaObject = () =>
    object().shape({
        [FieldConstants.RATIO_TAP_CHANGER_STATUS]: boolean().nullable(),
        [FieldConstants.PHASE_TAP_CHANGER_STATUS]: boolean().nullable(),
    });

type ToBeEstimatedFormData = InferType<ReturnType<typeof getToBeEstimatedValidationSchemaObject>>;

export const toBeEstimatedEmptyFormData: DeepNullable<ToBeEstimatedFormData> = {
    [FieldConstants.RATIO_TAP_CHANGER_STATUS]: null,
    [FieldConstants.PHASE_TAP_CHANGER_STATUS]: null,
};
