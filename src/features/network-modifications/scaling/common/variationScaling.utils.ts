/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { FieldConstants, ModificationType, VARIATION_TYPES } from '../../../../utils';
import { VariationScalingDto, VariationScalingFormData } from './variationScaling.type';

export const emptyVariationScalingFormData: VariationScalingFormData = {
    [FieldConstants.VARIATION_TYPE]: VARIATION_TYPES.DELTA_P.id,
    [FieldConstants.VARIATIONS]: [],
};

export function variationScalingFormToDto(
    formData: VariationScalingFormData,
    type: ModificationType
): VariationScalingDto {
    return {
        type,
        variationType: formData[FieldConstants.VARIATION_TYPE],
        variations: formData[FieldConstants.VARIATIONS],
    };
}

export function variationScalingDtoToForm(dto: VariationScalingDto): VariationScalingFormData {
    return {
        [FieldConstants.VARIATION_TYPE]: dto[FieldConstants.VARIATION_TYPE],
        [FieldConstants.VARIATIONS]: dto[FieldConstants.VARIATIONS],
    };
}
