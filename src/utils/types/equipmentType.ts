/**
 * Copyright (c) 2021, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Theme } from '@mui/material';
import { LIGHT_THEME } from '../constants/browserConstants';

export const TYPE_TAG_MAX_SIZE = '90px';
export const VL_TAG_MAX_SIZE = '100px';

export const equipmentStyles = {
    equipmentOption: {
        display: 'flex',
        gap: '20px',
        width: '100%',
        margin: '0px',
        padding: '0px',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    equipmentTag: (theme: string | Theme) => ({
        borderRadius: '10px',
        padding: '4px',
        fontSize: 'x-small',
        textAlign: 'center',
        color:
            // TODO remove first condition when gridstudy is updated
            theme === LIGHT_THEME || (typeof theme !== 'string' && theme?.palette?.mode === 'light')
                ? 'inherit'
                : 'black',
    }),
    equipmentTypeTag: {
        minWidth: TYPE_TAG_MAX_SIZE,
        maxWidth: TYPE_TAG_MAX_SIZE,
        background: 'lightblue',
    },
    equipmentVlTag: {
        width: VL_TAG_MAX_SIZE,
        minWidth: VL_TAG_MAX_SIZE,
        maxWidth: VL_TAG_MAX_SIZE,
        background: 'lightgray',
        fontStyle: 'italic',
    },
    result: {
        width: '100%',
        padding: '2px',
    },
};

/**
 * The order of the equipments in this list is important, as many UI follow it directly.
 * When EquipmentType is used for an interface this order must be maintained.
 */
export enum EquipmentType {
    SUBSTATION = 'SUBSTATION',
    VOLTAGE_LEVEL = 'VOLTAGE_LEVEL',
    BUS = 'BUS',
    BUSBAR_SECTION = 'BUSBAR_SECTION',
    SWITCH = 'SWITCH',
    LINE = 'LINE',
    TWO_WINDINGS_TRANSFORMER = 'TWO_WINDINGS_TRANSFORMER',
    THREE_WINDINGS_TRANSFORMER = 'THREE_WINDINGS_TRANSFORMER',
    GENERATOR = 'GENERATOR',
    BATTERY = 'BATTERY',
    LOAD = 'LOAD',
    SHUNT_COMPENSATOR = 'SHUNT_COMPENSATOR',
    STATIC_VAR_COMPENSATOR = 'STATIC_VAR_COMPENSATOR',
    HVDC_LINE = 'HVDC_LINE',
    HVDC_CONVERTER_STATION = 'HVDC_CONVERTER_STATION',
    VSC_CONVERTER_STATION = 'VSC_CONVERTER_STATION',
    LCC_CONVERTER_STATION = 'LCC_CONVERTER_STATION',
    DANGLING_LINE = 'DANGLING_LINE',
    TIE_LINE = 'TIE_LINE',
    DISCONNECTOR = 'DISCONNECTOR',
    BREAKER = 'BREAKER',
    HVDC_LINE_LCC = 'HVDC_LINE_LCC',
    HVDC_LINE_VSC = 'HVDC_LINE_VSC',
}

// order is not important,should cover all elements in EquipmentType
export const BASE_INFOS_EQUIPMENT_TYPES: Partial<Record<EquipmentType, { label: string }>> = {
    [EquipmentType.SUBSTATION]: {
        label: 'Substations',
    },
    [EquipmentType.VOLTAGE_LEVEL]: {
        label: 'VoltageLevels',
    },
    [EquipmentType.LINE]: {
        label: 'Lines',
    },
    [EquipmentType.TWO_WINDINGS_TRANSFORMER]: {
        label: 'TwoWindingsTransformers',
    },
    [EquipmentType.THREE_WINDINGS_TRANSFORMER]: {
        label: 'ThreeWindingsTransformers',
    },
    [EquipmentType.GENERATOR]: {
        label: 'Generators',
    },
    [EquipmentType.BATTERY]: {
        label: 'Batteries',
    },
    [EquipmentType.LOAD]: {
        label: 'Loads',
    },
    [EquipmentType.SHUNT_COMPENSATOR]: {
        label: 'ShuntCompensators',
    },
    [EquipmentType.STATIC_VAR_COMPENSATOR]: {
        label: 'StaticVarCompensators',
    },
    [EquipmentType.DANGLING_LINE]: {
        label: 'DanglingLines',
    },
    [EquipmentType.HVDC_LINE]: {
        label: 'Hvdc',
    },
    [EquipmentType.HVDC_LINE_LCC]: {
        label: 'LCC',
    },
    [EquipmentType.HVDC_LINE_VSC]: {
        label: 'VSC',
    },
};

// order is not important
export const SEARCH_TAG_EQUIPMENT_TYPES: Partial<Record<EquipmentType, { tagLabel: string } | undefined>> = {
    [EquipmentType.SUBSTATION]: {
        tagLabel: 'equipment_search/substationTag',
    },
    [EquipmentType.VOLTAGE_LEVEL]: {
        tagLabel: 'equipment_search/voltageLevelTag',
    },
    [EquipmentType.LINE]: {
        tagLabel: 'equipment_search/lineTag',
    },
    [EquipmentType.TWO_WINDINGS_TRANSFORMER]: {
        tagLabel: 'equipment_search/2wtTag',
    },
    [EquipmentType.THREE_WINDINGS_TRANSFORMER]: {
        tagLabel: 'equipment_search/3wtTag',
    },
    [EquipmentType.HVDC_LINE_LCC]: {
        tagLabel: 'equipment_search/hvdcLineLccTag',
    },
    [EquipmentType.HVDC_LINE_VSC]: {
        tagLabel: 'equipment_search/hvdcLineVscTag',
    },
    [EquipmentType.GENERATOR]: {
        tagLabel: 'equipment_search/generatorTag',
    },
    [EquipmentType.BATTERY]: {
        tagLabel: 'equipment_search/batteryTag',
    },
    [EquipmentType.LOAD]: {
        tagLabel: 'equipment_search/loadTag',
    },
    [EquipmentType.SHUNT_COMPENSATOR]: {
        tagLabel: 'equipment_search/shuntTag',
    },
    [EquipmentType.DANGLING_LINE]: {
        tagLabel: 'equipment_search/lineTag',
    },
    [EquipmentType.STATIC_VAR_COMPENSATOR]: {
        tagLabel: 'equipment_search/svcTag',
    },
    [EquipmentType.HVDC_CONVERTER_STATION]: {
        tagLabel: 'equipment_search/hvdcStationTag',
    },
    [EquipmentType.BUSBAR_SECTION]: {
        tagLabel: 'equipment_search/busbarSectionTag',
    },
    [EquipmentType.BUS]: {
        tagLabel: 'equipment_search/busTag',
    },
    [EquipmentType.SWITCH]: {
        tagLabel: 'equipment_search/switchTag',
    },
    [EquipmentType.VSC_CONVERTER_STATION]: {
        tagLabel: 'equipment_search/vscConverterStationTag',
    },
    [EquipmentType.LCC_CONVERTER_STATION]: {
        tagLabel: 'equipment_search/lccConverterStationTag',
    },
};

// order is important
export const SEARCH_FILTER_EQUIPMENT_TYPES: Partial<Record<EquipmentType, { label?: string }>> = {
    [EquipmentType.SUBSTATION]: {
        ...BASE_INFOS_EQUIPMENT_TYPES[EquipmentType.SUBSTATION],
    },
    [EquipmentType.VOLTAGE_LEVEL]: {
        ...BASE_INFOS_EQUIPMENT_TYPES[EquipmentType.VOLTAGE_LEVEL],
    },
    [EquipmentType.LINE]: {
        ...BASE_INFOS_EQUIPMENT_TYPES[EquipmentType.LINE],
    },
    [EquipmentType.TWO_WINDINGS_TRANSFORMER]: {
        ...BASE_INFOS_EQUIPMENT_TYPES[EquipmentType.TWO_WINDINGS_TRANSFORMER],
    },
    [EquipmentType.THREE_WINDINGS_TRANSFORMER]: {
        ...BASE_INFOS_EQUIPMENT_TYPES[EquipmentType.THREE_WINDINGS_TRANSFORMER],
    },
    [EquipmentType.GENERATOR]: {
        ...BASE_INFOS_EQUIPMENT_TYPES[EquipmentType.GENERATOR],
    },
    [EquipmentType.BATTERY]: {
        ...BASE_INFOS_EQUIPMENT_TYPES[EquipmentType.BATTERY],
    },
    [EquipmentType.LOAD]: {
        ...BASE_INFOS_EQUIPMENT_TYPES[EquipmentType.LOAD],
    },
    [EquipmentType.SHUNT_COMPENSATOR]: {
        ...BASE_INFOS_EQUIPMENT_TYPES[EquipmentType.SHUNT_COMPENSATOR],
    },
    [EquipmentType.STATIC_VAR_COMPENSATOR]: {
        ...BASE_INFOS_EQUIPMENT_TYPES[EquipmentType.STATIC_VAR_COMPENSATOR],
    },
    [EquipmentType.DANGLING_LINE]: {
        ...BASE_INFOS_EQUIPMENT_TYPES[EquipmentType.DANGLING_LINE],
    },
    [EquipmentType.HVDC_LINE_LCC]: {
        ...BASE_INFOS_EQUIPMENT_TYPES[EquipmentType.HVDC_LINE_LCC],
    },
    [EquipmentType.HVDC_LINE_VSC]: {
        ...BASE_INFOS_EQUIPMENT_TYPES[EquipmentType.HVDC_LINE_VSC],
    },
};

export interface Identifiable {
    id: string;
    name?: string;
}

export interface Equipment extends Identifiable {
    type: EquipmentType;
    voltageLevels?: Identifiable[];
}

export interface EquipmentInfos extends Identifiable {
    label: string;
    key: string;
    type: EquipmentType;
    voltageLevelLabel?: string;
    voltageLevelId?: string;
    operatingStatus?: string;
    terminal1Connected?: boolean;
    terminal2Connected?: boolean;
    voltageLevelId1?: string;
    voltageLevelName1?: string;
    voltageLevelId2?: string;
    voltageLevelName2?: string;
}

export const OperatingStatus = {
    IN_OPERATION: 'IN_OPERATION',
    PLANNED_OUTAGE: 'PLANNED_OUTAGE',
    FORCED_OUTAGE: 'FORCED_OUTAGE',
};

export const getEquipmentsInfosForSearchBar = (
    equipmentsInfos: Equipment[],
    getNameOrId: (e: Identifiable) => string
) => {
    return equipmentsInfos.flatMap((e): EquipmentInfos[] => {
        const label = getNameOrId(e);
        return e.type === EquipmentType.SUBSTATION
            ? [
                  {
                      label,
                      id: e.id,
                      key: e.id,
                      type: e.type,
                  },
              ]
            : e.voltageLevels?.map((vli) => {
                  return {
                      label,
                      id: e.id,
                      key: `${e.id}_${vli.id}`,
                      type: e.type,
                      voltageLevelLabel: getNameOrId(vli),
                      voltageLevelId: vli.id,
                  };
              }) ?? [];
    });
};
