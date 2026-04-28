/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { Property } from '../../common/properties';
import { ReactiveCapabilityCurvePoints } from '../../common/reactiveLimits/reactiveLimits.type';
import { ModificationType } from '../../../../utils';

export interface GeneratorCreationDto {
    type: ModificationType;
    uuid?: string;
    equipmentId: string;
    equipmentName: string | null;
    energySource: string | null;
    minP: number | null;
    maxP: number | null;
    ratedS: number | null;
    targetP: number | null;
    targetQ: number | null;
    voltageRegulationOn: boolean | null;
    targetV: number | null;
    qPercent: number | null;
    voltageLevelId: string | null;
    busOrBusbarSectionId: string | null;
    plannedActivePowerSetPoint: number | null;
    marginalCost: number | null;
    plannedOutageRate: number | null;
    forcedOutageRate: number | null;
    directTransX: number | null;
    stepUpTransformerX: number | null;
    regulatingTerminalId: string | null;
    regulatingTerminalType: string | null;
    regulatingTerminalVlId: string | null;
    reactiveCapabilityCurve: boolean;
    participate: boolean | null;
    droop: number | null;
    maxQ: number | null;
    minQ: number | null;
    reactiveCapabilityCurvePoints: ReactiveCapabilityCurvePoints[] | null;
    connectionDirection: string | null;
    connectionName: string | null;
    connectionPosition: number | null;
    terminalConnected: boolean | null;
    properties: Property[] | null;
}
