/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as yup from 'yup';

import { FieldConstants, VARIATION_LIST_EMPTY, VARIATION_MODES, YUP_REQUIRED } from '../../../../../../utils';
import { IDENTIFIER_LIST } from '../../common/variation.type';

export const getGeneratorScalingVariationSchema = () =>
    yup
        .object()
        .nullable()
        .shape({
            [FieldConstants.VARIATION_MODE]: yup.string().nullable().required(),
            [FieldConstants.VARIATION_VALUE]: yup.number().nullable().required(),
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
                .min(1, YUP_REQUIRED)
                .when([FieldConstants.VARIATION_MODE], {
                    is: VARIATION_MODES.STACKING_UP.id || VARIATION_MODES.VENTILATION.id,
                    then: (schema) =>
                        schema.test('AllFiltersAreExplicitNaming', 'AllExplicitNamingFiltersError', (values) =>
                            values.every((f) => f?.specificMetadata?.type === IDENTIFIER_LIST)
                        ),
                }),
        });

export const getGeneratorScalingVariationsSchema = (id: string) => ({
    [id]: yup.array().nullable().min(1, VARIATION_LIST_EMPTY).of(getGeneratorScalingVariationSchema()),
});

export const getGeneratorScalingVariationEmptyForm = (variationMode: string) => {
    return {
        [FieldConstants.VARIATION_MODE]: variationMode,
        [FieldConstants.VARIATION_VALUE]: null,
        [FieldConstants.FILTERS]: [],
    };
};
