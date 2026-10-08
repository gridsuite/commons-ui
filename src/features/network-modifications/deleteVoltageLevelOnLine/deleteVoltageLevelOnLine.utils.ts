/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as yup from 'yup';
import { FieldConstants, MODIFICATION_TYPES } from '../../../utils';
import { DeleteVoltageLevelOnLineDto, DeleteVoltageLevelOnLineFormData } from './deleteVoltageLevelOnLine.types';

export const deleteVoltageLevelOnLineEmptyFormData: DeleteVoltageLevelOnLineFormData = {
    [FieldConstants.LINE_TO_ATTACH_TO_1_ID]: null,
    [FieldConstants.LINE_TO_ATTACH_TO_2_ID]: null,
    [FieldConstants.REPLACING_LINE_1_ID]: '',
    [FieldConstants.REPLACING_LINE_1_NAME]: '',
};

export const deleteVoltageLevelOnLineFormSchema = yup
    .object()
    .shape({
        [FieldConstants.LINE_TO_ATTACH_TO_1_ID]: yup.string().nullable().required(),
        [FieldConstants.LINE_TO_ATTACH_TO_2_ID]: yup.string().nullable().required(),
        [FieldConstants.REPLACING_LINE_1_ID]: yup.string().required(),
        [FieldConstants.REPLACING_LINE_1_NAME]: yup.string(),
    })
    .required() as yup.ObjectSchema<DeleteVoltageLevelOnLineFormData>;

export const deleteVoltageLevelOnLineFormToDto = (
    formData: DeleteVoltageLevelOnLineFormData
): DeleteVoltageLevelOnLineDto => ({
    type: MODIFICATION_TYPES.DELETE_VOLTAGE_LEVEL_ON_LINE.type,
    [FieldConstants.LINE_TO_ATTACH_TO_1_ID]: formData[FieldConstants.LINE_TO_ATTACH_TO_1_ID],
    [FieldConstants.LINE_TO_ATTACH_TO_2_ID]: formData[FieldConstants.LINE_TO_ATTACH_TO_2_ID],
    [FieldConstants.REPLACING_LINE_1_ID]: formData[FieldConstants.REPLACING_LINE_1_ID],
    [FieldConstants.REPLACING_LINE_1_NAME]: formData[FieldConstants.REPLACING_LINE_1_NAME],
});

export const deleteVoltageLevelOnLineDtoToForm = (
    formData: DeleteVoltageLevelOnLineDto
): DeleteVoltageLevelOnLineFormData => ({
    [FieldConstants.LINE_TO_ATTACH_TO_1_ID]: formData[FieldConstants.LINE_TO_ATTACH_TO_1_ID],
    [FieldConstants.LINE_TO_ATTACH_TO_2_ID]: formData[FieldConstants.LINE_TO_ATTACH_TO_2_ID],
    [FieldConstants.REPLACING_LINE_1_ID]: formData[FieldConstants.REPLACING_LINE_1_ID],
    [FieldConstants.REPLACING_LINE_1_NAME]: formData[FieldConstants.REPLACING_LINE_1_NAME],
});
