/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 * SPDX-License-Identifier: MPL-2.0
 */
import type { MuiStyles } from '../styles';

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
    equipmentTag: (theme) => ({
        borderRadius: '10px',
        padding: '4px',
        fontSize: 'x-small',
        textAlign: 'center',
        color: theme?.palette?.mode === 'light' ? 'inherit' : 'black',
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
} as const satisfies MuiStyles;

/**
 * The order of the equipments in this list is important, as many UI follow it directly.
 * When EquipmentType is used for an interface this order must be maintained.
 * Should be moved to a specialized subtype as this one is used everywhere and cause problems
 * Will be deprecated soon.
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

export enum HvdcType {
    LCC = 'LCC',
    VSC = 'VSC',
}

export enum ExtendedEquipmentType {
    HVDC_LINE_LCC = 'HVDC_LINE_LCC',
    HVDC_LINE_VSC = 'HVDC_LINE_VSC',
}

export const ALL_EQUIPMENTS: Partial<
    Record<
        EquipmentType | ExtendedEquipmentType,
        {
            id: EquipmentType | ExtendedEquipmentType;
            label: string;
            tagLabel: string;
            shortLabel: string;
        }
    >
> = {
    [EquipmentType.SUBSTATION]: {
        id: EquipmentType.SUBSTATION,
        label: 'Substations',
        tagLabel: 'equipment_tag/substation',
        shortLabel: 'equipment_short/substation',
    },
    [EquipmentType.VOLTAGE_LEVEL]: {
        id: EquipmentType.VOLTAGE_LEVEL,
        label: 'VoltageLevels',
        tagLabel: 'equipment_tag/voltageLevel',
        shortLabel: 'equipment_short/voltageLevel',
    },
    [EquipmentType.LINE]: {
        id: EquipmentType.LINE,
        label: 'Lines',
        tagLabel: 'equipment_tag/line',
        shortLabel: 'equipment_short/line',
    },
    [EquipmentType.TWO_WINDINGS_TRANSFORMER]: {
        id: EquipmentType.TWO_WINDINGS_TRANSFORMER,
        label: 'TwoWindingsTransformers',
        tagLabel: 'equipment_tag/2wt',
        shortLabel: 'equipment_short/2wt',
    },
    [EquipmentType.THREE_WINDINGS_TRANSFORMER]: {
        id: EquipmentType.THREE_WINDINGS_TRANSFORMER,
        label: 'ThreeWindingsTransformers',
        tagLabel: 'equipment_tag/3wt',
        shortLabel: 'equipment_short/3wt',
    },
    [EquipmentType.GENERATOR]: {
        id: EquipmentType.GENERATOR,
        label: 'Generators',
        tagLabel: 'equipment_tag/generator',
        shortLabel: 'equipment_short/generator',
    },
    [EquipmentType.BATTERY]: {
        id: EquipmentType.BATTERY,
        label: 'Batteries',
        tagLabel: 'equipment_tag/battery',
        shortLabel: 'equipment_short/battery',
    },
    [EquipmentType.LOAD]: {
        id: EquipmentType.LOAD,
        label: 'Loads',
        tagLabel: 'equipment_tag/load',
        shortLabel: 'equipment_short/load',
    },
    [EquipmentType.SHUNT_COMPENSATOR]: {
        id: EquipmentType.SHUNT_COMPENSATOR,
        label: 'ShuntCompensators',
        tagLabel: 'equipment_tag/shunt',
        shortLabel: 'equipment_short/shunt',
    },
    [EquipmentType.STATIC_VAR_COMPENSATOR]: {
        id: EquipmentType.STATIC_VAR_COMPENSATOR,
        label: 'StaticVarCompensators',
        tagLabel: 'equipment_tag/svc',
        shortLabel: 'equipment_short/svc',
    },
    [EquipmentType.DANGLING_LINE]: {
        id: EquipmentType.DANGLING_LINE,
        label: 'DanglingLines',
        tagLabel: 'equipment_tag/danglingLine',
        shortLabel: 'equipment_short/danglingLine',
    },
    [EquipmentType.BUSBAR_SECTION]: {
        id: EquipmentType.BUSBAR_SECTION,
        label: 'BusBarSections',
        tagLabel: 'equipment_tag/busbarSection',
        shortLabel: 'equipment_short/busbarSection',
    },
    [EquipmentType.BUS]: {
        id: EquipmentType.BUS,
        label: 'Buses',
        tagLabel: 'equipment_tag/bus',
        shortLabel: 'equipment_short/bus',
    },
    [EquipmentType.SWITCH]: {
        id: EquipmentType.SWITCH,
        label: 'Switches',
        tagLabel: 'equipment_tag/switch',
        shortLabel: 'equipment_short/switch',
    },
    [EquipmentType.HVDC_LINE]: {
        id: EquipmentType.HVDC_LINE,
        label: 'Hvdc',
        tagLabel: 'equipment_tag/hvdcLine',
        shortLabel: 'equipment_short/hvdcLine',
    },
    [EquipmentType.HVDC_CONVERTER_STATION]: {
        id: EquipmentType.HVDC_CONVERTER_STATION,
        label: 'HvdcConverterStations',
        tagLabel: 'equipment_tag/hvdcStation',
        shortLabel: 'equipment_short/hvdcStation',
    },
    [EquipmentType.VSC_CONVERTER_STATION]: {
        id: EquipmentType.VSC_CONVERTER_STATION,
        label: 'VscConverterStations',
        tagLabel: 'equipment_tag/vscConverterStation',
        shortLabel: 'equipment_short/vscConverterStation',
    },
    [EquipmentType.LCC_CONVERTER_STATION]: {
        id: EquipmentType.LCC_CONVERTER_STATION,
        label: 'LccConverterStations',
        tagLabel: 'equipment_tag/lccConverterStation',
        shortLabel: 'equipment_short/lccConverterStation',
    },
    [ExtendedEquipmentType.HVDC_LINE_LCC]: {
        id: ExtendedEquipmentType.HVDC_LINE_LCC,
        label: 'LCC',
        tagLabel: 'equipment_tag/hvdcLineLcc',
        shortLabel: 'equipment_short/hvdcLineLcc',
    },
    [ExtendedEquipmentType.HVDC_LINE_VSC]: {
        id: ExtendedEquipmentType.HVDC_LINE_VSC,
        label: 'VSC',
        tagLabel: 'equipment_tag/hvdcLineVsc',
        shortLabel: 'equipment_short/hvdcLineVsc',
    },
};

export const BASE_EQUIPMENTS: typeof ALL_EQUIPMENTS = {
    [EquipmentType.SUBSTATION]: ALL_EQUIPMENTS[EquipmentType.SUBSTATION],
    [EquipmentType.VOLTAGE_LEVEL]: ALL_EQUIPMENTS[EquipmentType.VOLTAGE_LEVEL],
    [EquipmentType.LINE]: ALL_EQUIPMENTS[EquipmentType.LINE],
    [EquipmentType.TWO_WINDINGS_TRANSFORMER]: ALL_EQUIPMENTS[EquipmentType.TWO_WINDINGS_TRANSFORMER],
    [EquipmentType.THREE_WINDINGS_TRANSFORMER]: ALL_EQUIPMENTS[EquipmentType.THREE_WINDINGS_TRANSFORMER],
    [EquipmentType.GENERATOR]: ALL_EQUIPMENTS[EquipmentType.GENERATOR],
    [EquipmentType.BATTERY]: ALL_EQUIPMENTS[EquipmentType.BATTERY],
    [EquipmentType.LOAD]: ALL_EQUIPMENTS[EquipmentType.LOAD],
    [EquipmentType.SHUNT_COMPENSATOR]: ALL_EQUIPMENTS[EquipmentType.SHUNT_COMPENSATOR],
    [EquipmentType.STATIC_VAR_COMPENSATOR]: ALL_EQUIPMENTS[EquipmentType.STATIC_VAR_COMPENSATOR],
    [EquipmentType.DANGLING_LINE]: ALL_EQUIPMENTS[EquipmentType.DANGLING_LINE],
};

export const SEARCH_EQUIPMENTS: typeof ALL_EQUIPMENTS = {
    ...BASE_EQUIPMENTS,
    [ExtendedEquipmentType.HVDC_LINE_LCC]: ALL_EQUIPMENTS[ExtendedEquipmentType.HVDC_LINE_LCC],
    [ExtendedEquipmentType.HVDC_LINE_VSC]: ALL_EQUIPMENTS[ExtendedEquipmentType.HVDC_LINE_VSC],
};

export interface Identifiable {
    id: string;
    name?: string;
}

export interface Equipment extends Identifiable {
    type: EquipmentType | ExtendedEquipmentType;
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

// TODO move into powsybl-network-viewer
export enum OperatingStatus {
    IN_OPERATION = 'IN_OPERATION',
    PLANNED_OUTAGE = 'PLANNED_OUTAGE',
    FORCED_OUTAGE = 'FORCED_OUTAGE',
}

export function getEquipmentsInfosForSearchBar(equipmentsInfos: Equipment[], getNameOrId: (e: Identifiable) => string) {
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
            : (e.voltageLevels?.map((vli) => ({
                  label,
                  id: e.id,
                  key: `${e.id}_${vli.id}`,
                  type: e.type,
                  voltageLevelLabel: getNameOrId(vli),
                  voltageLevelId: vli.id,
              })) ?? []);
    });
}

type EquipmentInfosTypesStruct<T extends string = string> = { type: T };
export const EquipmentInfosTypes: Record<string, EquipmentInfosTypesStruct> = {
    LIST: { type: 'LIST' },
    MAP: { type: 'MAP' },
    FORM: { type: 'FORM' },
    TAB: { type: 'TAB' },
    TOOLTIP: { type: 'TOOLTIP' },
    OPERATING_STATUS: { type: 'OPERATING_STATUS' },
};
