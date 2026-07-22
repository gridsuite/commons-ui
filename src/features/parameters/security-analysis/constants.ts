/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

export const FLOW_PROPORTIONAL_THRESHOLD = 'flowProportionalThreshold';
export const LOW_VOLTAGE_PROPORTIONAL_THRESHOLD = 'lowVoltageProportionalThreshold';
export const LOW_VOLTAGE_ABSOLUTE_THRESHOLD = 'lowVoltageAbsoluteThreshold';
export const HIGH_VOLTAGE_PROPORTIONAL_THRESHOLD = 'highVoltageProportionalThreshold';
export const HIGH_VOLTAGE_ABSOLUTE_THRESHOLD = 'highVoltageAbsoluteThreshold';

export enum TabValues {
    Contingencies = 0,
    Aggravation = 1,
    LimitReductions = 2,
}
