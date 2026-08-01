/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { InferType, object, number } from 'yup';
import { FieldConstants } from '../../../../utils';

export const getTwtCharacteristicsValidationSchemaProps = (isModification = false) =>
    object().shape({
        [FieldConstants.R]: isModification
            ? number().nullable().min(0, 'mustBeGreaterOrEqualToZero')
            : number().nullable().min(0, 'mustBeGreaterOrEqualToZero').required(),
        [FieldConstants.X]: isModification ? number().nullable() : number().nullable().required(),
        [FieldConstants.G]: isModification
            ? number().nullable().min(0, 'mustBeGreaterOrEqualToZero')
            : number().nullable().min(0, 'mustBeGreaterOrEqualToZero').required(),
        [FieldConstants.B]: isModification ? number().nullable() : number().nullable().required(),
        [FieldConstants.RATED_S]: number().nullable().positive('RatedNominalPowerMustBeGreaterThanZero'),
        [FieldConstants.RATED_U1]: isModification
            ? number().nullable().min(0, 'mustBeGreaterOrEqualToZero')
            : number().nullable().min(0, 'mustBeGreaterOrEqualToZero').required(),
        [FieldConstants.RATED_U2]: isModification
            ? number().nullable().min(0, 'mustBeGreaterOrEqualToZero')
            : number().nullable().min(0, 'mustBeGreaterOrEqualToZero').required(),
    });

type TwtCharacteristicsFormData = InferType<ReturnType<typeof getTwtCharacteristicsValidationSchemaProps>>;

export const getTwtCharacteristicsEmptyFormData = () => {
    return {
        [FieldConstants.R]: null,
        [FieldConstants.X]: null,
        [FieldConstants.G]: null,
        [FieldConstants.B]: null,
        [FieldConstants.RATED_S]: null,
        [FieldConstants.RATED_U1]: null,
        [FieldConstants.RATED_U2]: null,
    };
};

export const getTwtCharacteristicsFormData = (
    {
        r = null,
        x = null,
        g = null,
        b = null,
        ratedS = null,
        ratedU1 = null,
        ratedU2 = null,
    }: TwtCharacteristicsFormData,
    id = FieldConstants.CHARACTERISTICS
) => ({
    [id]: {
        [FieldConstants.R]: r,
        [FieldConstants.X]: x,
        [FieldConstants.G]: g,
        [FieldConstants.B]: b,
        [FieldConstants.RATED_S]: ratedS,
        [FieldConstants.RATED_U1]: ratedU1,
        [FieldConstants.RATED_U2]: ratedU2,
    },
});