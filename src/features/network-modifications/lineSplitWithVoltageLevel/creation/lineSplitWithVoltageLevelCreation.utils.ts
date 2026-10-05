/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { InferType, object, string } from 'yup';
import { DeepNullable, FieldConstants, ModificationType, sanitizeString } from '../../../../utils';
import {
    getConnectivityData,
    getConnectivityPropertiesEmptyFormData,
    getConnectivityPropertiesValidationSchema,
    getLineToAttachOrSplitEmptyFormData,
    getLineToAttachOrSplitFormData,
    getLineToAttachOrSplitFormValidationSchema,
    getNewVoltageLevelData,
} from '../../common';
import { VoltageLevelCreationDto } from '../../voltageLevel/creation/voltageLevelCreation.types';
import { LineSplitWithVoltageLevelCreationDto } from './lineSplitWithVoltageLevelCreation.types';

export const lineSplitWithVoltageLevelCreationFormSchema = object()
    .shape({
        [FieldConstants.LINE1_ID]: string().required(),
        [FieldConstants.LINE1_NAME]: string().nullable(),
        [FieldConstants.LINE2_ID]: string().required(),
        [FieldConstants.LINE2_NAME]: string().nullable(),
        [FieldConstants.CONNECTIVITY]: object().shape(getConnectivityPropertiesValidationSchema()),
        ...getLineToAttachOrSplitFormValidationSchema(),
    })
    .required();

export type LineSplitWithVoltageLevelCreationFormData = InferType<typeof lineSplitWithVoltageLevelCreationFormSchema>;

export const lineSplitWithVoltageLevelCreationEmptyFormData: DeepNullable<LineSplitWithVoltageLevelCreationFormData> = {
    [FieldConstants.LINE1_ID]: '',
    [FieldConstants.LINE1_NAME]: '',
    [FieldConstants.LINE2_ID]: '',
    [FieldConstants.LINE2_NAME]: '',
    [FieldConstants.CONNECTIVITY]: getConnectivityPropertiesEmptyFormData(),
    ...getLineToAttachOrSplitEmptyFormData(),
};

export const lineSplitWithVoltageLevelCreationDtoToForm = (
    lineSplitDto: LineSplitWithVoltageLevelCreationDto
): LineSplitWithVoltageLevelCreationFormData => {
    const newVoltageLevel = lineSplitDto.mayNewVoltageLevelInfos;
    const connectivityData = getConnectivityData({
        voltageLevelId: lineSplitDto.existingVoltageLevelId ?? newVoltageLevel?.equipmentId,
        busbarSectionId: lineSplitDto.bbsOrBusId,
    });

    return {
        [FieldConstants.LINE1_ID]: lineSplitDto.newLine1Id,
        [FieldConstants.LINE1_NAME]: lineSplitDto.newLine1Name ?? '',
        [FieldConstants.LINE2_ID]: lineSplitDto.newLine2Id,
        [FieldConstants.LINE2_NAME]: lineSplitDto.newLine2Name ?? '',
        ...getLineToAttachOrSplitFormData({
            lineToAttachOrSplitId: lineSplitDto.lineToSplitId,
            percent: lineSplitDto.percent,
        }),
        ...connectivityData,
        ...(newVoltageLevel && {
            [FieldConstants.CONNECTIVITY]: {
                ...connectivityData[FieldConstants.CONNECTIVITY],
                [FieldConstants.VOLTAGE_LEVEL]: getNewVoltageLevelData(newVoltageLevel),
            },
        }),
    } as LineSplitWithVoltageLevelCreationFormData;
};

// newVoltageLevel carries the full creation payload for a not-yet-existing voltage level, when the user
// picked "create new voltage level" instead of an existing one: it cannot be derived from form data alone.
export const lineSplitWithVoltageLevelCreationFormToDto = (
    lineSplitForm: LineSplitWithVoltageLevelCreationFormData,
    newVoltageLevel: VoltageLevelCreationDto | null
): LineSplitWithVoltageLevelCreationDto => {
    const currentVoltageLevelId = lineSplitForm[FieldConstants.CONNECTIVITY]?.voltageLevel?.id;
    const isNewVoltageLevel = newVoltageLevel?.equipmentId === currentVoltageLevelId;
    return {
        type: ModificationType.LINE_SPLIT_WITH_VOLTAGE_LEVEL,
        lineToSplitId: lineSplitForm[FieldConstants.LINE_TO_ATTACH_OR_SPLIT_ID] ?? '',
        percent: lineSplitForm[FieldConstants.SLIDER_PERCENTAGE] ?? 50,
        mayNewVoltageLevelInfos: isNewVoltageLevel ? newVoltageLevel : null,
        existingVoltageLevelId: currentVoltageLevelId ?? '',
        bbsOrBusId: lineSplitForm[FieldConstants.CONNECTIVITY]?.busOrBusbarSection?.id ?? '',
        newLine1Id: lineSplitForm[FieldConstants.LINE1_ID],
        newLine1Name: sanitizeString(lineSplitForm[FieldConstants.LINE1_NAME]),
        newLine2Id: lineSplitForm[FieldConstants.LINE2_ID],
        newLine2Name: sanitizeString(lineSplitForm[FieldConstants.LINE2_NAME]),
    };
};
