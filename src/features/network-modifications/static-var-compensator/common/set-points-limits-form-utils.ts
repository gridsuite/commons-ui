/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as yup from 'yup';
import { NumberSchema } from 'yup';
import { FieldConstants, MUST_BE_GREATER_OR_EQUAL_TO_ZERO } from '../../../../utils';
import { CHARACTERISTICS_CHOICES } from '../../shunt-compensator';
import { REGULATION_TYPES } from '../../common';
import { VOLTAGE_REGULATION_MODES } from './constants';

export const getReactiveFormEmptyFormData = (id = FieldConstants.SETPOINTS_LIMITS) => ({
    [id]: {
        [FieldConstants.MAX_SUSCEPTANCE]: null,
        [FieldConstants.MIN_SUSCEPTANCE]: null,
        [FieldConstants.MAX_Q_AT_NOMINAL_V]: null,
        [FieldConstants.MIN_Q_AT_NOMINAL_V]: null,
        [FieldConstants.VOLTAGE_SET_POINT]: null,
        [FieldConstants.REACTIVE_POWER_SET_POINT]: null,
        [FieldConstants.CHARACTERISTICS_CHOICE]: CHARACTERISTICS_CHOICES.Q_AT_NOMINAL_V.id,
        [FieldConstants.VOLTAGE_REGULATION_MODE]: VOLTAGE_REGULATION_MODES.OFF.id,
        [FieldConstants.VOLTAGE_REGULATION_TYPE]: REGULATION_TYPES.LOCAL.id,
        [FieldConstants.VOLTAGE_LEVEL]: null,
        [FieldConstants.EQUIPMENT]: null,
    },
});

const requiredWhenSusceptanceChoice = (baseSchema: NumberSchema<number | null | undefined>) =>
    baseSchema.when([FieldConstants.CHARACTERISTICS_CHOICE], {
        is: (characteristicsChoice: string) => characteristicsChoice === CHARACTERISTICS_CHOICES.SUSCEPTANCE.id,
        then: (schema) => schema.required(),
        otherwise: (schema) => schema.notRequired(),
    });

const requiredWhenQatNominalVChoice = (baseSchema: NumberSchema<number | null | undefined>) =>
    baseSchema.when([FieldConstants.CHARACTERISTICS_CHOICE], {
        is: (characteristicsChoice: string) => characteristicsChoice === CHARACTERISTICS_CHOICES.Q_AT_NOMINAL_V.id,
        then: (schema) => schema.required(),
        otherwise: (schema) => schema.notRequired(),
    });

const requiredWhenDistantVoltageMode = <T extends yup.AnySchema>(baseSchema: T): T =>
    baseSchema.when([FieldConstants.VOLTAGE_REGULATION_MODE, FieldConstants.VOLTAGE_REGULATION_TYPE], {
        is: (voltageRegulationMode: string, voltageRegulationType: string) =>
            voltageRegulationMode === VOLTAGE_REGULATION_MODES.VOLTAGE.id &&
            voltageRegulationType === REGULATION_TYPES.DISTANT.id,
        then: (schema) => schema.required(),
    });

export const getReactiveFormValidationSchema = () =>
    yup.object().shape({
        [FieldConstants.MAX_SUSCEPTANCE]: requiredWhenSusceptanceChoice(yup.number().nullable()),
        [FieldConstants.MIN_SUSCEPTANCE]: requiredWhenSusceptanceChoice(yup.number().nullable()),
        [FieldConstants.MAX_Q_AT_NOMINAL_V]: requiredWhenQatNominalVChoice(yup.number().nullable()),
        [FieldConstants.MIN_Q_AT_NOMINAL_V]: requiredWhenQatNominalVChoice(yup.number().nullable()),
        [FieldConstants.VOLTAGE_SET_POINT]: yup
            .number()
            .nullable()
            .min(0, MUST_BE_GREATER_OR_EQUAL_TO_ZERO)
            .when([FieldConstants.VOLTAGE_REGULATION_MODE], {
                is: (voltageRegulationMode: string) => voltageRegulationMode === VOLTAGE_REGULATION_MODES.VOLTAGE.id,
                then: (schema) => schema.required(),
                otherwise: (schema) => schema.notRequired(),
            }),
        [FieldConstants.REACTIVE_POWER_SET_POINT]: yup
            .number()
            .nullable()
            .when([FieldConstants.VOLTAGE_REGULATION_MODE], {
                is: (voltageRegulationMode: string) =>
                    voltageRegulationMode === VOLTAGE_REGULATION_MODES.REACTIVE_POWER.id,
                then: (schema) => schema.required(),
                otherwise: (schema) => schema.notRequired(),
            }),
        [FieldConstants.CHARACTERISTICS_CHOICE]: yup.string().required(),
        [FieldConstants.VOLTAGE_REGULATION_MODE]: yup.string().required(),
        [FieldConstants.VOLTAGE_REGULATION_TYPE]: yup.string().required(),

        [FieldConstants.VOLTAGE_LEVEL]: requiredWhenDistantVoltageMode(
            yup
                .object()
                .nullable()
                .shape({
                    [FieldConstants.ID]: yup.string().required(),
                })
        ),
        [FieldConstants.EQUIPMENT]: requiredWhenDistantVoltageMode(
            yup
                .object()
                .nullable()
                .shape({
                    [FieldConstants.ID]: yup.string().required(),
                    [FieldConstants.TYPE]: yup.string().required(),
                })
        ),
    });

export const getReactiveFormData = ({
    maxSusceptance,
    minSusceptance,
    nominalV,
    maxQAtNominalV,
    minQAtNominalV,
    regulationMode,
    voltageSetpoint,
    reactivePowerSetpoint,
    voltageRegulationType,
    voltageLevelId,
    equipmentType,
    equipmentId,
}: {
    maxSusceptance: number | null;
    minSusceptance: number | null;
    nominalV?: number | null;
    maxQAtNominalV?: number | null;
    minQAtNominalV?: number | null;
    regulationMode: string;
    voltageSetpoint: number | null;
    reactivePowerSetpoint: number | null;
    voltageRegulationType: string;
    voltageLevelId: string | null;
    equipmentType: string | null;
    equipmentId: string | null;
}) => ({
    [FieldConstants.SETPOINTS_LIMITS]: {
        [FieldConstants.CHARACTERISTICS_CHOICE]:
            nominalV != null || minSusceptance == null
                ? CHARACTERISTICS_CHOICES.Q_AT_NOMINAL_V.id
                : CHARACTERISTICS_CHOICES.SUSCEPTANCE.id,
        [FieldConstants.VOLTAGE_REGULATION_MODE]: regulationMode,
        [FieldConstants.MAX_SUSCEPTANCE]: maxSusceptance,
        [FieldConstants.MIN_SUSCEPTANCE]: minSusceptance,
        [FieldConstants.MAX_Q_AT_NOMINAL_V]:
            nominalV != null && maxSusceptance != null ? maxSusceptance * nominalV ** 2 : maxQAtNominalV,
        [FieldConstants.MIN_Q_AT_NOMINAL_V]:
            nominalV != null && minSusceptance != null ? minSusceptance * nominalV ** 2 : minQAtNominalV,
        [FieldConstants.VOLTAGE_SET_POINT]: voltageSetpoint,
        [FieldConstants.REACTIVE_POWER_SET_POINT]: reactivePowerSetpoint,
        [FieldConstants.VOLTAGE_REGULATION_TYPE]: voltageRegulationType,
        [FieldConstants.VOLTAGE_LEVEL]: voltageLevelId ? { [FieldConstants.ID]: voltageLevelId } : null,
        [FieldConstants.EQUIPMENT]:
            equipmentId && equipmentType
                ? {
                      [FieldConstants.ID]: equipmentId,
                      [FieldConstants.TYPE]: equipmentType,
                  }
                : null, // set null because this object field is conditionally required, see in schema
    },
});
