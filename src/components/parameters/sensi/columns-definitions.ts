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
    PARAMETER_SENSI_HVDC,
    PARAMETER_SENSI_INJECTION,
    PARAMETER_SENSI_INJECTIONS_SET,
    PARAMETER_SENSI_NODES,
    PARAMETER_SENSI_PST,
    PSTS,
    SENSITIVITY_TYPE,
    SUPERVISED_VOLTAGE_LEVELS,
} from './constants';
import { ElementType, EquipmentType } from '../../../utils';
import { CONTINGENCIES } from '../common';
import { ACTIVATED, IColumnsDef, IParameters } from '../common/parameter-table';

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

export const COLUMNS_DEFINITIONS_INJECTIONS_SET: IColumnsDef[] = [
    {
        label: 'SupervisedBranches',
        dataKey: MONITORED_BRANCHES,
        initialValue: [],
        editable: true,
        directoryItems: true,
        equipmentTypes: MONITORED_BRANCHES_EQUIPMENT_TYPES,
        elementType: ElementType.FILTER,
        titleId: 'FiltersListsSelection',
    },
    {
        label: 'Injections',
        dataKey: INJECTIONS,
        initialValue: [],
        editable: true,
        directoryItems: true,
        equipmentTypes: INJECTIONS_EQUIPMENT_TYPES,
        elementType: ElementType.FILTER,
        titleId: 'FiltersListsSelection',
    },
    {
        label: 'DistributionType',
        dataKey: DISTRIBUTION_TYPE,
        equipmentTypes: INJECTION_DISTRIBUTION_TYPES,
        initialValue: INJECTION_DISTRIBUTION_TYPES[0].id,
        menuItems: true,
        editable: true,
        width: '16rem',
    },
    {
        label: 'ContingencyLists',
        dataKey: CONTINGENCIES,
        initialValue: [],
        editable: true,
        directoryItems: true,
        elementType: ElementType.CONTINGENCY_LIST,
        titleId: 'ContingencyListsSelection',
    },
    {
        label: 'Active',
        dataKey: ACTIVATED,
        initialValue: true,
        checkboxItems: true,
        editable: true,
        width: '4rem',
    },
];
export const COLUMNS_DEFINITIONS_INJECTIONS = [
    {
        label: 'SupervisedBranches',
        dataKey: MONITORED_BRANCHES,
        initialValue: [],
        editable: true,
        directoryItems: true,
        equipmentTypes: MONITORED_BRANCHES_EQUIPMENT_TYPES,
        elementType: ElementType.FILTER,
        titleId: 'FiltersListsSelection',
    },
    {
        label: 'Injections',
        dataKey: INJECTIONS,
        initialValue: [],
        editable: true,
        directoryItems: true,
        equipmentTypes: INJECTIONS_EQUIPMENT_TYPES,
        elementType: ElementType.FILTER,
        titleId: 'FiltersListsSelection',
    },
    {
        label: 'ContingencyLists',
        dataKey: CONTINGENCIES,
        initialValue: [],
        editable: true,
        directoryItems: true,
        elementType: ElementType.CONTINGENCY_LIST,
        titleId: 'ContingencyListsSelection',
    },
    {
        label: 'Active',
        dataKey: ACTIVATED,
        initialValue: true,
        checkboxItems: true,
        editable: true,
        width: '4rem',
    },
];
export const COLUMNS_DEFINITIONS_HVDCS = [
    {
        label: 'SupervisedBranches',
        dataKey: MONITORED_BRANCHES,
        initialValue: [],
        editable: true,
        directoryItems: true,
        equipmentTypes: MONITORED_BRANCHES_EQUIPMENT_TYPES,
        elementType: ElementType.FILTER,
        titleId: 'FiltersListsSelection',
    },
    {
        label: 'SensitivityType',
        dataKey: SENSITIVITY_TYPE,
        equipmentTypes: SENSITIVITY_TYPES,
        initialValue: SENSITIVITY_TYPES[0].id,
        menuItems: true,
        editable: true,
        width: '9rem',
    },
    {
        label: 'HvdcLines',
        dataKey: HVDC_LINES,
        initialValue: [],
        editable: true,
        directoryItems: true,
        equipmentTypes: HVDC_EQUIPMENT_TYPES,
        elementType: ElementType.FILTER,
        titleId: 'FiltersListsSelection',
    },
    {
        label: 'ContingencyLists',
        dataKey: CONTINGENCIES,
        initialValue: [],
        editable: true,
        directoryItems: true,
        elementType: ElementType.CONTINGENCY_LIST,
        titleId: 'ContingencyListsSelection',
    },
    {
        label: 'Active',
        dataKey: ACTIVATED,
        initialValue: true,
        checkboxItems: true,
        editable: true,
        width: '4rem',
    },
];
export const COLUMNS_DEFINITIONS_PSTS = [
    {
        label: 'SupervisedBranches',
        dataKey: MONITORED_BRANCHES,
        initialValue: [],
        editable: true,
        directoryItems: true,
        equipmentTypes: MONITORED_BRANCHES_EQUIPMENT_TYPES,
        elementType: ElementType.FILTER,
        titleId: 'FiltersListsSelection',
    },
    {
        label: 'SensitivityType',
        dataKey: SENSITIVITY_TYPE,
        equipmentTypes: SENSITIVITY_TYPES,
        initialValue: SENSITIVITY_TYPES[0].id,
        menuItems: true,
        editable: true,
        width: '9rem',
    },
    {
        label: 'PSTS',
        dataKey: PSTS,
        initialValue: [],
        editable: true,
        directoryItems: true,
        equipmentTypes: PSTS_EQUIPMENT_TYPES,
        elementType: ElementType.FILTER,
        titleId: 'FiltersListsSelection',
    },
    {
        label: 'ContingencyLists',
        dataKey: CONTINGENCIES,
        initialValue: [],
        editable: true,
        directoryItems: true,
        elementType: ElementType.CONTINGENCY_LIST,
        titleId: 'ContingencyListsSelection',
    },
    {
        label: 'Active',
        dataKey: ACTIVATED,
        initialValue: true,
        checkboxItems: true,
        editable: true,
        width: '4rem',
    },
];
export const COLUMNS_DEFINITIONS_NODES = [
    {
        label: 'MonitoredVoltageLevels',
        dataKey: SUPERVISED_VOLTAGE_LEVELS,
        initialValue: [],
        editable: true,
        directoryItems: true,
        equipmentTypes: MONITORED_VOLTAGE_LEVELS_EQUIPMENT_TYPES,
        elementType: ElementType.FILTER,
        titleId: 'FiltersListsSelection',
    },
    {
        label: 'EquipmentsInVoltageRegulation',
        dataKey: EQUIPMENTS_IN_VOLTAGE_REGULATION,
        initialValue: [],
        editable: true,
        directoryItems: true,
        equipmentTypes: EQUIPMENTS_IN_VOLTAGE_REGULATION_TYPES,
        elementType: ElementType.FILTER,
        titleId: 'FiltersListsSelection',
    },
    {
        label: 'ContingencyLists',
        dataKey: CONTINGENCIES,
        initialValue: [],
        editable: true,
        directoryItems: true,
        elementType: ElementType.CONTINGENCY_LIST,
        titleId: 'ContingencyListsSelection',
    },
    {
        label: 'Active',
        dataKey: ACTIVATED,
        initialValue: true,
        checkboxItems: true,
        editable: true,
        width: '4rem',
    },
];

export const SensiInjectionsSet: IParameters = {
    columnsDef: COLUMNS_DEFINITIONS_INJECTIONS_SET,
    name: PARAMETER_SENSI_INJECTIONS_SET,
};

export const SensiInjection: IParameters = {
    columnsDef: COLUMNS_DEFINITIONS_INJECTIONS,
    name: PARAMETER_SENSI_INJECTION,
};

export const SensiHvdcs: IParameters = {
    columnsDef: COLUMNS_DEFINITIONS_HVDCS,
    name: PARAMETER_SENSI_HVDC,
};

export const SensiPsts: IParameters = {
    columnsDef: COLUMNS_DEFINITIONS_PSTS,
    name: PARAMETER_SENSI_PST,
};

export const SensiNodes: IParameters = {
    columnsDef: COLUMNS_DEFINITIONS_NODES,
    name: PARAMETER_SENSI_NODES,
};

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
