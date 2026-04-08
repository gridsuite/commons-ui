/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import {
    DISTRIBUTION_TYPE,
    EQUIPMENTS_IN_VOLTAGE_REGULATION,
    HVDC_LINES,
    INJECTIONS,
    MONITORED_BRANCHES,
    PSTS,
    SENSITIVITY_TYPE,
    SUPERVISED_VOLTAGE_LEVELS,
} from './constants';
import { ElementType, EquipmentType } from '../../../utils';
import { CONTINGENCIES } from '../common';
import { ACTIVATED } from '../common/parameter-table-field';
import { DndColumn, DndColumnType } from '../../dnd-table-v2';

export const MONITORED_BRANCHES_EQUIPMENT_TYPES = [EquipmentType.LINE, EquipmentType.TWO_WINDINGS_TRANSFORMER];
export const INJECTION_DISTRIBUTION_TYPES = [
    { id: 'PROPORTIONAL', label: 'Proportional' },
    { id: 'PROPORTIONAL_MAXP', label: 'ProportionalMaxP' },
    { id: 'REGULAR', label: 'Regular' },
    { id: 'VENTILATION', label: 'Ventilation' },
];

export const SENSITIVITY_TYPES = [
    { id: 'DELTA_MW', label: 'DeltaMW' },
    { id: 'DELTA_A', label: 'DeltaA' },
];

export const PSTS_EQUIPMENT_TYPES = [EquipmentType.TWO_WINDINGS_TRANSFORMER];

export const MONITORED_VOLTAGE_LEVELS_EQUIPMENT_TYPES = [EquipmentType.VOLTAGE_LEVEL];
export const INJECTIONS_EQUIPMENT_TYPES = [EquipmentType.GENERATOR, EquipmentType.LOAD];

export const EQUIPMENTS_IN_VOLTAGE_REGULATION_TYPES = [
    EquipmentType.GENERATOR,
    EquipmentType.TWO_WINDINGS_TRANSFORMER,
    EquipmentType.VSC_CONVERTER_STATION,
    EquipmentType.STATIC_VAR_COMPENSATOR,
    EquipmentType.SHUNT_COMPENSATOR,
];
export const HVDC_EQUIPMENT_TYPES = [EquipmentType.HVDC_LINE];

export const COLUMNS_DEFINITIONS_INJECTIONS_SET: DndColumn[] = [
    {
        label: 'SupervisedBranches',
        dataKey: MONITORED_BRANCHES,
        initialValue: [],
        editable: true,
        type: DndColumnType.DIRECTORY_ITEMS,
        equipmentTypes: MONITORED_BRANCHES_EQUIPMENT_TYPES,
        elementType: ElementType.FILTER,
        titleId: 'FiltersListsSelection',
    },
    {
        label: 'Injections',
        dataKey: INJECTIONS,
        initialValue: [],
        editable: true,
        type: DndColumnType.DIRECTORY_ITEMS,
        equipmentTypes: INJECTIONS_EQUIPMENT_TYPES,
        elementType: ElementType.FILTER,
        titleId: 'FiltersListsSelection',
    },
    {
        label: 'DistributionType',
        dataKey: DISTRIBUTION_TYPE,
        options: INJECTION_DISTRIBUTION_TYPES,
        initialValue: INJECTION_DISTRIBUTION_TYPES[0].id,
        type: DndColumnType.SELECT,
        editable: true,
        width: '16rem',
    },
    {
        label: 'ContingencyLists',
        dataKey: CONTINGENCIES,
        initialValue: [],
        editable: true,
        type: DndColumnType.DIRECTORY_ITEMS,
        equipmentTypes: [],
        elementType: ElementType.CONTINGENCY_LIST,
        titleId: 'ContingencyListsSelection',
    },
    {
        label: 'Active',
        dataKey: ACTIVATED,
        initialValue: true,
        type: DndColumnType.SWITCH,
        editable: true,
        width: '4rem',
    },
];
export const COLUMNS_DEFINITIONS_INJECTIONS: DndColumn[] = [
    {
        label: 'SupervisedBranches',
        dataKey: MONITORED_BRANCHES,
        initialValue: [],
        editable: true,
        type: DndColumnType.DIRECTORY_ITEMS,
        equipmentTypes: MONITORED_BRANCHES_EQUIPMENT_TYPES,
        elementType: ElementType.FILTER,
        titleId: 'FiltersListsSelection',
    },
    {
        label: 'Injections',
        dataKey: INJECTIONS,
        initialValue: [],
        editable: true,
        type: DndColumnType.DIRECTORY_ITEMS,
        equipmentTypes: INJECTIONS_EQUIPMENT_TYPES,
        elementType: ElementType.FILTER,
        titleId: 'FiltersListsSelection',
    },
    {
        label: 'ContingencyLists',
        dataKey: CONTINGENCIES,
        initialValue: [],
        editable: true,
        type: DndColumnType.DIRECTORY_ITEMS,
        equipmentTypes: [],
        elementType: ElementType.CONTINGENCY_LIST,
        titleId: 'ContingencyListsSelection',
    },
    {
        label: 'Active',
        dataKey: ACTIVATED,
        initialValue: true,
        type: DndColumnType.SWITCH,
        editable: true,
        width: '4rem',
    },
];
export const COLUMNS_DEFINITIONS_HVDCS: DndColumn[] = [
    {
        label: 'SupervisedBranches',
        dataKey: MONITORED_BRANCHES,
        initialValue: [],
        editable: true,
        type: DndColumnType.DIRECTORY_ITEMS,
        equipmentTypes: MONITORED_BRANCHES_EQUIPMENT_TYPES,
        elementType: ElementType.FILTER,
        titleId: 'FiltersListsSelection',
    },
    {
        label: 'SensitivityType',
        dataKey: SENSITIVITY_TYPE,
        options: SENSITIVITY_TYPES,
        initialValue: SENSITIVITY_TYPES[0].id,
        type: DndColumnType.SELECT,
        editable: true,
        width: '9rem',
    },
    {
        label: 'HvdcLines',
        dataKey: HVDC_LINES,
        initialValue: [],
        editable: true,
        type: DndColumnType.DIRECTORY_ITEMS,
        equipmentTypes: HVDC_EQUIPMENT_TYPES,
        elementType: ElementType.FILTER,
        titleId: 'FiltersListsSelection',
    },
    {
        label: 'ContingencyLists',
        dataKey: CONTINGENCIES,
        initialValue: [],
        editable: true,
        type: DndColumnType.DIRECTORY_ITEMS,
        equipmentTypes: [],
        elementType: ElementType.CONTINGENCY_LIST,
        titleId: 'ContingencyListsSelection',
    },
    {
        label: 'Active',
        dataKey: ACTIVATED,
        initialValue: true,
        type: DndColumnType.SWITCH,
        editable: true,
        width: '4rem',
    },
];
export const COLUMNS_DEFINITIONS_PSTS: DndColumn[] = [
    {
        label: 'SupervisedBranches',
        dataKey: MONITORED_BRANCHES,
        initialValue: [],
        editable: true,
        type: DndColumnType.DIRECTORY_ITEMS,
        equipmentTypes: MONITORED_BRANCHES_EQUIPMENT_TYPES,
        elementType: ElementType.FILTER,
        titleId: 'FiltersListsSelection',
    },
    {
        label: 'SensitivityType',
        dataKey: SENSITIVITY_TYPE,
        options: SENSITIVITY_TYPES,
        initialValue: SENSITIVITY_TYPES[0].id,
        type: DndColumnType.SELECT,
        editable: true,
        width: '9rem',
    },
    {
        label: 'PSTS',
        dataKey: PSTS,
        initialValue: [],
        editable: true,
        type: DndColumnType.DIRECTORY_ITEMS,
        equipmentTypes: PSTS_EQUIPMENT_TYPES,
        elementType: ElementType.FILTER,
        titleId: 'FiltersListsSelection',
    },
    {
        label: 'ContingencyLists',
        dataKey: CONTINGENCIES,
        initialValue: [],
        editable: true,
        type: DndColumnType.DIRECTORY_ITEMS,
        equipmentTypes: [],
        elementType: ElementType.CONTINGENCY_LIST,
        titleId: 'ContingencyListsSelection',
    },
    {
        label: 'Active',
        dataKey: ACTIVATED,
        initialValue: true,
        type: DndColumnType.SWITCH,
        editable: true,
        width: '4rem',
    },
];
export const COLUMNS_DEFINITIONS_NODES: DndColumn[] = [
    {
        label: 'MonitoredVoltageLevels',
        dataKey: SUPERVISED_VOLTAGE_LEVELS,
        initialValue: [],
        editable: true,
        type: DndColumnType.DIRECTORY_ITEMS,
        equipmentTypes: MONITORED_VOLTAGE_LEVELS_EQUIPMENT_TYPES,
        elementType: ElementType.FILTER,
        titleId: 'FiltersListsSelection',
    },
    {
        label: 'EquipmentsInVoltageRegulation',
        dataKey: EQUIPMENTS_IN_VOLTAGE_REGULATION,
        initialValue: [],
        editable: true,
        type: DndColumnType.DIRECTORY_ITEMS,
        equipmentTypes: EQUIPMENTS_IN_VOLTAGE_REGULATION_TYPES,
        elementType: ElementType.FILTER,
        titleId: 'FiltersListsSelection',
    },
    {
        label: 'ContingencyLists',
        dataKey: CONTINGENCIES,
        initialValue: [],
        editable: true,
        type: DndColumnType.DIRECTORY_ITEMS,
        equipmentTypes: [],
        elementType: ElementType.CONTINGENCY_LIST,
        titleId: 'ContingencyListsSelection',
    },
    {
        label: 'Active',
        dataKey: ACTIVATED,
        initialValue: true,
        type: DndColumnType.SWITCH,
        editable: true,
        width: '4rem',
    },
];

export enum SensiTabValues {
    'SensitivityBranches' = 0,
    'SensitivityNodes' = 1,
}

export enum SensiBranchesTabValues {
    'SensiInjectionsSet' = 0,
    'SensiInjection' = 1,
    'SensiHVDC' = 2,
    'SensiPST' = 3,
}
