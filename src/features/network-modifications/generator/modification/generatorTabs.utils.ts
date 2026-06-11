/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { FieldConstants } from '../../../../utils';

export enum GeneratorDialogTab {
    CONNECTIVITY_TAB = 0,
    SETPOINTS_AND_LIMITS_TAB = 1,
    SPECIFIC_TAB = 2,
    ADDITIONAL_INFORMATION_TAB = 3,
}

export const GENERATOR_TAB_FIELDS: Readonly<Partial<Record<GeneratorDialogTab, FieldConstants[]>>> = {
    [GeneratorDialogTab.CONNECTIVITY_TAB]: [FieldConstants.CONNECTIVITY],
    [GeneratorDialogTab.SETPOINTS_AND_LIMITS_TAB]: [
        // setpoints
        FieldConstants.ACTIVE_POWER_SET_POINT,
        FieldConstants.REACTIVE_POWER_SET_POINT,
        FieldConstants.VOLTAGE_REGULATION,
        FieldConstants.VOLTAGE_SET_POINT,
        FieldConstants.VOLTAGE_REGULATION_TYPE,
        FieldConstants.Q_PERCENT,
        FieldConstants.FREQUENCY_REGULATION,
        FieldConstants.DROOP,
        // limits
        FieldConstants.MINIMUM_ACTIVE_POWER,
        FieldConstants.MAXIMUM_ACTIVE_POWER,
        FieldConstants.RATED_NOMINAL_POWER,
        FieldConstants.REACTIVE_LIMITS,
    ],
    [GeneratorDialogTab.SPECIFIC_TAB]: [
        FieldConstants.TRANSIENT_REACTANCE,
        FieldConstants.TRANSFORMER_REACTANCE,
        FieldConstants.PLANNED_ACTIVE_POWER_SET_POINT,
        FieldConstants.MARGINAL_COST,
        FieldConstants.PLANNED_OUTAGE_RATE,
        FieldConstants.FORCED_OUTAGE_RATE,
    ],
    [GeneratorDialogTab.ADDITIONAL_INFORMATION_TAB]: [FieldConstants.ADDITIONAL_PROPERTIES],
};
