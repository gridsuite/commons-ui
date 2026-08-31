/*
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 * SPDX-License-Identifier: MPL-2.0
 */

import * as yup from 'yup';
import { IntlShape } from 'react-intl';
import {
    EquipmentType,
    equipmentTypesForPredefinedPropertiesMapper,
    FieldConstants,
    getCsvDelimiter,
    MODIFICATIONS_REQUIRED_TAB_ERROR,
} from '../../../utils';
import { createPropertyModification, Property, ReactiveCapabilityCurvePoints } from '../common';
import {
    PROPERTY_CSV_COLUMN_PREFIX,
    TABULAR_BOOLEAN,
    TABULAR_ENUM,
    TABULAR_NUMBER,
    TabularFieldConstants,
} from './tabular.constants';
import { tabularPropertiesSchema, TabularProperty } from './properties/tabularProperty.utils';
import { TabularModificationType } from './tabular.types';
import type { PredefinedEquipmentProperties, TabularField, TabularModificationRow } from './tabular.types';

export const tabularFormSchema = yup
    .object()
    .shape({
        [FieldConstants.TYPE]: yup.string().nullable().required(),
        [TabularFieldConstants.MODIFICATIONS_TABLE]: yup.array().min(1, MODIFICATIONS_REQUIRED_TAB_ERROR).required(),
        [TabularFieldConstants.CSV_FILENAME]: yup.string(),
    })
    .concat(tabularPropertiesSchema)
    .required();

export type TabularFormType = yup.InferType<typeof tabularFormSchema>;

export const getEmptyTabularFormData = (equipmentType: string) => {
    return {
        [FieldConstants.TYPE]: equipmentType,
        [TabularFieldConstants.MODIFICATIONS_TABLE]: [],
        [TabularFieldConstants.TABULAR_PROPERTIES]: [],
        [TabularFieldConstants.CSV_FILENAME]: undefined,
    };
};

export const formatModification = (modification: TabularModificationRow) => {
    // exclude type, date and uuid from the modification object
    const { type, date, uuid, ...rest } = modification;
    return rest;
};

export const addPropertiesFromBack = (modification: TabularModificationRow, tabularProperties: Property[] | null) => {
    const updatedModification: TabularModificationRow = { ...modification };
    tabularProperties?.forEach((property: Property) => {
        updatedModification[PROPERTY_CSV_COLUMN_PREFIX + property.name] = property.value;
    });
    return updatedModification;
};

export const convertReactiveCapabilityCurvePointsFromBackToFront = (value: ReactiveCapabilityCurvePoints[]) => {
    const curvePoint1 = value[0];
    const curvePoint2 = value[1];
    const curvePoint3 = value[2];

    if (!curvePoint1) {
        return [];
    }

    const result = [
        {
            key: TabularFieldConstants.REACTIVE_CAPABILITY_CURVE_P_MIN,
            value: curvePoint1.p,
        },
        {
            key: TabularFieldConstants.REACTIVE_CAPABILITY_CURVE_Q_MAX_P_MIN,
            value: curvePoint1.maxQ,
        },
        {
            key: TabularFieldConstants.REACTIVE_CAPABILITY_CURVE_Q_MIN_P_MIN,
            value: curvePoint1.minQ,
        },
    ];

    if (curvePoint2) {
        const isLastPoint = !curvePoint3;

        result.push(
            {
                key: isLastPoint
                    ? TabularFieldConstants.REACTIVE_CAPABILITY_CURVE_P_MAX
                    : TabularFieldConstants.REACTIVE_CAPABILITY_CURVE_P_0,
                value: curvePoint2.p,
            },
            {
                key: isLastPoint
                    ? TabularFieldConstants.REACTIVE_CAPABILITY_CURVE_Q_MAX_P_MAX
                    : TabularFieldConstants.REACTIVE_CAPABILITY_CURVE_Q_MAX_P_0,
                value: curvePoint2.maxQ,
            },
            {
                key: isLastPoint
                    ? TabularFieldConstants.REACTIVE_CAPABILITY_CURVE_Q_MIN_P_MAX
                    : TabularFieldConstants.REACTIVE_CAPABILITY_CURVE_Q_MIN_P_0,
                value: curvePoint2.minQ,
            }
        );
    }

    if (curvePoint3) {
        result.push(
            { key: TabularFieldConstants.REACTIVE_CAPABILITY_CURVE_P_MAX, value: curvePoint3.p },
            { key: TabularFieldConstants.REACTIVE_CAPABILITY_CURVE_Q_MAX_P_MAX, value: curvePoint3.maxQ },
            { key: TabularFieldConstants.REACTIVE_CAPABILITY_CURVE_Q_MIN_P_MAX, value: curvePoint3.minQ }
        );
    }

    return result;
};

/* eslint-disable no-param-reassign -- the row is updated in place, as expected by the callers */
export const convertReactiveCapabilityCurvePointsFromFrontToBack = (modification: TabularModificationRow) => {
    if (modification[TabularFieldConstants.REACTIVE_CAPABILITY_CURVE]) {
        // Convert list data to matrix
        const rccPoints = [];
        if (modification[TabularFieldConstants.REACTIVE_CAPABILITY_CURVE_P_MIN] !== null) {
            rccPoints.push({
                p: modification[TabularFieldConstants.REACTIVE_CAPABILITY_CURVE_P_MIN],
                maxQ: modification[TabularFieldConstants.REACTIVE_CAPABILITY_CURVE_Q_MAX_P_MIN],
                minQ: modification[TabularFieldConstants.REACTIVE_CAPABILITY_CURVE_Q_MIN_P_MIN],
            });
        }
        if (modification[TabularFieldConstants.REACTIVE_CAPABILITY_CURVE_P_0] !== null) {
            rccPoints.push({
                p: modification[TabularFieldConstants.REACTIVE_CAPABILITY_CURVE_P_0],
                maxQ: modification[TabularFieldConstants.REACTIVE_CAPABILITY_CURVE_Q_MAX_P_0],
                minQ: modification[TabularFieldConstants.REACTIVE_CAPABILITY_CURVE_Q_MIN_P_0],
            });
        }
        if (modification[TabularFieldConstants.REACTIVE_CAPABILITY_CURVE_P_MAX] !== null) {
            rccPoints.push({
                p: modification[TabularFieldConstants.REACTIVE_CAPABILITY_CURVE_P_MAX],
                maxQ: modification[TabularFieldConstants.REACTIVE_CAPABILITY_CURVE_Q_MAX_P_MAX],
                minQ: modification[TabularFieldConstants.REACTIVE_CAPABILITY_CURVE_Q_MIN_P_MAX],
            });
        }
        modification[TabularFieldConstants.REACTIVE_CAPABILITY_CURVE_POINTS] = rccPoints;
    }
};
/* eslint-enable no-param-reassign */

export const setFieldTypeError = (
    fieldTypeInError: string,
    expectedTypeForFieldInError: string,
    tableName: string,
    setError: (tableName: string, error: { type: string; message?: string }) => void,
    intl: IntlShape,
    expectedValues?: string[]
) => {
    if (expectedTypeForFieldInError === TABULAR_ENUM) {
        setError(tableName, {
            type: 'custom',
            message: intl.formatMessage(
                { id: 'WrongEnumValue' },
                {
                    field: fieldTypeInError,
                    expectedValues: expectedValues?.join(', ') ?? '',
                }
            ),
        });
    } else {
        setError(tableName, {
            type: 'custom',
            message: intl.formatMessage(
                { id: 'WrongFieldType' },
                {
                    field: fieldTypeInError,
                    type: intl.formatMessage({ id: `fieldType.${expectedTypeForFieldInError}` }),
                }
            ),
        });
    }
};

export const isFieldTypeOk = (value: any, fieldDefinition: { type?: string; options?: any[] } | undefined): boolean => {
    if (!fieldDefinition?.type || value === null || value === undefined) {
        return true;
    }

    switch (fieldDefinition.type) {
        case TABULAR_BOOLEAN:
            if (typeof value !== 'boolean') {
                return false;
            }
            break;

        case TABULAR_NUMBER: {
            const parsedNumber = parseFloat(value);
            if (Number.isNaN(parsedNumber)) {
                return false;
            }
            break;
        }

        case TABULAR_ENUM:
            if (!fieldDefinition?.options?.includes(value)) {
                return false;
            }
            break;

        default:
            console.warn(`Unknown type "${fieldDefinition.type}" for value "${value}". Value will be returned as-is.`);
            break;
    }
    return true;
};

/**
 * Sanitize a CSV cell value before injecting it into the table:
 * - a mandatory boolean (checkbox) cell with no/invalid value defaults to `false`
 *   (an empty checkbox cannot be distinguished from `false`),
 * - any other value with a wrong format is dropped (replaced by `null`) so invalid data
 *   is never injected,
 * - otherwise the value is kept as-is (including non-typed `property_*` columns).
 */
export const sanitizeRowValue = (value: any, fieldDefinition: TabularField | undefined): any => {
    if (fieldDefinition?.type === TABULAR_BOOLEAN && fieldDefinition.required && typeof value !== 'boolean') {
        return false;
    }
    if (!isFieldTypeOk(value, fieldDefinition)) {
        return null;
    }
    return value;
};

interface CommentLinesConfig {
    fields: TabularField[] | null;
    selectedProperties: string[];
    intl: IntlShape;
    equipmentType: string;
    language: string;
    formType: TabularModificationType;
    predefinedEquipmentProperties?: PredefinedEquipmentProperties;
}

export const generateCommentLines = ({
    fields,
    selectedProperties,
    intl,
    equipmentType,
    language,
    formType,
    predefinedEquipmentProperties,
}: CommentLinesConfig): string[][] => {
    const commentData: string[][] = [];

    const csvTranslatedColumns = fields
        ?.map((field: TabularField) => intl.formatMessage({ id: field.id }) + (field.required ? ' (*)' : ''))
        ?.concat(selectedProperties);

    if (csvTranslatedColumns) {
        const separator = getCsvDelimiter(language);
        // First comment line contains header translation
        commentData.push(csvTranslatedColumns.map((column, index) => (index === 0 ? `#${column}` : column)));

        // Check for optional second comment line from the translation file
        let secondCommentLine: string = '';
        const formTypeKeyPart = formType === TabularModificationType.CREATION ? 'Creation' : 'Modification';
        const commentKey = `Tabular${formTypeKeyPart}SkeletonComment.${equipmentType}`;
        if (intl.messages[commentKey]) {
            secondCommentLine = intl.formatMessage({ id: commentKey });
        }
        if (selectedProperties.length) {
            const networkEquipmentType = equipmentTypesForPredefinedPropertiesMapper(equipmentType as EquipmentType);
            if (networkEquipmentType && predefinedEquipmentProperties?.[networkEquipmentType]) {
                if (secondCommentLine.length === 0) {
                    // create an empty row without property columns
                    const nbSeparator = csvTranslatedColumns.length - 1 - selectedProperties.length;
                    secondCommentLine = separator.repeat(nbSeparator);
                }
                selectedProperties.forEach((propertyName) => {
                    const possibleValues =
                        predefinedEquipmentProperties[networkEquipmentType]?.[propertyName]?.toSorted((a, b) =>
                            a.localeCompare(b)
                        ) ?? [];
                    secondCommentLine += separator;
                    if (possibleValues.length > 0) {
                        secondCommentLine += possibleValues.join(' | ');
                    }
                });
            }
        }
        if (secondCommentLine.length > 0 && secondCommentLine.replaceAll(separator, '').length > 0) {
            commentData.push(secondCommentLine.split(separator));
        }
    }
    return commentData;
};

export const transformProperties = (row: TabularModificationRow): Property[] => {
    const propertiesModifications: Property[] = [];
    Object.keys(row).forEach((key) => {
        if (key.startsWith(PROPERTY_CSV_COLUMN_PREFIX) && row[key]?.length) {
            // if a value is set for a "property_*" column and the current row
            propertiesModifications.push(
                createPropertyModification(key.replace(PROPERTY_CSV_COLUMN_PREFIX, ''), row[key])
            );
            // eslint-disable-next-line no-param-reassign -- the property columns are consumed from the row
            delete row[key];
        }
    });
    return propertiesModifications;
};

export const getSelectedTabularPropertyNames = (tabularProperties: TabularProperty[] | undefined): string[] =>
    tabularProperties?.filter((property) => property.selected)?.map((property) => property.name) ?? [];
