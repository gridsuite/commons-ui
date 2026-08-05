/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { UUID } from 'node:crypto';
import { BranchCreationDto } from '../../common/branch';

export interface TapChangerStepCreationDto {
    index: number;
    rho: number;
    r: number;
    x: number;
    g: number;
    b: number;
    alpha?: number;
}

export interface TapChangerCreationDto {
    lowTapPosition: number;
    tapPosition: number;
    isRegulating: boolean;
    targetDeadband: number | null;
    terminalRefConnectableId: string | null;
    terminalRefConnectableType: string | null;
    terminalRefConnectableVlId: string | null;
    steps: TapChangerStepCreationDto[];
    hasLoadTapChangingCapabilities: boolean;
}

export interface RatioTapChangerCreationDto extends TapChangerCreationDto {
    targetV: number | null;
}

export enum PhaseTapChangerRegulationMode {
    CURRENT_LIMITER = 'CURRENT_LIMITER',
    ACTIVE_POWER_CONTROL = 'ACTIVE_POWER_CONTROL',
}

export interface PhaseTapChangerCreationDto extends TapChangerCreationDto {
    regulationMode: PhaseTapChangerRegulationMode | null;
    regulationValue: number | null;
}

// cf TwoWindingsTransformerCreationInfos back DTO class
export interface TwoWindingsTransformerCreationDto extends BranchCreationDto {
    r: number | null;
    x: number;
    g: number;
    b: number;
    ratedS: number | null;
    ratedU1: number;
    ratedU2: number;
    ratioTapChanger: RatioTapChangerCreationDto | null;
    phaseTapChanger: PhaseTapChangerCreationDto | null;
}

export type TwoWindingsTransformerCreationDtoWithId = TwoWindingsTransformerCreationDto & { uuid?: UUID };
