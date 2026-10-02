/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { InferType, object, string } from 'yup';
import { DeepNullable, FieldConstants, ModificationType, sanitizeString } from '../../../../utils';
import {
    getConnectivityPropertiesData,
    getConnectivityPropertiesEmptyFormData,
    getConnectivityPropertiesValidationSchema,
    getLineToAttachOrSplitEmptyFormData,
    getLineToAttachOrSplitFormData,
    getLineToAttachOrSplitFormValidationSchema,
    getNewVoltageLevelData,
} from '../../common';
import { LineCreationDto } from '../../line/creation/lineCreation.types';
import { VoltageLevelCreationDto } from '../../voltageLevel/creation/voltageLevelCreation.types';
import { LineAttachToVoltageLevelCreationDto } from './lineAttachToVoltageLevelCreation.types';

const DIRTY_TRIGGER = '_dirtyTrigger';

export const lineAttachToVoltageLevelEmptyAttachmentPoint: VoltageLevelCreationDto = {
    type: ModificationType.VOLTAGE_LEVEL_CREATION,
    equipmentId: '',
    equipmentName: null,
    substationId: null,
    substationCreation: null,
    nominalV: null,
    lowVoltageLimit: null,
    highVoltageLimit: null,
    ipMin: null,
    ipMax: null,
    busbarCount: 1,
    sectionCount: 1,
    switchKinds: [],
    couplingDevices: [],
    properties: null,
};

export const lineAttachToVoltageLevelCreationFormSchema = object()
    .shape({
        [FieldConstants.ATTACHMENT_LINE_ID]: string().required(),
        [FieldConstants.ATTACHMENT_POINT_ID]: string().required(),
        [FieldConstants.ATTACHMENT_POINT_NAME]: string().nullable(),
        [FieldConstants.LINE1_ID]: string().required(),
        [FieldConstants.LINE1_NAME]: string().nullable(),
        [FieldConstants.LINE2_ID]: string().required(),
        [FieldConstants.LINE2_NAME]: string().nullable(),
        [FieldConstants.CONNECTIVITY]: object().shape(getConnectivityPropertiesValidationSchema(false)),
        ...getLineToAttachOrSplitFormValidationSchema(),
        [DIRTY_TRIGGER]: string(),
    })
    .required();

export type LineAttachToVoltageLevelCreationFormData = InferType<typeof lineAttachToVoltageLevelCreationFormSchema>;

export const lineAttachToVoltageLevelCreationEmptyFormData: DeepNullable<LineAttachToVoltageLevelCreationFormData> = {
    [FieldConstants.ATTACHMENT_LINE_ID]: '',
    [FieldConstants.ATTACHMENT_POINT_ID]: '',
    [FieldConstants.ATTACHMENT_POINT_NAME]: '',
    [FieldConstants.LINE1_ID]: '',
    [FieldConstants.LINE1_NAME]: '',
    [FieldConstants.LINE2_ID]: '',
    [FieldConstants.LINE2_NAME]: '',
    [FieldConstants.CONNECTIVITY]: getConnectivityPropertiesEmptyFormData(),
    ...getLineToAttachOrSplitEmptyFormData(),
    [DIRTY_TRIGGER]: '',
};

export const lineAttachToVoltageLevelCreationDtoToForm = (
    lineAttachDto: LineAttachToVoltageLevelCreationDto
): LineAttachToVoltageLevelCreationFormData => {
    const newVoltageLevel = lineAttachDto.mayNewVoltageLevelInfos;
    const connectivityData = getConnectivityPropertiesData({
        voltageLevelId: lineAttachDto.existingVoltageLevelId ?? newVoltageLevel?.equipmentId,
        busbarSectionId: lineAttachDto.bbsOrBusId,
    });

    return {
        [DIRTY_TRIGGER]: '',
        [FieldConstants.LINE1_ID]: lineAttachDto.newLine1Id,
        [FieldConstants.LINE1_NAME]: lineAttachDto.newLine1Name ?? '',
        [FieldConstants.LINE2_ID]: lineAttachDto.newLine2Id,
        [FieldConstants.LINE2_NAME]: lineAttachDto.newLine2Name ?? '',
        [FieldConstants.ATTACHMENT_LINE_ID]: lineAttachDto.attachmentLine?.equipmentId ?? '',
        [FieldConstants.ATTACHMENT_POINT_ID]: lineAttachDto.attachmentPointId,
        [FieldConstants.ATTACHMENT_POINT_NAME]: lineAttachDto.attachmentPointName ?? '',
        ...getLineToAttachOrSplitFormData({
            lineToAttachOrSplitId: lineAttachDto.lineToAttachToId,
            percent: lineAttachDto.percent,
        }),
        [FieldConstants.CONNECTIVITY]: newVoltageLevel
            ? {
                  ...connectivityData,
                  [FieldConstants.VOLTAGE_LEVEL]: getNewVoltageLevelData(newVoltageLevel),
              }
            : connectivityData,
    } as LineAttachToVoltageLevelCreationFormData;
};

export interface LineAttachToVoltageLevelFormToDtoExtras {
    attachmentPoint: VoltageLevelCreationDto;
    attachmentLine: LineCreationDto;
    newVoltageLevel: VoltageLevelCreationDto | null;
}

// attachmentPoint/attachmentLine/newVoltageLevel are the full nested-creation payloads (produced by
// the app-supplied AttachmentPointPane/AttachedLinePane/NewVoltageLevelPane): they cannot be derived
// from form data alone, since the form only tracks their id/name, not their full creation payload.
export const lineAttachToVoltageLevelCreationFormToDto = (
    lineAttachForm: LineAttachToVoltageLevelCreationFormData,
    { attachmentPoint, attachmentLine, newVoltageLevel }: LineAttachToVoltageLevelFormToDtoExtras
): LineAttachToVoltageLevelCreationDto => {
    const currentVoltageLevelId = lineAttachForm[FieldConstants.CONNECTIVITY]?.voltageLevel?.id;
    const isNewVoltageLevel = newVoltageLevel?.equipmentId === currentVoltageLevelId;
    return {
        type: ModificationType.LINE_ATTACH_TO_VOLTAGE_LEVEL,
        lineToAttachToId: lineAttachForm[FieldConstants.LINE_TO_ATTACH_OR_SPLIT_ID] ?? '',
        percent: lineAttachForm[FieldConstants.SLIDER_PERCENTAGE] ?? 50,
        attachmentPointId: lineAttachForm[FieldConstants.ATTACHMENT_POINT_ID],
        attachmentPointName: sanitizeString(lineAttachForm[FieldConstants.ATTACHMENT_POINT_NAME]),
        attachmentPointDetailInformation: attachmentPoint,
        mayNewVoltageLevelInfos: isNewVoltageLevel ? newVoltageLevel : null,
        existingVoltageLevelId: currentVoltageLevelId ?? '',
        bbsOrBusId: lineAttachForm[FieldConstants.CONNECTIVITY]?.busOrBusbarSection?.id ?? '',
        attachmentLine,
        newLine1Id: lineAttachForm[FieldConstants.LINE1_ID],
        newLine1Name: sanitizeString(lineAttachForm[FieldConstants.LINE1_NAME]),
        newLine2Id: lineAttachForm[FieldConstants.LINE2_ID],
        newLine2Name: sanitizeString(lineAttachForm[FieldConstants.LINE2_NAME]),
    };
};
