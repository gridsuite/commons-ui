/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { array, boolean, object, string } from 'yup';
import { FieldConstants, YUP_REQUIRED } from '../../../../utils';

const getMcsConnectionsSchema = () =>
    array()
        .of(
            object().shape({
                [FieldConstants.ID]: string().required(),
                [FieldConstants.SHUNT_COMPENSATOR_SELECTED]: boolean().required(YUP_REQUIRED),
            })
        )
        .required();

export const getHvdcLccDeletionSchema = () =>
    object()
        .shape({
            [FieldConstants.DELETION_SPECIFIC_TYPE]: string().required(YUP_REQUIRED),
            [FieldConstants.SHUNT_COMPENSATOR_SIDE_1]: getMcsConnectionsSchema(),
            [FieldConstants.SHUNT_COMPENSATOR_SIDE_2]: getMcsConnectionsSchema(),
        })
        .optional()
        .nullable();
