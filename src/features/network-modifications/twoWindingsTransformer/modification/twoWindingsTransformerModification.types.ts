/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { UUID } from 'node:crypto';
import { BranchModificationDto } from '../../common/branch/branchModification.types';
import { AttributeModification } from '../../../../utils';
import { TapChangerStepCreationDto } from '../creation/twoWindingsTransformerCreation.types';

export interface TapChangerModificationDto {
    enabled: AttributeModification<boolean> | null;
    regulationType: AttributeModification<string> | null;
    regulationSide: AttributeModification<string> | null;
    lowTapPosition: AttributeModification<number> | null;
    tapPosition: AttributeModification<number> | null;
    isRegulating: AttributeModification<boolean> | null;
    targetDeadband: AttributeModification<number> | null;
    terminalRefConnectableId: AttributeModification<string> | null;
    terminalRefConnectableType: AttributeModification<string> | null;
    terminalRefConnectableVlId: AttributeModification<string> | null;
    steps: TapChangerStepCreationDto[] | null;
    hasLoadTapChangingCapabilities: AttributeModification<boolean> | null;
}

export interface RatioTapChangerModificationDto extends TapChangerModificationDto {
    targetV: AttributeModification<number> | null;
}

export interface PhaseTapChangerModificationDto extends TapChangerModificationDto {
    regulationMode: AttributeModification<string> | null;
    regulationValue: AttributeModification<number> | null;
}

// cf TwoWindingsTransformerModificationInfos back DTO class
export interface TwoWindingsTransformerModificationDto extends BranchModificationDto {
    g: AttributeModification<number> | null;
    b: AttributeModification<number> | null;
    ratedU1: AttributeModification<number> | null;
    ratedU2: AttributeModification<number> | null;
    ratedS: AttributeModification<number> | null;
    ratioTapChanger: RatioTapChangerModificationDto | null;
    phaseTapChanger: PhaseTapChangerModificationDto | null;
    ratioTapChangerToBeEstimated: AttributeModification<boolean> | null;
    phaseTapChangerToBeEstimated: AttributeModification<boolean> | null;
}

export type TwoWindingsTransformerModificationDtoWithId = TwoWindingsTransformerModificationDto & { uuid?: UUID };
