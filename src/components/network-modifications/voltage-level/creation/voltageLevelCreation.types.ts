/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { Property } from '../../common';

export interface CouplingDevice {
    busBarSectionId1: string | null;
    busBarSectionId2: string | null;
}

export interface SwitchKindFormData {
    switchKind: string;
}

export interface CreateSwitchesFormData {
    switchKinds: SwitchKindFormData[];
}

export type VoltageLevelCreationDto = {
    type: string;
    equipmentId: string;
    equipmentName: string | null;
    substationId: string | null;
    nominalV: number | null;
    lowVoltageLimit: number | null;
    highVoltageLimit: number | null;
    ipMin: number | null;
    ipMax: number | null;
    busbarCount: number;
    sectionCount: number;
    switchKinds: string[];
    couplingDevices: CouplingDevice[];
    topologyKind: string | null;
    properties: Property[] | null;
};
