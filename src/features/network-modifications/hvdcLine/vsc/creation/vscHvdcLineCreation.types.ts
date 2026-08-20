/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { ModificationType } from '../../../../../utils';
import { Property } from '../../../common/properties/properties.type';
import { ReactiveCapabilityCurvePoints } from '../../../common/reactiveLimits/reactiveLimits.type';

interface InjectionCreationDto {
    voltageLevelId: string;
    busOrBusbarSectionId: string;
    connectionDirection: string | null;
    connectionName?: string | null;
    connectionPosition?: number | null;
    terminalConnected?: boolean | null;
}

export interface ConverterStationCreationDto extends InjectionCreationDto {
    type: ModificationType;
    equipmentId: string;
    equipmentName: string | null;
    lossFactor: number | null;
    reactivePowerSetpoint: number | null;
    voltageRegulationOn?: boolean;
    voltageSetpoint: number | null;
    reactiveCapabilityCurve: boolean;
    minQ: number | null;
    maxQ: number | null;
    reactiveCapabilityCurvePoints: ReactiveCapabilityCurvePoints[];
}

// cf VscCreationInfos server class
export interface VscHdvLineCreationDto {
    type: ModificationType;
    uuid?: string | null;
    equipmentId: string;
    equipmentName: string | null;
    properties: Property[] | null;
    nominalV: number | null;
    r: number | null;
    maxP: number | null;
    operatorActivePowerLimitFromSide1ToSide2: number | null;
    operatorActivePowerLimitFromSide2ToSide1: number | null;
    convertersMode: string;
    activePowerSetpoint: number | null;
    angleDroopActivePowerControl: boolean | null;
    p0: number | null;
    droop: number | null;
    converterStation1: ConverterStationCreationDto;
    converterStation2: ConverterStationCreationDto;
}
