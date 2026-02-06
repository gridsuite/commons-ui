/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { FieldConstants, isBlankOrEmpty, PredefinedProperties } from '../../../../utils';
import yup from '../../../../utils/yupConfig';
import { fetchStudyMetadata } from '../../../../services';
import { FilledProperty, Properties, Property } from './properties.type';

export type EquipmentWithProperties = {
    properties?: Record<string, string>;
};

export const fetchPredefinedProperties = (networkElementType: string): Promise<PredefinedProperties | undefined> => {
    return fetchStudyMetadata().then((studyMetadata) => {
        return studyMetadata.predefinedEquipmentProperties?.[networkElementType];
    });
};

export const emptyProperties: Properties = {
    [FieldConstants.ADDITIONAL_PROPERTIES]: [] as Property[],
};

export const createPropertyModification = (name: string, value: string | null): Property => {
    return {
        [FieldConstants.NAME]: name,
        [FieldConstants.VALUE]: value,
        [FieldConstants.PREVIOUS_VALUE]: value,
        [FieldConstants.DELETION_MARK]: false,
        [FieldConstants.ADDED]: true,
    };
};

export const initializedProperty = (): Property => {
    return createPropertyModification('', null);
};

const isFilledProperty = (property: Property): property is FilledProperty => {
    return property.value != null;
};

export const getFilledPropertiesFromModification = (properties: Property[] | undefined | null): FilledProperty[] => {
    return (
        properties?.filter(isFilledProperty).map((p) => {
            return {
                [FieldConstants.NAME]: p[FieldConstants.NAME],
                [FieldConstants.VALUE]: p[FieldConstants.VALUE],
                [FieldConstants.PREVIOUS_VALUE]: p[FieldConstants.PREVIOUS_VALUE],
                [FieldConstants.ADDED]: p[FieldConstants.ADDED],
                [FieldConstants.DELETION_MARK]: p[FieldConstants.DELETION_MARK],
            };
        }) ?? []
    );
};

export const getPropertiesFromModification = (properties: Property[] | undefined | null): Properties => {
    return {
        [FieldConstants.ADDITIONAL_PROPERTIES]: properties
            ? properties.map((p) => {
                  return {
                      [FieldConstants.NAME]: p[FieldConstants.NAME],
                      [FieldConstants.VALUE]: p[FieldConstants.VALUE],
                      [FieldConstants.PREVIOUS_VALUE]: p[FieldConstants.PREVIOUS_VALUE],
                      [FieldConstants.ADDED]: p[FieldConstants.ADDED],
                      [FieldConstants.DELETION_MARK]: p[FieldConstants.DELETION_MARK],
                  };
              })
            : [],
    };
};

export const copyEquipmentPropertiesForCreation = (equipmentInfos: EquipmentWithProperties): Properties => {
    return {
        [FieldConstants.ADDITIONAL_PROPERTIES]: equipmentInfos.properties
            ? Object.entries(equipmentInfos.properties).map(([name, value]) => {
                  return {
                      [FieldConstants.NAME]: name,
                      [FieldConstants.VALUE]: value,
                      [FieldConstants.PREVIOUS_VALUE]: null,
                      [FieldConstants.DELETION_MARK]: false,
                      [FieldConstants.ADDED]: true,
                  };
              })
            : [],
    };
};

/*
    We first load modification properties (empty at creation but could be filled later on), then we load properties
    already present on the equipment (network). If one of the equipment properties key is present in the modification
    we update the previousValue of this one, it means the modification change the network property value.
    If not we add it as an unmodified property. We will be able to delete it or modify its value, but not it's name.
 */
export const mergeModificationAndEquipmentProperties = (
    modificationProperties: Property[],
    equipment: EquipmentWithProperties
): Property[] => {
    const newModificationProperties = new Map<string, Property>();
    modificationProperties.forEach((property) => {
        if (property.name !== null) {
            newModificationProperties.set(property.name, property);
        }
    });
    if (equipment.properties !== undefined) {
        Object.entries(equipment.properties).forEach(([name, value]) => {
            if (name !== null) {
                let propertyToAdd;
                // If the property is present in the modification and in the equipment
                if (newModificationProperties.has(name)) {
                    const modProperty = newModificationProperties.get(name)!;
                    propertyToAdd = {
                        ...modProperty,
                        previousValue: value, // We set previous value of the modification to the equipment value
                    };
                } else {
                    propertyToAdd = {
                        [FieldConstants.NAME]: name,
                        [FieldConstants.VALUE]: null,
                        [FieldConstants.PREVIOUS_VALUE]: value,
                        [FieldConstants.DELETION_MARK]: false,
                        [FieldConstants.ADDED]: false,
                    };
                }
                newModificationProperties.set(name, propertyToAdd);
            }
        });
    }
    return Array.from(newModificationProperties.values());
};

export function getConcatenatedProperties(
    equipment: EquipmentWithProperties,
    getValues: (name: string) => any,
    id?: string
): any {
    // ex: current Array [ {Object {  name: "p1", value: "v2", previousValue: undefined, added: true, deletionMark: false } }, {...} ]

    const path = id ? `${id}.${FieldConstants.ADDITIONAL_PROPERTIES}` : `${FieldConstants.ADDITIONAL_PROPERTIES}`;
    const modificationProperties = getValues(path);
    return mergeModificationAndEquipmentProperties(modificationProperties, equipment);
}

export const toModificationProperties = (properties: Properties) => {
    const filteredProperties = properties[FieldConstants.ADDITIONAL_PROPERTIES]?.filter(
        (p: Property) => !isBlankOrEmpty(p.value) || p[FieldConstants.DELETION_MARK]
    );
    return filteredProperties === undefined || filteredProperties?.length === 0 ? null : filteredProperties;
};

const checkUniquePropertyNames = (
    properties:
        | {
              name: string;
          }[]
        | undefined
) => {
    if (properties === undefined) {
        return true;
    }
    const validValues = properties.filter((v) => v.name);
    return validValues.length === new Set(validValues.map((v) => v.name)).size;
};

export const creationPropertiesSchema = yup.object({
    [FieldConstants.ADDITIONAL_PROPERTIES]: yup
        .array()
        .of(
            yup.object().shape({
                [FieldConstants.NAME]: yup.string().required(),
                [FieldConstants.VALUE]: yup.string().required(),
                [FieldConstants.PREVIOUS_VALUE]: yup.string().nullable(),
                [FieldConstants.DELETION_MARK]: yup.boolean().required(),
                [FieldConstants.ADDED]: yup.boolean().required(),
            })
        )
        .test('checkUniqueProperties', 'DuplicatedPropsError', (values) => checkUniquePropertyNames(values)),
});

export const modificationPropertiesSchema = yup.object({
    [FieldConstants.ADDITIONAL_PROPERTIES]: yup
        .array()
        .of(
            yup.object().shape({
                [FieldConstants.NAME]: yup.string().required(),
                [FieldConstants.VALUE]: yup
                    .string()
                    .nullable()
                    .when([FieldConstants.ADDED], {
                        is: (added: boolean) => added,
                        then: (schema) => schema.required(),
                    }),
                [FieldConstants.PREVIOUS_VALUE]: yup.string().nullable(),
                [FieldConstants.DELETION_MARK]: yup.boolean().required(),
                [FieldConstants.ADDED]: yup.boolean().required(),
            })
        )
        .test('checkUniqueProperties', 'DuplicatedPropsError', (values) => checkUniquePropertyNames(values)),
});

export const getPropertyValue = (properties: Record<string, string> | undefined, keyName: string): string | undefined =>
    properties?.[keyName];
