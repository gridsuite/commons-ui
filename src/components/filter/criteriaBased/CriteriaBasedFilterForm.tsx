/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { FieldConstants } from '../../../utils/constants/fieldConstants';
import { getCriteriaBasedFormData } from './criteriaBasedFilterUtils';
import { FreePropertiesTypes } from './FilterFreeProperties';

export const criteriaBasedFilterEmptyFormData = getCriteriaBasedFormData(undefined, {
    [FieldConstants.ENERGY_SOURCE]: null,
    [FreePropertiesTypes.SUBSTATION_FILTER_PROPERTIES]: [],
    [FreePropertiesTypes.FREE_FILTER_PROPERTIES]: [],
});
