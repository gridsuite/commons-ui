/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import {ConnectablePositionFormInfos } from "../../common";

interface StandbyAutomatonInfos {
    lowVoltageSetpoint: number | null;
    highVoltageSetpoint: number | null;
    lowVoltageThreshold: number | null;
    highVoltageThreshold: number | null;
    b0: number | null;
    q0: number | null;
    standby: boolean;
}

export interface StaticVarCompensatorFormInfo {
    id: string;
    name: string;

    voltageLevelId: string;
    busOrBusbarSectionId: string;

    connectablePosition: ConnectablePositionFormInfos;

    minSusceptance: number | null;
    maxSusceptance: number | null;
    nominalV: any;
    isRegulating: boolean;
    regulationMode: string;
    voltageSetpoint: number;
    reactivePowerSetpoint: number;
    regulatingTerminalConnectableId: string | null;
    regulatingTerminalId: string | null;
    regulatingTerminalVlId: string | null;
    regulatingTerminalConnectableType: string;

    standbyAutomatonInfos?: StandbyAutomatonInfos;

    properties: Record<string, string> | undefined;
}