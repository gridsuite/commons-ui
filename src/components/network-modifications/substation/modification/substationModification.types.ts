/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { UUID } from 'node:crypto';
import { AttributeModification, ModificationType } from '../../../../utils';
import { Property } from '../../common';

export interface SubstationModificationInfos {
    id: string;
    name?: string;
    country: string | null;
    properties?: Record<string, string>;
}

export interface SubstationModificationDto {
    uuid?: UUID;
    equipmentId: string;
    equipmentName?: AttributeModification<string> | null;
    country: AttributeModification<string> | null;
    properties?: Property[] | null;
    type?: ModificationType;
}
