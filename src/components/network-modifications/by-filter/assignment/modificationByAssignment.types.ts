/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { EquipmentType, ModificationType } from '../../../../utils';
import { Assignment } from './assignment/assignment.type';

export interface ModificationByAssignmentDto {
    type: ModificationType.MODIFICATION_BY_ASSIGNMENT;
    equipmentType: EquipmentType;
    assignmentInfosList: Assignment[];
}
