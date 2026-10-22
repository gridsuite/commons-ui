/*
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 * SPDX-License-Identifier: MPL-2.0
 */

import * as yup from 'yup';
import { InferType, object } from 'yup';
import {
    getConnectivityPropertiesData,
    getConnectivityPropertiesValidationSchema,
    getConnectivityWithoutPositionEmptyFormData,
} from '../common';
import { FieldConstants, ModificationType, sanitizeString } from '../../../utils';
import { LinesAttachToSplittingLinesDto } from './linesAttachToSplittingLines.type';

export const linesAttachToSplittingLinesFormSchema = object()
    .shape({
        [FieldConstants.LINE_TO_ATTACH_TO_1_ID]: yup.string().nullable().required(),
        [FieldConstants.LINE_TO_ATTACH_TO_2_ID]: yup.string().nullable().required(),
        [FieldConstants.ATTACHED_LINE_ID]: yup.string().nullable().required(),
        [FieldConstants.REPLACING_LINE_1_ID]: yup.string().required(),
        [FieldConstants.REPLACING_LINE_1_NAME]: yup.string(),
        [FieldConstants.REPLACING_LINE_2_ID]: yup.string().required(),
        [FieldConstants.REPLACING_LINE_2_NAME]: yup.string(),
        [FieldConstants.CONNECTIVITY]: yup.object().shape(getConnectivityPropertiesValidationSchema()),
    })
    .required();

export type LinesAttachToSplitLinesFormData = InferType<typeof linesAttachToSplittingLinesFormSchema>;

export const linesAttachToSplittingLinesEmptyFormData = {
    [FieldConstants.LINE_TO_ATTACH_TO_1_ID]: null,
    [FieldConstants.LINE_TO_ATTACH_TO_2_ID]: null,
    [FieldConstants.ATTACHED_LINE_ID]: null,
    [FieldConstants.REPLACING_LINE_1_ID]: '',
    [FieldConstants.REPLACING_LINE_1_NAME]: '',
    [FieldConstants.REPLACING_LINE_2_ID]: '',
    [FieldConstants.REPLACING_LINE_2_NAME]: '',
    ...getConnectivityWithoutPositionEmptyFormData(),
};

export const linesAttachToSplittingLinesDtoToForm = (
    dto: LinesAttachToSplittingLinesDto
): LinesAttachToSplitLinesFormData => {
    return {
        [FieldConstants.LINE_TO_ATTACH_TO_1_ID]: dto.lineToAttachTo1Id,
        [FieldConstants.LINE_TO_ATTACH_TO_2_ID]: dto.lineToAttachTo2Id,
        [FieldConstants.ATTACHED_LINE_ID]: dto.attachedLineId,
        [FieldConstants.REPLACING_LINE_1_ID]: dto.replacingLine1Id,
        [FieldConstants.REPLACING_LINE_1_NAME]: dto.replacingLine1Name ?? '',
        [FieldConstants.REPLACING_LINE_2_ID]: dto.replacingLine2Id,
        [FieldConstants.REPLACING_LINE_2_NAME]: dto.replacingLine2Name ?? '',
        [FieldConstants.CONNECTIVITY]: getConnectivityPropertiesData({
            voltageLevelId: dto.voltageLevelId,
            busbarSectionId: dto.bbsBusId,
        }),
    };
};

export const linesAttachToSplittingLinesFormToDto = (
    formData: LinesAttachToSplitLinesFormData
): LinesAttachToSplittingLinesDto => {
    return {
        type: ModificationType.LINES_ATTACH_TO_SPLIT_LINES,
        lineToAttachTo1Id: formData[FieldConstants.LINE_TO_ATTACH_TO_1_ID],
        lineToAttachTo2Id: formData[FieldConstants.LINE_TO_ATTACH_TO_2_ID],
        attachedLineId: formData[FieldConstants.ATTACHED_LINE_ID],
        voltageLevelId:
            formData[FieldConstants.CONNECTIVITY]?.[FieldConstants.VOLTAGE_LEVEL]?.[FieldConstants.ID] ?? null,
        bbsBusId:
            formData[FieldConstants.CONNECTIVITY]?.[FieldConstants.BUS_OR_BUSBAR_SECTION]?.[FieldConstants.ID] ?? null,
        replacingLine1Id: formData[FieldConstants.REPLACING_LINE_1_ID],
        replacingLine1Name: sanitizeString(formData[FieldConstants.REPLACING_LINE_1_NAME]),
        replacingLine2Id: formData[FieldConstants.REPLACING_LINE_2_ID],
        replacingLine2Name: sanitizeString(formData[FieldConstants.REPLACING_LINE_2_NAME]),
    };
};
