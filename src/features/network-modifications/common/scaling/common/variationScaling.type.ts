/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import type { UUID } from 'node:crypto';
import { FieldConstants, ModificationType } from '../../../../../utils';
import { Variations, VariationType } from './variation.type';

export interface VariationScalingFormData {
    [FieldConstants.VARIATION_TYPE]: VariationType;
    [FieldConstants.VARIATIONS]: Variations[];
}

export interface VariationScalingDto {
    uuid?: UUID;
    type: ModificationType;
    variationType: VariationType;
    variations: Variations[];
}
