/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { bool, number, object, string } from 'yup';
import { FieldConstants } from '../../../../utils';
import { getRegulatingTerminalEmptyFormData } from '../regulatingTerminal';

export const REGULATION_TYPES = {
    DISTANT: { id: 'DISTANT', label: 'Distant' },
    LOCAL: { id: 'LOCAL', label: 'Local' },
} as const;

export const getVoltageRegulationEmptyFormData = (isEquipmentModification = false) => ({
    [FieldConstants.VOLTAGE_REGULATION]: isEquipmentModification ? null : false,
    [FieldConstants.VOLTAGE_SET_POINT]: null,
    [FieldConstants.Q_PERCENT]: null,
    [FieldConstants.VOLTAGE_REGULATION_TYPE]: isEquipmentModification ? null : REGULATION_TYPES.LOCAL.id,
    ...getRegulatingTerminalEmptyFormData(),
});

export const getVoltageRegulationSchema = (isEquipmentModification = false) => ({
    [FieldConstants.VOLTAGE_REGULATION]: bool()
        .nullable()
        .when([], {
            is: () => !isEquipmentModification,
            then: (schema) => schema.required(),
        }),
    [FieldConstants.VOLTAGE_REGULATION_TYPE]: string().nullable(),

    [FieldConstants.VOLTAGE_SET_POINT]: number()
        .nullable()
        .min(0, 'mustBeGreaterOrEqualToZero')
        .when([FieldConstants.VOLTAGE_REGULATION], {
            is: (value: string) => !isEquipmentModification && value,
            then: (schema) => schema.required(),
        }),
    [FieldConstants.Q_PERCENT]: number().nullable().max(100, 'NormalizedPercentage').min(0, 'NormalizedPercentage'),
    [FieldConstants.VOLTAGE_LEVEL]: object()
        .nullable()
        .shape({
            [FieldConstants.ID]: string(),
            [FieldConstants.NAME]: string(),
            [FieldConstants.SUBSTATION_ID]: string(),
            [FieldConstants.NOMINAL_VOLTAGE]: string(),
            [FieldConstants.TOPOLOGY_KIND]: string().nullable(),
        })
        .when([FieldConstants.VOLTAGE_REGULATION, FieldConstants.VOLTAGE_REGULATION_TYPE], {
            is: (voltageRegulation: number, voltageRegulationType: string) =>
                !isEquipmentModification && voltageRegulation && voltageRegulationType === REGULATION_TYPES.DISTANT.id,
            then: (schema) => schema.required(),
        }),
    [FieldConstants.EQUIPMENT]: object()
        .nullable()
        .shape({
            [FieldConstants.ID]: string(),
            [FieldConstants.NAME]: string().nullable(),
            [FieldConstants.TYPE]: string(),
        })
        .when([FieldConstants.VOLTAGE_REGULATION, FieldConstants.VOLTAGE_REGULATION_TYPE], {
            is: (voltageRegulation: number, voltageRegulationType: string) =>
                !isEquipmentModification && voltageRegulation && voltageRegulationType === REGULATION_TYPES.DISTANT.id,
            then: (schema) => schema.required(),
        }),
});
