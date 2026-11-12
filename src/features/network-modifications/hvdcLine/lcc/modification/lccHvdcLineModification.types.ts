/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { UUID } from 'node:crypto';
import { AttributeModification } from '../../../../../utils';
import { Property } from '../../../common';
import { LccShuntCompensatorInfos } from '../common';

export interface LccShuntCompensatorModificationInfos extends LccShuntCompensatorInfos {
    deletionMark: boolean;
}

export interface LccConverterStationModificationDto {
    type: string;
    equipmentId: string;
    equipmentName: AttributeModification<string> | null;
    lossFactor: AttributeModification<number> | null;
    powerFactor: AttributeModification<number> | null;
    shuntCompensatorsOnSide: LccShuntCompensatorModificationInfos[];
}

export interface LccModificationDto {
    uuid?: UUID;
    type: string;
    equipmentId: string;
    equipmentName: AttributeModification<string> | null;
    nominalV: AttributeModification<number> | null;
    r: AttributeModification<number> | null;
    maxP: AttributeModification<number> | null;
    convertersMode: AttributeModification<string> | null;
    activePowerSetpoint: AttributeModification<number> | null;
    converterStation1: LccConverterStationModificationDto;
    converterStation2: LccConverterStationModificationDto;
    properties?: Property[] | null;
}
