/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as yup from 'yup';
import { NumberSchema, Schema } from 'yup';
import { CHARACTERISTICS_CHOICES } from '../../shunt-compensator';
import { VOLTAGE_REGULATION_MODES } from './constants';
import { FieldConstants, MUST_BE_GREATER_OR_EQUAL_TO_ZERO } from '../../../../utils';

export const getStandbyAutomatonEmptyFormData = (id = FieldConstants.AUTOMATON) => ({
    [id]: {
        [FieldConstants.ADD_STAND_BY_AUTOMATON]: false,
        [FieldConstants.STAND_BY_AUTOMATON]: false,
        [FieldConstants.LOW_VOLTAGE_SET_POINT]: null,
        [FieldConstants.HIGH_VOLTAGE_SET_POINT]: null,
        [FieldConstants.LOW_VOLTAGE_THRESHOLD]: null,
        [FieldConstants.HIGH_VOLTAGE_THRESHOLD]: null,
        [FieldConstants.CHARACTERISTICS_CHOICE_AUTOMATON]: CHARACTERISTICS_CHOICES.Q_AT_NOMINAL_V.id,
        [FieldConstants.MIN_Q_AUTOMATON]: null,
        [FieldConstants.MAX_Q_AUTOMATON]: null,
        [FieldConstants.MIN_S_AUTOMATON]: null,
        [FieldConstants.MAX_S_AUTOMATON]: null,
        [FieldConstants.B0]: null,
        [FieldConstants.Q0]: null,
    },
});

const requiredIfAddStandbyAutomaton = (baseSchema: NumberSchema<number | null | undefined>) =>
    baseSchema.nullable().when([FieldConstants.ADD_STAND_BY_AUTOMATON], {
        is: true,
        then: (schema: Schema) => schema.required(),
    });

const requiredWhenSusceptanceChoice = (baseSchema: NumberSchema<number | null | undefined>) =>
    baseSchema.when([FieldConstants.ADD_STAND_BY_AUTOMATON, FieldConstants.CHARACTERISTICS_CHOICE_AUTOMATON], {
        is: (addStandbyAutomaton: boolean, characteristicsChoiceAutomaton: string) =>
            addStandbyAutomaton && characteristicsChoiceAutomaton === CHARACTERISTICS_CHOICES.SUSCEPTANCE.id,
        then: (schema) =>
            schema
                .min(yup.ref(FieldConstants.MIN_S_AUTOMATON), 'StaticVarCompensatorErrorSFixLessThanSMin')
                .max(yup.ref(FieldConstants.MAX_S_AUTOMATON), 'StaticVarCompensatorErrorSFixGreaterThanSMax')
                .required(),
    });

const requiredWhenQatNominalVChoice = (baseSchema: NumberSchema<number | null | undefined>) =>
    baseSchema.when([FieldConstants.ADD_STAND_BY_AUTOMATON, FieldConstants.CHARACTERISTICS_CHOICE_AUTOMATON], {
        is: (addStandbyAutomaton: boolean, characteristicsChoiceAutomaton: string) =>
            addStandbyAutomaton && characteristicsChoiceAutomaton === CHARACTERISTICS_CHOICES.Q_AT_NOMINAL_V.id,
        then: (schema) =>
            schema
                .min(yup.ref(FieldConstants.MIN_Q_AUTOMATON), 'StaticVarCompensatorErrorQFixLessThanQMin')
                .max(yup.ref(FieldConstants.MAX_Q_AUTOMATON), 'StaticVarCompensatorErrorQFixGreaterThanQMax')
                .required(),
    });

export const getStandbyAutomatonFormValidationSchema = () =>
    yup.object().shape({
        [FieldConstants.ADD_STAND_BY_AUTOMATON]: yup.boolean().nullable(),
        [FieldConstants.STAND_BY_AUTOMATON]: yup
            .boolean()
            .nullable()
            .when([FieldConstants.ADD_STAND_BY_AUTOMATON, FieldConstants.VOLTAGE_REGULATION_MODE], {
                is: (addStandbyAutomaton: boolean, voltageRegulationMode: string) =>
                    addStandbyAutomaton && voltageRegulationMode === VOLTAGE_REGULATION_MODES.VOLTAGE.id,
                then: (schema) => schema.required(),
            }),
        [FieldConstants.LOW_VOLTAGE_SET_POINT]: requiredIfAddStandbyAutomaton(
            yup.number().min(0, MUST_BE_GREATER_OR_EQUAL_TO_ZERO)
        ),
        [FieldConstants.HIGH_VOLTAGE_SET_POINT]: requiredIfAddStandbyAutomaton(
            yup.number().min(0, MUST_BE_GREATER_OR_EQUAL_TO_ZERO)
        ),
        [FieldConstants.LOW_VOLTAGE_THRESHOLD]: requiredIfAddStandbyAutomaton(
            yup.number().min(0, MUST_BE_GREATER_OR_EQUAL_TO_ZERO)
        ),
        [FieldConstants.HIGH_VOLTAGE_THRESHOLD]: requiredIfAddStandbyAutomaton(
            yup.number().min(0, MUST_BE_GREATER_OR_EQUAL_TO_ZERO)
        ),
        [FieldConstants.B0]: requiredWhenSusceptanceChoice(yup.number().nullable()),
        [FieldConstants.Q0]: requiredWhenQatNominalVChoice(yup.number().nullable()),
    });

export const getStandbyAutomatonFormData = ({
    addStandbyAutomaton,
    standby,
    b0,
    q0,
    lowVoltageSetpoint,
    highVoltageSetpoint,
    lowVoltageThreshold,
    highVoltageThreshold,
}: {
    addStandbyAutomaton: boolean;
    standby: boolean | undefined;
    b0: number | null | undefined;
    q0: number | null | undefined;
    lowVoltageSetpoint: number | null | undefined;
    highVoltageSetpoint: number | null | undefined;
    lowVoltageThreshold: number | null | undefined;
    highVoltageThreshold: number | null | undefined;
}) => ({
    [FieldConstants.AUTOMATON]: {
        [FieldConstants.ADD_STAND_BY_AUTOMATON]: addStandbyAutomaton,
        [FieldConstants.STAND_BY_AUTOMATON]: standby,
        [FieldConstants.LOW_VOLTAGE_SET_POINT]: lowVoltageSetpoint,
        [FieldConstants.HIGH_VOLTAGE_SET_POINT]: highVoltageSetpoint,
        [FieldConstants.LOW_VOLTAGE_THRESHOLD]: lowVoltageThreshold,
        [FieldConstants.HIGH_VOLTAGE_THRESHOLD]: highVoltageThreshold,
        [FieldConstants.B0]: b0,
        [FieldConstants.Q0]: q0,
    },
});

export const computeQ0 = (b0?: number | null, nominalV?: number | null): number | undefined => {
    return b0 != null && nominalV != null ? b0 * nominalV ** 2 : undefined;
};

/**
 * Modification: every field is nullable (null = unchanged).
 * ADD_STAND_BY_AUTOMATON: null = unchanged, true = add (or keep) the automaton, false = remove it.
 * The automaton values are required only when it is added, i.e. when it does not exist yet on the equipment:
 * this information is given by the form context `hasStandbyAutomaton`.
 */
const requiredIfStandbyAutomatonAdded = (baseSchema: NumberSchema<number | null | undefined>) =>
    baseSchema.nullable().when([FieldConstants.ADD_STAND_BY_AUTOMATON, '$hasStandbyAutomaton'], {
        is: (addStandbyAutomaton: boolean | null, hasStandbyAutomaton: boolean | undefined) =>
            addStandbyAutomaton === true && !hasStandbyAutomaton,
        then: (schema: Schema) => schema.required(),
    });

const getFixedPartModificationSchema = (
    characteristicsChoice: string,
    minField: FieldConstants,
    maxField: FieldConstants,
    lessThanMinError: string,
    greaterThanMaxError: string
) =>
    yup
        .number()
        .nullable()
        .when(
            [
                FieldConstants.ADD_STAND_BY_AUTOMATON,
                FieldConstants.CHARACTERISTICS_CHOICE_AUTOMATON,
                '$hasStandbyAutomaton',
            ],
            {
                is: (addStandbyAutomaton: boolean | null, choice: string, hasStandbyAutomaton: boolean | undefined) =>
                    addStandbyAutomaton === true && !hasStandbyAutomaton && choice === characteristicsChoice,
                then: (schema) => schema.required(),
            }
        )
        .test('fixedPartGreaterThanMin', lessThanMinError, (value, context) => {
            const min = context.parent[minField];
            return !(value != null && min != null && value < min);
        })
        .test('fixedPartLessThanMax', greaterThanMaxError, (value, context) => {
            const max = context.parent[maxField];
            return !(value != null && max != null && value > max);
        });

export const getStandbyAutomatonModificationEmptyFormData = (id = FieldConstants.AUTOMATON) => ({
    [id]: {
        ...getStandbyAutomatonEmptyFormData(id)[id],
        [FieldConstants.ADD_STAND_BY_AUTOMATON]: null,
        [FieldConstants.STAND_BY_AUTOMATON]: null,
    },
});

export const getStandbyAutomatonModificationFormValidationSchema = () =>
    yup.object().shape({
        [FieldConstants.ADD_STAND_BY_AUTOMATON]: yup.boolean().nullable(),
        [FieldConstants.STAND_BY_AUTOMATON]: yup.boolean().nullable(),
        [FieldConstants.LOW_VOLTAGE_SET_POINT]: requiredIfStandbyAutomatonAdded(
            yup.number().min(0, MUST_BE_GREATER_OR_EQUAL_TO_ZERO)
        ),
        [FieldConstants.HIGH_VOLTAGE_SET_POINT]: requiredIfStandbyAutomatonAdded(
            yup.number().min(0, MUST_BE_GREATER_OR_EQUAL_TO_ZERO)
        ),
        [FieldConstants.LOW_VOLTAGE_THRESHOLD]: requiredIfStandbyAutomatonAdded(
            yup.number().min(0, MUST_BE_GREATER_OR_EQUAL_TO_ZERO)
        ),
        [FieldConstants.HIGH_VOLTAGE_THRESHOLD]: requiredIfStandbyAutomatonAdded(
            yup.number().min(0, MUST_BE_GREATER_OR_EQUAL_TO_ZERO)
        ),
        [FieldConstants.B0]: getFixedPartModificationSchema(
            CHARACTERISTICS_CHOICES.SUSCEPTANCE.id,
            FieldConstants.MIN_S_AUTOMATON,
            FieldConstants.MAX_S_AUTOMATON,
            'StaticVarCompensatorErrorSFixLessThanSMin',
            'StaticVarCompensatorErrorSFixGreaterThanSMax'
        ),
        [FieldConstants.Q0]: getFixedPartModificationSchema(
            CHARACTERISTICS_CHOICES.Q_AT_NOMINAL_V.id,
            FieldConstants.MIN_Q_AUTOMATON,
            FieldConstants.MAX_Q_AUTOMATON,
            'StaticVarCompensatorErrorQFixLessThanQMin',
            'StaticVarCompensatorErrorQFixGreaterThanQMax'
        ),
    });
