/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { UUID } from 'node:crypto';
import { ConnectablePositionFormInfos } from '../../common';
import { ModificationType } from '../../../../utils';
import { Property } from '../../common/properties';

interface StandbyAutomatonInfos {
    lowVoltageSetpoint: number | null;
    highVoltageSetpoint: number | null;
    lowVoltageThreshold: number | null;
    highVoltageThreshold: number | null;
    b0: number | null;
    q0: number | null;
    standby: boolean;
}

export interface StaticVarCompensatorDto {
    type: ModificationType.STATIC_VAR_COMPENSATOR_CREATION;
    uuid?: UUID;
    equipmentId: string;
    equipmentName?: string | null;
    voltageLevelId: string | null;
    busOrBusbarSectionId?: string | null;
    connectionDirection?: string | null;
    connectionName?: string | null;
    connectionPosition?: number | null;
    terminalConnected?: boolean | null;
    maxSusceptance: number | null;
    minSusceptance: number | null;
    maxQAtNominalV: number | null;
    minQAtNominalV: number | null;
    regulationMode: string;
    isRegulating: boolean;
    voltageSetpoint: number | null;
    reactivePowerSetpoint: number | null;
    voltageRegulationType: string;
    regulatingTerminalId: string | null;
    regulatingTerminalType: string | null;
    regulatingTerminalVlId: string | null;
    regulatingTerminalConnectableId: string | null;
    standbyAutomatonOn: boolean;
    standby: boolean;
    lowVoltageSetpoint: number | null;
    highVoltageSetpoint: number | null;
    lowVoltageThreshold: number | null;
    highVoltageThreshold: number | null;
    b0: number | null;
    q0: number | null;
    properties: Property[] | null;
}

export interface StaticVarCompensatorFormInfo {
    id: string;
    name: string;
    voltageLevelId: string;
    busOrBusbarSectionId: string;
    connectablePosition: ConnectablePositionFormInfos;
    minSusceptance: number | null;
    maxSusceptance: number | null;
    nominalV: number;
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
