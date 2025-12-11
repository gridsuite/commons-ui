/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

export const SHORT_CIRCUIT_ICC_MATERIAL_ACTIVE = 'active';
export const SHORT_CIRCUIT_ICC_MATERIAL_TYPE = 'type';
export const SHORT_CIRCUIT_ICC_MATERIAL_ALPHA = 'alpha';
export const SHORT_CIRCUIT_ICC_MATERIAL_USMIN = 'usMin';
export const SHORT_CIRCUIT_ICC_MATERIAL_USMAX = 'usMax';
export const SHORT_CIRCUIT_ICC_MATERIAL_U0 = 'u0';

export interface IccMaterialIColumnsDef {
    label: React.ReactNode;
    dataKey: string;
    tooltip: React.ReactNode;
}

export const COLUMNS_DEFINITIONS_ICC_MATERIALS: IccMaterialIColumnsDef[] = [
    {
        label: 'ShortCircuitIccMaterialActivate',
        dataKey: SHORT_CIRCUIT_ICC_MATERIAL_ACTIVE,
        tooltip: 'ShortCircuitIccMaterialActivateTooltip',
    },
    {
        label: 'ShortCircuitIccMaterialType',
        dataKey: SHORT_CIRCUIT_ICC_MATERIAL_TYPE,
        tooltip: 'ShortCircuitIccMaterialTypeTooltip',
    },
    {
        label: 'ShortCircuitIccMaterialAlpha',
        dataKey: SHORT_CIRCUIT_ICC_MATERIAL_ALPHA,
        tooltip: 'ShortCircuitIccMaterialAlphaTooltip',
    },
    {
        label: 'ShortCircuitIccMaterialUsmin',
        dataKey: SHORT_CIRCUIT_ICC_MATERIAL_USMIN,
        tooltip: 'ShortCircuitIccMaterialUsminTooltip',
    },
    {
        label: 'ShortCircuitIccMaterialUsmax',
        dataKey: SHORT_CIRCUIT_ICC_MATERIAL_USMAX,
        tooltip: 'ShortCircuitIccMaterialUsmaxTooltip',
    },
    {
        label: 'ShortCircuitIccMaterialU0',
        dataKey: SHORT_CIRCUIT_ICC_MATERIAL_U0,
        tooltip: 'ShortCircuitIccMaterialU0Tooltip',
    },
];
