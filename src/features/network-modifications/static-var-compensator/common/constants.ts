/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

export const VOLTAGE_REGULATION_MODES = {
    VOLTAGE: { id: 'VOLTAGE', label: 'VoltageRegulationText' },
    REACTIVE_POWER: { id: 'REACTIVE_POWER', label: 'ReactivePowerRegulationText' },
    // used in order to set regulating to false but doesn't exist in powsybl => should not be sent to the back
    OFF: { id: 'OFF', label: 'Off' },
} as const;
