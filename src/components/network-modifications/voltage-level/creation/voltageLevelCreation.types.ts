/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { Property } from '../../common';
import { SubstationCreationDto } from '../../substation';

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

export enum SwitchKind {
    BREAKER = 'BREAKER',
    DISCONNECTOR = 'DISCONNECTOR',
    LOAD_BREAK_SWITCH = 'LOAD_BREAK_SWITCH',
}

export enum SubstationCreationMode {
    /** Always show the substation creation form, no delete button (e.g. attachment point modification) */
    MUST_CREATE_SUBSTATION = 'MUST_CREATE_SUBSTATION',
    /** Autocomplete with a "Create substation" action; creation form includes a delete button */
    CAN_CREATE_SUBSTATION = 'CAN_CREATE_SUBSTATION',
    /** Plain autocomplete only, no option to create a new substation */
    CANNOT_CREATE_SUBSTATION = 'CANNOT_CREATE_SUBSTATION',
}

export type VoltageLevelCreationDto = {
    type: string;
    equipmentId: string;
    equipmentName: string | null;
    substationId: string | null;
    substationCreation: SubstationCreationDto | null;
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
