/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { AttributeModification } from '../../../../utils';
import { Property } from '../../common/properties';
import { ReactiveCapabilityCurvePoints } from '../../common/reactiveLimits/reactiveLimits.type';

export interface GeneratorModificationDto {
    type: string;
    uuid: string | null;
    equipmentId: string;
    equipmentName: AttributeModification<string> | null;
    energySource?: AttributeModification<string> | null;
    maxP: AttributeModification<number> | null;
    minP: AttributeModification<number> | null;
    targetP: AttributeModification<number> | null;
    targetQ: AttributeModification<number> | null;
    participate: AttributeModification<boolean> | null;
    droop: AttributeModification<number> | null;
    reactiveCapabilityCurve: AttributeModification<boolean> | null;
    minQ: AttributeModification<number> | null;
    maxQ: AttributeModification<number> | null;
    reactiveCapabilityCurvePoints: ReactiveCapabilityCurvePoints[] | null;
    voltageLevelId: AttributeModification<string> | null;
    busOrBusbarSectionId: AttributeModification<string> | null;
    connectionDirection: AttributeModification<string> | null;
    connectionName?: AttributeModification<string> | null;
    connectionPosition?: AttributeModification<number> | null;
    terminalConnected?: AttributeModification<boolean> | null;
    properties: Property[] | null;
    ratedS: AttributeModification<number> | null;
    voltageRegulationOn: AttributeModification<boolean> | null;
    targetV: AttributeModification<number> | null;
    qPercent: AttributeModification<number> | null;
    plannedActivePowerSetPoint: AttributeModification<number> | null;
    marginalCost: AttributeModification<number> | null;
    plannedOutageRate: AttributeModification<number> | null;
    forcedOutageRate: AttributeModification<number> | null;
    directTransX: AttributeModification<number> | null;
    stepUpTransformerX: AttributeModification<number> | null;
    voltageRegulationType?: AttributeModification<string> | null;
    regulatingTerminalId: AttributeModification<string> | null;
    regulatingTerminalType: AttributeModification<string> | null;
    regulatingTerminalVlId: AttributeModification<string> | null;
}
