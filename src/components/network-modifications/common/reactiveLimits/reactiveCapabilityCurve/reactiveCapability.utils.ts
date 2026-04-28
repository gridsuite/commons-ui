/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { array, number, ref, object, TestContext, ValidationError } from 'yup';
import { FieldValues, UseFormSetValue } from 'react-hook-form';
import { ReactiveCapabilityCurve, ReactiveCapabilityCurvePoints } from '../reactiveLimits.type';
import { FieldConstants, toNumber, validateValueIsANumber } from '../../../../../utils';
import {
    GeneratorCreationDialogSchemaForm,
    GeneratorDialogSchemaBaseForm,
    GeneratorModificationDialogSchemaForm,
} from '../../../generator/generatorDialog.type';
import { GeneratorCreationDto } from '../../../generator/creation/generatorCreation.types';
import { GeneratorModificationDto } from '../../../generator/modification/generatorModification.types';

export const INSERT = 'INSERT';
export const REMOVE = 'REMOVE';

const getCreationRowSchema = () =>
    object().shape({
        [FieldConstants.MAX_Q]: number().nullable().default(null),
        [FieldConstants.MIN_Q]: number()
            .nullable()
            .default(null)
            .max(ref(FieldConstants.MAX_Q), 'ReactiveCapabilityCurveCreationErrorQminPQmaxPIncoherence'),
        [FieldConstants.P]: number().nullable().default(null),
    });

export const getRowEmptyFormData = () => ({
    [FieldConstants.P]: null,
    [FieldConstants.MAX_Q]: null,
    [FieldConstants.MIN_Q]: null,
});

function getNotNullPFromArray(values: ReactiveCapabilityCurve) {
    return values
        ?.map((element) => {
            const pValue = element[FieldConstants.P];

            // Note : convertion toNumber is necessary here to prevent corner cases like if
            // two values are "-0" and "0", which would be considered different by the Set below.
            return validateValueIsANumber(pValue) ? toNumber(pValue) : null;
        })
        .filter((p) => p !== null);
}

function checkAllPValuesAreUnique(values: ReactiveCapabilityCurve) {
    const validActivePowerValues = getNotNullPFromArray(values);
    const setOfPs = [...new Set(validActivePowerValues)];
    return setOfPs.length === validActivePowerValues?.length;
}

function checkAllPValuesBetweenMinMax(values: ReactiveCapabilityCurve) {
    const validActivePowerValues = getNotNullPFromArray(values);
    if (validActivePowerValues) {
        const minP = validActivePowerValues[0];
        const maxP = validActivePowerValues[validActivePowerValues.length - 1];
        return validActivePowerValues.every((p: number) => p >= minP && p <= maxP);
    }
    return undefined;
}

function hasAtLeastOneNegativeP(values: ReactiveCapabilityCurve) {
    return values?.some((value) => value.p && value.p < 0);
}

function hasAtLeastOnePositiveP(values: ReactiveCapabilityCurve) {
    return values?.some((value) => value.p && value.p >= 0);
}

function ifOneFieldThenAllFields(values: ReactiveCapabilityCurve, context: TestContext) {
    if (!values) {
        return true;
    }
    const hasAnyValue = values.some((v) => v.p != null || v.maxQ != null || v.minQ != null);
    if (!hasAnyValue) {
        return true;
    }
    const errors: ValidationError[] = [];
    values.forEach((value, index) => {
        (['p', 'maxQ', 'minQ'] as const).forEach((field) => {
            if (value?.[field] == null) {
                errors.push(
                    context.createError({
                        path: `${FieldConstants.REACTIVE_LIMITS}.${FieldConstants.REACTIVE_CAPABILITY_CURVE_TABLE}[${index}].${field}`,
                        message: 'YupRequired',
                    })
                );
            }
        });
    });

    return errors.length === 0 ? true : new ValidationError(errors);
}

export const getReactiveCapabilityCurveValidationSchema = (
    id = FieldConstants.REACTIVE_CAPABILITY_CURVE_TABLE,
    positiveAndNegativePExist = false
) => ({
    [id]: array()
        .nullable()
        .when([FieldConstants.REACTIVE_CAPABILITY_CURVE_CHOICE], {
            is: 'CURVE',
            then: (schema) => {
                let resultSchema = schema.of(getCreationRowSchema());
                if (positiveAndNegativePExist) {
                    resultSchema = resultSchema
                        .test(
                            'checkATLeastThereIsOneNegativeP',
                            'ReactiveCapabilityCurveCreationErrorMissingNegativeP',
                            hasAtLeastOneNegativeP
                        )
                        .test(
                            'checkATLeastThereIsOnePositiveP',
                            'ReactiveCapabilityCurveCreationErrorMissingPositiveP',
                            hasAtLeastOnePositiveP
                        );
                }
                return resultSchema
                    .min(2, 'ReactiveCapabilityCurveCreationErrorMissingPoints')
                    .test('ifOneFieldThenAllFields', '', ifOneFieldThenAllFields)
                    .test(
                        'checkAllValuesAreUnique',
                        'ReactiveCapabilityCurveCreationErrorPInvalid',
                        checkAllPValuesAreUnique
                    )
                    .test(
                        'checkAllValuesBetweenMinMax',
                        'ReactiveCapabilityCurveCreationErrorPOutOfRange',
                        checkAllPValuesBetweenMinMax
                    );
            },
        }),
});

export function setSelectedReactiveLimits(
    id: string,
    minMaxReactiveLimits: number,
    setValue: UseFormSetValue<FieldValues>
) {
    setValue(id, minMaxReactiveLimits ? 'MINMAX' : 'CURVE');
}

export function setCurrentReactiveCapabilityCurveTable(
    previousReactiveCapabilityCurveTable: ReactiveCapabilityCurve,
    fieldKey: string,
    setValue: UseFormSetValue<FieldValues>
) {
    setValue(fieldKey, previousReactiveCapabilityCurveTable);
}

function handleReactiveCapabilityCurveChoice(
    currentChoice: string | null | undefined,
    previousChoice: string | null | undefined,
    currentReactiveLimits: GeneratorDialogSchemaBaseForm[typeof FieldConstants.REACTIVE_LIMITS] | null | undefined
) {
    if (currentChoice === 'MINMAX') {
        const hasAnyValue =
            currentReactiveLimits?.[FieldConstants.MAXIMUM_REACTIVE_POWER] ||
            currentReactiveLimits?.[FieldConstants.MINIMUM_REACTIVE_POWER];
        if (previousChoice === 'CURVE' && !hasAnyValue) {
            return 'CURVE';
        }
        return 'MINMAX';
    }
    if (currentChoice === 'CURVE') {
        const currentPoints = currentReactiveLimits?.[FieldConstants.REACTIVE_CAPABILITY_CURVE_TABLE];
        const hasAnyValue = currentPoints?.some((v) => v.p != null || v.maxQ != null || v.minQ != null);
        if (previousChoice === 'MINMAX' && !hasAnyValue) {
            return 'MINMAX';
        }
        return 'CURVE';
    }
    console.error(
        'Reactive capability curve choice is not valid, it should be either MINMAX or CURVE. We return MINMAX by default.'
    );
    return 'MINMAX';
}

// In case the user has changed the choice of the reactive capability curve, but not the values, we keep the original choice
export function toReactiveCapabilityCurveChoiceForGeneratorCreation(
    currentReactiveLimits: GeneratorCreationDialogSchemaForm[typeof FieldConstants.REACTIVE_LIMITS],
    editData: GeneratorCreationDto | null | undefined
) {
    const currentChoice = currentReactiveLimits?.[FieldConstants.REACTIVE_CAPABILITY_CURVE_CHOICE];
    let previousChoice: 'CURVE' | 'MINMAX' | undefined;
    if (editData) {
        previousChoice = editData.reactiveCapabilityCurve ? 'CURVE' : 'MINMAX';
    }
    return handleReactiveCapabilityCurveChoice(currentChoice, previousChoice, currentReactiveLimits);
}

// In case the user has changed the choice of the reactive capability curve, but not the values, we keep the original choice
export function toReactiveCapabilityCurveChoiceForGeneratorModification(
    currentReactiveLimits: GeneratorModificationDialogSchemaForm[typeof FieldConstants.REACTIVE_LIMITS],
    editData: GeneratorModificationDto | null | undefined,
    networkPoints: ReactiveCapabilityCurvePoints[] | null | undefined
) {
    const currentChoice = currentReactiveLimits?.[FieldConstants.REACTIVE_CAPABILITY_CURVE_CHOICE];
    let editDataChoice;
    if (editData) {
        editDataChoice = editData.reactiveCapabilityCurve?.value === true ? 'CURVE' : 'MINMAX';
    }
    const networkChoice = networkPoints ? 'CURVE' : 'MINMAX';
    const previousChoice = editDataChoice ?? networkChoice;

    return handleReactiveCapabilityCurveChoice(currentChoice, previousChoice, currentReactiveLimits);
}
