/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { InferType, object, string } from 'yup';
import { FieldConstants, ModificationType, sanitizeString } from '../../../../utils';
import { DeleteAttachingLineDto } from './deleteAttachingLine.types';

export const deleteAttachingLineFormSchema = object()
    .shape({
        [FieldConstants.ATTACHED_LINE_ID]: string().nullable().required(),
        [FieldConstants.LINE_TO_ATTACH_TO_1_ID]: string().nullable().required(),
        [FieldConstants.LINE_TO_ATTACH_TO_2_ID]: string().nullable().required(),
        [FieldConstants.REPLACING_LINE_1_ID]: string().required(),
        [FieldConstants.REPLACING_LINE_1_NAME]: string(),
    })
    .required();

export type DeleteAttachingLineFormData = InferType<typeof deleteAttachingLineFormSchema>;

export const deleteAttachingLineEmptyFormData: DeleteAttachingLineFormData = {
    [FieldConstants.ATTACHED_LINE_ID]: '',
    [FieldConstants.LINE_TO_ATTACH_TO_1_ID]: '',
    [FieldConstants.LINE_TO_ATTACH_TO_2_ID]: '',
    [FieldConstants.REPLACING_LINE_1_ID]: '',
    [FieldConstants.REPLACING_LINE_1_NAME]: '',
};

export const deleteAttachingLineDtoToForm = (dto: DeleteAttachingLineDto): DeleteAttachingLineFormData => ({
    [FieldConstants.ATTACHED_LINE_ID]: dto.attachedLineId,
    [FieldConstants.LINE_TO_ATTACH_TO_1_ID]: dto.lineToAttachTo1Id,
    [FieldConstants.LINE_TO_ATTACH_TO_2_ID]: dto.lineToAttachTo2Id,
    [FieldConstants.REPLACING_LINE_1_ID]: dto.replacingLine1Id,
    [FieldConstants.REPLACING_LINE_1_NAME]: dto.replacingLine1Name ?? '',
});

export const deleteAttachingLineFormToDto = (form: DeleteAttachingLineFormData): DeleteAttachingLineDto => ({
    type: ModificationType.DELETE_ATTACHING_LINE,
    lineToAttachTo1Id: form[FieldConstants.LINE_TO_ATTACH_TO_1_ID],
    lineToAttachTo2Id: form[FieldConstants.LINE_TO_ATTACH_TO_2_ID],
    attachedLineId: form[FieldConstants.ATTACHED_LINE_ID],
    replacingLine1Id: form[FieldConstants.REPLACING_LINE_1_ID],
    replacingLine1Name: sanitizeString(form[FieldConstants.REPLACING_LINE_1_NAME]),
});
