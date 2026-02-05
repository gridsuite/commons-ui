/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { ElementType, EquipmentType } from '../../../utils';

export const SHORT_CIRCUIT_ICC_MATERIAL_ACTIVE = 'active';
export const SHORT_CIRCUIT_ICC_MATERIAL_TYPE = 'type';
export const SHORT_CIRCUIT_ICC_MATERIAL_ALPHA = 'alpha';
export const SHORT_CIRCUIT_ICC_MATERIAL_USMIN = 'usMin';
export const SHORT_CIRCUIT_ICC_MATERIAL_USMAX = 'usMax';
export const SHORT_CIRCUIT_ICC_MATERIAL_U0 = 'u0';
export const SHORT_CIRCUIT_ICC_CLUSTER_ACTIVE = SHORT_CIRCUIT_ICC_MATERIAL_ACTIVE;
export const SHORT_CIRCUIT_ICC_CLUSTER_FILTERS = 'filters';
export const SHORT_CIRCUIT_ICC_CLUSTER_TYPE = SHORT_CIRCUIT_ICC_MATERIAL_TYPE;
export const SHORT_CIRCUIT_ICC_CLUSTER_ALPHA = SHORT_CIRCUIT_ICC_MATERIAL_ALPHA;
export const SHORT_CIRCUIT_ICC_CLUSTER_USMIN = SHORT_CIRCUIT_ICC_MATERIAL_USMIN;
export const SHORT_CIRCUIT_ICC_CLUSTER_USMAX = SHORT_CIRCUIT_ICC_MATERIAL_USMAX;
export const SHORT_CIRCUIT_ICC_CLUSTER_U0 = SHORT_CIRCUIT_ICC_MATERIAL_U0;

export interface IccCommonIColumnsDef {
    label: React.ReactNode;
    dataKey: string;
    tooltip: React.ReactNode;
    width?: string;
}

export interface IccMaterialIColumnsDef extends IccCommonIColumnsDef {}
export interface IccClusterIColumnsDef extends IccCommonIColumnsDef {
    equipmentTypes?: EquipmentType[];
    elementType?: string;
    titleId?: string;
    initialValue?: any;
}

export const COLUMNS_DEFINITIONS_ICC_MATERIALS: IccMaterialIColumnsDef[] = [
    {
        label: 'ShortCircuitIccActive',
        dataKey: SHORT_CIRCUIT_ICC_MATERIAL_ACTIVE,
        tooltip: 'ShortCircuitIccMaterialActiveTooltip',
        width: '8%',
    },
    {
        label: 'ShortCircuitIccMaterialType',
        dataKey: SHORT_CIRCUIT_ICC_MATERIAL_TYPE,
        tooltip: 'ShortCircuitIccMaterialTypeTooltip',
    },
    {
        label: 'ShortCircuitIccAlpha',
        dataKey: SHORT_CIRCUIT_ICC_MATERIAL_ALPHA,
        tooltip: 'ShortCircuitIccAlphaTooltip',
        width: '8%',
    },
    {
        label: 'ShortCircuitIccUsmin',
        dataKey: SHORT_CIRCUIT_ICC_MATERIAL_USMIN,
        tooltip: 'ShortCircuitIccUsminTooltip',
        width: '8%',
    },
    {
        label: 'ShortCircuitIccUsmax',
        dataKey: SHORT_CIRCUIT_ICC_MATERIAL_USMAX,
        tooltip: 'ShortCircuitIccUsmaxTooltip',
        width: '8%',
    },
    {
        label: 'ShortCircuitIccU0',
        dataKey: SHORT_CIRCUIT_ICC_MATERIAL_U0,
        tooltip: 'ShortCircuitIccU0Tooltip',
        width: '8%',
    },
];

export const COLUMNS_DEFINITIONS_ICC_CLUSTERS: IccClusterIColumnsDef[] = [
    {
        label: 'ShortCircuitIccActive',
        dataKey: SHORT_CIRCUIT_ICC_CLUSTER_ACTIVE,
        tooltip: 'ShortCircuitIccClusterActiveTooltip',
        initialValue: false,
        width: '8%',
    },
    {
        label: 'ShortCircuitIccClusterFilters',
        dataKey: SHORT_CIRCUIT_ICC_CLUSTER_FILTERS,
        tooltip: 'ShortCircuitIccClusterFiltersTooltip',
        equipmentTypes: [EquipmentType.GENERATOR, EquipmentType.BATTERY],
        elementType: ElementType.FILTER,
        titleId: 'FiltersListsSelection',
        initialValue: [],
    },
    {
        label: 'ShortCircuitIccClusterType',
        dataKey: SHORT_CIRCUIT_ICC_CLUSTER_TYPE,
        tooltip: 'ShortCircuitIccClusterTypeTooltip',
        titleId: 'ShortCircuitIccClusterTypeListsSelection',
        initialValue: [],
        width: '15%',
    },
    {
        label: 'ShortCircuitIccAlpha',
        dataKey: SHORT_CIRCUIT_ICC_CLUSTER_ALPHA,
        tooltip: 'ShortCircuitIccAlphaTooltip',
        initialValue: 1,
        width: '8%',
    },
    {
        label: 'ShortCircuitIccUsmin',
        dataKey: SHORT_CIRCUIT_ICC_CLUSTER_USMIN,
        tooltip: 'ShortCircuitIccUsminTooltip',
        initialValue: 0,
        width: '8%',
    },
    {
        label: 'ShortCircuitIccUsmax',
        dataKey: SHORT_CIRCUIT_ICC_CLUSTER_USMAX,
        tooltip: 'ShortCircuitIccUsmaxTooltip',
        initialValue: 100,
        width: '8%',
    },
    {
        label: 'ShortCircuitIccU0',
        dataKey: SHORT_CIRCUIT_ICC_CLUSTER_U0,
        tooltip: 'ShortCircuitIccU0Tooltip',
        initialValue: 100,
        width: '8%',
    },
];
