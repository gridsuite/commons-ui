/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { EquipmentType } from './types';

const mapEquipmentTypeForPredefinedProperties = (
    type: EquipmentType
): string | undefined => {
    switch (type) {
        case 'SUBSTATION':
            return 'substation';
        case 'LOAD':
            return 'load';
        case 'GENERATOR':
            return 'generator';
        case 'LINE':
            return 'line';
        case 'TWO_WINDINGS_TRANSFORMER':
            return 'twt';
        case 'BATTERY':
            return 'battery';
        case 'SHUNT_COMPENSATOR':
            return 'shuntCompensator';
        case 'VOLTAGE_LEVEL':
            return 'voltageLevel';
        case 'BUSBAR_SECTION':
        case 'DANGLING_LINE':
        case 'HVDC_LINE':
        case 'LCC_CONVERTER_STATION':
        case 'THREE_WINDINGS_TRANSFORMER':
        case 'STATIC_VAR_COMPENSATOR':
        case 'VSC_CONVERTER_STATION':
            return undefined;
        default:
            return undefined;
    }
};

export default mapEquipmentTypeForPredefinedProperties;
