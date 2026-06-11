/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { ActivePowerControlInfos } from '../common/activePowerControl';
import {
    MinMaxReactiveLimitsFormInfos,
    ReactiveCapabilityCurvePoints,
} from '../common/reactiveLimits/reactiveLimits.type';
import { ShortCircuitInfos } from '../common/shortCircuit/shortCircuitForm.type';
import { ConnectablePositionFormInfos } from '../common/connectivity/connectivity.type';
import { MeasurementInfo } from '../common/measurements/measurement.type';

export interface GeneratorFormInfos {
    id: string;
    name: string;
    energySource?: string;
    maxP: number;
    minP: number;
    ratedS: number;
    targetP: number;
    voltageRegulatorOn: boolean;
    targetV: number;
    targetQ: number;
    generatorStartup: GeneratorStartUpFormInfos;
    connectablePosition: ConnectablePositionFormInfos;
    activePowerControl: ActivePowerControlInfos;
    generatorShortCircuit: ShortCircuitInfos;
    regulatingTerminalId: string;
    regulatingTerminalVlId: string;
    regulatingTerminalConnectableId: string;
    regulatingTerminalConnectableType: string;
    coordinatedReactiveControl: CoordinatedReactiveControlInfos;
    minMaxReactiveLimits: MinMaxReactiveLimitsFormInfos;
    reactiveCapabilityCurvePoints: ReactiveCapabilityCurvePoints[];
    voltageLevelId: string;
    busOrBusbarSectionId: string;
    connectionDirection: string | null;
    connectionName?: string | null;
    connectionPosition?: number | null;
    terminalConnected?: boolean | null;
    measurementP: MeasurementInfo | undefined;
    measurementQ: MeasurementInfo | undefined;
    properties: Record<string, string> | undefined;
}

interface CoordinatedReactiveControlInfos {
    qPercent?: number | null;
}

interface GeneratorStartUpFormInfos {
    plannedActivePowerSetPoint: number | null;
    marginalCost?: number | null;
    plannedOutageRate?: number | null;
    forcedOutageRate?: number | null;
}
