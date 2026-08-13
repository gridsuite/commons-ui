/*
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 * SPDX-License-Identifier: MPL-2.0
 */

import { UUID } from 'node:crypto';
import { ModificationType } from '../../../../utils';

export interface CouplingDeviceCreationDto {
    type: ModificationType.CREATE_COUPLING_DEVICE;
    uuid?: UUID;
    voltageLevelId: string;
    couplingDeviceInfos: {
        busbarSectionId1: string;
        busbarSectionId2: string;
    };
}
