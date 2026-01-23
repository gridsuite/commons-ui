/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import type { UUID } from 'node:crypto';
import { Property } from '../components/network-modifications/common/properties/property-types';

export interface StudyContext {
    studyId: UUID;
    nodeId: UUID;
    rootNetworkId?: UUID;
}

export interface SubstationCreationInfo extends StudyContext {
    substationId: string;
    substationName: string | null;
    country: string | null;
    isUpdate: boolean;
    modificationUuid?: UUID;
    properties: Property[] | null;
}
