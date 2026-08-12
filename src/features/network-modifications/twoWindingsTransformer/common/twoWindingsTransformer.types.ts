/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { EquipmentType, FieldConstants, Identifiable } from '../../../../utils';
import { TwoWindingsTransformerModificationDto } from '../modification/twoWindingsTransformerModification.types';
import { ConnectablePositionFormInfos } from '../../common/connectivity/connectivity.type';
import { CurrentLimitsData } from '../../common/currentLimits/limits.types';

export interface TapChangerStep extends TapChangerStepMapInfos {
    [FieldConstants.STEPS_TAP]: number;
    [FieldConstants.SELECTED]?: boolean;
}

export interface TapChangerPaneProps {
    id?: string;
    voltageLevelOptions?: Identifiable[];
    previousValues?: TwoWindingsTransformerMapInfos;
    editData?: TwoWindingsTransformerModificationDto;
    fetchVoltageLevelEquipments: (voltageLevelId: string) => Promise<(Identifiable & { type: EquipmentType })[]>;
    isModification?: boolean;
}

// Types from network map server response

interface TwoWindingsTransformerToBeEstimatedInfos {
    ratioTapChangerStatus?: boolean;
    phaseTapChangerStatus?: boolean;
}

interface MeasurementsInfos {
    value?: number;
    validity: boolean;
}

export interface TapChangerStepMapInfos {
    [FieldConstants.STEPS_RESISTANCE]: number;
    [FieldConstants.STEPS_REACTANCE]: number;
    [FieldConstants.STEPS_CONDUCTANCE]: number;
    [FieldConstants.STEPS_SUSCEPTANCE]: number;
    [FieldConstants.STEPS_RATIO]: number;
    [FieldConstants.STEPS_ALPHA]?: number;
}

export interface TapChangerMapInfos {
    [FieldConstants.LOW_TAP_POSITION]: number;
    [FieldConstants.TAP_POSITION]: number;
    [FieldConstants.HIGH_TAP_POSITION]: number;
    [FieldConstants.REGULATING]?: boolean;
    [FieldConstants.LOAD_TAP_CHANGING_CAPABILITIES]?: boolean;
    [FieldConstants.TARGET_V]?: number;
    [FieldConstants.TARGET_DEADBAND]?: number;
    [FieldConstants.REGULATION_MODE]?: string;
    [FieldConstants.REGULATION_VALUE]?: number;
    [FieldConstants.REGULATING_TERMINAL_CONNECTABLE_ID]?: string;
    [FieldConstants.REGULATING_TERMINAL_CONNECTABLE_TYPE]?: string;
    [FieldConstants.REGULATING_TERMINAL_VOLTAGE_LEVEL_ID]?: string;
    [FieldConstants.STEPS]?: Record<number, TapChangerStepMapInfos>;
}

export interface TwoWindingsTransformerMapInfos extends Identifiable {
    properties?: Record<string, string>;
    voltageLevelId1: string;
    voltageLevelName1: string;
    voltageLevelId2: string;
    voltageLevelName2: string;
    terminal1Connected: boolean;
    terminal2Connected: boolean;
    p1?: number;
    q1?: number;
    p2?: number;
    q2?: number;
    i1?: number;
    i2?: number;
    currentLimits?: CurrentLimitsData[];
    selectedOperationalLimitsGroupId1?: string;
    selectedOperationalLimitsGroupId2?: string;
    phaseTapChanger?: TapChangerMapInfos;
    ratioTapChanger?: TapChangerMapInfos;
    g: number;
    b: number;
    r: number;
    x: number;
    ratedU1: number;
    ratedU2: number;
    ratedS?: number;
    connectablePosition1: ConnectablePositionFormInfos;
    connectablePosition2: ConnectablePositionFormInfos;
    busOrBusbarSectionId1?: string;
    busOrBusbarSectionId2?: string;
    operatingStatus?: string;
    measurementP1?: MeasurementsInfos;
    measurementQ1?: MeasurementsInfos;
    measurementP2?: MeasurementsInfos;
    measurementQ2?: MeasurementsInfos;
    toBeEstimated?: TwoWindingsTransformerToBeEstimatedInfos;
}
