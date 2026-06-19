/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { object, number } from 'yup';
import { FieldConstants } from '../../../../utils';
import { LineCharacteristics } from './lineCharacteristicsPane.types';

export const getLineCharacteristicsValidationSchemaProps = (isEquipmentModification = false) =>
    object().shape({
        [FieldConstants.R]: isEquipmentModification
            ? number().nullable().min(0, 'mustBeGreaterOrEqualToZero')
            : number().nullable().min(0, 'mustBeGreaterOrEqualToZero').required(),
        [FieldConstants.X]: isEquipmentModification ? number().nullable() : number().nullable().required(),
        [FieldConstants.B1]: number().nullable(),
        [FieldConstants.G1]: number().nullable().min(0, 'mustBeGreaterOrEqualToZero'),
        [FieldConstants.B2]: number().nullable(),
        [FieldConstants.G2]: number().nullable().min(0, 'mustBeGreaterOrEqualToZero'),
    });

const characteristicsValidationSchema = (id: string, modification: boolean) => ({
    [id]: object().shape({
        [FieldConstants.R]: modification
            ? number().nullable().min(0, 'mustBeGreaterOrEqualToZero')
            : number().nullable().min(0, 'mustBeGreaterOrEqualToZero').required(),
        [FieldConstants.X]: modification ? number().nullable() : number().nullable().required(),
        [FieldConstants.B1]: number().nullable(),
        [FieldConstants.G1]: number().nullable().min(0, 'mustBeGreaterOrEqualToZero'),
        [FieldConstants.B2]: number().nullable(),
        [FieldConstants.G2]: number().nullable().min(0, 'mustBeGreaterOrEqualToZero'),
    }),
});

export const getCharacteristicsValidationSchema = (
    id: string,
    modification: boolean = false
) => {
    return characteristicsValidationSchema(id, modification);
};

const characteristicsEmptyFormData = (id: string) => ({
    [id]: {
        [FieldConstants.R]: null,
        [FieldConstants.X]: null,
        [FieldConstants.B1]: null,
        [FieldConstants.G1]: null,
        [FieldConstants.B2]: null,
        [FieldConstants.G2]: null,
    },
});

export const getLineCharacteristicsEmptyFormData = (
    id: string = FieldConstants.CHARACTERISTICS
) => {
    return characteristicsEmptyFormData(id);
};

export const getLineCharacteristicsFormData = (
    {
        r = null,
        x = null,
        g1 = null,
        b1 = null,
        g2 = null,
        b2 = null,
    }: LineCharacteristics,
    id = FieldConstants.CHARACTERISTICS
) => ({
    [id]: {
        [FieldConstants.R]: r,
        [FieldConstants.X]: x,
        [FieldConstants.G1]: g1,
        [FieldConstants.B1]: b1,
        [FieldConstants.G2]: g2,
        [FieldConstants.B2]: b2,
    },
});

export const getCharacteristicsWithOutConnectivityFormData = (
    { r, x, g1, b1, g2, b2 }: LineCharacteristics,
    id = FieldConstants.CHARACTERISTICS
) => ({
    [id]: {
        [FieldConstants.R]: r,
        [FieldConstants.X]: x,
        [FieldConstants.G1]: g1,
        [FieldConstants.B1]: b1,
        [FieldConstants.G2]: g2,
        [FieldConstants.B2]: b2,
    },
});
