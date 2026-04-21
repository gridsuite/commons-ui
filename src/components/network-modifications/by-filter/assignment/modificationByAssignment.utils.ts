/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { InferType, mixed } from 'yup';
import {
    convertInputValue,
    convertOutputValue,
    DeepNullable,
    EquipmentType,
    FieldConstants,
    FieldType,
    ModificationType,
    yupConfig as yup,
} from '../../../../utils';
import {
    EMPTY_FIELD_VALUE,
    getAssignmentFromEditData,
    getAssignmentInitialValue,
    getAssignmentsSchema,
    getDataType,
    getUnsettable,
} from './assignment/assignment-utils';
import { ModificationByAssignmentDto } from './modificationByAssignment.types';
import { DataType } from './assignment/assignment.type';

export const modificationByAssignmentFormSchema = yup
    .object()
    .shape({
        [FieldConstants.EQUIPMENT_TYPE]: mixed<EquipmentType>().oneOf(Object.values(EquipmentType)).required(),
        [FieldConstants.ASSIGNMENTS]: getAssignmentsSchema(EMPTY_FIELD_VALUE),
    })
    .required();

export type ModificationByAssignmentFormData = InferType<typeof modificationByAssignmentFormSchema>;

export const emptyModificationByAssignmentFormData: DeepNullable<ModificationByAssignmentFormData> = {
    [FieldConstants.EQUIPMENT_TYPE]: null,
    [FieldConstants.ASSIGNMENTS]: [getAssignmentInitialValue()],
};

export const modificationByAssignmentDtoToForm = (
    dto: ModificationByAssignmentDto
): ModificationByAssignmentFormData => ({
    [FieldConstants.EQUIPMENT_TYPE]: dto.equipmentType,
    [FieldConstants.ASSIGNMENTS]: dto.assignmentInfosList?.map((info) => {
        const assignment = getAssignmentFromEditData(info);
        const fieldKey = assignment.editedField as keyof typeof FieldType;
        const field = FieldType[fieldKey];
        const { value } = assignment;
        const valueConverted = convertInputValue(field, value);
        const unsettable = getUnsettable(assignment.editedField);
        return {
            ...assignment,
            value: unsettable && valueConverted !== 0 && !valueConverted ? EMPTY_FIELD_VALUE : valueConverted,
        };
    }) ?? [getAssignmentInitialValue()],
});

export const modificationByAssignmentFormToDto = (
    formData: ModificationByAssignmentFormData
): ModificationByAssignmentDto => ({
    type: ModificationType.MODIFICATION_BY_ASSIGNMENT,
    equipmentType: formData.equipmentType,
    assignmentInfosList: formData.assignments.map((assignment) => {
        const fieldKey = assignment.editedField as keyof typeof FieldType;
        const field: FieldType = FieldType[fieldKey];
        const value = assignment.value === EMPTY_FIELD_VALUE ? '' : assignment.value;
        return {
            ...assignment,
            dataType: getDataType(assignment.editedField) ?? DataType.STRING,
            value: convertOutputValue(field, value),
        };
    }),
});
