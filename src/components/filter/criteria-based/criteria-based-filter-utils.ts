/**
 * Copyright (c) 2021, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import FieldConstants from '../../../utils/field-constants';
import {
    PROPERTY_NAME,
    PROPERTY_VALUES,
    PROPERTY_VALUES_1,
    PROPERTY_VALUES_2,
} from './filter-property';
import { FilterType } from '../constants/filter-constants';
import { PredefinedProperties } from '../../../utils/types';
import yup from '../../../utils/yup-config';
import {
    DEFAULT_RANGE_VALUE,
    getRangeInputDataForm,
    getRangeInputSchema,
} from '../../inputs/react-hook-form/range-input';
import { FreePropertiesTypes } from './filter-free-properties';

export const getCriteriaBasedSchema = (extraFields: any) => ({
    [FieldConstants.CRITERIA_BASED]: yup.object().shape({
        [FieldConstants.COUNTRIES]: yup.array().of(yup.string()),
        [FieldConstants.COUNTRIES_1]: yup.array().of(yup.string()),
        [FieldConstants.COUNTRIES_2]: yup.array().of(yup.string()),
        ...getRangeInputSchema(FieldConstants.NOMINAL_VOLTAGE),
        ...getRangeInputSchema(FieldConstants.NOMINAL_VOLTAGE_1),
        ...getRangeInputSchema(FieldConstants.NOMINAL_VOLTAGE_2),
        ...getRangeInputSchema(FieldConstants.NOMINAL_VOLTAGE_3),
        ...extraFields,
    }),
});
export const getCriteriaBasedFormData = (
    criteriaValues: any,
    extraFields: any
) => ({
    [FieldConstants.CRITERIA_BASED]: {
        [FieldConstants.COUNTRIES]:
            criteriaValues?.[FieldConstants.COUNTRIES] ?? [],
        [FieldConstants.COUNTRIES_1]:
            criteriaValues?.[FieldConstants.COUNTRIES_1] ?? [],
        [FieldConstants.COUNTRIES_2]:
            criteriaValues?.[FieldConstants.COUNTRIES_2] ?? [],
        ...getRangeInputDataForm(
            FieldConstants.NOMINAL_VOLTAGE,
            criteriaValues?.[FieldConstants.NOMINAL_VOLTAGE] ??
                DEFAULT_RANGE_VALUE
        ),
        ...getRangeInputDataForm(
            FieldConstants.NOMINAL_VOLTAGE_1,
            criteriaValues?.[FieldConstants.NOMINAL_VOLTAGE_1] ??
                DEFAULT_RANGE_VALUE
        ),
        ...getRangeInputDataForm(
            FieldConstants.NOMINAL_VOLTAGE_2,
            criteriaValues?.[FieldConstants.NOMINAL_VOLTAGE_2] ??
                DEFAULT_RANGE_VALUE
        ),
        ...getRangeInputDataForm(
            FieldConstants.NOMINAL_VOLTAGE_3,
            criteriaValues?.[FieldConstants.NOMINAL_VOLTAGE_3] ??
                DEFAULT_RANGE_VALUE
        ),
        ...extraFields,
    },
});

/**
 * Transform
 * from obj.equipmentFilterForm.{
 *  freeProperties.{nameB:valuesB},
 *  freeProperties1.{nameA:valuesA},
 *  freeProperties2.{nameA:valuesC}}
 * to a obj.criteriaBased.freeProperties.[
 *  {name_property:nameA, prop_values1:valuesA, prop_values2:valuesC},
 *  {name_property:namesB, prop_values:valuesB}]
 * @author Laurent LAUGARN modified by Florent MILLOT
 */
export const backToFrontTweak = (response: any) => {
    const subProps = response.equipmentFilterForm.substationFreeProperties;
    const freeProps = response.equipmentFilterForm.freeProperties;
    const props1 = response.equipmentFilterForm.freeProperties1;
    const props2 = response.equipmentFilterForm.freeProperties2;
    const allKeys = new Set<string>();
    if (subProps) {
        Object.keys(subProps).forEach((k) => allKeys.add(k));
    }
    if (props1) {
        Object.keys(props1).forEach((k) => allKeys.add(k));
    }
    if (props2) {
        Object.keys(props2).forEach((k) => allKeys.add(k));
    }
    const filterSubstationProperties: PredefinedProperties[] = [];
    const filterFreeProperties: PredefinedProperties[] = [];
    allKeys.forEach((k: string) => {
        const prop: any = { [PROPERTY_NAME]: k };
        const values = subProps?.[k];
        if (values) {
            prop[PROPERTY_VALUES] = values;
        }
        const values1 = props1?.[k];
        if (values1) {
            prop[PROPERTY_VALUES_1] = values1;
        }
        const values2 = props2?.[k];
        if (values2) {
            prop[PROPERTY_VALUES_2] = values2;
        }
        filterSubstationProperties.push(prop);
    });
    allKeys.clear();
    if (freeProps) {
        Object.keys(freeProps).forEach((k) => allKeys.add(k));
    }
    allKeys.forEach((k) => {
        const prop: any = { [PROPERTY_NAME]: k };
        const values = freeProps?.[k];
        if (values) {
            prop[PROPERTY_VALUES] = values;
        }
        filterFreeProperties.push(prop);
    });

    const ret = {
        [FieldConstants.EQUIPMENT_TYPE]:
            response[FieldConstants.EQUIPMENT_TYPE],
        ...getCriteriaBasedFormData(response.equipmentFilterForm, {
            [FieldConstants.ENERGY_SOURCE]:
                response.equipmentFilterForm[FieldConstants.ENERGY_SOURCE],
            [FreePropertiesTypes.SUBSTATION_FILTER_PROPERTIES]:
                filterSubstationProperties,
            [FreePropertiesTypes.FREE_FILTER_PROPERTIES]: filterFreeProperties,
        }),
    };
    return ret;
};

function isNominalVoltageEmpty(
    nominalVoltage: Record<string, unknown>
): boolean {
    return (
        nominalVoltage[FieldConstants.VALUE_1] === null &&
        nominalVoltage[FieldConstants.VALUE_2] === null
    );
}

// The server expect them to be null if the user don't fill them, unlike contingency list
function cleanNominalVoltages(formValues: any) {
    const cleanedFormValues = { ...formValues };
    if (
        isNominalVoltageEmpty(cleanedFormValues[FieldConstants.NOMINAL_VOLTAGE])
    ) {
        cleanedFormValues[FieldConstants.NOMINAL_VOLTAGE] = null;
    }
    if (
        isNominalVoltageEmpty(
            cleanedFormValues[FieldConstants.NOMINAL_VOLTAGE_1]
        )
    ) {
        cleanedFormValues[FieldConstants.NOMINAL_VOLTAGE_1] = null;
    }
    if (
        isNominalVoltageEmpty(
            cleanedFormValues[FieldConstants.NOMINAL_VOLTAGE_2]
        )
    ) {
        cleanedFormValues[FieldConstants.NOMINAL_VOLTAGE_2] = null;
    }
    if (
        isNominalVoltageEmpty(
            cleanedFormValues[FieldConstants.NOMINAL_VOLTAGE_3]
        )
    ) {
        cleanedFormValues[FieldConstants.NOMINAL_VOLTAGE_3] = null;
    }
    return cleanedFormValues;
}

/**
 * Transform
 * from obj.criteriaBased.freeProperties.[
 *  {name_property:nameA, prop_values1:valuesA, prop_values2:valuesC},
 *  {name_property:namesB, prop_values:valuesB}]
 * to obj.equipmentFilterForm.{
 *  freeProperties.{nameB:valuesB},
 *  freeProperties1.{nameA:valuesA},
 *  freeProperties2.{nameA:valuesC}}
 * @author Laurent LAUGARN modified by Florent MILLOT
 */
export const frontToBackTweak = (id?: string, filter?: any) => {
    const filterSubstationProperties =
        filter[FieldConstants.CRITERIA_BASED][
            FreePropertiesTypes.SUBSTATION_FILTER_PROPERTIES
        ];
    const ret = {
        id,
        type: FilterType.CRITERIA_BASED.id,
        equipmentFilterForm: undefined,
    };
    const eff = {
        [FieldConstants.EQUIPMENT_TYPE]: filter[FieldConstants.EQUIPMENT_TYPE],
        ...cleanNominalVoltages(filter[FieldConstants.CRITERIA_BASED]),
    };
    // in the back end we store everything in a field called equipmentFilterForm
    ret.equipmentFilterForm = eff;
    delete eff[FreePropertiesTypes.SUBSTATION_FILTER_PROPERTIES];
    const props: any = {};
    const props1: any = {};
    const props2: any = {};
    filterSubstationProperties.forEach((prop: any) => {
        const values = prop[PROPERTY_VALUES];
        const values1 = prop[PROPERTY_VALUES_1];
        const values2 = prop[PROPERTY_VALUES_2];
        if (values) {
            props[prop[PROPERTY_NAME]] = values;
        }
        if (values1) {
            props1[prop[PROPERTY_NAME]] = values1;
        }
        if (values2) {
            props2[prop[PROPERTY_NAME]] = values2;
        }
    });
    eff.substationFreeProperties = props;
    eff.freeProperties1 = props1;
    eff.freeProperties2 = props2;

    const filterFreeProperties =
        filter[FieldConstants.CRITERIA_BASED][
            FreePropertiesTypes.FREE_FILTER_PROPERTIES
        ];
    // in the back end we store everything in a field called equipmentFilterForm
    delete eff[FreePropertiesTypes.FREE_FILTER_PROPERTIES];
    const freeProps: any = {};
    filterFreeProperties.forEach((prop: any) => {
        const values = prop[PROPERTY_VALUES];
        if (values) {
            freeProps[prop[PROPERTY_NAME]] = values;
        }
    });
    eff.freeProperties = freeProps;
    return ret;
};
