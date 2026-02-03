/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import type { UUID } from 'node:crypto';
import { Property } from '../components/network-modifications/common/properties/properties.type';

export interface NetworkModificationData {
    uuid: UUID;
    type: string;
    [key: string]: any;
}

export interface StudyNodeInfo {
    studyId: UUID;
    nodeId: UUID;
}

export interface SubstationCreationDto {
    substationId: string;
    substationName: string | null;
    country: string | null;
    isUpdate: boolean;
    modificationUuid?: UUID;
    properties: Property[] | null;
}

export interface SubstationCreationInfo extends StudyNodeInfo, SubstationCreationDto {}
