/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { Property } from '../../common';
import { UUID } from 'node:crypto';
import { ModificationType } from '../../../../utils';

export interface StaticVarCompensatorCreationDto {
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
    regulationMode: string | null;
    isRegulating: boolean;
    voltageSetpoint: number | null;
    reactivePowerSetpoint: number | null;
    voltageRegulationType: string;
    regulatingTerminalId: string | null;
    regulatingTerminalType: string | null;
    regulatingTerminalVlId: string | null;
    standbyAutomatonOn: boolean | null;
    standby: boolean | null;
    lowVoltageSetpoint: number | null;
    highVoltageSetpoint: number | null;
    lowVoltageThreshold: number | null;
    highVoltageThreshold: number | null;
    b0: number | null;
    q0: number | null;
    properties?: Property[] | null;
}
