/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { boolean, number, object } from 'yup';
import { MeasurementInfo } from './measurement.type';
import { FieldConstants } from '../../../../utils';

export function getPowerWithValidityEmptyFormData(id: string) {
    return {
        [id]: {
            [FieldConstants.VALUE]: null,
            [FieldConstants.VALIDITY]: null,
        },
    };
}

export function getPowerWithValidityValidationSchema(id: string) {
    return {
        [id]: object().shape({
            [FieldConstants.VALUE]: number().nullable(),
            [FieldConstants.VALIDITY]: boolean().nullable(),
        }),
    };
}

export function getPowerWithValidityEditData(id: string, measurement: MeasurementInfo) {
    return {
        [id]: {
            [FieldConstants.VALUE]: measurement?.value ?? null,
            [FieldConstants.VALIDITY]: measurement?.validity ?? null,
        },
    };
}
