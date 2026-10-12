/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as yup from 'yup';
import { FieldConstants, ModificationType } from '../../../../utils';
import { getLoadScalingVariationsSchema } from './loadScalingVariation.utils';
import {
    variationScalingDtoToForm,
    variationScalingFormToDto,
    VariationScalingDto,
    VariationScalingFormData,
} from '../common';

export const loadScalingFormSchema = yup
    .object()
    .shape({
        [FieldConstants.VARIATION_TYPE]: yup.string().required(),
        ...getLoadScalingVariationsSchema(FieldConstants.VARIATIONS),
    })
    .required() as yup.ObjectSchema<VariationScalingFormData>;

export function loadScalingFormToDto(formData: VariationScalingFormData): VariationScalingDto {
    return variationScalingFormToDto(formData, ModificationType.LOAD_SCALING);
}

export function loadScalingDtoToForm(dto: VariationScalingDto): VariationScalingFormData {
    return variationScalingDtoToForm(dto);
}
