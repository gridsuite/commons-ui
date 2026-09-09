/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { UUID } from 'node:crypto';
import { AttributeModification, ModificationType } from '../../../../../utils';
import { Property } from '../../../common/properties/properties.type';
import { ReactiveCapabilityCurvePoints } from '../../../common/reactiveLimits/reactiveLimits.type';

interface InjectionModificationDto {
    type: ModificationType;
    equipmentId: string;
    equipmentName: AttributeModification<string> | null;
    voltageLevelId: AttributeModification<string> | null;
    busOrBusbarSectionId: AttributeModification<string> | null;
    connectionDirection: AttributeModification<string> | null;
    connectionName: AttributeModification<string> | null;
    connectionPosition: AttributeModification<number> | null;
    terminalConnected: AttributeModification<boolean> | null;
    pMeasurementValue: AttributeModification<number> | null;
    pMeasurementValidity: AttributeModification<boolean> | null;
    qMeasurementValue: AttributeModification<number> | null;
    qMeasurementValidity: AttributeModification<boolean> | null;
}

export interface ConverterStationModificationDto extends InjectionModificationDto {
    lossFactor: AttributeModification<number> | null;
    reactivePowerSetpoint: AttributeModification<number> | null;
    voltageRegulationOn: AttributeModification<boolean> | null;
    voltageSetpoint: AttributeModification<number> | null;
    reactiveCapabilityCurve: AttributeModification<boolean> | null;
    minQ: AttributeModification<number> | null;
    maxQ: AttributeModification<number> | null;
    reactiveCapabilityCurvePoints: ReactiveCapabilityCurvePoints[];
}

// cf VscModificationInfos server class
export interface VscHdvLineModificationDto {
    type: ModificationType;
    uuid?: UUID;
    equipmentId: string;
    equipmentName: AttributeModification<string> | null;
    properties: Property[] | null;
    nominalV: AttributeModification<number> | null;
    r: AttributeModification<number> | null;
    maxP: AttributeModification<number> | null;
    operatorActivePowerLimitFromSide1ToSide2: AttributeModification<number> | null;
    operatorActivePowerLimitFromSide2ToSide1: AttributeModification<number> | null;
    convertersMode: AttributeModification<string> | null;
    activePowerSetpoint: AttributeModification<number> | null;
    angleDroopActivePowerControl: AttributeModification<boolean> | null;
    p0: AttributeModification<number> | null;
    droop: AttributeModification<number> | null;
    converterStation1: ConverterStationModificationDto;
    converterStation2: ConverterStationModificationDto;
}
