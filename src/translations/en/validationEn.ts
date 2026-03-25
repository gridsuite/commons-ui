/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import {
    DESCRIPTION_LIMIT_ERROR,
    MUST_BE_GREATER_OR_EQUAL_TO_ZERO,
    NAME_EMPTY,
    NORMALIZED_PERCENTAGE,
    REAL_PERCENTAGE,
    YUP_NOT_TYPE_DEFAULT,
    YUP_NOT_TYPE_NUMBER,
    YUP_REQUIRED,
} from '../../utils';

export const validationEn = {
    [YUP_REQUIRED]: 'This field is required',
    [YUP_NOT_TYPE_NUMBER]: 'This field only accepts numeric values',
    [YUP_NOT_TYPE_DEFAULT]: 'Field value format is incorrect',
    [NAME_EMPTY]: 'The name is empty',
    [DESCRIPTION_LIMIT_ERROR]: 'Description exceeds character limit',
    [MUST_BE_GREATER_OR_EQUAL_TO_ZERO]: 'Must be greater than or equal to 0',
    [NORMALIZED_PERCENTAGE]: 'This percentage must be between 0 and 100',
    [REAL_PERCENTAGE]: 'This value must be between 0 and 1',
};
