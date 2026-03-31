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
    FieldType,
    ModificationType,
    yupConfig as yup,
} from '../../../../utils';
import { BY_FILTER_FIELDS } from '../commons/byFilterFields';
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
        [BY_FILTER_FIELDS.EQUIPMENT_TYPE]: yup.string().required(),
        [BY_FILTER_FIELDS.ASSIGNMENTS]: getAssignmentsSchema(emptyValueStr),
    })
    .required();

export type ModificationByAssignmentFormData = InferType<typeof modificationByAssignmentFormSchema>;

export const emptyModificationByAssignmentFormData: DeepNullable<ModificationByAssignmentFormData> = {
    [BY_FILTER_FIELDS.EQUIPMENT_TYPE]: '',
    [BY_FILTER_FIELDS.ASSIGNMENTS]: [getAssignmentInitialValue()],
};

export const modificationByAssignmentDtoToForm = (
    dto: ModificationByAssignmentDto
): ModificationByAssignmentFormData => ({
    [BY_FILTER_FIELDS.EQUIPMENT_TYPE]: dto.equipmentType,
    [BY_FILTER_FIELDS.ASSIGNMENTS]: dto.assignmentInfosList?.map((info) => {
        const assignment = getAssignmentFromEditData(info);
        const fieldKey = assignment[BY_FILTER_FIELDS.EDITED_FIELD] as keyof typeof FieldType;
        const field = FieldType[fieldKey];
        const value = assignment[BY_FILTER_FIELDS.VALUE];
        const valueConverted = convertInputValue(field, value);
        return {
            ...assignment,
            [BY_FILTER_FIELDS.VALUE]: valueConverted !== 0 && !valueConverted ? emptyValueStr : valueConverted,
        };
    }) ?? [getAssignmentInitialValue()],
});

export const modificationByAssignmentFormToDto = (
    formData: ModificationByAssignmentFormData
): ModificationByAssignmentDto => ({
    type: ModificationType.MODIFICATION_BY_ASSIGNMENT,
    equipmentType: formData[BY_FILTER_FIELDS.EQUIPMENT_TYPE],
    assignmentInfosList: formData[BY_FILTER_FIELDS.ASSIGNMENTS].map((assignment) => {
        const fieldKey = assignment[BY_FILTER_FIELDS.EDITED_FIELD] as keyof typeof FieldType;
        const field: FieldType = FieldType[fieldKey];
        const value = assignment[BY_FILTER_FIELDS.VALUE] === emptyValueStr ? '' : assignment[BY_FILTER_FIELDS.VALUE];
        return {
            ...assignment,
            dataType: getDataType(assignment[BY_FILTER_FIELDS.EDITED_FIELD]),
            [BY_FILTER_FIELDS.VALUE]: convertOutputValue(field, value),
        };
    }),
});
