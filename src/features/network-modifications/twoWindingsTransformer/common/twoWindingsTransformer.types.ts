/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { EquipmentType, FieldConstants, Identifiable } from '../../../../utils';
import { TwoWindingsTransformerModificationDto } from '../modification/twoWindingsTransformerModification.types';
import { ConnectablePositionFormInfos, LimitsProperty } from '../../common';

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

// Creation/Modification form types
export interface EntityIdReference {
    [FieldConstants.ID]: string;
}

export type ConnectivityFormSchema = {
    [FieldConstants.VOLTAGE_LEVEL]: EntityIdReference | null;
    [FieldConstants.BUS_OR_BUSBAR_SECTION]: EntityIdReference | null;
    [FieldConstants.CONNECTION_DIRECTION]: string | null;
    [FieldConstants.CONNECTION_NAME]: string;
    [FieldConstants.CONNECTION_POSITION]: number | null;
    [FieldConstants.CONNECTED]: boolean | null;
};

export interface MeasurementFormSchema {
    [FieldConstants.VALUE]: number | null;
    [FieldConstants.VALIDITY]: boolean | null;
}

export interface ToBeEstimatedFormSchema {
    [FieldConstants.RATIO_TAP_CHANGER_STATUS]: boolean | null;
    [FieldConstants.PHASE_TAP_CHANGER_STATUS]: boolean | null;
}

export interface StateEstimationFormSchema {
    [FieldConstants.MEASUREMENT_P1]: MeasurementFormSchema;
    [FieldConstants.MEASUREMENT_Q1]: MeasurementFormSchema;
    [FieldConstants.MEASUREMENT_P2]: MeasurementFormSchema;
    [FieldConstants.MEASUREMENT_Q2]: MeasurementFormSchema;
    [FieldConstants.TO_BE_ESTIMATED]: ToBeEstimatedFormSchema;
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

export interface TemporaryLimitMapInfos {
    name: string;
    value?: number;
    acceptableDuration?: number;
}

export interface CurrentLimitsMapInfos {
    id?: string;
    permanentLimit?: number;
    temporaryLimits?: TemporaryLimitMapInfos[];
    temporaryLimitsByName?: Record<string, TemporaryLimitMapInfos>;
    applicability: string;
    limitsProperties?: LimitsProperty[];
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
    currentLimits?: CurrentLimitsMapInfos[];
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
