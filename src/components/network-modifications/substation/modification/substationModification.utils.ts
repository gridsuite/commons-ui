/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import yup from '../../../../utils/yupConfig';
import {
    getFilledPropertiesFromModification,
    modificationPropertiesSchema,
    toModificationProperties,
} from '../../common/properties/propertyUtils';
import { FieldConstants, ModificationType, sanitizeString, toModificationOperation } from '../../../../utils';
import { SubstationModificationDto } from './substationModification.types';

export const substationModificationFormSchema = yup
    .object()
    .shape({
        [FieldConstants.EQUIPMENT_ID]: yup.string().required(),
        [FieldConstants.EQUIPMENT_NAME]: yup.string().nullable(),
        [FieldConstants.COUNTRY]: yup.string().nullable(),
    })
    .concat(modificationPropertiesSchema);

export type SubstationModificationFormData = yup.InferType<typeof substationModificationFormSchema>;

export const substationModificationEmptyFormData: SubstationModificationFormData = {
    [FieldConstants.EQUIPMENT_ID]: '',
    [FieldConstants.EQUIPMENT_NAME]: '',
    [FieldConstants.COUNTRY]: null,
    [FieldConstants.ADDITIONAL_PROPERTIES]: [],
};

export const substationModificationFormToDto = (
    formData: SubstationModificationFormData
): SubstationModificationDto => ({
    type: ModificationType.SUBSTATION_MODIFICATION,
    equipmentId: formData[FieldConstants.EQUIPMENT_ID],
    equipmentName: toModificationOperation(sanitizeString(formData[FieldConstants.EQUIPMENT_NAME])),
    country: toModificationOperation(formData[FieldConstants.COUNTRY] ?? null),
    properties: toModificationProperties(formData),
});

export const substationModificationDtoToForm = (
    substationDto: SubstationModificationDto
): SubstationModificationFormData => {
    return {
        equipmentID: substationDto.equipmentId,
        equipmentName: substationDto.equipmentName?.value ?? '',
        country: substationDto.country?.value ?? null,
        AdditionalProperties: getFilledPropertiesFromModification(substationDto.properties),
    };
};
