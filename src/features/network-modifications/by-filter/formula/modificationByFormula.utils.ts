/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import * as yup from 'yup';
import { UUID } from 'node:crypto';
import {
    convertInputValue,
    convertOutputValue,
    DeepNullable,
    FieldConstants,
    FieldType,
    ModificationType,
} from '../../../../utils';
import { getFormulaInitialValue, getFormulaSchema } from './formula/formula-utils';

import {
    FORMULAS,
    OPERATOR,
    REFERENCE_FIELD_OR_VALUE_1,
    REFERENCE_FIELD_OR_VALUE_2,
} from './formula/formula-constants';
import { ModificationByFormulaDto, ReferenceFieldOrValue } from './formula/formula.type';

export const modificationByFormulaFormSchema = yup
    .object()
    .shape({
        [FieldConstants.EQUIPMENT_TYPE]: yup.string().required(),
        [FORMULAS]: getFormulaSchema(),
    })
    .required();

export type ModificationByFormulaFormData = yup.InferType<typeof modificationByFormulaFormSchema>;

export const emptyModificationFormData: DeepNullable<ModificationByFormulaFormData> = {
    [FieldConstants.EQUIPMENT_TYPE]: '',
    [FORMULAS]: [getFormulaInitialValue()],
};

function shouldConvert(isNumber1: boolean, isNumber2: boolean, operator: string) {
    switch (operator) {
        case 'DIVISION':
            if (isNumber1 && isNumber2) {
                return { convertValue1: true, convertValue2: false };
            }
            return { convertValue1: false, convertValue2: false };
        case 'MULTIPLICATION':
        case 'PERCENTAGE':
            if (isNumber1 && isNumber2) {
                return { convertValue1: false, convertValue2: true };
            }
            return { convertValue1: false, convertValue2: false };
        default: // Any Other case : convert
            return { convertValue1: true, convertValue2: true };
    }
}

function shouldConvertFromNumber(input1: number | null, input2: number | null, operator: string) {
    const isNumber1 = input1 !== null && !Number.isNaN(input1);
    const isNumber2 = input2 !== null && !Number.isNaN(input2);
    return shouldConvert(isNumber1, isNumber2, operator);
}

function shouldConvertFromString(input1: string | null, input2: string | null, operator: string) {
    const isNumber1 = input1 !== null && !Number.isNaN(Number.parseFloat(input1.replace(',', '.')));
    const isNumber2 = input2 !== null && !Number.isNaN(Number.parseFloat(input2.replace(',', '.')));
    return shouldConvert(isNumber1, isNumber2, operator);
}

export const modificationByFormulaDtoToForm = (dto: ModificationByFormulaDto): ModificationByFormulaFormData => {
    const formulas = dto.formulaInfosList?.map((formula) => {
        const shouldConverts = shouldConvertFromNumber(
            formula?.fieldOrValue1?.value,
            formula?.fieldOrValue2?.value,
            formula?.operator
        );

        const valueConverted1 = shouldConverts.convertValue1
            ? convertInputValue(formula.editedField as FieldType, formula?.fieldOrValue1?.value)
            : formula?.fieldOrValue1?.value;
        const valueConverted2 = shouldConverts.convertValue2
            ? convertInputValue(formula.editedField as FieldType, formula?.fieldOrValue2?.value)
            : formula?.fieldOrValue2?.value;
        const ref1 = valueConverted1?.toString() ?? formula?.fieldOrValue1?.equipmentField;
        const ref2 = valueConverted2?.toString() ?? formula?.fieldOrValue2?.equipmentField;
        return {
            [REFERENCE_FIELD_OR_VALUE_1]: ref1,
            [REFERENCE_FIELD_OR_VALUE_2]: ref2,
            [FieldConstants.EDITED_FIELD]: formula.editedField,
            [OPERATOR]: formula.operator,
            [FieldConstants.FILTERS]: formula.filters,
        };
    });
    return {
        [FieldConstants.EQUIPMENT_TYPE]: dto.identifiableType,
        [FORMULAS]: formulas,
    };
};

function getFieldOrConvertedUnitValue(input: string, fieldType: FieldType, convert: boolean): ReferenceFieldOrValue {
    const value = input.replace(',', '.');
    const isNumber = !Number.isNaN(Number.parseFloat(value));

    if (isNumber) {
        return {
            value: convert ? convertOutputValue(fieldType, value) : value,
            equipmentField: null,
        };
    }
    return {
        value: null,
        equipmentField: input,
    };
}

export const modificationByFormulaFormToDto = (formData: ModificationByFormulaFormData): ModificationByFormulaDto => {
    const formulas = formData[FORMULAS]?.map((formula) => {
        const shouldConverts = shouldConvertFromString(
            formula[REFERENCE_FIELD_OR_VALUE_1] as string,
            formula[REFERENCE_FIELD_OR_VALUE_2] as string,
            formula[OPERATOR]
        );
        const fieldOrValue1 = getFieldOrConvertedUnitValue(
            formula[REFERENCE_FIELD_OR_VALUE_1] as string,
            formula[FieldConstants.EDITED_FIELD] as FieldType,
            shouldConverts.convertValue1
        );
        const fieldOrValue2 = getFieldOrConvertedUnitValue(
            formula[REFERENCE_FIELD_OR_VALUE_2] as string,
            formula[FieldConstants.EDITED_FIELD] as FieldType,
            shouldConverts.convertValue2
        );

        const filters = formula[FieldConstants.FILTERS]?.map((filter) => {
            return {
                id: filter.id as UUID,
                name: filter.name,
                specificMetadata: filter.specificMetadata,
            };
        });

        return {
            fieldOrValue1,
            fieldOrValue2,
            filters,
            operator: formula.operator,
            editedField: formula.editedField,
        };
    });
    return {
        type: ModificationType.BY_FORMULA_MODIFICATION,
        identifiableType: formData[FieldConstants.EQUIPMENT_TYPE],
        formulaInfosList: formulas ?? [],
    };
};
