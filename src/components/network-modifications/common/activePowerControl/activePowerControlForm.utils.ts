/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { bool, number } from 'yup';
import { FieldConstants, YUP_REQUIRED } from '../../../../utils';

export const getActivePowerControlEmptyFormData = (isEquipmentModification = false) => ({
    [FieldConstants.FREQUENCY_REGULATION]: isEquipmentModification ? null : false,
    [FieldConstants.DROOP]: null,
});

export const getActivePowerControlSchema = (isEquipmentModification = false) => ({
    [FieldConstants.FREQUENCY_REGULATION]: bool()
        .nullable()
        .when([], {
            is: () => !isEquipmentModification,
            then: (schema) => schema.required(YUP_REQUIRED),
        }),
    [FieldConstants.DROOP]: number()
        .nullable()
        .min(0, 'NormalizedPercentage')
        .max(100, 'NormalizedPercentage')
        .when([FieldConstants.FREQUENCY_REGULATION], {
            is: (frequencyRegulation: boolean) => !isEquipmentModification && frequencyRegulation,
            then: (schema) => schema.required(YUP_REQUIRED),
        }),
});
