/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as yup from 'yup';
import { FieldConstants, REACTIVE_VARIATION_MODES, VARIATION_LIST_EMPTY, YUP_REQUIRED } from '../../../../../../utils';

export const getLoadScalingVariationSchema = () =>
    yup
        .object()
        .nullable()
        .shape({
            [FieldConstants.VARIATION_MODE]: yup.string().nullable().required(),
            [FieldConstants.VARIATION_VALUE]: yup.number().nullable().required(),
            [FieldConstants.REACTIVE_VARIATION_MODE]: yup.string().nullable().required(),
            [FieldConstants.FILTERS]: yup
                .array()
                .of(
                    yup.object().shape({
                        [FieldConstants.ID]: yup.string().required(),
                        [FieldConstants.NAME]: yup.string().required(),
                        [FieldConstants.SPECIFIC_METADATA]: yup.object().shape({
                            [FieldConstants.TYPE]: yup.string(),
                        }),
                    })
                )
                .required()
                .min(1, YUP_REQUIRED),
        });

export const getLoadScalingVariationsSchema = (id: string) => ({
    [id]: yup.array().nullable().min(1, VARIATION_LIST_EMPTY).of(getLoadScalingVariationSchema()),
});

export const getLoadScalingVariationEmptyForm = (variationMode: string) => {
    return {
        [FieldConstants.VARIATION_MODE]: variationMode,
        [FieldConstants.VARIATION_VALUE]: null,
        [FieldConstants.REACTIVE_VARIATION_MODE]: REACTIVE_VARIATION_MODES.CONSTANT_Q.id,
        [FieldConstants.FILTERS]: [],
    };
};
