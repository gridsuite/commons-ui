/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { CHARACTERISTICS_CHOICES } from '../../shunt-compensator';
import * as yup from 'yup';
import { VOLTAGE_REGULATION_MODES} from './constants';
import { FieldConstants } from '../../../../utils';

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
        [FieldConstants.LOW_VOLTAGE_SET_POINT]: requiredIfAddStandbyAutomaton(yup.number().min(0, 'mustBeGreaterOrEqualToZero')),
        [FieldConstants.HIGH_VOLTAGE_SET_POINT]: requiredIfAddStandbyAutomaton(yup.number().min(0, 'mustBeGreaterOrEqualToZero')),
        [FieldConstants.LOW_VOLTAGE_THRESHOLD]: requiredIfAddStandbyAutomaton(yup.number().min(0, 'mustBeGreaterOrEqualToZero')),
        [FieldConstants.HIGH_VOLTAGE_THRESHOLD]: requiredIfAddStandbyAutomaton(yup.number().min(0, 'mustBeGreaterOrEqualToZero')),
        [FieldConstants.B0]: requiredWhenSusceptanceChoice(yup.number().nullable()),
        [FieldConstants.Q0]: requiredWhenQatNominalVChoice(yup.number().nullable()),
    });


const requiredIfAddStandbyAutomaton = (yup: any) =>
    yup.nullable().when([FieldConstants.ADD_STAND_BY_AUTOMATON], {
        is: true,
        then: (schema: any) => schema.required(),
    });

const requiredWhenSusceptanceChoice = (schema: any) =>
    schema.when([FieldConstants.ADD_STAND_BY_AUTOMATON, FieldConstants.CHARACTERISTICS_CHOICE_AUTOMATON], {
        is: (addStandbyAutomaton: boolean, characteristicsChoiceAutomaton: string) =>
            addStandbyAutomaton && characteristicsChoiceAutomaton === CHARACTERISTICS_CHOICES.SUSCEPTANCE.id,
        then: (schema: any) =>
            schema
                .min(yup.ref(FieldConstants.MIN_S_AUTOMATON), 'StaticVarCompensatorErrorSFixLessThanSMin')
                .max(yup.ref(FieldConstants.MAX_S_AUTOMATON), 'StaticVarCompensatorErrorSFixGreaterThanSMax')
                .required(),
    });

const requiredWhenQatNominalVChoice = (schema: any) =>
    schema.when([FieldConstants.ADD_STAND_BY_AUTOMATON, FieldConstants.CHARACTERISTICS_CHOICE_AUTOMATON], {
        is: (addStandbyAutomaton: boolean, characteristicsChoiceAutomaton: string) =>
            addStandbyAutomaton && characteristicsChoiceAutomaton === CHARACTERISTICS_CHOICES.Q_AT_NOMINAL_V.id,
        then: (schema: any) =>
            schema
                .min(yup.ref(FieldConstants.MIN_Q_AUTOMATON), 'StaticVarCompensatorErrorQFixLessThanQMin')
                .max(yup.ref(FieldConstants.MAX_Q_AUTOMATON), 'StaticVarCompensatorErrorQFixGreaterThanQMax')
                .required(),
    });
