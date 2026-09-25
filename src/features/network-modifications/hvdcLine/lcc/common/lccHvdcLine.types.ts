/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { ConnectablePositionInfos } from '../../../common';
import { FieldConstants } from '../../../../../utils';

export enum LccHvdcLineDialogTab {
    HVDC_LINE_TAB = 0,
    CONVERTER_STATION_1_TAB = 1,
    CONVERTER_STATION_2_TAB = 2,
}

export const HVDC_LCC_LINE_TAB_FIELDS: Readonly<Partial<Record<LccHvdcLineDialogTab, FieldConstants[]>>> = {
    [LccHvdcLineDialogTab.HVDC_LINE_TAB]: [FieldConstants.HVDC_LINE_TAB, FieldConstants.ADDITIONAL_PROPERTIES],
    [LccHvdcLineDialogTab.CONVERTER_STATION_1_TAB]: [FieldConstants.CONVERTER_STATION_1],
    [LccHvdcLineDialogTab.CONVERTER_STATION_2_TAB]: [FieldConstants.CONVERTER_STATION_2],
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
export interface ShuntCompensatorFormSchema {
    shuntCompensatorId: string;
    shuntCompensatorName?: string | null;
    maxQAtNominalV: number;
    connectedToHvdc?: boolean | null;
}

export interface ShuntCompensatorModificationFormSchema extends ShuntCompensatorFormSchema {
    deletionMark?: boolean | null;
}
