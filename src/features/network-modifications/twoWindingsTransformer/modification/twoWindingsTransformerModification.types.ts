/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { UUID } from 'node:crypto';
import { BranchModificationDto } from '../../common/branch/branchModification.types';
import { AttributeModification, toModificationOperation } from '../../../../utils';
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
    steps: TapChangerStepCreationDto[] | null; // In server-side we use the same DTO for both creation and modification
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

const getTapChangerEmptyModificationDto = (enabled: boolean | null | undefined): TapChangerModificationDto => ({
    enabled: toModificationOperation(enabled),
    regulationType: null,
    regulationSide: null,
    lowTapPosition: null,
    tapPosition: null,
    isRegulating: null,
    targetDeadband: null,
    terminalRefConnectableId: null,
    terminalRefConnectableType: null,
    terminalRefConnectableVlId: null,
    steps: null,
    hasLoadTapChangingCapabilities: null,
});

export const getRatioTapChangerEmptyModificationDto = (
    enabled: boolean | null | undefined
): RatioTapChangerModificationDto => ({
    ...getTapChangerEmptyModificationDto(enabled),
    targetV: null,
});

export const getPhaseTapChangerEmptyModificationDto = (
    enabled: boolean | null | undefined
): PhaseTapChangerModificationDto => ({
    ...getTapChangerEmptyModificationDto(enabled),
    regulationMode: null,
    regulationValue: null,
});
