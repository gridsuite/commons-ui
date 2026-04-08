/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { InferType } from 'yup';
import {
    convertInputValue,
    convertOutputValue,
    DeepNullable,
    EquipmentType,
    FieldType,
    ModificationType,
    yupConfig as yup,
} from '../../../../utils';
import {
    getAssignmentFromEditData,
    getAssignmentInitialValue,
    getAssignmentsSchema,
    getDataType,
} from './assignment/assignment-utils';
import { ModificationByAssignmentDto } from './modificationByAssignment.types';

const emptyValueStr = '—';

export const modificationByAssignmentFormSchema = yup
    .object()
    .shape({
        equipmentType: yup.string().required(),
        assignments: getAssignmentsSchema(emptyValueStr),
    })
    .required();

export type ModificationByAssignmentFormData = InferType<typeof modificationByAssignmentFormSchema>;

export const emptyModificationByAssignmentFormData: DeepNullable<ModificationByAssignmentFormData> = {
    equipmentType: '',
    assignments: [getAssignmentInitialValue()],
};

export const modificationByAssignmentDtoToForm = (dto: ModificationByAssignmentDto): ModificationByAssignmentFormData => ({
    equipmentType: dto.equipmentType,
    assignments: dto.assignmentInfosList?.map((info) => {
        const assignment = getAssignmentFromEditData(info);
        const fieldKey = assignment.editedField as keyof typeof FieldType;
        const field = FieldType[fieldKey];
        const { value } = assignment;
        const valueConverted = convertInputValue(field, value);
        return {
            ...assignment,
            value: valueConverted !== 0 && !valueConverted ? emptyValueStr : valueConverted,
        };
    }) ?? [getAssignmentInitialValue()],
});

export const modificationByAssignmentFormToDto = (
    formData: ModificationByAssignmentFormData
): ModificationByAssignmentDto => ({
    type: ModificationType.MODIFICATION_BY_ASSIGNMENT,
    equipmentType: formData.equipmentType as EquipmentType,
    assignmentInfosList: formData.assignments.map((assignment) => {
        const fieldKey = assignment.editedField as keyof typeof FieldType;
        const field: FieldType = FieldType[fieldKey];
        const value = assignment.value === emptyValueStr ? '' : assignment.value;
        return {
            ...assignment,
            dataType: getDataType(assignment.editedField),
            value: convertOutputValue(field, value),
        };
    }),
});
