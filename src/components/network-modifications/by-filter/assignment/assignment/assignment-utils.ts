/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { Schema } from 'yup';
import { FieldConstants, yupConfig as yup } from '../../../../../utils';
import { Assignment, DataType, FieldOptionType, FieldValue } from './assignment.type';
import { FIELD_OPTIONS } from './assignment-constants';

export const getFieldOption = (fieldName?: string | null): FieldOptionType | undefined => {
    return Object.values(FIELD_OPTIONS).find((fieldOption) => fieldOption.id === fieldName);
};

export const getDataType = (fieldName?: string | null) => {
    return getFieldOption(fieldName)?.dataType;
};

export const getUnsettable = (fieldName?: string | null) => {
    return getFieldOption(fieldName)?.settableToNone;
};

function getValueSchema(emptyValueStr: string, dataType?: DataType, settable_to_none?: boolean) {
    let schema: Schema;
    switch (dataType) {
        case DataType.DOUBLE:
            schema = settable_to_none
                ? yup.string().test('is-number-or-none', 'NumericValueOrEmptyField', (value) => {
                      return value === emptyValueStr || !Number.isNaN(Number(value));
                  })
                : yup.number();
            break;
        case DataType.INTEGER:
            schema = yup.number().integer();
            break;
        case DataType.ENUM:
        case DataType.PROPERTY:
            schema = yup.string();
            break;
        case DataType.BOOLEAN:
            schema = yup.boolean();
            break;
        case DataType.STRING:
            schema = yup.string();
            break;
        default:
            schema = yup.number();
    }

    return schema.required();
}

export const getAssignmentInitialValue = () => ({
    [FieldConstants.FILTERS]: [],
    [FieldConstants.EDITED_FIELD]: null,
    [FieldConstants.PROPERTY_NAME]: null,
    [FieldConstants.VALUE]: null,
});

export function getAssignmentsSchema(emptyValueStr: string) {
    return yup
        .array()
        .of(
            yup.object().shape({
                [FieldConstants.FILTERS]: yup
                    .array()
                    .of(
                        yup.object().shape({
                            [FieldConstants.ID]: yup.string().required(),
                            [FieldConstants.NAME]: yup.string().required(),
                        })
                    )
                    .required()
                    .min(1, 'YupRequired'),
                [FieldConstants.EDITED_FIELD]: yup.string().required(),
                [FieldConstants.PROPERTY_NAME]: yup
                    .string()
                    .when([FieldConstants.EDITED_FIELD], ([editedField], schema) => {
                        const dataType = getDataType(editedField);
                        if (dataType === DataType.PROPERTY) {
                            return schema.required();
                        }
                        return schema.nullable();
                    }),
                [FieldConstants.VALUE]: yup
                    .mixed<FieldValue>()
                    .when([FieldConstants.EDITED_FIELD], ([editedField]) => {
                        const dataType = getDataType(editedField);
                        const unsettable = getUnsettable(editedField);
                        return getValueSchema(emptyValueStr, dataType, unsettable);
                    })
                    .required(),
            })
        )
        .required();
}

export function getAssignmentFromEditData(assignment: Assignment): Assignment {
    return {
        ...assignment,
        [FieldConstants.FILTERS]: assignment.filters.map((filter) => ({ ...filter })),
    };
}
