/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { object, number } from 'yup';
import { CreateRuleFormInput } from './regulationRule.types';
import { FieldConstants } from '../../../../../utils';

const createRuleValidationSchema = () =>
    object().shape({
        [FieldConstants.LOW_TAP_POSITION]: number().nullable().required(),
        [FieldConstants.HIGH_TAP_POSITION]: number().nullable().required(),
    });

export const getCreateRuleValidationSchema = () => createRuleValidationSchema();

export const getCreateRuleEmptyFormData = (): CreateRuleFormInput => ({
    [FieldConstants.LOW_TAP_POSITION]: null,
    [FieldConstants.HIGH_TAP_POSITION]: null,
});
