/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { number } from 'yup';
import { FieldConstants, YUP_REQUIRED } from '../../../../utils';

export const getShortCircuitEmptyFormData = () => {
    return {
        [FieldConstants.TRANSIENT_REACTANCE]: null,
        [FieldConstants.TRANSFORMER_REACTANCE]: null,
    };
};

export const getShortCircuitFormSchema = (isEquipmentModification = false) => {
    return {
        [FieldConstants.TRANSFORMER_REACTANCE]: number().nullable(),
        [FieldConstants.TRANSIENT_REACTANCE]: number()
            .nullable()
            .when([FieldConstants.TRANSFORMER_REACTANCE], {
                is: (transformerReactance: number) => isEquipmentModification && transformerReactance != null,
                then: (schema) => schema.required(YUP_REQUIRED),
            }),
    };
};

export const getShortCircuitFormData = ({
    directTransX,
    stepUpTransformerX,
}: {
    directTransX?: number | null;
    stepUpTransformerX?: number | null;
}) => {
    return {
        [FieldConstants.TRANSIENT_REACTANCE]: directTransX,
        [FieldConstants.TRANSFORMER_REACTANCE]: stepUpTransformerX,
    };
};
