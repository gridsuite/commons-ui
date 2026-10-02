/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as yup from 'yup';
import { FieldConstants, ModificationType } from '../../../../../utils';
import { getGeneratorScalingVariationsSchema } from './variation/variation.utils';
import { variationScalingDtoToForm, variationScalingFormToDto } from '../common/variationScaling.utils';
import { VariationScalingDto, VariationScalingFormData } from '../common/variationScaling.type';

export const generatorScalingFormSchema = yup
    .object()
    .shape({
        [FieldConstants.VARIATION_TYPE]: yup.string().required(),
        ...getGeneratorScalingVariationsSchema(FieldConstants.VARIATIONS),
    })
    .required() as yup.ObjectSchema<VariationScalingFormData>;

export function generatorScalingFormToDto(formData: VariationScalingFormData): VariationScalingDto {
    return variationScalingFormToDto(formData, ModificationType.GENERATOR_SCALING);
}

export function generatorScalingDtoToForm(dto: VariationScalingDto): VariationScalingFormData {
    return variationScalingDtoToForm(dto);
}
