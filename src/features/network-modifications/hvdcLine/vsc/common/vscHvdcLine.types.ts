/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import {
    ConnectablePositionInfos,
    MeasurementInfo,
    MinMaxReactiveLimitsFormInfos,
    ReactiveCapabilityCurvePoints,
} from '../../../common';

enum VscConverterMode {
    SIDE_1_RECTIFIER_SIDE_2_INVERTER = 'SIDE_1_RECTIFIER_SIDE_2_INVERTER',
    SIDE_1_INVERTER_SIDE_2_RECTIFIER = 'SIDE_1_INVERTER_SIDE_2_RECTIFIER',
}

interface VscConverterModeValue {
    id: string;
    label: string;
}

export const VSC_CONVERTER_MODE: Record<VscConverterMode, VscConverterModeValue> = {
    [VscConverterMode.SIDE_1_RECTIFIER_SIDE_2_INVERTER]: {
        id: 'SIDE_1_RECTIFIER_SIDE_2_INVERTER',
        label: 'side1RectifierSide2Inverter',
    },
    [VscConverterMode.SIDE_1_INVERTER_SIDE_2_RECTIFIER]: {
        id: 'SIDE_1_INVERTER_SIDE_2_RECTIFIER',
        label: 'side1InverterSide2Rectifier',
    },
};

export interface HvdcOperatorActivePowerRangeInfo {
    oprFromCS1toCS2: number;
    oprFromCS2toCS1: number;
}

export interface HvdcAngleDroopActivePowerControlInfo {
    isEnabled: boolean;
    droop: number;
    p0: number;
}

export interface ConverterStationInfos {
    id: string;
    name: string | null;
    lossFactor: number;
    voltageSetpoint: number | null;
    reactivePowerSetpoint: number | null;
    voltageRegulatorOn: boolean;
    voltageLevelId: string;
    busOrBusbarSectionId: string;
    nominalV: number;
    terminalConnected: boolean;
    p: number | null;
    q: number | null;
    reactiveCapabilityCurvePoints: ReactiveCapabilityCurvePoints[];
    minMaxReactiveLimits: MinMaxReactiveLimitsFormInfos | null;
    connectablePosition: ConnectablePositionInfos;
    measurementP?: MeasurementInfo;
    measurementQ?: MeasurementInfo;
}

export interface VscHvdcLineInfo {
    id: string;
    name: string;
    convertersMode: string;
    r: number;
    nominalV: number;
    activePowerSetpoint: number;
    maxP: number;
    hvdcAngleDroopActivePowerControl: HvdcAngleDroopActivePowerControlInfo;
    hvdcOperatorActivePowerRange: HvdcOperatorActivePowerRangeInfo;
    converterStation1: ConverterStationInfos;
    converterStation2: ConverterStationInfos;
    properties: Record<string, string>;
}
