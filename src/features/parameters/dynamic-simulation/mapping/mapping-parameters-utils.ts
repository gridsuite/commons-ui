/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import * as yup from 'yup';
import { MAPPING } from './mapping-parameters-constants';
import { ID, NAME } from '../../common/parameter-table-field';

export const mappingFormSchema = yup.object().shape({
    [MAPPING]: yup
        .object()
        .shape({
            [ID]: yup.string().required(),
            [NAME]: yup.string().required(),
        })
        .required(),
});

export const mappingEmptyFormData = {
    [MAPPING]: null,
};
