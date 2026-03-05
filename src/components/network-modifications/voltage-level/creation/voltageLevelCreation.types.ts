/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { Property } from '../../common';

export interface CouplingDevice {
    busbarSectionId1: string;
    busbarSectionId2: string;
}

export interface SwitchKindFormData {
    switchKind: SwitchKind;
}

export interface CreateSwitchesFormData {
    switchKinds: SwitchKindFormData[];
}

export type AttachedSubstationCreationDto = {
    type: string;
    equipmentId: string | null;
    equipmentName: string | null;
    country: string | null;
    properties: Property[] | null;
};

export enum SwitchKind {
    BREAKER = 'BREAKER',
    DISCONNECTOR = 'DISCONNECTOR',
    LOAD_BREAK_SWITCH = 'LOAD_BREAK_SWITCH',
}

export type VoltageLevelCreationDto = {
    type: string;
    equipmentId: string;
    equipmentName: string | null;
    substationId: string | null;
    substationCreation: AttachedSubstationCreationDto | null;
    nominalV: number | null;
    lowVoltageLimit: number | null;
    highVoltageLimit: number | null;
    ipMin: number | null;
    ipMax: number | null;
    busbarCount: number;
    sectionCount: number;
    switchKinds: SwitchKind[];
    couplingDevices: CouplingDevice[];
    properties: Property[] | null;
};
