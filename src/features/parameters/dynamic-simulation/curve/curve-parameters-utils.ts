/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import yup from '../../../../utils/yupConfig';
import { Curve } from './curve-parameters-constants';

export const curveFormSchema = yup.object().shape({
    [Curve.CURVES]: yup
        .array()
        .of(
            yup.object().shape({
                [Curve.EQUIPMENT_ID]: yup.string().required(),
                [Curve.VARIABLE_ID]: yup.string().required(),
            })
        )
        .nullable(),
});

export const curveEmptyFormData = {
    [Curve.CURVES]: [],
};
