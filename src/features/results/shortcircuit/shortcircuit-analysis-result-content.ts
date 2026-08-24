/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { ShortCircuitAnalysisType } from './shortcircuit-analysis-result.type';
import { kiloUnitToUnit } from '../../../utils';

export const ALL_BUSES = 'allBuses';
export const ONE_BUS = 'oneBus';

export const FROM_COLUMN_TO_FIELD: Record<string, string> = {
    elementId: 'fault.id',
    voltageLevel: 'fault.voltageLevelId',
    faultType: 'fault.faultType',
    connectableId: 'feederResults.connectableId',
    current: 'current',
    limitType: 'firstLimitViolation.limitType',
    limitMin: 'ipMin',
    limitMax: 'ipMax',
    deltaCurrentIpMin: 'deltaCurrentIpMin',
    deltaCurrentIpMax: 'deltaCurrentIpMax',
    shortCircuitPower: 'shortCircuitPower',
};

// When we filter / sort the 'current' column in one bus,
// it's actually the 'fortescueCurrent.positiveMagnitude' field in the back-end
export const FROM_COLUMN_TO_FIELD_ONE_BUS: Record<string, string> = {
    ...FROM_COLUMN_TO_FIELD,
    connectableId: 'connectableId',
    current: 'fortescueCurrent.positiveMagnitude',
    side: 'side',
};

export const mappingTabs = (analysisType: ShortCircuitAnalysisType): string => {
    switch (analysisType) {
        case ShortCircuitAnalysisType.ONE_BUS:
            return ONE_BUS;
        case ShortCircuitAnalysisType.ALL_BUSES:
            return ALL_BUSES;
        default:
            return '';
    }
};

export type ShortcircuitFilterConfig = {
    column: string;
    value: unknown;
    tolerance?: number;
    [key: string]: unknown;
};

export const convertFilterValues = (filterSelector: ShortcircuitFilterConfig[]) => {
    return filterSelector.map((filter) => {
        switch (filter.column) {
            case 'current':
            case 'deltaCurrentIpMax':
            case 'deltaCurrentIpMin':
            case 'limitMin':
            case 'limitMax':
                return {
                    ...filter,
                    value: kiloUnitToUnit(Number(filter.value)),
                    tolerance: kiloUnitToUnit(Number(filter.tolerance)),
                };
            default:
                return filter;
        }
    });
};
