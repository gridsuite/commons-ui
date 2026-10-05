/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { ConnectablePositionInfos } from '../../../common';

export enum LccConverterMode {
    SIDE_1_RECTIFIER_SIDE_2_INVERTER = 'SIDE_1_RECTIFIER_SIDE_2_INVERTER',
    SIDE_1_INVERTER_SIDE_2_RECTIFIER = 'SIDE_1_INVERTER_SIDE_2_RECTIFIER',
}

export interface LccConverterModeValue {
    id: string;
    label: string;
}

export const LCC_CONVERTER_MODE: Record<LccConverterMode, LccConverterModeValue> = {
    [LccConverterMode.SIDE_1_RECTIFIER_SIDE_2_INVERTER]: {
        id: 'SIDE_1_RECTIFIER_SIDE_2_INVERTER',
        label: 'side1RectifierSide2Inverter',
    },
    [LccConverterMode.SIDE_1_INVERTER_SIDE_2_RECTIFIER]: {
        id: 'SIDE_1_INVERTER_SIDE_2_RECTIFIER',
        label: 'side1InverterSide2Rectifier',
    },
};

export interface LccShuntCompensatorInfos {
    id: string;
    name?: string | null;
    maxQAtNominalV: number;
    connectedToHvdc?: boolean | null;
    terminalConnected?: boolean | null;
    type?: string;
}

export interface LccConverterStationFormInfos {
    id: string;
    name: string;
    lossFactor: number;
    powerFactor: number;
    voltageLevelId: string;
    busOrBusbarSectionId: string;
    terminalConnected: boolean;
    connectablePosition: ConnectablePositionInfos;
    shuntCompensatorsOnSide: LccShuntCompensatorInfos[];
}

export interface LccHvdcLineFormInfos {
    id: string;
    name: string;
    nominalV: number;
    r: number;
    maxP: number;
    convertersMode: string;
    activePowerSetpoint: number;
    lccConverterStation1: LccConverterStationFormInfos;
    lccConverterStation2: LccConverterStationFormInfos;
    properties?: Record<string, string>;
}

// this type used instead of ShuntCompensatorInfos because RHF uses 'id' to manage array, see useFieldArray
export interface LccShuntCompensatorFormData {
    shuntCompensatorId: string;
    shuntCompensatorName?: string | null;
    maxQAtNominalV: number;
    connectedToHvdc?: boolean | null;
}

export interface LccShuntCompensatorModificationFormData extends LccShuntCompensatorFormData {
    deletionMark?: boolean | null;
}
