/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { number, ref, string } from 'yup';
import {
    FieldConstants,
    MAXIMUM_SECTION_COUNT_MUST_BE_GREATER_OR_EQUAL_TO_ONE,
    SECTION_COUNT_MUST_BE_BETWEEN_ZERO_AND_MAXIMUM_SECTION_COUNT,
    SHUNT_COMPENSATOR_ERROR_Q_AT_NOMINAL_VOLTAGE_LESS_THAN_ZERO,
} from '../../../../utils';
import { CHARACTERISTICS_CHOICES, computeSwitchedOnValue, SHUNT_COMPENSATOR_TYPES } from './shuntCompensator.utils';

const getCharacteristicsCreateFormValidationSchema = () => ({
    [FieldConstants.MAX_Q_AT_NOMINAL_V]: number()
        .nullable()
        .default(null)
        .when([FieldConstants.CHARACTERISTICS_CHOICE], {
            is: (characteristicsChoice: string) => characteristicsChoice === CHARACTERISTICS_CHOICES.Q_AT_NOMINAL_V.id,
            then: (schema) => schema.min(0, SHUNT_COMPENSATOR_ERROR_Q_AT_NOMINAL_VOLTAGE_LESS_THAN_ZERO).required(),
        }),
    [FieldConstants.MAX_SUSCEPTANCE]: number()
        .nullable()
        .default(null)
        .when([FieldConstants.CHARACTERISTICS_CHOICE], {
            is: (characteristicsChoice: string) => characteristicsChoice === CHARACTERISTICS_CHOICES.SUSCEPTANCE.id,
            then: (schema) => schema.required(),
        }),
    [FieldConstants.MAXIMUM_SECTION_COUNT]: number()
        .required()
        .min(1, MAXIMUM_SECTION_COUNT_MUST_BE_GREATER_OR_EQUAL_TO_ONE),
    [FieldConstants.SECTION_COUNT]: number()
        .required()
        .min(0, SECTION_COUNT_MUST_BE_BETWEEN_ZERO_AND_MAXIMUM_SECTION_COUNT)
        .max(ref(FieldConstants.MAXIMUM_SECTION_COUNT), SECTION_COUNT_MUST_BE_BETWEEN_ZERO_AND_MAXIMUM_SECTION_COUNT),
    [FieldConstants.SWITCHED_ON_Q_AT_NOMINAL_V]: number().notRequired(),
    [FieldConstants.SWITCHED_ON_SUSCEPTANCE]: number().notRequired(),
});

const getCharacteristicsModificationFormValidationSchema = () => ({
    [FieldConstants.MAX_Q_AT_NOMINAL_V]: number()
        .min(0, SHUNT_COMPENSATOR_ERROR_Q_AT_NOMINAL_VOLTAGE_LESS_THAN_ZERO)
        .nullable()
        .default(null),
    [FieldConstants.MAX_SUSCEPTANCE]: number().nullable().default(null),
    [FieldConstants.MAXIMUM_SECTION_COUNT]: number()
        .min(1, MAXIMUM_SECTION_COUNT_MUST_BE_GREATER_OR_EQUAL_TO_ONE)
        .nullable()
        .default(null),
    [FieldConstants.SECTION_COUNT]: number()
        .min(0, SECTION_COUNT_MUST_BE_BETWEEN_ZERO_AND_MAXIMUM_SECTION_COUNT)
        .nullable()
        .default(null),
    [FieldConstants.SWITCHED_ON_Q_AT_NOMINAL_V]: number().nullable(),
    [FieldConstants.SWITCHED_ON_SUSCEPTANCE]: number().nullable(),
});

export const getCharacteristicsFormValidationSchema = (isModification: boolean) => {
    const baseSchema = {
        [FieldConstants.CHARACTERISTICS_CHOICE]: string().required(),
        [FieldConstants.SHUNT_COMPENSATOR_TYPE]: string()
            .nullable()
            .default(null)
            .when([FieldConstants.CHARACTERISTICS_CHOICE], {
                is: (choice: string) => choice === CHARACTERISTICS_CHOICES.Q_AT_NOMINAL_V.id && !isModification,
                then: (schema) =>
                    schema.oneOf([SHUNT_COMPENSATOR_TYPES.CAPACITOR.id, SHUNT_COMPENSATOR_TYPES.REACTOR.id]).required(),
            }),
    };
    const additionalSchema = isModification
        ? getCharacteristicsModificationFormValidationSchema()
        : getCharacteristicsCreateFormValidationSchema();

    return {
        ...baseSchema,
        ...additionalSchema,
    };
};

export const getCharacteristicsEmptyFormData = () => ({
    [FieldConstants.MAXIMUM_SECTION_COUNT]: null,
    [FieldConstants.SECTION_COUNT]: null,
    [FieldConstants.CHARACTERISTICS_CHOICE]: CHARACTERISTICS_CHOICES.Q_AT_NOMINAL_V.id,
    [FieldConstants.MAX_SUSCEPTANCE]: null,
    [FieldConstants.SHUNT_COMPENSATOR_TYPE]: null,
    [FieldConstants.MAX_Q_AT_NOMINAL_V]: null,
    [FieldConstants.SWITCHED_ON_Q_AT_NOMINAL_V]: null,
    [FieldConstants.SWITCHED_ON_SUSCEPTANCE]: null,
});

export const getCharacteristicsFormData = ({
    maxSusceptance,
    maxQAtNominalV,
    shuntCompensatorType,
    sectionCount,
    maximumSectionCount,
}: {
    maxSusceptance: number | null;
    maxQAtNominalV: number | null;
    shuntCompensatorType?: string | null;
    sectionCount?: number | null;
    maximumSectionCount?: number | null;
}) => ({
    [FieldConstants.CHARACTERISTICS_CHOICE]:
        maxSusceptance == null ? CHARACTERISTICS_CHOICES.Q_AT_NOMINAL_V.id : CHARACTERISTICS_CHOICES.SUSCEPTANCE.id,
    [FieldConstants.MAX_SUSCEPTANCE]: maxSusceptance,
    [FieldConstants.SHUNT_COMPENSATOR_TYPE]: shuntCompensatorType ?? null,
    [FieldConstants.MAX_Q_AT_NOMINAL_V]: maxQAtNominalV,
    [FieldConstants.SECTION_COUNT]: sectionCount ?? null,
    [FieldConstants.MAXIMUM_SECTION_COUNT]: maximumSectionCount ?? null,
    [FieldConstants.SWITCHED_ON_Q_AT_NOMINAL_V]:
        maxQAtNominalV != null && sectionCount != null && maximumSectionCount != null
            ? computeSwitchedOnValue(sectionCount, maximumSectionCount, maxQAtNominalV)
            : null,
    [FieldConstants.SWITCHED_ON_SUSCEPTANCE]:
        maxSusceptance != null && sectionCount != null && maximumSectionCount != null
            ? computeSwitchedOnValue(sectionCount, maximumSectionCount, maxSusceptance)
            : null,
});

export const getCharacteristicsCreateFormDataFromSearchCopy = ({
    bPerSection,
    qAtNominalV,
    sectionCount,
    maximumSectionCount,
}: {
    bPerSection: number | null;
    qAtNominalV: number | null;
    sectionCount: number | null;
    maximumSectionCount: number | null;
}) => ({
    [FieldConstants.CHARACTERISTICS_CHOICE]: CHARACTERISTICS_CHOICES.Q_AT_NOMINAL_V.id,
    [FieldConstants.MAX_SUSCEPTANCE]: bPerSection && maximumSectionCount && bPerSection * maximumSectionCount,
    [FieldConstants.SHUNT_COMPENSATOR_TYPE]:
        bPerSection && bPerSection > 0 ? SHUNT_COMPENSATOR_TYPES.CAPACITOR.id : SHUNT_COMPENSATOR_TYPES.REACTOR.id,
    [FieldConstants.MAX_Q_AT_NOMINAL_V]: qAtNominalV && maximumSectionCount && qAtNominalV * maximumSectionCount,
    [FieldConstants.SECTION_COUNT]: sectionCount,
    [FieldConstants.MAXIMUM_SECTION_COUNT]: maximumSectionCount,
});
