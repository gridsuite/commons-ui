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
}

export enum ExtendedEquipmentType {
    HVDC_LINE_LCC = 'HVDC_LINE_LCC',
    HVDC_LINE_VSC = 'HVDC_LINE_VSC',
}

// Must be equivalent as the back enum
export const EQUIPMENT_TYPE: Partial<
    Record<
        EquipmentType | ExtendedEquipmentType,
        { name: EquipmentType | ExtendedEquipmentType; tagLabel: string } | undefined
    >
> = {
    [EquipmentType.SUBSTATION]: {
        name: EquipmentType.SUBSTATION,
        tagLabel: 'equipment_search/substationTag',
    },
    [EquipmentType.VOLTAGE_LEVEL]: {
        name: EquipmentType.VOLTAGE_LEVEL,
        tagLabel: 'equipment_search/voltageLevelTag',
    },
    [EquipmentType.LINE]: {
        name: EquipmentType.LINE,
        tagLabel: 'equipment_search/lineTag',
    },
    [EquipmentType.TWO_WINDINGS_TRANSFORMER]: {
        name: EquipmentType.TWO_WINDINGS_TRANSFORMER,
        tagLabel: 'equipment_search/2wtTag',
    },
    [EquipmentType.THREE_WINDINGS_TRANSFORMER]: {
        name: EquipmentType.THREE_WINDINGS_TRANSFORMER,
        tagLabel: 'equipment_search/3wtTag',
    },
    [ExtendedEquipmentType.HVDC_LINE_LCC]: {
        name: ExtendedEquipmentType.HVDC_LINE_LCC,
        tagLabel: 'equipment_search/hvdcLineLccTag',
    },
    [ExtendedEquipmentType.HVDC_LINE_VSC]: {
        name: ExtendedEquipmentType.HVDC_LINE_VSC,
        tagLabel: 'equipment_search/hvdcLineVscTag',
    },
    [EquipmentType.GENERATOR]: {
        name: EquipmentType.GENERATOR,
        tagLabel: 'equipment_search/generatorTag',
    },
    [EquipmentType.BATTERY]: {
        name: EquipmentType.BATTERY,
        tagLabel: 'equipment_search/batteryTag',
    },
    [EquipmentType.LOAD]: {
        name: EquipmentType.LOAD,
        tagLabel: 'equipment_search/loadTag',
    },
    [EquipmentType.SHUNT_COMPENSATOR]: {
        name: EquipmentType.SHUNT_COMPENSATOR,
        tagLabel: 'equipment_search/shuntTag',
    },
    [EquipmentType.DANGLING_LINE]: {
        name: EquipmentType.DANGLING_LINE,
        tagLabel: 'equipment_search/lineTag',
    },
    [EquipmentType.STATIC_VAR_COMPENSATOR]: {
        name: EquipmentType.STATIC_VAR_COMPENSATOR,
        tagLabel: 'equipment_search/svcTag',
    },
    [EquipmentType.HVDC_CONVERTER_STATION]: {
        name: EquipmentType.HVDC_CONVERTER_STATION,
        tagLabel: 'equipment_search/hvdcStationTag',
    },
    [EquipmentType.BUSBAR_SECTION]: {
        name: EquipmentType.BUSBAR_SECTION,
        tagLabel: 'equipment_search/busbarSectionTag',
    },
    [EquipmentType.BUS]: {
        name: EquipmentType.BUS,
        tagLabel: 'equipment_search/busTag',
    },
    [EquipmentType.SWITCH]: {
        name: EquipmentType.SWITCH,
        tagLabel: 'equipment_search/switchTag',
    },
    [EquipmentType.VSC_CONVERTER_STATION]: {
        name: EquipmentType.VSC_CONVERTER_STATION,
        tagLabel: 'equipment_search/vscConverterStationTag',
    },
    [EquipmentType.LCC_CONVERTER_STATION]: {
        name: EquipmentType.LCC_CONVERTER_STATION,
        tagLabel: 'equipment_search/lccConverterStationTag',
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
    type: EquipmentType | ExtendedEquipmentType;
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
