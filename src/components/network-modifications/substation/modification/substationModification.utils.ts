/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { object, string, type InferType } from 'yup';
import {
    getPropertiesFromModification,
    modificationPropertiesSchema,
    toModificationProperties,
} from '../../common/properties/propertyUtils';
import { FieldConstants, ModificationType, sanitizeString, toModificationOperation } from '../../../../utils';
import { SubstationModificationDto } from './substationModification.types';

export const substationModificationFormSchema = object()
    .shape({
        [FieldConstants.EQUIPMENT_ID]: string().required(),
        [FieldConstants.EQUIPMENT_NAME]: string().nullable(),
        [FieldConstants.COUNTRY]: string().nullable(),
    })
    .concat(modificationPropertiesSchema);

export type SubstationModificationFormData = InferType<typeof substationModificationFormSchema>;

export const substationModificationEmptyFormData: SubstationModificationFormData = {
    equipmentID: '',
    equipmentName: '',
    country: null,
    AdditionalProperties: [],
};

export const substationModificationFormToDto = (
    formData: SubstationModificationFormData
): SubstationModificationDto => ({
    type: ModificationType.SUBSTATION_MODIFICATION,
    equipmentId: formData.equipmentID,
    equipmentName: toModificationOperation(sanitizeString(formData.equipmentName)),
    country: toModificationOperation(formData.country ?? null),
    properties: toModificationProperties(formData),
});

export const substationModificationDtoToForm = (
    substationDto: SubstationModificationDto,
    includePreviousValues = true
): SubstationModificationFormData => {
    return {
        equipmentID: substationDto.equipmentId,
        equipmentName: substationDto.equipmentName?.value ?? '',
        country: substationDto.country?.value ?? null,
        ...getPropertiesFromModification(substationDto?.properties, includePreviousValues),
    };
};
