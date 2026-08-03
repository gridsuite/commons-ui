/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import {
    DUPLICATED_PROPS_ERROR,
    MUST_BE_GREATER_OR_EQUAL_TO_ZERO,
    NAME_ALREADY_USED,
    NAME_EMPTY,
    NORMALIZED_PERCENTAGE,
    NUMERIC_VALUE_OR_EMPTY_FIELD,
    REAL_PERCENTAGE,
    YUP_DEFAULT,
    YUP_NOT_NULL,
    YUP_NOT_TYPE_DEFAULT,
    YUP_NOT_TYPE_NUMBER,
    YUP_POSITIVE,
    YUP_REQUIRED,
} from '../../utils';

export const genericValidationEn = {
    [YUP_REQUIRED]: 'Required',
    [YUP_NOT_NULL]: 'Cannot be empty',
    [YUP_DEFAULT]: 'This field is invalid',
    [YUP_POSITIVE]: 'Must be a positive number',
    [YUP_NOT_TYPE_NUMBER]: 'This field only accepts numeric values',
    [YUP_NOT_TYPE_DEFAULT]: 'Field value format is incorrect',
    [DUPLICATED_PROPS_ERROR]: 'Duplicated properties: each property must be unique',
    [MUST_BE_GREATER_OR_EQUAL_TO_ZERO]: 'Must be greater than or equal to 0',
    [NORMALIZED_PERCENTAGE]: 'This percentage must be between 0 and 100',
    [REAL_PERCENTAGE]: 'This value must be between 0 and 1',
    [NAME_EMPTY]: 'The name is empty',
    [NAME_ALREADY_USED]: 'This name is already used',
    [NUMERIC_VALUE_OR_EMPTY_FIELD]: 'Numeric value or Empty the field',
    UniqueName: 'Name should be unique',
    FieldNotEmpty: 'Field should not be empty',
};
