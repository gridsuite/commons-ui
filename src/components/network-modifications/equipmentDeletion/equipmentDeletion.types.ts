/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { UUID } from 'node:crypto';
import { EquipmentType, ModificationType } from '../../../utils';

export interface LccShuntCompensatorConnectionDto {
    id: string;
    connectedToHvdc: boolean;
}

// cf HvdcLccDeletionInfos from modification-server
export interface LccDeletionDto {
    specificType: string;
    // below is specific to HVDC-LCC deletion (then specificType = HVDC_LINE_LCC_DELETION_SPECIFIC_TYPE)
    mcsOnSide1: LccShuntCompensatorConnectionDto[];
    mcsOnSide2: LccShuntCompensatorConnectionDto[];
}

export type EquipmentDeletionDto = {
    type: ModificationType;
    equipmentId: UUID;
    equipmentType: EquipmentType;
    equipmentInfos?: LccDeletionDto;
};
