/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import {
    AMPERE,
    KILO_AMPERE,
    KILO_METER,
    KILO_VOLT,
    MEGA_VAR,
    MEGA_VOLT_AMPERE,
    MEGA_WATT,
    MICRO_SIEMENS,
    OHM,
    PERCENTAGE,
    SIEMENS,
} from './unitsConstants';

export const MicroSusceptanceAdornment = {
    position: 'end',
    text: MICRO_SIEMENS,
};

export const SusceptanceAdornment = {
    position: 'end',
    text: SIEMENS,
};
export const OhmAdornment = {
    position: 'end',
    text: OHM,
};
export const AmpereAdornment = {
    position: 'end',
    text: AMPERE,
};

export const KiloAmpereAdornment = {
    position: 'end',
    text: KILO_AMPERE,
};

export const ActivePowerAdornment = {
    position: 'end',
    text: MEGA_WATT,
};
export const ReactivePowerAdornment = {
    position: 'end',
    text: MEGA_VAR,
};
export const MVAPowerAdornment = {
    position: 'end',
    text: MEGA_VOLT_AMPERE,
};
export const VoltageAdornment = {
    position: 'end',
    text: KILO_VOLT,
};

export const KilometerAdornment = {
    position: 'end',
    text: KILO_METER,
};

export const PercentageAdornment = {
    position: 'end',
    text: PERCENTAGE,
};
